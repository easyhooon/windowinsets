# Samsung RTL credits and reservation budget

**Last live verification:** 2026-09-23 01:20 KST

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
5. Do not extend a session. Preserve partial evidence and requeue unfinished
   captures.
6. After closing a session, refresh the header and Usage History. Record booked
   credits separately from any returned unused-time credits.
7. Stop when the current balance is below two credits or the UI reports the
   once-per-day grant has already been claimed.

Until Samsung resolves the documentation mismatch, reports should say both the
published allowance and the amount actually granted to the account on that date.
