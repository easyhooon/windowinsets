package info.windowinsets.probe

import org.junit.Assert.assertEquals
import org.junit.Test

class NavigationModeTest {
    @Test fun fold2TaskbarDoesNotOverrideVerifiedGestureNavigation() {
        assertEquals("gesture", NavigationMode.resolve("threeButton", "gesture", 2, true))
        assertEquals("threeButton", NavigationMode.resolve("threeButton", "threeButton", 0, false))
    }

    @Test fun writingTheSecureSettingAloneCannotClaimGestureNavigation() {
        assertEquals("threeButton", NavigationMode.resolve("threeButton", "gesture", 0, false))
        assertEquals("threeButton", NavigationMode.resolve("threeButton", "gesture", 2, false))
        assertEquals("gesture", NavigationMode.resolve("gesture", "gesture", 2, true))
    }
}
