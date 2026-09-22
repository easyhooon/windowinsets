import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { devices, featuredDevice, REPO_URL } from "../data/devices";
import { ResizeHandle } from "../components/ResizeHandle";
import { Icon } from "../components/Icon";
import { getRtlAvailability } from "../data/rtlAvailability";

export default function Shell() {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const current = devices.find(d => location.pathname === `/${d.slug}`) ?? featuredDevice;
  const filtered = devices.filter(d => d.name.toLowerCase().includes(query.trim().toLowerCase()));
  const groupOf = (d: typeof devices[number]) => d.formFactor === "tablet" ? "Galaxy Tab" : /^Galaxy S\d*$/.test(d.series) ? "Galaxy S" : d.series;
  const series = [...new Set(filtered.map(groupOf))];
  return <div style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties} className="app-shell" data-build-commit={__BUILD_COMMIT__}>
    <a href="#device-canvas" className="skip-link">Skip to device canvas</a>
    <header className="app-header">
      <NavLink to="/" className="brand"><img src="/favicon-v2.svg" width="28" height="28" alt="" />windowinsets.info</NavLink>
      <button className="mobile-model" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><span className={`device-thumbnail ${current.formFactor}`} /><span>{current.name}<small>{current.releaseYear ?? "Skin preview"}</small></span><Icon name="chevron" /></button>
    </header>
    <div className="app-content">
      <aside className={`device-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Devices">
        <div className="sidebar-heading"><strong>Devices</strong><span>{devices.length}</span></div>
        <label className="device-search"><Icon name="search" /><input type="search" aria-label="Search devices" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search devices…" /></label>
        <nav className="device-list">
          {series.map(group => <section key={group} aria-label={group}><h2>{group}</h2>
            {filtered.filter(d => groupOf(d) === group).map(d => <NavLink key={d.slug} to={`/${d.slug}`} onClick={() => setMobileOpen(false)} className={`device-link ${current.slug === d.slug ? "selected" : ""}`}>
              <span className={`device-thumbnail ${d.formFactor}`} /><span>{d.name}<small>{d.releaseYear ? `${d.releaseYear} · ` : ""}{getRtlAvailability(d.slug).label}</small></span>
            </NavLink>)}
          </section>)}
          {!filtered.length && <p className="p-3 text-sm text-muted">No devices found.</p>}
        </nav>
        <nav className="sidebar-footer">
          <NavLink to="/developer-guide" onClick={() => setMobileOpen(false)}>Developer guide</NavLink>
          <NavLink to="/methodology" onClick={() => setMobileOpen(false)}>How we measure</NavLink>
          <span className="sidebar-footer-community">
            <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer" aria-label="GitHub에서 문의하기 (새 창)">문의하기 ↗</a>
          </span>
          <a href="https://safearea.info" target="_blank" rel="noreferrer">Inspired by safearea.info ↗</a>
        </nav>
      </aside>
      <ResizeHandle label="Devices width" value={sidebarWidth} onChange={setSidebarWidth} min={190} max={360} />
      <main className="workspace"><Outlet /></main>
    </div>
  </div>;
}
