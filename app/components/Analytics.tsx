import { useEffect } from "react";
import { useLocation } from "react-router";
import { devices, featuredDevice } from "../data/devices";
import { initializeAnalytics, trackPageView } from "../lib/analytics";

export function Analytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    initializeAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID, import.meta.env.PROD);
    const device = pathname === "/" ? featuredDevice : devices.find(d => pathname === `/${d.slug}`);
    trackPageView(pathname, device);
  }, [pathname]);
  return null;
}
