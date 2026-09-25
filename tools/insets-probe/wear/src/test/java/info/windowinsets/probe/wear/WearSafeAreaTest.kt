package info.windowinsets.probe.wear

import org.junit.Assert.assertEquals
import org.junit.Test

class WearSafeAreaTest {
    @Test
    fun roundWindowUsesCenteredInscribedSquare() {
        assertEquals(WearSafeArea(58, 58, 338, 338), WearSafeArea.calculate(396, 396, isRound = true))
    }

    @Test
    fun nonRoundWindowUsesTheEntireBounds() {
        assertEquals(WearSafeArea(0, 0, 396, 360), WearSafeArea.calculate(396, 360, isRound = false))
    }
}
