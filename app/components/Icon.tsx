export function Icon({ name }: { name: "chevron" | "settings" | "search" | "check" }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "chevron" && <path d="m8 10 4 4 4-4" />}
    {name === "search" && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    {name === "check" && <path d="m5 12 4 4 10-10" />}
    {name === "settings" && <><path d="m9 3-.6 3-2 .9-2.7-.9-2 3.5 2.2 2v2.3l-2.2 2 2 3.5 2.7-.9 2 .9.6 3h4l.6-3 2-.9 2.7.9 2-3.5-2.2-2v-2.3l2.2-2-2-3.5-2.7.9-2-.9-.6-3z" /><circle cx="11" cy="12.7" r="3" /></>}
  </svg>;
}
