package info.windowinsets.probe

import org.junit.Assert.assertEquals
import org.junit.Test

class FlexWindowContractTest {
    @Test fun onlyTheWidgetSourceGetsWidgetProvenance() {
        assertEquals(
            FlexWindowContract.SCREEN_LABEL_SOURCE_WIDGET,
            FlexWindowContract.screenLabelSource(FlexWindowContract.SCREEN_LABEL_SOURCE_WIDGET),
        )
        assertEquals(FlexWindowContract.SCREEN_LABEL_SOURCE_MANUAL, FlexWindowContract.screenLabelSource(null))
        assertEquals(FlexWindowContract.SCREEN_LABEL_SOURCE_MANUAL, FlexWindowContract.screenLabelSource("unknown"))
    }
}
