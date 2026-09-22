# Samsung skin and RTL coverage

Checked 2026-09-22. **The full comparison is not yet verified.**

Keep registered skins browsable under the existing 2020+ coverage policy.
New measurement collection targets models offered by Samsung Remote Test Lab.
Only actual InsetsProbe captures populate insets; a skin or RTL listing never
supplies measured values. Preserve historical captures even if Samsung later
removes a model from its catalog.

## Evidence collected

- [Official RTL introduction](https://developer.samsung.com/remote-test-lab)
  features Galaxy Z Fold8, Galaxy Z Flip8, Galaxy S26 Ultra and Galaxy Tab S11.
  These are featured models, not a complete inventory or verified free slots.
- [Reservation catalog](https://developer.samsung.com/remotetestlab/devices)
  still returned 403 Forbidden when the logged-in Chrome tab was reloaded on
  2026-09-22. The public text fetch exposed only an application shell.
- The local skin archive contains 73 registered models; 70 are public under
  the release-year policy. All four featured mobile models have registered skins.
  The other 69 archived models (66 public) remain unverified, not unsupported.
- Existing S25+ and S25 Ultra captures document past measurements. They do not
  establish current reservation availability. Fold8 inner and Flip8 cover remain
  unmeasured independently of model availability.

The comparison for every registered skin is in [RTL_SKIN_COMPARISON.csv](RTL_SKIN_COMPARISON.csv).
It includes archived pre-2020 models for inventory completeness; it does not
publish their routes or change the separate TriFold decision.

## Data and presentation

The `rtlCatalog` snapshot in `app/data/rtlAvailability.ts` stores the source, check date, inventory scope and
explicit model slugs. `rtlAvailability.ts` derives three states:

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
No new device reservation was made during this comparison.

Validation: typecheck, seven rendering/catalog tests and static build passed.
Local browser visual verification was blocked by `ERR_BLOCKED_BY_CLIENT`.
