// Partial official listing; never infer non-support from this snapshot.
export const rtlCatalog = {
  "checkedAt": "2026-09-24",
  "sourceUrl": "https://developer.samsung.com/remote-test-lab",
  "scope": "featured-devices",
  "complete": false,
  "reservationCatalogUrl": "https://developer.samsung.com/remotetestlab/devices",
  "reservationCatalogResult": "Accessible after manual sign-in. Galaxy Z inventory was inspected; Galaxy Z Fold8, Fold7, Fold6, Fold5, Fold4, Fold3, Flip8, Flip7, Flip7 FE, Flip6, Flip5, Flip4, Flip3 and the original Galaxy Z Flip (SM-F700F-IN5, India/Noida) were successfully reserved. Galaxy S25 (SM-S931N_KR1), Galaxy S25 Edge (SM-S937N_KR10), Galaxy S25 FE (SM-S731N_KR1), Galaxy S24 Ultra (SM-S928N-KR3), Galaxy S24+ (SM-S926N-KR3), and Galaxy S24 (SM-S921N-KR3; all Korea/Gumi) were also reserved. The full cross-series and cross-region inventory is still incomplete.",
  "reservableSlugs": [
    "galaxy-z-trifold",
    "galaxy-s24",
    "galaxy-s24-plus",
    "galaxy-s24-ultra",
    "galaxy-s25-fe",
    "galaxy-s25-edge",
    "galaxy-s25",
    "galaxy-z-fold8",
    "galaxy-z-fold7",
    "galaxy-z-fold6",
    "galaxy-z-fold5",
    "galaxy-z-fold4",
    "galaxy-z-fold3",
    "galaxy-z-flip7",
    "galaxy-z-flip7-fe",
    "galaxy-z-flip6",
    "galaxy-z-flip5",
    "galaxy-z-flip4",
    "galaxy-z-flip3",
    "galaxy-z-flip"
  ],
  "listedSlugs": [
    "galaxy-z-fold8",
    "galaxy-z-flip8",
    "galaxy-s26-ultra",
    "galaxy-tab-s11"
  ]
};


export interface RtlCatalog {
  checkedAt: string;
  sourceUrl: string;
  scope: string;
  complete: boolean;
  listedSlugs: string[];
  reservableSlugs?: string[];
}

/** Absence from a featured list or a blocked page is not evidence of non-support. */
export function getRtlAvailability(slug: string, snapshot: RtlCatalog = rtlCatalog) {
  const reservable = snapshot.reservableSlugs?.includes(slug) ?? false;
  const status = snapshot.listedSlugs.includes(slug) || reservable ? "listed"
    : snapshot.complete ? "not-listed" : "unknown";
  return {
    status,
    checkedAt: snapshot.checkedAt,
    sourceUrl: snapshot.sourceUrl,
    label: reservable ? "Reservable on RTL"
      : status === "listed"
      ? snapshot.scope === "featured-devices" ? "Featured on RTL" : "Listed on RTL"
      : status === "not-listed" ? "Not listed on RTL" : "RTL status unverified",
    description: reservable
      ? "A live Samsung RTL reservation was opened successfully. Measurement coverage is shown separately for each screen and navigation mode."
      : status === "listed"
      ? "Samsung lists this model on Remote Test Lab. Live reservation slots have not been checked."
      : status === "not-listed"
        ? "This model was not in the checked RTL device catalog. Its official skin remains available here."
        : "The full RTL device catalog could not be checked. This does not mean the model is unsupported.",
    previewNotice: status === "listed"
      ? "Skin preview · RTL measurement pending for this screen and navigation mode"
      : status === "not-listed"
        ? "Skin preview · Not listed on Samsung RTL · No measurement available"
        : "Skin preview · RTL availability unverified · No measurement available",
  };
}
