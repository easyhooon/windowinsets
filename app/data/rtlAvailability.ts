// Partial official listing; never infer non-support from this snapshot.
export const rtlCatalog = {
  "checkedAt": "2026-09-22",
  "sourceUrl": "https://developer.samsung.com/remote-test-lab",
  "scope": "featured-devices",
  "complete": false,
  "reservationCatalogUrl": "https://developer.samsung.com/remotetestlab/devices",
  "reservationCatalogResult": "403 Forbidden in the logged-in browser; full model inventory unavailable.",
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
}

/** Absence from a featured list or a blocked page is not evidence of non-support. */
export function getRtlAvailability(slug: string, snapshot: RtlCatalog = rtlCatalog) {
  const status = snapshot.listedSlugs.includes(slug) ? "listed"
    : snapshot.complete ? "not-listed" : "unknown";
  return {
    status,
    checkedAt: snapshot.checkedAt,
    sourceUrl: snapshot.sourceUrl,
    label: status === "listed"
      ? snapshot.scope === "featured-devices" ? "Featured on RTL" : "Listed on RTL"
      : status === "not-listed" ? "Not listed on RTL" : "RTL status unverified",
    description: status === "listed"
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
