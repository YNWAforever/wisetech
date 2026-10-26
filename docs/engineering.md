# Risk map and engineering priorities

This map describes the checked-in implementation, not a production audit.

| Priority / area | Evidence and consequence | Existing check / remaining work |
| --- | --- | --- |
| High: enquiry correctness | `JoinPage` keeps only component state; review consent is not checked by `next()`. `EnquiryForm` uses `noValidate` and checks non-empty values, not email format. Users can complete an invalid draft. | SSR checks pin the visible consent and email fields; add browser tests and explicit validation before relying on enquiries. |
| High before real accounts: access control | Portal is public preview; optional header auth is unused and does not establish membership. | Robots tests protect indexing intent only. Introduce server authorization before storing or displaying private data. |
| Medium: route/index integrity | Catch-all accepts unsupported locales and many unknown paths with HTTP 200. Metadata can inherit a broad section title for missing content. | Sitemap destinations, bilingual alternates and preview indexing covered. Add a shared route registry and true not-found semantics. |
| Medium: content truth and freshness | Historical events and 79 partner records are source-managed; current relationship status is not confirmed. | Content/asset tests preserve historical labels; establish owners, approvals and review dates. |
| Medium: release confidence | GitHub source and Sites saved versions are separate; direct Worker tests stub assets and omit hydration/runtime bindings. | Artifact copy checks and release runbook added; automate browser/preview checks and record version-to-commit mapping. |
| Medium: delivery/performance | Large client component files and existing `<img>` lint warnings; no measured runtime performance budget. | Measure bundle, LCP and image delivery before choosing optimizations. |

## Next three recommended investments

1. **Browser acceptance coverage and form validation.** Cover both languages:
   membership step gates/back/edit/reload, consent enforcement, invalid email,
   enquiry summary encoding/editing, menu keyboard behavior and language
   query/fragment preservation. Intercept mailto handoffs. Done when these flows
   run in CI against a fresh preview and invalid data cannot reach completion.
2. **A single typed route/content registry.** Derive dispatch, titles,
   canonicals, alternates, sitemap and navigation validation from approved route
   definitions. Reject unsupported locales and return HTTP 404 for unknown
   resources. Done when missing routes are non-indexable 404 responses and every
   published route has bilingual metadata without duplicate route lists.
3. **Define and implement the real enquiry/member service boundary.** Decide
   whether email preparation remains the product or whether server submissions
   are required. For server records, first specify retention, membership
   authorization, consent, idempotency, audit events and failure recovery; then
   introduce a schema and isolated integration tests. Done when a submitted
   record can be verified after reload, users cannot read another member's data,
   and operators can trace a request without collecting unnecessary personal data.
