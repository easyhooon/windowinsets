import { allPaths, SITE_URL } from "../data/devices";

export function loader() {
  const urls = allPaths()
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
