package info.windowinsets.probe

/** Screen labels are manual; reject the observed closed-device/Main mismatch. */
object CapturePolicy {
    fun blockingReason(screen: String, hingeAngle: Float?, layoutReady: Boolean, multiWindow: Boolean): String? = when {
        !layoutReady -> "Display is changing. Wait for the window to settle, then Measure again."
        multiWindow -> "Open InsetsProbe full screen before measuring."
        screen == "main" && hingeAngle != null && hingeAngle <= 5f ->
            "Main selected, but the hinge reports closed. Open the device and verify the active window size."
        else -> null // Missing hinge data cannot establish which physical display is active.
    }
}
