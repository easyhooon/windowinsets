import { Link } from "react-router";
import { devices, SITE_URL } from "../data/devices";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  const title = "Android Window Insets & Display Metrics for Galaxy Devices | windowinsets.info";
  const description =
    "Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices, with a source for every number.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: SITE_URL },
    { tagName: "link", rel: "canonical", href: SITE_URL },
  ];
}

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Window insets for Galaxy devices</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Status bar, navigation bar and display cutout insets, corner radii, and foldable
        hinge states — every value is labeled <b>official</b>, <b>measured</b> or{" "}
        <b>community</b>, with its source and the One UI / Android version it applies to.
        Values that are not verified yet are shown as pending, never guessed.
      </p>
      <h2 className="mt-8 text-sm font-medium text-neutral-500">Devices</h2>
      <ul className="mt-2 divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {devices.map((d) => (
          <li key={d.slug}>
            <Link to={`/${d.slug}`} className="flex justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900">
              <span>{d.name}</span>
              <span className="text-neutral-500">{d.releaseYear}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
