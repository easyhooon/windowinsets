package info.windowinsets.probe

/** Samsung's documented display contract for launching an activity from a FlexWindow widget. */
object FlexWindowContract {
    const val COVER_DISPLAY_ID = 1
    const val EXTRA_SCREEN = "screen"
    const val EXTRA_EXPECTED_DISPLAY_ID = "expectedDisplayId"
    const val EXTRA_SCREEN_LABEL_SOURCE = "screenLabelSource"
    const val SCREEN_LABEL_SOURCE_WIDGET = "flexWindowWidget"
    const val SCREEN_LABEL_SOURCE_MANUAL = "manual"

    fun screenLabelSource(value: String?): String =
        if (value == SCREEN_LABEL_SOURCE_WIDGET) SCREEN_LABEL_SOURCE_WIDGET else SCREEN_LABEL_SOURCE_MANUAL
}
