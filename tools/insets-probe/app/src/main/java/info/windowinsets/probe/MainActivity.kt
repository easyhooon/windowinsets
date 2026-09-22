package info.windowinsets.probe

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Typeface
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.Gravity
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.Button
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.content.ContextCompat
import androidx.core.util.Consumer
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsCompat.Type
import androidx.core.view.updatePadding
import androidx.window.java.layout.WindowInfoTrackerCallbackAdapter
import androidx.window.layout.FoldingFeature
import androidx.window.layout.WindowInfoTracker
import androidx.window.layout.WindowLayoutInfo
import java.io.File
import kotlin.math.abs

class MainActivity : ComponentActivity(), SensorEventListener {
    private lateinit var root: LinearLayout
    private lateinit var output: TextView
    private lateinit var screenGroup: RadioGroup
    private lateinit var captureStatus: TextView

    private var latestInsets: WindowInsetsCompat? = null
    private var hingeAngle: Float? = null
    private var foldingFeatures: List<FoldingFeature> = emptyList()
    private var lastJson: String = ""
    private var autoExport = false
    private var expectedDisplayId: Int? = null
    private var screenLabelSource = FlexWindowContract.SCREEN_LABEL_SOURCE_MANUAL

    private val layoutTracker by lazy { WindowInfoTrackerCallbackAdapter(WindowInfoTracker.getOrCreate(this)) }
    private val layoutListener = Consumer<WindowLayoutInfo> { info ->
        foldingFeatures = info.displayFeatures.filterIsInstance<FoldingFeature>()
        refresh()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        buildUi()

        // Automation: adb shell am start -n info.windowinsets.probe/.MainActivity --es screen main --ez export true
        when (intent.getStringExtra(FlexWindowContract.EXTRA_SCREEN)) {
            "cover" -> screenGroup.check(ID_COVER)
            "main" -> screenGroup.check(ID_MAIN)
        }
        expectedDisplayId = intent.takeIf { it.hasExtra(FlexWindowContract.EXTRA_EXPECTED_DISPLAY_ID) }
            ?.getIntExtra(FlexWindowContract.EXTRA_EXPECTED_DISPLAY_ID, FlexWindowContract.COVER_DISPLAY_ID)
        screenLabelSource = FlexWindowContract.screenLabelSource(
            intent.getStringExtra(FlexWindowContract.EXTRA_SCREEN_LABEL_SOURCE),
        )
        autoExport = intent.getBooleanExtra("export", false)

        // Listen on the root so we see exactly what an app's content root would receive.
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            latestInsets = insets
            val pad = insets.getInsets(Type.systemBars() or Type.displayCutout())
            v.updatePadding(pad.left, pad.top, pad.right, pad.bottom)
            refresh()
            insets // not consumed
        }
    }

    override fun onStart() {
        super.onStart()
        layoutTracker.addWindowLayoutInfoListener(this, ContextCompat.getMainExecutor(this), layoutListener)
    }

    override fun onStop() {
        layoutTracker.removeWindowLayoutInfoListener(layoutListener)
        super.onStop()
    }

    override fun onResume() {
        super.onResume()
        hingeAngle = null
        ViewCompat.requestApplyInsets(root)
        val sm = getSystemService(SensorManager::class.java)
        sm.getDefaultSensor(Sensor.TYPE_HINGE_ANGLE)?.let {
            sm.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onPause() {
        getSystemService(SensorManager::class.java).unregisterListener(this)
        super.onPause()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        latestInsets = null
        lastJson = ""
        foldingFeatures = emptyList()
        ViewCompat.requestApplyInsets(root)
    }

    override fun onSensorChanged(event: SensorEvent) {
        val angle = event.values.firstOrNull() ?: return
        val prev = hingeAngle
        hingeAngle = angle
        if (prev == null || abs(prev - angle) >= 1f) refresh()
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    private fun selectedScreen(): String = when (screenGroup.checkedRadioButtonId) {
        ID_COVER -> "cover"
        ID_MAIN -> "main"
        else -> "phone"
    }

    private fun refresh() {
        val insets = latestInsets ?: return
        val json = Probe.collect(this, insets, selectedScreen(), hingeAngle, foldingFeatures, screenLabelSource)
        lastJson = json.toString(2)
        output.text = lastJson
        val bounds = windowManager.currentWindowMetrics.bounds
        val maximumBounds = windowManager.maximumWindowMetrics.bounds
        val displayStatus = display?.displayId?.let { "display $it" } ?: "display unknown"
        val expectedStatus = expectedDisplayId?.let { " · expected display $it" }.orEmpty()
        captureStatus.text = "Active window: ${bounds.width()} × ${bounds.height()} px · $displayStatus$expectedStatus · " +
            "hinge: ${hingeAngle?.let { "${it.toInt()}°" } ?: "unavailable"}\n" +
            "Full display: ${maximumBounds.width()} × ${maximumBounds.height()} px\n" +
            "Screen label: ${selectedScreen()} ($screenLabelSource; does not switch displays)"

        if (autoExport) {
            autoExport = false
            // Give WindowInfoTracker a moment to report the FoldingFeature before saving.
            root.postDelayed({
                refresh()
                export()?.let { Log.i(TAG, "Saved ${it.absolutePath}") }
            }, 1000)
        }
    }

    /** Save to app-specific external storage (adb pull-able) and log to logcat. */
    private fun export(): File? {
        val currentInsets = ViewCompat.getRootWindowInsets(root)
        val bounds = windowManager.currentWindowMetrics.bounds
        val maximumBounds = windowManager.maximumWindowMetrics.bounds
        val reason = CapturePolicy.blockingReason(
            selectedScreen(), hingeAngle,
            currentInsets != null && root.isLaidOut && !root.isLayoutRequested &&
                root.width == bounds.width() && root.height == bounds.height(),
            isInMultiWindowMode,
            expectedDisplayId,
            display?.displayId,
            bounds.width() == maximumBounds.width() && bounds.height() == maximumBounds.height(),
        )
        if (reason != null) {
            Toast.makeText(this, reason, Toast.LENGTH_LONG).show()
            Log.w(TAG, "Capture blocked: $reason")
            ViewCompat.requestApplyInsets(root)
            return null
        }
        // A button press must collect now, not export the last callback's JSON.
        val json = Probe.collect(
            this,
            currentInsets!!,
            selectedScreen(),
            hingeAngle,
            foldingFeatures,
            screenLabelSource,
        )
        lastJson = json.toString(2)
        output.text = lastJson
        val nav = json.getJSONObject("navigation").getString("mode")
        val screen = json.getString("screen")
        val name = if (screen == "phone") "main-$nav.json" else "$screen-$nav.json"
        val file = File(getExternalFilesDir(null), name).apply { writeText(lastJson) }
        lastJson.lines().chunked(60).forEach { Log.i(TAG, it.joinToString("\n")) }
        return file
    }

    private fun buildUi() {
        val dp = resources.displayMetrics.density
        fun px(v: Int) = (v * dp).toInt()

        root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        root.addView(TextView(this).apply {
            text = "InsetsProbe · windowinsets.info"
            textSize = 16f
            setTypeface(typeface, Typeface.BOLD)
            setPadding(px(12), px(8), px(12), 0)
        })
        root.addView(TextView(this).apply {
            text = "Use default Display size / Font size in full screen. Physically open or close the device first. " +
                "Cover / Main only labels the active display; it cannot unfold the device. " +
                "Change navigation in Android Settings, return here, then Measure."
            textSize = 12f
            setPadding(px(12), px(4), px(12), px(4))
        })

        screenGroup = RadioGroup(this).apply {
            orientation = RadioGroup.HORIZONTAL
            setPadding(px(8), 0, px(8), 0)
            addView(RadioButton(context).apply { id = ID_PHONE; text = "Phone" })
            addView(RadioButton(context).apply { id = ID_COVER; text = "Cover" })
            addView(RadioButton(context).apply { id = ID_MAIN; text = "Main" })
            check(ID_PHONE)
            setOnCheckedChangeListener { _, _ -> refresh() }
        }
        root.addView(screenGroup)

        captureStatus = TextView(this).apply {
            textSize = 12f
            setPadding(px(12), px(4), px(12), px(4))
            text = "Waiting for active window insets…"
        }
        root.addView(captureStatus)
        root.addView(Button(this).apply {
            text = "Display / navigation settings"
            setOnClickListener { startActivity(Intent(Settings.ACTION_DISPLAY_SETTINGS)) }
        })

        val buttons = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.START
            setPadding(px(8), 0, px(8), 0)
        }
        buttons.addView(Button(this).apply {
            text = "Measure"
            setOnClickListener {
                val file = export() ?: return@setOnClickListener
                Toast.makeText(context, "Saved: ${file.name}", Toast.LENGTH_LONG).show()
            }
        })
        buttons.addView(Button(this).apply {
            text = "Copy JSON"
            setOnClickListener {
                val file = export() ?: return@setOnClickListener
                getSystemService(ClipboardManager::class.java).setPrimaryClip(ClipData.newPlainText("probe", lastJson))
                Toast.makeText(context, "Copied. Saved: ${file.name}", Toast.LENGTH_LONG).show()
            }
        })
        buttons.addView(Button(this).apply {
            text = "Share"
            setOnClickListener {
                export() ?: return@setOnClickListener
                val send = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, lastJson)
                }
                startActivity(Intent.createChooser(send, "Share probe JSON"))
            }
        })
        root.addView(buttons)

        output = TextView(this).apply {
            typeface = Typeface.MONOSPACE
            textSize = 10f
            setTextIsSelectable(true)
            setPadding(px(12), px(4), px(12), px(12))
        }
        root.addView(ScrollView(this).apply { addView(output, MATCH_PARENT, WRAP_CONTENT) }, MATCH_PARENT, 0).also {
            (root.getChildAt(root.childCount - 1).layoutParams as LinearLayout.LayoutParams).weight = 1f
        }

        setContentView(root)
    }

    private companion object {
        const val TAG = "InsetsProbe"
        const val ID_PHONE = 1001
        const val ID_COVER = 1002
        const val ID_MAIN = 1003
    }
}
