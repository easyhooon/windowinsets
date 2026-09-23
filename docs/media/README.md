# README hinge demonstrations

These GIFs were captured from the live `windowinsets.info` renderer at commit
`91a3ea2` on 2026-09-23, using Chrome at 1440 × 900 with device scale factor 1.

Each capture sweeps the public hinge slider in 3° increments from 0° to 180°,
then reverses the frames back to 0°. Reduced motion makes each captured angle
deterministic; the GIF plays at 15 fps, with endpoint holds, for a 9.54-second loop.
Only the visualization panel is captured, with the hinge dropdown closed.

The 640-pixel-wide GIFs use an FFmpeg-generated palette and Bayer dithering.
They demonstrate the actual app renderer and recorded cover/inner measurements;
they are not physical-device footage or new measurements at each hinge angle.
