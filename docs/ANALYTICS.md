# Usage analytics (GA4)

GA4 measures visits, acquisition and explicit model interest without Firebase,
Tag Manager, a backend, session replay or an error-monitoring SDK.
The Google tag loads asynchronously only in a production build on
`windowinsets.info` or `www.windowinsets.info`, with a valid measurement ID.
Without that ID the site works normally and analytics remains disabled.

## Enable collection

1. In [Google Analytics](https://analytics.google.com/), create a GA4 property
   and a **Web** data stream for `https://windowinsets.info`. Copy its `G-…`
   measurement ID (not the numeric property or stream ID).
2. In that stream, **turn Enhanced measurement off**. The app owns page views
   and device events. In particular, automatic browser-history page views must
   be disabled; `send_page_view: false` alone does not disable them.
   Do not install a second Google tag through the hosting provider or GTM.
3. Set `VITE_GA_MEASUREMENT_ID` to the web stream's `G-…` ID in Vercel
   project Settings → Environment Variables, targeting **Production**, then
   rebuild/redeploy. For local production builds use `.env.production.local`,
   which Git ignores. Only the empty `.env.example` template belongs in Git.
   Vite embeds this public ID at build time; changes require a rebuild.
4. In Admin → Custom definitions, create **event-scoped** custom dimensions
   for `device_slug`, `device_name`, `device_series`, `form_factor`,
   `view_source`, and `selection_source`. Register these before collecting
   production data; reports can take 24–48 hours to populate.
5. Open the production site and select a model. Check Realtime for `page_view`,
   `device_view`, and `device_select`. In browser Network, filter `collect`
   and inspect `en` and `ep.*`. Ad blockers can prevent collection.

## Event contract

| Event | Trigger | Parameters / interpretation |
| --- | --- | --- |
| `page_view` | Initial page and each changed pathname, including back/forward | Page location, title, previous page; ignores query/hash-only changes |
| `device_view` | A page view displaying a registered device | `device_slug`, `device_name`, `device_series`, `form_factor`, `view_source` |
| `device_select` | Device-list link click, Enter, modifier-click or middle-click | Device parameters plus `selection_source=device_list`; repeated clicks count |

`form_factor` is the **viewed model's** category: `bar`, `foldable-book`,
`foldable-flip`, or `tablet`. It is not the visitor's hardware.
`view_source=home_default` marks the model automatically shown on the homepage;
`device_page` covers direct model links and internal navigation.
Direct visits and back/forward navigation do not fabricate selection events.
Right-click → Open in new tab is counted as a view in the destination, not a
selection in the source. All registered models, including previews, are covered.

## Read the results

- **Traffic:** Reports → Acquisition → Traffic acquisition for sessions and
  sources; use Users for visitors and Views for page loads/navigation.
- **Model interest:** Explore → Free form, rows `device_name`, values Event
  count and Total users, filter Event name exactly `device_select`.
- **Form-factor interest:** Same exploration with rows `form_factor`.
- **Reach including direct links:** Filter `device_view`, split by
  `view_source`. Keep homepage exposure separate from deliberate selection.
- **Interpretation:** One visitor can click repeatedly, so compare Total users
  with Event count. GA4 users are browser/device-based estimates, not a count
  of identified people. Click share is not a conversion rate or exposure-adjusted
  preference: list ordering and model availability affect it.

## Collection scope

No account IDs, custom user identifiers, search input, session recordings or
crash reports are sent by this integration. Custom page locations exclude query
strings and fragments; the initial referrer comes from the browser. GA4 still
uses its standard analytics cookies and browser/network metadata. Google Signals
and advertising personalization signals are disabled. This implementation does
not include a consent UI; configure the site's privacy notice and consent handling
for its deployment requirements before enabling collection where consent is needed.

Local dev and preview hostnames never load the tag, even when an ID is present.
Use a browser test with the production origin and intercepted Google requests
to validate events without sending test data. A successful local test proves
event emission, not receipt by a real GA4 property.

## References

- [Manual page views and disabling history-based automatic views](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Custom dimensions](https://support.google.com/analytics/answer/14240153)
- [Google tag configuration](https://developers.google.com/tag-platform/gtagjs/configure)
