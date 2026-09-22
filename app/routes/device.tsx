import { DeviceView } from "../components/DeviceView";
import { findDevice, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/device";

export function meta({ params }: Route.MetaArgs) {
  const device = findDevice(params.slug);
  if (!device) return [{ title: "Not found | windowinsets.info" }];
  return pageMeta({
    title: `${device.name} Window Insets & Display Metrics | windowinsets.info`,
    description: `Status bar, navigation bar and cutout insets, resolution, density and hinge states for ${device.name}, with sources for every value.`,
    url: `${SITE_URL}/${device.slug}`,
  });
}

export default function DevicePage({ params }: Route.ComponentProps) {
  const device = findDevice(params.slug);
  if (!device) throw new Response("Not Found", { status: 404 });
  return <DeviceView device={device} />;
}
