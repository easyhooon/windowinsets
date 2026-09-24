/** Product decision, 2026-09-22. Release evidence: docs/DEVICE_COVERAGE.md. */
export const MIN_RELEASE_YEAR = 2020;

// Audited boundary models. Do not infer a release year from a skin ZIP date.
export const checkedReleaseYears: Record<string, number> = {
  "galaxy-tab-s4-10-5": 2018,
  "galaxy-tab-s6": 2019,
  "galaxy-fold": 2019,
  "galaxy-s10-lite": 2020,
  "galaxy-tab-s8-ultra": 2022,
  "galaxy-tab-s6-lite": 2020,
  "galaxy-z-flip": 2020,
  "galaxy-z-fold3": 2021,
  "galaxy-note-fe": 2017,
  "galaxy-note8": 2017,
  "galaxy-note9": 2018,
  "galaxy-note10": 2019,
  "galaxy-note10-plus": 2019,
  "galaxy-note10-lite": 2020,
  "galaxy-note20": 2020,
  "galaxy-note20-ultra": 2020,
  "galaxy-a01-core": 2020,
  "galaxy-a11": 2020,
  "galaxy-a21s": 2020,
  "galaxy-a31": 2020,
  "galaxy-a42-5g": 2020,
  "galaxy-a71": 2020,
};

export function isInCoverage(device: { slug: string; releaseYear: number | null }): boolean {
  const year = checkedReleaseYears[device.slug] ?? device.releaseYear;
  // Other existing previews have no exact year metadata; new imports require
  // a release-year review before publishing (see the coverage guide).
  return year === null || year >= MIN_RELEASE_YEAR;
}
