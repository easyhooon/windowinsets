import type { Device } from "./types";
import { galaxyS25 } from "./devices/galaxy-s25";
import { galaxyS25Plus } from "./devices/galaxy-s25-plus";
import { galaxyS25Ultra } from "./devices/galaxy-s25-ultra";
import { galaxyZFold6 } from "./devices/galaxy-z-fold6";
import { galaxyZFlip6 } from "./devices/galaxy-z-flip6";
import { galaxyZFold7 } from "./devices/galaxy-z-fold7";
import { galaxyZFold8 } from "./devices/galaxy-z-fold8";
import { galaxyZFlip8 } from "./devices/galaxy-z-flip8";

/** Newest first. Add a device by creating a file in ./devices and listing it here. */
export const devices: Device[] = [
  galaxyZFold8,
  galaxyZFlip8,
  galaxyS25Plus,
  galaxyS25Ultra,
  galaxyS25,
  galaxyZFold7,
  galaxyZFold6,
  galaxyZFlip6,
];

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
