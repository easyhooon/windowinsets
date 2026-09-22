import type { Config } from "@react-router/dev/config";
import { devices } from "./app/data/devices";

export default {
  // Static site: every page is rendered to HTML at build time (SEO + link previews),
  // then hydrates as a normal React SPA. No server needed.
  ssr: false,
  prerender: ["/", "/sitemap.xml", ...devices.map((d) => `/${d.slug}`)],
} satisfies Config;
