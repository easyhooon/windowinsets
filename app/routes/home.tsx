import { Link } from "react-router";
import { devices, hasVerifiedInsets, SITE_URL } from "../data/devices";
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

export default function Home() {
  const featured = devices.find(hasVerifiedInsets) || devices[0];
  const otherDevices = devices.filter((d) => d.slug !== featured.slug);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Window insets for Galaxy devices</h1>
      <p className="mt-3 text-muted">
        Status bar, navigation bar and display cutout insets, corner radii, and foldable
        hinge states — every value is labeled <b>official</b>, <b>measured</b> or{" "}
        <b>community</b>, with its source and the One UI / Android version it applies to.
        Values that are not verified yet are shown as pending, never guessed.{" "}
        <Link to="/methodology" className="text-accent underline">
          See how I measure.
        </Link>
      </p>

      {/* Featured Device */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-muted mb-3">Featured</h2>
        <Link
          to={`/${featured.slug}`}
          className="block p-6 rounded-[10px] border-2 border-accent bg-accent/5 hover:bg-accent/10 shadow-card transition"
        >
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-semibold">{featured.name}</h3>
            <span className="text-sm text-muted">{featured.releaseYear}</span>
          </div>
          <p className="mt-2 text-sm text-muted">{featured.series}</p>
          {hasVerifiedInsets(featured) && (
            <p className="mt-2 inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-800">
              ✓ Measured
            </p>
          )}
        </Link>
      </div>

      <h2 className="mt-8 text-sm font-medium text-muted">All Devices</h2>
      <ul className="mt-2 divide-y divide-line rounded-[10px] border border-line bg-surface shadow-card">
        {otherDevices.map((d) => (
          <li key={d.slug}>
            <Link to={`/${d.slug}`} className="flex justify-between items-center px-4 py-3 hover:bg-canvas">
              <span>{d.name}</span>
              <span className="text-muted text-sm">{d.releaseYear}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
