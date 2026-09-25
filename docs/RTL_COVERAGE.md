# Samsung skin and RTL coverage

Checked 2026-09-25. **The full comparison is not yet verified.**

Keep registered skins browsable under the 2020+ coverage policy with the Fold/Flip exception.
New measurement collection prioritizes models offered by Samsung Remote Test Lab.
The owner also explicitly authorized physical Fold2 measurements on 2026-09-22;
verified physical-device captures are accepted without implying RTL availability.
Only actual InsetsProbe captures populate insets; a skin or RTL listing never
supplies measured values. Preserve historical captures even if Samsung later
removes a model from its catalog.

## Evidence collected

- [Official RTL introduction](https://developer.samsung.com/remote-test-lab)
  features Galaxy Z Fold8, Galaxy Z Flip8, Galaxy S26 Ultra and Galaxy Tab S11.
  These are featured models, not a complete inventory or verified free slots.
- [Reservation catalog](https://developer.samsung.com/remotetestlab/devices)
  became accessible after the user completed Samsung authentication manually.
  The Galaxy Z list was inspected and Galaxy Z Fold8 (SM-F971N, Korea/Gumi) was
  successfully reserved on 2026-09-22. Galaxy Z Fold7 (SM-F966U, Korea/Gumi) was
  reserved twice on 2026-09-23 to complete a split 30-minute capture workflow.
  Galaxy Z Flip8 (SM-F776B) was also operated on 2026-09-23 and its FlexWindow
  cover was measured through the registered InsetsProbe AppWidget on display 1.
  Galaxy Z Fold8 Ultra (SM-F976U, Korea/Gumi) was reservable on 2026-09-23. An
  earlier session was returned before capture because the lock screen required
  manual handoff; later captures in the repository measured both displays.
  Galaxy Z Fold6 (SM-F956U-KR10, Korea/Gumi) was reserved three times on
  2026-09-23. Its cover and inner display were measured in both navigation
  modes. An earlier inner 3-button attempt was retained but not published
  because the navigation bar was transiently reported as 1 px; a later
  recapture reported a settled 126 px navigation bar.
  Galaxy Z Fold5 (SM-F946BE-VN1, Vietnam/Hanoi) was reserved twice on
  2026-09-23. Both screens were measured in both navigation modes; the first
  cover gesture capture was rotated and retained as rejected evidence, then
  recaptured upright in the second reservation.
  Galaxy Z Fold4 (SM-F936BE-VN2, Vietnam/Hanoi) was reserved on 2026-09-23.
  Both screens were measured upright in both navigation modes. Rotated first
  attempts and a main gesture attempt with Taskbar enabled are retained as
  rejected evidence; the accepted main captures have Taskbar off.
  An initial Galaxy Z Flip7 FE (SM-F761B-VN4, Vietnam/Hanoi) reservation on
  2026-09-23 failed to install InsetsProbe at 0%, even after reconnecting
  following a device restart. That reservation was returned with one credit
  refunded and produced no accepted measurement. A later capture is documented
  below. Galaxy Z Flip6 (SM-F741U-KR10,
  Korea/Gumi) was subsequently reserved. Its official main-screen skin was
  matched to fresh, upright 1080×2640 px captures in both navigation modes;
  the skin archive has no cover layout, so cover values remain pending.
  Galaxy Z Fold3 (SM-F926B-VN1) was reserved but its Probe installation stayed
  at 0%; it was returned without a capture. Galaxy Z Flip7 (SM-F766N_KR1) was
  then reserved and produced an upright 1080×2520 main 3-button capture with
  Probe 1.3.0. The model already had complete physical-device measurements for
  both screens and modes, so this RTL file is preserved separately under
  `measurements/galaxy-z-flip7/rtl-recapture-2026-09-23/` and does not replace
  the canonical measurements. Its inset values agree with the physical main
  3-button capture; the newer probe also records a cutout path.
  Galaxy Z Flip5 (SM-F731BE-VN3, Vietnam/Hanoi) was then reserved. Its
  official main skin matches upright 1080×2640 captures in both navigation
  modes. The first gesture export was rotated 180° and retained only in the
  host download history; the accepted recapture is rotation 0. The imported
  archive has no cover layout, so cover remains unavailable.
  Galaxy Z Flip3 (SM-F711B-VN2, Vietnam/Hanoi) was reserved on 2026-09-23.
  Its upright main 3-button capture was downloaded and verified at 1080×2640.
  Probe also saved a main gesture capture on the device, but WebClient stopped
  delivering subsequent downloads despite Chrome automatic downloads being
  allowed. Samsung's Device to Host clipboard notification was selected, but
  the host clipboard remained empty. At that time the gesture mode was not
  accepted or registered; neither file deletion nor a new reservation was
  evidence of that missing capture.
  On 2026-09-24 the same Flip3 unit was reserved again. InsetsProbe 1.3.0
  produced a fresh upright main gesture capture (1080×2640 px, display 0,
  density 480 dpi, Android 14 / One UI 6.1). Its WebClient download reached
  the host and was validated against the earlier main 3-button capture.
  Both main modes are now registered; no official cover skin is available.
  The original Galaxy Z Flip (SM-F700F-IN5, India/Noida) was reserved on
  2026-09-24. InsetsProbe 1.3.0 captured its main display in both navigation
  modes on Android 13 / One UI 5.1.1; the official skin archive contains only
  the main layout, so no cover measurement is registered. This reservation
  verifies this exact model variant was offered on that date only.
  A second Fold3 unit (SM-F926U-VN2, Android 15, Vietnam/Hanoi) was reserved
  on 2026-09-24. The same built APK again stalled at 0% in WebClient
  Applications, while installation succeeded on Flip3 in the same session.
  No Fold3 insets were captured. The device-specific installation failure is
  tracked in [issue #11](https://github.com/easyhooon/windowinsets/issues/11).
  The full cross-series, cross-region inventory was not completed.
- The local skin archive contains 126 registered models; 119 are public under
  the release-year policy. All four featured mobile models have registered skins.
  The other archived models remain unverified, not unsupported. Galaxy Z Flip5
  was visible in the 2026-09-23 reservation catalog; its official main skin
  and two verified main captures are now registered.
- Galaxy S25 (SM-S931N_KR1, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured its main display in both
  navigation modes at 1080×2340 px; the files match the official main skin.
  This verifies that exact model's availability on that date, but not the
  complete cross-series catalog. Existing S25+ captures are from a physical
  device; S25 Ultra captures document a separate past RTL reservation.
- Galaxy S25 Edge (SM-S937N_KR10, Korea/Gumi) was reserved on 2026-09-24
  with Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured both navigation
  modes at 1080×2340 px in FHD+ mode; the physical panel is 1440×3120 px.
  Its live reservation confirms availability on that date only.
- Galaxy S25 FE (SM-S731N_KR1, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured both navigation modes
  at 1080×2340 px; this confirms availability on that date only.
- Galaxy S24 Ultra (SM-S928N-KR3, Korea/Gumi) was reserved for 30 minutes on
  2026-09-24 with Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured the main
  display in both navigation modes at 1080×2340 px / 450 dpi. Settings and inset
  evidence agree; raw captures omit the cutout bounding rectangle, so only the
  top cutout inset is registered. This confirms availability on that date only.
- Galaxy S24+ (SM-S926N-KR3, Korea/Gumi) was reserved twice for 30 minutes on
  2026-09-24 with Android 16 / One UI 8.5. Its initial reservation produced an
  upright main 3-button capture; a second reservation produced the gesture
  capture. Both were downloaded and validated at 1080×2340 px / 450 dpi, and
  InsetsProbe and Android's navigation setting agree in both files. The gesture
  capture was generated at 2026-09-24T14:26:26Z and saved unchanged as
  `main-gesture.json`. The earlier stale-export symptom is tracked in issue #12.
  These reservations confirm this exact model was offered in Korea on this date
  only.
- Galaxy S24 (SM-S921N-KR3, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured the main display in both
  navigation modes at 1080×2340 px / 480 dpi; the downloaded files report
  matching Settings and inset classifications. This confirms availability for
  this exact model on that date only.
- Galaxy S24 FE (SM-S721N_KR4, Korea/Gumi) was reserved on 2026-09-25 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured its Phone-labeled built-in
  display in both navigation modes at 1080×2340 px / 450 dpi with font scale 1.
  Both downloaded files report matching Settings and inset classifications.
  Samsung's raw captures include the display cutout inset but no bounding
  rectangles, so no cutout shape is registered. This confirms availability for
  the exact model on that date only.
- Galaxy S23 FE (SM-S711B), Galaxy S22 Ultra (SM-S908U), Galaxy S22+ (SM-S906B)
  and Galaxy S22 (SM-S901B) were reserved and captured on 2026-09-25. Each has
  full-screen main captures in both navigation modes with Android setting and
  InsetsProbe classifications in agreement, font scale 1, and exact raw JSON
  preserved under its `measurements/` directory. S23 FE is Android 16 / One UI
  8.5 at 1080×2340 px / 450 dpi; S22 Ultra is Android 13 / One UI 5.1 at
  1080×2316 px / 450 dpi on its 1440×3088 physical panel; S22+ is Android 15 /
  One UI 7.0 at 1080×2340 px / 450 dpi; S22 is Android 15 / One UI 7.0 at
  1080×2340 px / 480 dpi. S22 Ultra's raw cutout bounds are centered around
  x=720 despite the active window being 1080 px wide, so only its measured safe
  inset is registered and the inconsistent cutout shape is omitted from the
  diagram. This verifies these exact model variants were offered on the capture
  date; it does not complete the cross-region catalog inventory.
- Galaxy S21 Ultra (SM-G998B), Galaxy S21+ (SM-G996B), Galaxy S21 (SM-G991B),
  Galaxy S20 Ultra (SM-G988B) and Galaxy S20 FE (SM-G780G) were reserved and
  captured on 2026-09-25. The first four have accepted main captures in both
  navigation modes, all with matching Android setting and InsetsProbe mode,
  font scale 1 and rotation 0. S21 Ultra: Android 14 / One UI 6.1,
  1080×2400 px / 450 dpi on a 1440×3200 panel; rounded-corner values are null
  in both raw captures and remain unavailable. S21+: Android 15 / One UI 7.0,
  1080×2400 px / 450 dpi. S21: Android 14 / One UI 6.1, 1080×2400 px / 480
  dpi. S20 Ultra: Android 13 / One UI 5.1, 1080×2400 px / 420 dpi on a
  1440×3200 panel. Its raw cutout rectangle is centered around x=720 despite
  the active window being 1080 px wide; the safe inset is registered and the
  unscaled cutout shape is omitted. S20 FE has both modes (Android 13 / One UI
  5.1, 1080×2400 px / 480 dpi). Its gesture file says 2026-09-25T05:30:35Z;
  the 3-button file's embedded `capturedAt` says 2024-12-27T11:54:02Z, while
  its host download modification time is 2026-09-25 14:30:57 KST, 13 seconds
  after the gesture file. The user confirmed the 3-button capture was just
  measured alongside the gesture capture. Probe writes `capturedAt` using the
  Android device clock (`Instant.now()`), so the raw discrepancy is retained
  and documented as a likely device-clock anomaly; neither JSON was edited.
  These reservations verify exact model variants on the capture date only, not
  the full cross-region catalog.
- Galaxy Tab S11 Ultra Wi-Fi (SM-X930) was captured in both navigation modes
  on 2026-09-25. Its landscape 2960×1848 px window matches the official main
  display resolution. The gesture capture's inset-only classifier says
  threeButton, but Android Settings, config and side gesture insets confirm
  gesture mode; preserve and register the measured gesture values.
- Galaxy Tab S11 Wi-Fi (SM-X730), Galaxy Tab S10 FE+ Wi-Fi (SM-X620), Galaxy
  Tab S10 FE Wi-Fi (SM-X520) and Galaxy Tab S9 FE+ 5G (SM-X616N) each have
  landscape main captures in both navigation modes from 2026-09-25. The captures
  match their registered official skin dimensions: 2560×1600, 2880×1800,
  2304×1440 and 2560×1600 px respectively, all at rotation 1. Gesture mode is
  confirmed by Android Settings/configuration and side system gesture insets,
  even though InsetsProbe's inset-only classification says threeButton. The
  S10 FE captures report font scale 1.08 rather than the default 1.0; their raw
  measurements are registered with that condition and should be recaptured at
  1.0 for a normalized comparison.
- Galaxy Tab A9+ 5G (SM-X216B) has both landscape main modes from Samsung RTL,
  Android 14 / One UI 6.1, build `UP1A.231005.007.X216BXXS3CXG1`. Captures match
  the official 1920×1200 skin at rotation 1, 240 dpi, and font scale 1.1. Both
  modes report 48 dp / 72 px bottom system bars. The gesture mode is confirmed
  by Settings/configuration and side system-gesture insets even though the
  inset-only heuristic reports threeButton; the shared bottom inset is preserved
  rather than treated as a mode mismatch.
- Galaxy Tab A7 Lite LTE (SM-T225) has both landscape main captures from Samsung
  RTL, Android 14 / One UI 6.1, build `UP1A.231005.007.T225XXSBEYE4`. The
  1340×800 px active window matches Samsung's published display resolution at
  rotation 1, 213 dpi and font scale 1. Gesture mode is confirmed by
  Settings/configuration and side system-gesture insets although the inset-only
  heuristic reports threeButton. Both modes report 48.08 dp / 64 px bottom
  system bars; preserve the measured values.
- Fold8 cover and inner were both
  recaptured from a live reservation in 3-button and gesture modes. Fold7 cover
  and inner are also measured in both modes from the same SM-F966U software
  build. Flip8 cover and inner are now measured in both modes; its accepted cover
  captures report display 1 and 948×1048 px, while the older mislabeled
  `cover-threeButton.json` remains preserved as historical inner-display evidence.
  Fold6 now has accepted cover and inner captures in both navigation modes;
  the rejected inner 3-button attempt remains historical evidence. Fold5 also
  has accepted captures for both screens and modes, with its rotated first
  cover gesture attempt preserved separately. Fold4 has accepted upright cover
  and inner captures in both modes after the Taskbar correction. Flip5 and Flip6
  main have accepted captures in both modes; their covers remain skin-unavailable. Flip3
  main is also registered in both modes from dated captures on the same RTL unit.
  Galaxy Z Fold3 is now measured on both displays in both navigation modes from
  two Vietnam/Hanoi RTL units running Android 14 / One UI 6.1.

### Galaxy Z Fold3 — 2026-09-25

InsetsProbe 1.3.0 captured all four display/navigation combinations on Samsung
RTL. Cover and main 3-button captures came from SM-F926B-VN1; main gesture was
recaptured on SM-F926B-VN2. The captures share model/build, Android 14, One UI
6.1, and 420 dpi. The active windows match the official cover/main skin classes:
840×2289 px cover and 1768×2208 px main, both portrait. Main captures include a
vertical FLAT folding feature at x=884 px.

- cover: 82 px top and 126/39 px bottom for 3-button/gesture;
- main: 88 px top and 126/168 px bottom for 3-button/gesture;
- main gesture mode is verified from Settings/configuration and side system
  gesture insets although InsetsProbe's inset-only classifier reports 3-button.
  User screenshots show the persistent Taskbar with both navigation choices;
  the gesture-mode bottom inset is 64 dp versus 48 dp in 3-button mode. Preserve
  these measured values as the observed Fold3 configuration, not a mode error.

Two rejected attempts are preserved under
`measurements/galaxy-z-fold3/rejected-2026-09-25/`: `content (40)` was labeled
main gesture but had cover dimensions (840×2289 px), while `content (43)` had
the correct inner dimensions but retained the Phone label. Neither is registered.
Fold3 RTL availability is confirmed by live reservations in Vietnam/Hanoi on
2026-09-25; the reservation catalog was not exhaustively inventoried by region.

The comparison for every registered skin is in [RTL_SKIN_COMPARISON.csv](RTL_SKIN_COMPARISON.csv).
It includes pre-2020 models for inventory completeness. Galaxy Fold is public
under the Fold/Flip exception; other pre-2020 entries remain archived. TriFold artwork and two-hinge animation were separately approved on 2026-09-24.
Its RTL availability is unverified; neither screen has an accepted capture.

## Data and presentation

The `rtlCatalog` snapshot in `app/data/rtlAvailability.ts` stores the source,
check date, inventory scope, featured model slugs and separately verified
reservable slugs. `rtlAvailability.ts` derives three inventory states:

| Evidence | Display | Measurement handling |
| --- | --- | --- |
| Model appears in checked source | Featured/Listed on RTL | Capture each screen and navigation mode before adding numbers |
| Model absent from a complete reservation catalog | Not listed on RTL | Keep skin preview; explain missing RTL access |
| Catalog incomplete or inaccessible | RTL status unverified | Keep preview; do not claim non-support |

Measurement status is separate and specific to the selected screen and navigation
mode. Current slot occupancy is also separate: a fully booked model is still
offered by RTL. Existing measurements are never hidden by availability metadata.

## Completing the comparison

When the reservation catalog opens, clear search and category filters, inspect all
pages and regions, and retain a dated list with source and scope. Include busy
devices, not just immediately free slots. Match exact model variants, including
Plus, Ultra, FE, Wi-Fi and 5G where applicable; unresolved aliases require review.

Replace the featured-only snapshot with that verified inventory, set
`scope: "reservation-catalog"`, and set `complete: true` only after all models
and regions have been checked. A 403, an empty shell or a filtered page must
never produce a complete empty inventory. Refresh the CSV from the same snapshot.
Galaxy Z Fold8, Fold7, Fold6, Fold5, Fold4 and Flip8 reservations were made during this comparison.
They establish those models' availability on their checked dates only; they do not
make the partial inventory complete.

## Galaxy S26 Ultra measured on 2026-09-23

Samsung RTL Korea/Gumi SM-S948U_KR3 was reserved and its main display captured
with InsetsProbe 1.2.1 in both 3-button and gesture navigation. Both accepted
files report an upright 1080×2340 px app window. The physical panel is
1440×3120 px according to Samsung specifications. This reservation verifies
that model was offered on the checked date; it does not complete the
cross-region RTL catalog inventory.

## Galaxy S25 measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S931N_KR1 (Android 16, One UI 8.5, build
BP4A.251205.006.S931NKSSBCZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation at an upright 1080×2340 px full
window, matching the official Galaxy S25 main skin. Both captures report
480 dpi, font scale 1, display 0, and matching navigation settings/configuration.
The hinge angle is null and there are no folding features, as expected for this
bar phone. The reservation proves this model was offered in Korea on this date;
the overall RTL inventory remains incomplete.

## Galaxy S25 Edge measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S937N_KR10 (Android 16, One UI 8.5, build
BP4A.251205.006.S937NKSS9CZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation in FHD+ mode at an upright, full-screen
1080×2340 px window. Samsung specifies the panel as 1440×3120 px. Both captures
report 450 dpi, font scale 1, display 0, rotation 0, and matching navigation
settings/configuration. The reservation confirms Korea availability on this date;
the overall RTL inventory remains incomplete.

## Galaxy S25 FE measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S731N_KR1 (Android 16, One UI 8.5, build
BP4A.251205.006.S731NKSS8BZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation at an upright, full-screen
1080×2340 px window. Both captures report 450 dpi, font scale 1, display 0,
rotation 0, and matching navigation settings/configuration. The reservation
confirms Korea availability on this date; the overall RTL inventory remains
incomplete.

## Galaxy Z TriFold — 2026-09-24 and 2026-09-25

Samsung RTL SM-F968N_KR1, Korea/Gumi, Android 16 / One UI 8.5, build
`BP4A.251205.006.F968NKSS6BZG3`. Main 3-button and gesture captures are
2160×1584 px, natural landscape (rotation 0), 320 dpi, Taskbar off. Cover
gesture is 1080×2520 px, portrait, 420 dpi. On 2026-09-25 a second Korea/Gumi
reservation produced the missing cover 3-button capture at 2026-09-24T15:17:37Z:
1080×2520 px, 420 dpi, display 0, rotation 0 and fontScale 1. InsetsProbe and
Android Settings both reported three-button navigation. All four screen/mode
captures are now verified.

Raw captures and unchanged RTL log exports are preserved in
`measurements/galaxy-z-trifold/`. See its README for extraction provenance,
display-density refresh behavior and the RTL hinge-report limitation.

## Galaxy Z Flip4 measured on 2026-09-25

Samsung RTL Vietnam/Hanoi SM-F721BE-VN1 (SM-F721B, Android 14 / One UI 6.1.1)
produced valid unfolded main captures in 3-button and gesture navigation. Both
report display 0, 1080×2640 px, 480 dpi, rotation 0, and a horizontal FLAT
folding feature at y=1320. InsetsProbe, Settings and Android navigation
configuration agree: bottom system bars are 144 px in 3-button mode and 45 px
in gesture mode. The reservation confirms availability in Vietnam on this date;
the Korean catalog and full RTL inventory remain incomplete.

The session's Cover-labelled exports are preserved as rejected evidence because
they also report display 0, the unfolded 1080×2640 px window, and the FLAT inner
display. Probe's Cover/Main radio changes only the stored label; it does not
switch displays. The Flip cover collection policy now starts at Flip5: Flip, Flip3
and Flip4 covers are unsupported and are not measurement targets because their
registered official skins have no cover layout. The physical Flip4 cover exists,
but its RTL captures are intentionally excluded from product support. See the raw
captures, rejected files and unchanged log export under
`measurements/galaxy-z-flip4/`.

For Flip5 and later, cover measurement is eligible only after a registered
official cover skin exists. As of 2026-09-25, only Flip7 and Flip8 have cover
layouts in the catalog; Flip5 and Flip6 remain main-only until cover artwork is
imported. Complete both cover navigation modes on eligible models before moving
to lower-priority collection targets.

## Galaxy Z Flip7 FE measured on 2026-09-25

InsetsProbe 1.3.0 captures for SM-F761B, Android 16 / One UI 8.0, build
`BP2A.250605.031.A3.F761BXXU4AYI1`, were downloaded and validated on 2026-09-25.
Both are upright main-display captures at 1080×2640 px, display 0, 480 dpi and
font scale 1, with the device fully unfolded (180°) and a horizontal FLAT
folding feature at y=1320 px. The captures agree with Android navigation
configuration: gesture has 116/45 px top/bottom system bars; 3-button has
116/144 px. Both include a 66×116 px centered cutout bound. The registered
skin includes only the main display, so no cover capture is in scope.

Raw files: `measurements/galaxy-z-flip7-fe/main-gesture.json` and
`main-threeButton.json`.

## Galaxy Tab S11 Ultra measured on 2026-09-25

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S11 Ultra Wi-Fi (SM-X930),
Android 16 / One UI 8.5, build `BP4A.251205.006.X930XXS7BZG3`, in landscape at
rotation 1. Both captures report a full-screen 2960×1848 px main display at
280 dpi with font scale 1, matching Samsung's official WQXGA+ resolution. The
main skin is portrait artwork; the registered capture rotation presents the
landscape evidence in its physical orientation. Samsung's listed 14.6-inch
diagonal and 2960×1848 resolution give approximately 240 ppi.

- 3-button: system bars are 60 px top and 84 px bottom (34.29 / 48 dp).
- gesture: system bars are 60 px top and 26 px bottom (34.29 / 14.86 dp).
  Settings, `config_navBarInteractionMode=2`, and side system gestures confirm
  gesture mode, although the inset-only heuristic reports threeButton because
  the tappable bottom inset is nonzero.
- Both captures report a 100×28 px centered cutout bound and 44 px rounded
  corners. InsetsProbe labels non-foldable displays `phone`; these matching
  SM-X930 captures are registered as the tablet's main screen.

Raw files: `measurements/galaxy-tab-s11-ultra/main-gesture.json` and
`main-threeButton.json`.

## Galaxy Tab S9 Ultra measured on 2026-09-25

Samsung RTL SM-X916B (Android 15 / One UI 7.0, build
`AP3A.240905.015.A2.X916BXXS5CYG1`) produced full-screen main captures in
landscape at rotation 1: 2960×1848 px, 280 dpi, font scale 1. Both match
Samsung's official 14.6-inch WQXGA+ display. The captures report `screen: main`
and display 0; InsetsProbe's generic Phone label is classified as the tablet's
main screen from the model and dimensions.

- 3-button: system bars are 42 px top and 84 px bottom (24 / 48 dp).
- gesture: system bars are 42 px top and 26 px bottom (24 / 14.86 dp). Settings,
  `config_navBarInteractionMode=2` and side system gesture insets confirm gesture
  mode; Settings and inset classification agree.
- Both captures include a 186×28 px centered cutout bound (106.29×16 dp) and
  23 px rounded corners (13.14 dp).

Raw files: `measurements/galaxy-tab-s9-ultra/main-gesture.json` and
`main-threeButton.json`. The reservation confirms this exact model was offered
in RTL on this date; it does not complete the cross-region catalog inventory.

## Physical Galaxy Tab S9 measured on 2026-09-25

InsetsProbe 1.3.0 was installed through Android CLI on the user's physical
Galaxy Tab S9 Wi-Fi (SM-X710), Android 16 / One UI 8.0, build
`BP2A.250605.031.A3.X710XXS5DZA1`. Both full-screen Main captures are portrait,
rotation 0, 1600×2560 px, 340 dpi (default) and font scale 1, matching the
official 2560×1600 panel in portrait orientation. The Samsung Taskbar was enabled
for both captures and was left unchanged.

- 3-button: system bars are 64 px top and 102 px bottom (30.12 / 48 dp).
- gesture: system bars are 64 px top and 32 px bottom (30.12 / 15.06 dp).
  Settings and `config_navBarInteractionMode=2` confirm gesture mode; left/right
  system-gesture insets are 63 px. The inset-only heuristic reports
  threeButton, so retain the settings and gesture-region evidence rather than
  inferring a mode error from that heuristic.
- Both captures have no display cutout and report 21 px rounded corners
  (9.88 dp).

These are direct physical-device captures, not RTL data; the RTL catalog status
for Galaxy Tab S9 remains unknown. Raw files:
`measurements/galaxy-tab-s9/main-gesture.json` and
`main-threeButton.json`.


### Galaxy Tab S9 FE — 2026-09-25

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S9 FE 5G (SM-X516N),
Android 16 / One UI 8.5, build `BP4A.251205.006.X516NKOSEEZG3`, landscape at
rotation 1. Both captures match the main skin at 2304×1440 px, 280 dpi, with
font scale 1.08. The gesture capture is registered: Settings/configuration and
side system-gesture insets confirm gesture mode, while the inset-only heuristic
reports threeButton.

The 3-button capture is preserved as rejected evidence because both
`navigationBars` and `systemBars` report a 1 px bottom inset, including when
ignoring visibility, despite `tappableElement` and mandatory-gesture bottom
insets of 84 px. It does not provide a settled 3-button system-bar measurement;
recapture that mode before publishing it. Font scale 1.08 is non-default and is
recorded as captured; recapture at 1.0 if a normalized baseline is needed.

Accepted raw file: `measurements/galaxy-tab-s9-fe/main-gesture.json`.
Rejected raw file: `measurements/galaxy-tab-s9-fe/rejected-2026-09-25/main-threeButton.json`.
