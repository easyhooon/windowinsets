# Samsung skin and RTL coverage

Checked 2026-09-24. **The full comparison is not yet verified.**

Keep registered skins browsable under the existing 2020+ coverage policy.
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
  Galaxy Z Flip7 FE (SM-F761B-VN4, Vietnam/Hanoi) was reserved on
  2026-09-23, but InsetsProbe installation stayed at 0% even after reconnecting
  following a device restart. The reservation was returned with one credit
  refunded; no measurement was accepted. Galaxy Z Flip6 (SM-F741U-KR10,
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
- The local skin archive contains 125 registered models; 117 are public under
  the release-year policy. All four featured mobile models have registered skins.
  The other archived models remain unverified, not unsupported. Galaxy Z Flip5
  was visible in the 2026-09-23 reservation catalog; its official main skin
  and two verified main captures are now registered.
- Existing S25+ and S25 Ultra captures document past measurements. They do not
  establish current reservation availability. Fold8 cover and inner were both
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
  main is also registered in both modes from dated captures on the same RTL unit. Fold3's
  imported cover and main artwork are previews with no measured insets.

The comparison for every registered skin is in [RTL_SKIN_COMPARISON.csv](RTL_SKIN_COMPARISON.csv).
It includes archived pre-2020 models for inventory completeness; it does not
publish their routes or change the separate TriFold decision.

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
