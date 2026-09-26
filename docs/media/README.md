# README hinge demonstrations

These GIFs were refreshed on 2026-09-26 from the local production build containing
rigid fold housings, the head-on perspective camera, capture-relative hinges and
the shared measurement rulers.
Chrome runs at 1440 × 900 with device scale factor 1.

Each capture sweeps the public hinge slider in 3° increments from 0° to 180°,
then reverses the frames back to 0°. Reduced motion makes each captured angle
deterministic; 143 frames play at 15 fps with endpoint holds (about 9.54 seconds).
Only the visualization panel is captured, with the hinge dropdown closed.

The 640-pixel-wide per-device GIFs use an FFmpeg-generated palette and Bayer
dithering. `galaxy-z-all-hinge.gif` places the same Flip8, Fold8 and TriFold frames
side by side at 1080 pixels with a 128-color palette, for places that accept one GIF.
They demonstrate the actual app renderer and recorded cover/inner measurements;
they are not physical-device footage or new measurements at each hinge angle.
Published chassis dimensions constrain the models where available; hinge contours
and models without published depth remain illustrative.

To reproduce (Chrome, FFmpeg and project dependencies required):

```sh
pnpm build
PORT=4175 node scripts/serve-test-build.mjs
# In a second terminal:
node scripts/capture-readme-gifs.mjs
```

`CAPTURE_BASE_URL` overrides the server URL; `FFMPEG_BIN` selects an alternate
FFmpeg executable. Capture uses temporary PNG frames and removes them afterward.
