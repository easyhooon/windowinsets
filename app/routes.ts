import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("methodology", "routes/methodology.tsx"),
    route(":slug", "routes/device.tsx"),
  ]),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;
