package info.windowinsets.probe.wear

import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sqrt

/** Pixel bounds for the central square that fits inside a reported round window. */
data class WearSafeArea(
    val left: Int,
    val top: Int,
    val right: Int,
    val bottom: Int,
) {
    val width: Int get() = right - left
    val height: Int get() = bottom - top

    companion object {
        fun calculate(width: Int, height: Int, isRound: Boolean): WearSafeArea {
            require(width > 0 && height > 0)
            if (!isRound) return WearSafeArea(0, 0, width, height)

            // This is geometric safe-area data, not a WindowInsets-reported system inset.
            val inscribedSquareSide = min(width, height) / sqrt(2.0)
            val horizontalInset = ((width - inscribedSquareSide) / 2.0).roundToInt()
            val verticalInset = ((height - inscribedSquareSide) / 2.0).roundToInt()
            return WearSafeArea(
                left = horizontalInset,
                top = verticalInset,
                right = width - horizontalInset,
                bottom = height - verticalInset,
            )
        }
    }
}
