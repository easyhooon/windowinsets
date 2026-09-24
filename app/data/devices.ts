import type { Device } from "./types";
import { galaxyS25 } from "./devices/galaxy-s25";
import { galaxyS25Plus } from "./devices/galaxy-s25-plus";
import { galaxyS25Ultra } from "./devices/galaxy-s25-ultra";
import { galaxyS26Ultra } from "./devices/galaxy-s26-ultra";
import { galaxyS26Plus } from "./devices/galaxy-s26-plus";
import { galaxyS26 } from "./devices/galaxy-s26";
import { galaxyZFold6 } from "./devices/galaxy-z-fold6";
import { galaxyZFold5 } from "./devices/galaxy-z-fold5";
import { galaxyZFold4 } from "./devices/galaxy-z-fold4";
import { galaxyZFold2 } from "./devices/galaxy-z-fold2";
import { galaxyZFlip6 } from "./devices/galaxy-z-flip6";
import { galaxyZFlip } from "./devices/galaxy-z-flip";
import { galaxyZFlip5 } from "./devices/galaxy-z-flip5";
import { galaxyZFlip3 } from "./devices/galaxy-z-flip3";
import { galaxyZFlip7 } from "./devices/galaxy-z-flip7";
import { galaxyZFold8Ultra } from "./devices/galaxy-z-fold8-ultra";
import { galaxyZFold7 } from "./devices/galaxy-z-fold7";
import { galaxyZFold8 } from "./devices/galaxy-z-fold8";
import { galaxyZFlip8 } from "./devices/galaxy-z-flip8";
import { skinPreviews } from "./skinPreviews";
import { isInCoverage } from "./coverage";

// Explicit entries own all verified data. Skins can add missing screens, never
// replace a screen's captures. Add a measured entry here as RTL data arrives.
const verifiedEntries = [galaxyZFold8Ultra, galaxyZFold8, galaxyZFlip8, galaxyS26Ultra, galaxyS26Plus, galaxyS26,
  galaxyS25Ultra, galaxyS25Plus, galaxyS25, galaxyZFlip7, galaxyZFold7, galaxyZFold6, galaxyZFold5, galaxyZFold4, galaxyZFlip6, galaxyZFlip5, galaxyZFlip3, galaxyZFlip, galaxyZFold2];
const mergedDevices = verifiedEntries.map(device => {
  const preview = skinPreviews.find(entry => entry.slug === device.slug);
  const missingScreens = preview?.screens.filter(screen => !device.screens.some(s => s.id === screen.id)) ?? [];
  return { ...device, screens: [...device.screens, ...missingScreens].sort((a, b) => Number(a.id === "main") - Number(b.id === "main")) };
}).concat(skinPreviews.filter(preview => !verifiedEntries.some(device => device.slug === preview.slug)));

const groupOrder = (device: Device) => device.formFactor === "foldable-book" ? 0
  : device.formFactor === "foldable-flip" ? 1 : device.formFactor === "tablet" ? 3
  : device.series.startsWith("Galaxy Note") ? 4 : device.series === "Galaxy A" ? 5 : 2;
const generation = (device: Device) => Number(device.slug.match(/(?:fold|flip|s|a|active|note)(\d+)/)?.[1] ?? 1);
const tier = (device: Device) => device.slug.endsWith("ultra") ? 0 : device.slug.endsWith("plus") ? 1
  : device.slug.endsWith("edge") ? 2 : device.slug.includes("-fe") ? 4 : 3;

export const devices: Device[] = mergedDevices.filter(isInCoverage).sort((a, b) => groupOrder(a) - groupOrder(b)
  || generation(b) - generation(a) || tier(a) - tier(b) || a.name.localeCompare(b.name));

export const featuredDevice = devices.find(device => device.slug === "galaxy-z-fold8")!;

export const SITE_URL = "https://windowinsets.info";
export const REPO_URL = "https://github.com/easyhooon/windowinsets";

/** Non-device pages that are prerendered and listed in the sitemap. */
export const STATIC_PATHS = ["/", "/methodology"];

export const allPaths = () => [...STATIC_PATHS, ...devices.map((d) => `/${d.slug}`)];

export function findDevice(slug: string | undefined): Device | undefined {
  return devices.find((d) => d.slug === slug);
}

export function hasVerifiedInsets(device: Device): boolean {
  return device.screens.some((s) =>
    Object.values(s.insets).some((m) => m !== null),
  );
}

/** A screen counts as "specced" once resolution/ppi were filled in from a source. */
export function isSpecced(screen: Device["screens"][number]): boolean {
  return screen.ppi > 0 && screen.resolutionPx.width > 0;
}
