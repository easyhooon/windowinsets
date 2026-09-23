# Device coverage

Decision, 2026-09-22: support officially skinned Samsung Galaxy models first
released in **2020 or later**. This replaces the earlier no-cutoff decision.
Discontinued and non-flagship models remain eligible. Priority is current
S/Fold/Flip quality → Tab → Note and A. TriFold awaits a separate decision.

Use the model's first commercial release year, not the skin upload date, ZIP
timestamp, announcement of a refresh, or inferred generation number. A separately
identified refreshed model can have its own release year.

## Boundary audit

These are official Samsung sources checked on 2026-09-22. Regional availability
dates below establish the year; they are not necessarily the first worldwide date.

| Imported model | Release evidence | Public coverage |
| --- | --- | --- |
| Galaxy Tab S4 10.5 | [US availability August 10, 2018](https://news.samsung.com/us/samsung-galaxy-tab-s4-helps-get-more-done) | Archive only |
| Galaxy Tab S6 | [Korean release August 29, 2019](https://www.samsung.com/sec/business/insights/news/news-20190830/) | Archive only |
| Galaxy Fold | [Korean release September 6, 2019](https://www.samsungmobilepress.com/articles/samsung-galaxy-fold-now-available) | Archive only |
| Galaxy Tab S6 Lite | [Available April 30, 2020 in the Netherlands](https://news.samsung.com/nl/nieuwe-samsung-galaxy-tab-s6-lite-de-tablet-voor-werk-en-vrije-tijd) | Included |
| Galaxy Z Flip | [Original model first launched February 2020](https://news.samsung.com/us/galaxy-z-flip-5g-enabled-foldable-smartphone-unpacked/) | Included |
| Galaxy Z Fold3 | [US availability August 26, 2021](https://news.samsung.com/us/galaxy-z-fold3-5g-galaxy-z-flip3-5g-unpacked-2021-next-mobile-innovation/) | Included |

The downloaded archive therefore reaches back at least to 2018. This is not a
claim about the oldest model in Samsung's entire skin library. This boundary
audit also does not establish exact release dates for every imported model.

## Implementation and future imports

`app/data/skinCatalog.json` and `public/skins/` retain all 74 imported models.
`app/data/coverage.ts` applies the 2020 cutoff to known release years and the
audited boundary models. `devices.ts` filters the merged device list, so device
navigation, lookup, prerendered routes and the sitemap share the same policy.
There are 71 public models: 28 S, 28 Tab, 8 Fold and 7 Flip.

The user-supplied `Galaxy_Z_Fold3.zip` was imported on 2026-09-23 with its
folded cover and unfolded main layouts. It is an artwork-only preview until
actual inset captures are collected.

The importer preserves artwork independently of coverage. Before publishing a
new batch, check its release years using official sources; record older/boundary
models in `coverage.ts` and add the evidence here. Unknown-year preview entries
are not automatically rejected, so importing assets alone does not certify their
eligibility. In particular, review older Note/A downloads before publishing.

Artwork-only models continue to show pending measurements. A supported release
year or an official skin does not establish WindowInsets values or 3D animation
support. Raw captures and downloaded originals remain unchanged.
