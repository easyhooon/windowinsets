package info.windowinsets.probe

/** Screen labels are manual; reject the observed closed-device/Main mismatch. */
object CapturePolicy {
    fun blockingReason(
        screen: String,
        hingeAngle: Float?,
        layoutReady: Boolean,
        multiWindow: Boolean,
        expectedDisplayId: Int? = null,
        actualDisplayId: Int? = null,
        fullDisplayWindow: Boolean = true,
    ): String? = when {
        !layoutReady -> "Display is changing. Wait for the window to settle, then Measure again."
        multiWindow -> "Open InsetsProbe full screen before measuring."
        expectedDisplayId != null && actualDisplayId != expectedDisplayId ->
            "InsetsProbe opened on display ${actualDisplayId ?: "unknown"}, not the FlexWindow. " +
                "Launch it from the InsetsProbe cover widget and try again."
        !fullDisplayWindow ->
            "The active window does not fill this display. Exit compatibility, pop-up, or split-screen mode and try again."
        screen == "main" && hingeAngle != null && hingeAngle <= 5f ->
            "Main selected, but the hinge reports closed. Open the device and verify the active window size."
        else -> null // Missing hinge data cannot establish which physical display is active.
    }
}
