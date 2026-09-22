import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { devices } from "../data/devices";

export default function Shell() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = devices.filter((d) => d.name.toLowerCase().includes(q));

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <NavLink to="/" className="text-base font-semibold">
          windowinsets.info
        </NavLink>
        <span className="hidden text-sm text-neutral-500 sm:inline">
          Window insets &amp; display metrics for Galaxy devices
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex max-h-48 shrink-0 flex-col border-b border-neutral-200 md:max-h-none md:w-64 md:border-r md:border-b-0 dark:border-neutral-800">
          <div className="p-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search devices…"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <p className="px-2 pb-1 text-xs font-medium text-neutral-500">
              Samsung Galaxy · {filtered.length}
            </p>
            {filtered.map((d) => (
              <NavLink
                key={d.slug}
                to={`/${d.slug}`}
                className={({ isActive }) =>
                  `block rounded-md px-2 py-1.5 text-sm ${
                    isActive
                      ? "bg-blue-100 font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  }`
                }
              >
                {d.name}
                <span className="block text-xs text-neutral-500">{d.releaseYear}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
