import type { Device } from "../data/types";

type Parameters = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let ready = false;
let lastPath: string | undefined;
let previousLocation: string | undefined;

/** Only the public production site collects data; previews and local builds do not. */
export function initializeAnalytics(measurementId: string | undefined, production: boolean) {
  if (ready || typeof window === "undefined" || !production
    || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)
    || !["windowinsets.info", "www.windowinsets.info"].includes(window.location.hostname)) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  ready = true;
}

function deviceParameters(device: Device): Parameters {
  return {
    device_slug: device.slug,
    device_name: device.name,
    device_series: device.series,
    form_factor: device.formFactor,
  };
}

/** This means an explicit link activation, including keyboard and new-tab clicks. */
export function trackDeviceSelection(device: Device) {
  if (!ready) return;
  window.gtag?.("event", "device_select", {
    ...deviceParameters(device),
    selection_source: "device_list",
  });
}

/** Path-only tracking avoids search text / URL fragments and rerender duplicates. */
export function trackPageView(pathname: string, device?: Device) {
  if (!ready || pathname === lastPath) return;
  const pageLocation = `${window.location.origin}${pathname}`;
  const page = {
    page_location: pageLocation,
    page_title: document.title,
    page_referrer: previousLocation ?? document.referrer,
  };
  window.gtag?.("set", page);
  window.gtag?.("event", "page_view", page);
  if (device) {
    window.gtag?.("event", "device_view", {
      ...page,
      ...deviceParameters(device),
      view_source: pathname === "/" ? "home_default" : "device_page",
    });
  }
  lastPath = pathname;
  previousLocation = pageLocation;
}
