import type { ReactNode } from "react";
import { devices, hasVerifiedInsets, REPO_URL, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/methodology";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "How I measure Android window insets | windowinsets.info",
    description:
      "Where every number on windowinsets.info comes from: official specs, open-source InsetsProbe measurements, the conditions they are valid for, and known limitations.",
    url: `${SITE_URL}/methodology`,
  });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-muted [&_b]:text-fg [&_code]:rounded [&_code]:bg-canvas [&_code]:px-1 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline">
        {children}
      </div>
    </section>
  );
}

export default function Methodology() {
  const measured = devices.filter(hasVerifiedInsets).length;

  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">How I measure</h1>
      <p className="mt-2 text-muted">
        This site is only useful if you can trust its numbers, so here is exactly where each
        one comes from and where it stops being reliable.
      </p>

      <p className="mt-4 rounded-[10px] border border-line bg-surface p-3 text-sm shadow-card">
        <b>Current status:</b> {measured} of {devices.length} devices have measured inset
        values. Everything else is shown as <i>pending</i>.
      </p>

      <Section title="1. Every value has a source tier">
        <ul>
          <li>
            <b>official</b> – published by Samsung or Google (for example resolution and
            pixel density on the Samsung Developer site).
          </li>
          <li>
            <b>measured</b> – captured by InsetsProbe on a real device or on Samsung Remote
            Test Lab. The raw JSON is committed to the repository and linked from the value.
          </li>
          <li>
            <b>community</b> – contributed by someone else and not yet reproduced. Shown with a
            clear label until a second capture confirms it.
          </li>
        </ul>
        <p>
          Each source also shows the date it was last checked, and each measurement records the
          One UI and Android version it was taken on.
        </p>
      </Section>

      <Section title="2. Why insets must be measured">
        <p>
          Samsung publishes screen size, resolution and density, but not status bar height,
          navigation bar height, cutout geometry or corner radii. Those depend on the device
          and on the software running on it, so I read them from Android itself instead of
          estimating.
        </p>
      </Section>

      <Section title="3. What InsetsProbe reads">
        <p>
          <a href={`${REPO_URL}/tree/main/tools/insets-probe`}>InsetsProbe</a> is a small,
          open-source Android app in this repository. It records:
        </p>
        <ul>
          <li>
            <code>WindowInsets</code>: status bars, navigation bars, system bars, display
            cutout, caption bar, system gestures, mandatory system gestures, tappable element
            (px and dp, with and without visibility).
          </li>
          <li>
            <code>DisplayCutout</code>: safe insets, bounding rectangles, waterfall insets.
          </li>
          <li>
            <code>RoundedCorner</code> for all four corners.
          </li>
          <li>
            Foldables: <code>FoldingFeature</code> (state, orientation, occlusion, bounds) and
            the hinge angle sensor.
          </li>
          <li>
            Device, Android and One UI version, <code>densityDpi</code> next to the device's
            default density, font scale and navigation mode.
          </li>
        </ul>
        <p>
          It prints the raw values as JSON. I do not edit these files by hand. You can build
          the app yourself and reproduce any number.
        </p>
      </Section>

      <Section title="4. Conditions a measurement is valid for">
        <ul>
          <li>Portrait orientation, app in full screen (no split-screen or pop-up window).</li>
          <li>
            Default <b>Display size</b>, <b>Font size</b> and, on Samsung, default{" "}
            <b>Screen resolution</b>. Changing them changes pixels and density, so dp values
            change too. The capture records <code>densityDpi</code> and{" "}
            <code>defaultDensityDpi</code>, which makes a non-default setting visible.
          </li>
          <li>
            One navigation mode per capture (<b>gesture</b> or <b>3-button</b>), because bar
            heights and gesture insets differ between them.
          </li>
          <li>
            Foldables: cover and main screens are captured separately, and the hinge angle is
            recorded.
          </li>
        </ul>
        <p>
          dp is computed as <code>px ÷ (densityDpi ÷ 160)</code> and rounded to two decimals.
        </p>
      </Section>

      <Section title="5. What I never do">
        <ul>
          <li>Estimate or interpolate a value from another device or from resolution alone.</li>
          <li>Fill a value from a source that cannot be linked.</li>
          <li>Overwrite a measurement without keeping the earlier capture in the history.</li>
        </ul>
        <p>Anything I cannot verify stays visible as <i>pending</i>.</p>
      </Section>

      <Section title="6. Known limitations">
        <ul>
          <li>
            Values can change with a One UI update. That is why every measurement names its
            One UI and Android version.
          </li>
          <li>Each capture comes from a specific unit and firmware, recorded by model number.</li>
          <li>Landscape and multi-window modes are not covered yet.</li>
          <li>
            Apps can add their own padding or use different window flags, so a real app may
            see different insets than the raw platform values shown here.
          </li>
        </ul>
      </Section>

      <Section title="7. Found a mistake, or want to add a device?">
        <p>
          Open an <a href={`${REPO_URL}/issues`}>issue</a> or a pull request with your
          InsetsProbe JSON. A capture that reproduces (or contradicts) an existing one is just
          as valuable as a new device.
        </p>
      </Section>
    </article>
  );
}
