# Samsung RTL credits and reservation budget

**Last live verification:** 2026-09-23 21:01 KST

Samsung's published pages and the current RTL account UI do not agree on the
daily grant. Keep the published policy, observed behavior and spending history
separate instead of turning either one into an unsupported universal rule.

## Published policy

- Samsung's current [About Remote Test Lab](https://developer.samsung.com/remotetestlab/doc/about-remote-test-lab)
  says that each Samsung Developer user receives **20 credits every day**, one
  credit buys **15 minutes**, the minimum reservation is **30 minutes / 2
  credits**, and the daily reservation maximum is 10 hours / 40 credits.
- Samsung's [Web Client guide](https://developer.samsung.com/remotetestlab/doc/get-started-with-web-client)
  says that ending a reservation early returns credits in proportion to unused
  time. Therefore reservation rows show booked credits, not necessarily final
  net consumption.
- Samsung's 2023 [RTL watch-testing guide](https://developer.samsung.com/sdp/blog/en/2023/11/16/testing-watch-faces-in-remote-test-lab-through-watch-face-studio)
  instead says that clicking the credit control earns **10 credits once per
  day**. This matches the live observation below.

## Live account observation

At 2026-09-23 01:20 KST the signed-in account showed **0 Credits**. Clicking
**Get Free Credits** once produced `10 Credits have been added.` and changed the
header to **10 Credits**. A second click produced `Available only 1 time a day`
and did not change the balance. The UI did not expose a countdown, reset time or
timezone, so those details remain unknown.

A Galaxy Z Fold7 reservation then ran for the full 30-minute minimum and expired
without extension. The header showed **8 Credits** afterward, directly confirming
the documented two-credit cost for one minimum reservation on this account.

A second 30-minute Fold7 reservation reduced the header from **8 to 6 Credits**.
Ending it early with RTL's checked `Return this device to get back 1 credit(s)`
option raised the balance to **7 Credits**. This is direct evidence that an early
return can refund one whole unused 15-minute block; it does not establish
sub-credit or partial-block behavior.

A subsequent Galaxy Z Flip8 reservation was confirmed at exactly **30 minutes / 2
credits** and produced the verified FlexWindow captures at about 02:40 KST. The
slot expired normally without an early return. Returning to the device list then
showed **5 Credits**, confirming the full two-credit net consumption from the
previously observed 7-credit balance.

A Galaxy Z Fold8 Ultra reservation then reduced the header from **5 to 3
Credits**. InsetsProbe installed successfully, but the device started at its lock
screen and the single calibrated Computer Use swipe did not unlock it. Because the
user was unavailable for the required manual handoff and 25 minutes remained, the
reservation was ended with RTL's checked `Return this device to get back 1
credit(s)` option. The device list then showed **4 Credits**. No measurement from
this blocked reservation was accepted.

On 2026-09-23, a second Galaxy Z Fold6 reservation reduced the live header
from **19 to 17 Credits**. After downloading the remaining attempted capture,
the WebClient still displayed 17 minutes remaining on the 30-minute slot.
Ending it with `Return this device to get back 1 credit(s)` checked raised the
header to **18 Credits** and left no active reservation. This is a second direct
one-credit refund observation, not proof that the threshold is exactly 15
minutes; the checkbox and resulting balance are the evidence.

Two Galaxy Z Fold5 30-minute reservations on 2026-09-23 each ended with the
WebClient's one-credit return option selected after their needed captures were
downloaded. The first raised the observed balance from **14 to 15 Credits**;
the second, used to recapture an upright cover gesture file, reduced the balance
to **13** on booking and raised it to **14 Credits** on return. The final 14-credit
header was verified on the RTL device list. These are optional refunds after
completed work, not a reason to shorten measurement or validation.

A Galaxy Z Fold4 30-minute reservation later reduced the observed balance from
**14 to 12 Credits**. All four accepted captures were downloaded and checked;
the taskbar and rotation recaptures used most of the slot, so no early-return
refund was assumed or claimed. The next booking must read the live header again.

On 2026-09-23, a Galaxy Z Flip7 FE 30-minute reservation reduced the header
from **12 to 10 Credits**. InsetsProbe installation remained at 0% across
retries, including after reconnecting to the same reservation following a device
restart. No capture was made. Ending the reservation with the displayed
`Return this device to get back 1 credit(s)` option checked raised the header
to **11 Credits**, and Reservations showed no active device. A subsequent
Galaxy Z Flip6 30-minute reservation reduced the balance to **9 Credits**.
Both needed Flip6 main-screen captures were downloaded and validated. When the
WebClient showed 14 minutes remaining, its exit dialog offered no credit-return
option. The session was ended and displayed `All ongoing tests have ended.`; no
refund is claimed from this reservation.

A subsequent Galaxy Z Fold3 reservation reduced the header from **9 to 7
Credits**. Probe installation stayed at 0%, so the device was returned with
the one-credit option selected and the header rose to **8 Credits**. Galaxy Z
Flip7 then reduced it from **8 to 6 Credits**. After one supplemental RTL
capture was downloaded and checked, the device was returned with the one-credit
option selected; Reservations showed **7 Credits** and no active test.

The preceding 2026-09-22 Usage History contained these booked reservations:

| Time | Device | Booked credits |
| --- | --- | ---: |
| 10:34 | Galaxy S25 Ultra | 2 |
| 11:15 | Galaxy Z Fold8 | 2 |
| 13:20 | Galaxy Z Fold8 | 4 |
| 13:26 | Galaxy Z Flip8 | 4 |
| 20:02 | Galaxy Z Fold8 | 2 |
| 21:20 | Galaxy Z Flip8 | 2 |
| 22:04 | Galaxy Z Flip8 | 2 |
| 22:36 | Galaxy Z Flip8 | 2 |
| **Total** |  | **20** |

This explains the observed progression from four remaining credits to zero:
the final two 30-minute Flip8 reservations booked two credits each. It does not
prove a universal 20-credit grant because the next live grant was only 10.

## Operational budgeting rule

1. Build the APK and capture checklist before spending credits.
2. Read the current header balance. If needed, click **Get Free Credits** once
   and record the exact notification and resulting balance.
3. Treat the live balance as the reservation ceiling. Do not budget against the
   published 20-credit figure when the account received less.
4. Reserve one device for exactly 30 minutes / 2 credits. With a confirmed
   10-credit balance, the no-refund ceiling is five devices; with 20, it is ten.
5. Complete and validate the captures at a sound pace; 15 minutes is not a
   measurement deadline. Only if the work happens to finish while the
   early-return dialog offers one credit back, optionally check it, end the
   slot and verify the balance increase. Never sacrifice a needed capture or
   validation for a refund. Do not extend a session; preserve partial evidence
   and requeue unfinished captures.
6. After closing a session, refresh the header and Usage History. Record booked
   credits separately from any returned unused-time credits.
7. Stop when the current balance is below two credits or the UI reports the
   once-per-day grant has already been claimed.

Until Samsung resolves the documentation mismatch, reports should say both the
published allowance and the amount actually granted to the account on that date.
