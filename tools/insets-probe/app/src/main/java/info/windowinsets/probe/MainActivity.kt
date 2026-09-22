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
    private lateinit var navModeGroup: RadioGroup

    private var latestInsets: WindowInsetsCompat? = null
    private var hingeAngle: Float? = null
    private var foldingFeatures: List<FoldingFeature> = emptyList()
    private var lastJson: String = ""
    private var autoExport = false
    private var measureAllInProgress = false

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
        when (intent.getStringExtra("screen")) {
            "cover" -> screenGroup.check(ID_COVER)
            "main" -> screenGroup.check(ID_MAIN)
        }
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
        ViewCompat.requestApplyInsets(root)
        refresh()
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

    private fun setNavMode(mode: Int) {
        runCatching {
            Settings.Secure.putInt(contentResolver, "navigation_mode", mode)
            Log.i(TAG, "Set navigation_mode to $mode")
        }.onFailure { Log.e(TAG, "Failed to set navigation_mode", it) }
    }

    private fun measureAll() {
        measureAllInProgress = true
        val screens = listOf(ID_COVER, ID_MAIN)
        // Bug fix: the RadioGroup's onCheckedChangeListener guards setNavMode() behind
        // `!measureAllInProgress`, so calling navModeGroup.check(modeId) alone during
        // automation never actually changed the nav mode — both captures silently stayed
        // in whatever mode was active before Measure All started. Call setNavMode()
        // explicitly here instead of relying on that listener.
        val modes = listOf(ID_THREEBUTTON to 0, ID_GESTURE to 2)
        var delay = 0L

        for (screenId in screens) {
            for ((modeId, modeValue) in modes) {
                root.postDelayed({
                    screenGroup.check(screenId)
                    navModeGroup.check(modeId)
                    setNavMode(modeValue)
                    // Real hardware needs more time than the emulator for the system nav
                    // bar to actually switch and for insets to settle before export.
                    root.postDelayed({
                        val file = export()
                        if (file != null) {
                            Log.i(TAG, "Saved: ${file.name}")
                        }
                    }, 600)
                }, delay)
                delay += 1400
            }
        }

        root.postDelayed({
            measureAllInProgress = false
            Toast.makeText(this, "Saved 4 measurement files", Toast.LENGTH_LONG).show()
        }, delay + 500)
    }

    private fun refresh() {
        val insets = latestInsets ?: return
        val json = Probe.collect(this, insets, selectedScreen(), hingeAngle, foldingFeatures)
        lastJson = json.toString(2)
        output.text = lastJson

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
        if (lastJson.isEmpty()) return null
        val nav = latestInsets?.let { runCatching { org.json.JSONObject(lastJson).getJSONObject("navigation").getString("mode") }.getOrNull() } ?: "unknown"
        val screen = selectedScreen()
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
            text = "Hold the device in portrait, at default Display size / Font size, with the navigation mode you want to record. " +
                "Select which screen you are measuring, then Copy JSON."
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

        navModeGroup = RadioGroup(this).apply {
            orientation = RadioGroup.HORIZONTAL
            setPadding(px(8), 0, px(8), 0)
            addView(RadioButton(context).apply {
                id = ID_THREEBUTTON
                text = "3-Button"
                setOnCheckedChangeListener { _, isChecked -> if (isChecked && !measureAllInProgress) setNavMode(0) }
            })
            addView(RadioButton(context).apply {
                id = ID_GESTURE
                text = "Gesture"
                setOnCheckedChangeListener { _, isChecked -> if (isChecked && !measureAllInProgress) setNavMode(2) }
            })
            check(ID_THREEBUTTON)
        }
        root.addView(navModeGroup)

        val buttons = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.START
            setPadding(px(8), 0, px(8), 0)
        }
        buttons.addView(Button(this).apply {
            text = "Measure All"
            setOnClickListener { measureAll() }
        })
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
        const val ID_THREEBUTTON = 1004
        const val ID_GESTURE = 1005
    }
}
