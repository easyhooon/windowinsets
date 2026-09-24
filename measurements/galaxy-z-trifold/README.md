# Galaxy Z TriFold capture provenance

## Galaxy Z TriFold — 2026-09-24

Samsung RTL SM-F968N_KR1, Korea/Gumi, Android 16 / One UI 8.5, build
`BP4A.251205.006.F968NKSS6BZG3`. Main 3-button and gesture captures are
2160×1584 px, natural landscape (rotation 0), 320 dpi, Taskbar off. Cover
gesture is 1080×2520 px, portrait, 420 dpi. All registered captures use fontScale 1.
Cover 3-button remains pending: its device-side file could not be retrieved before
the reservation ended and the earlier screen transition had suspect stale density.

File Browser delivered only main-threeButton.json. The other two accepted
captures were recovered through WebClient Logs filtered to `InsetsProbe`, then
**save logs**. Original downloaded logs are retained in `rtl-logs/`. JSON message
fields were extracted in order, removing only the tab-separated log metadata;
complete objects were parsed independently (the cover log also contains the prior
main gesture capture). No values were filled from another capture.

After physically switching screens, Probe could retain the previous display's
density until restarted. Both gesture captures were taken after restarting Probe.
Cover reports densityDpi 420 while defaultDensityDpi remains 320. RTL's hinge
sensor reports 0° even unfolded; main exposes one vertical FLAT feature at x=1080.
This API report does not describe the two physical hinges. The initial main
fontScale 1.08 capture is retained separately and not published.
