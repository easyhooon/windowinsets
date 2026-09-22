import { DeviceView } from "../components/DeviceView";
import { devices, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Android Window Insets & Display Metrics for Galaxy Devices | windowinsets.info",
    description:
      "Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices, with a source for every number.",
    url: SITE_URL,
  });
}

/** Landing page shows the newest device's own detail view directly —
 * safearea.info does the same with iPhone Duo — instead of a separate
 * list-only summary page. Pick any other device from the sidebar. */
export default function Home() {
  const featured = devices[0];
  return <DeviceView device={featured} />;
}
