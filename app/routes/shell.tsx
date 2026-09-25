import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router";
import { devices, featuredDevice, REPO_URL } from "../data/devices";
import { ResizeHandle } from "../components/ResizeHandle";
import { Icon } from "../components/Icon";
import { getRtlAvailability } from "../data/rtlAvailability";
import { trackDeviceSelection } from "../lib/analytics";

type Device = typeof devices[number];
type Family = "All" | "Z" | "S" | "Tab" | "Note" | "A";
const families: Family[] = ["All", "Z", "S", "Tab", "Note", "A"];
const groupOf = (device: Device) => device.formFactor === "tablet" ? "Galaxy Tab"
  : /^Galaxy S\d*$/.test(device.series) ? "Galaxy S" : device.series;
const familyOf = (device: Device): Family => device.formFactor === "tablet" ? "Tab"
  : device.series.startsWith("Galaxy Z") ? "Z" : device.series.startsWith("Galaxy Note") ? "Note"
  : device.series === "Galaxy A" ? "A" : "S";

export default function Shell() {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { slug } = useParams();
  const current = devices.find(d => d.slug === slug) ?? featuredDevice;
  const [family, setFamily] = useState<Family>(() => familyOf(current));
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set([groupOf(current)]));
  useEffect(() => {
    setFamily(familyOf(current));
    setExpandedGroups(new Set([groupOf(current)]));
  }, [location.pathname]);
  const search = query.trim().toLowerCase();
  const filtered = devices.filter(d => search ? d.name.toLowerCase().includes(search) : family === "All" || familyOf(d) === family);
  const series = [...new Set(filtered.map(groupOf))];
  const selectFamily = (next: Family) => {
    setFamily(next);
    setQuery("");
    const first = next === "All" || familyOf(current) === next ? current : devices.find(d => familyOf(d) === next);
    setExpandedGroups(new Set(first ? [groupOf(first)] : []));
  };
  const toggleGroup = (group: string) => setExpandedGroups(previous => {
    const next = new Set(previous);
    if (next.has(group)) next.delete(group); else next.add(group);
    return next;
  });
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
        <div className="device-family-tabs" role="group" aria-label="Device series">
          {families.map(option => <button key={option} type="button" aria-pressed={family === option} onClick={() => selectFamily(option)}>{option}</button>)}
        </div>
        <nav className="device-list">
          {series.map(group => {
            const members = filtered.filter(d => groupOf(d) === group);
            const expanded = Boolean(search) || expandedGroups.has(group);
            const id = `device-group-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return <section key={group} aria-label={group}>
            <h2><button type="button" className="device-group-toggle" aria-expanded={expanded} aria-controls={id} disabled={Boolean(search)} onClick={() => toggleGroup(group)}><span>{group}</span><span className="device-group-count">{members.length}</span><Icon name="chevron" /></button></h2>
            <div id={id} hidden={!expanded}>{members.map(d => <NavLink key={d.slug} to={`/${d.slug}`} onClick={() => { trackDeviceSelection(d); setQuery(""); setMobileOpen(false); }} onAuxClick={e => { if (e.button === 1) trackDeviceSelection(d); }} className={`device-link ${current.slug === d.slug ? "selected" : ""}`}>
              <span className={`device-thumbnail ${d.formFactor}`} /><span>{d.name}<small>{d.releaseYear ? `${d.releaseYear} · ` : ""}{getRtlAvailability(d.slug).label}</small></span>
            </NavLink>)}</div>
          </section>})}
          {!filtered.length && <p className="p-3 text-sm text-muted">No devices found.</p>}
        </nav>
        <nav className="sidebar-footer">
          <NavLink to="/developer-guide" onClick={() => setMobileOpen(false)}>Developer guide</NavLink>
          <NavLink to="/methodology" onClick={() => setMobileOpen(false)}>How we measure</NavLink>
          <span className="sidebar-footer-community">
            <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer" aria-label="Contact us on GitHub (opens in a new tab)">Contact us ↗</a>
          </span>
          <a href="https://safearea.info" target="_blank" rel="noreferrer">Inspired by safearea.info ↗</a>
        </nav>
      </aside>
      <ResizeHandle label="Devices width" value={sidebarWidth} onChange={setSidebarWidth} min={190} max={360} />
      <main className="workspace"><Outlet /></main>
    </div>
  </div>;
}
