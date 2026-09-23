// Partial official listing; never infer non-support from this snapshot.
export const rtlCatalog = {
  "checkedAt": "2026-09-23",
  "sourceUrl": "https://developer.samsung.com/remote-test-lab",
  "scope": "featured-devices",
  "complete": false,
  "reservationCatalogUrl": "https://developer.samsung.com/remotetestlab/devices",
  "reservationCatalogResult": "Accessible after manual sign-in. Galaxy Z inventory was inspected; Galaxy Z Fold8, Fold7 and Fold6 were successfully reserved. The full cross-series and cross-region inventory is still incomplete.",
  "reservableSlugs": [
    "galaxy-z-fold8",
    "galaxy-z-fold7",
    "galaxy-z-fold6"
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
