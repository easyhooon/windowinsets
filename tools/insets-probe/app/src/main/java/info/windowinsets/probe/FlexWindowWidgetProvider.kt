package info.windowinsets.probe

import android.app.ActivityOptions
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class FlexWindowWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, manager: AppWidgetManager, appWidgetIds: IntArray) {
        val launchIntent = Intent(context, MainActivity::class.java).apply {
            putExtra(FlexWindowContract.EXTRA_SCREEN, "cover")
            putExtra(FlexWindowContract.EXTRA_EXPECTED_DISPLAY_ID, FlexWindowContract.COVER_DISPLAY_ID)
            putExtra(
                FlexWindowContract.EXTRA_SCREEN_LABEL_SOURCE,
                FlexWindowContract.SCREEN_LABEL_SOURCE_WIDGET,
            )
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val launchOptions = ActivityOptions.makeBasic().apply {
            launchDisplayId = FlexWindowContract.COVER_DISPLAY_ID
        }.toBundle()
        val launchProbe = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            launchOptions,
        )

        appWidgetIds.forEach { appWidgetId ->
            val views = RemoteViews(context.packageName, R.layout.flex_window_widget).apply {
                setOnClickPendingIntent(R.id.launch_probe, launchProbe)
            }
            manager.updateAppWidget(appWidgetId, views)
        }
    }
}
