import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { devices, REPO_URL } from "../data/devices";

export default function Shell() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = devices.filter((d) => d.name.toLowerCase().includes(q));

  return (
    // data-build-commit is not shown in the UI — inspect it (view-source or devtools)
    // to confirm you're looking at the latest deploy rather than a cached page.
    <div className="flex h-dvh flex-col bg-canvas text-fg" data-build-commit={__BUILD_COMMIT__}>
      <header className="flex items-center gap-3 border-b border-line bg-canvas px-4 py-3">
        <NavLink to="/" className="text-base font-semibold">
          windowinsets.info
        </NavLink>
        <span className="hidden text-sm text-muted sm:inline">
          Window insets &amp; display metrics for Galaxy devices
        </span>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <NavLink to="/developer-guide" className="text-muted hover:text-fg">
            Developer guide
          </NavLink>
          <NavLink to="/methodology" className="text-muted hover:text-fg">
            How I measure
          </NavLink>
          <a href={REPO_URL} className="text-muted hover:text-fg" rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </header>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex max-h-48 shrink-0 flex-col border-b border-line bg-surface md:max-h-none md:w-64 md:border-r md:border-b-0">
          <div className="p-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search devices…"
              className="w-full rounded-md border border-line bg-surface px-3 py-1.5 text-sm"
            />
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <p className="px-2 pb-1 text-xs font-medium text-muted">
              Samsung Galaxy · {filtered.length}
            </p>
            {filtered.map((d) => (
              <NavLink
                key={d.slug}
                to={`/${d.slug}`}
                className={({ isActive }) =>
                  `block rounded-md px-2 py-1.5 text-sm ${
                    isActive
                      ? "bg-accent-subtle font-medium text-accent"
                      : "hover:bg-canvas"
                  }`
                }
              >
                {d.name}
                <span className="block text-xs text-muted">{d.releaseYear}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="grid-canvas min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
