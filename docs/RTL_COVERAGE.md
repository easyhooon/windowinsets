# Samsung skin and RTL coverage

Checked 2026-09-23. **The full comparison is not yet verified.**

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
  Galaxy Z Fold8 Ultra (SM-F976U, Korea/Gumi) was reservable on 2026-09-23, but
  its session was returned before capture because the lock screen required the
  unavailable manual handoff. This verifies catalog availability, not insets.
  The full cross-series, cross-region inventory was not completed.
- The local skin archive contains 73 registered models; 70 are public under
  the release-year policy. All four featured mobile models have registered skins.
  The other 69 archived models (66 public) remain unverified, not unsupported.
- Existing S25+ and S25 Ultra captures document past measurements. They do not
  establish current reservation availability. Fold8 cover and inner were both
  recaptured from a live reservation in 3-button and gesture modes. Fold7 cover
  and inner are also measured in both modes from the same SM-F966U software
  build. Flip8 cover and inner are now measured in both modes; its accepted cover
  captures report display 1 and 948×1048 px, while the older mislabeled
  `cover-threeButton.json` remains preserved as historical inner-display evidence.

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
Galaxy Z Fold8, Fold7 and Flip8 reservations were made during this comparison.
They establish those models' availability on their checked dates only; they do not
make the partial inventory complete.

## Galaxy S26 Ultra measured on 2026-09-23

Samsung RTL Korea/Gumi SM-S948U_KR3 was reserved and its main display captured
with InsetsProbe 1.2.1 in both 3-button and gesture navigation. Both accepted
files report an upright 1080×2340 px app window. The physical panel is
1440×3120 px according to Samsung specifications. This reservation verifies
that model was offered on the checked date; it does not complete the
cross-region RTL catalog inventory.
