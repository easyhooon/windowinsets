package info.windowinsets.probe

/** A tappable taskbar does not imply three-button navigation (observed on Fold2). */
object NavigationMode {
    fun resolve(fromInsets: String, fromSetting: String, fromConfig: Int, sideGestures: Boolean): String = when {
        fromConfig == 2 && sideGestures -> "gesture"
        fromInsets != "unknown" -> fromInsets
        else -> fromSetting
    }
}
