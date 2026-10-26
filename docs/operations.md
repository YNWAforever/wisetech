# Operations

## Test contract

`npm test` builds once and runs `node --test tests/*.test.mjs`. Tests invoke the
built Worker directly with `Request`/`Response`, an ASSETS stub returning 404,
and a no-op execution context. They perform no network requests or DB writes.
`.github/workflows/verify.yml` runs the locked install, fresh build/tests and lint
on pull requests and pushes to `main` using Node 24 on Ubuntu.

| Suite | What it verifies |
| --- | --- |
| `content-routes` | Bilingual content, navigation labels and anchors, historical event/partner claims |
| `full-inner-pages` | Expanded routes, enquiry entry points, preview and fallback text |
| `rendered-html` | Development-preview metadata on the root response |
| `partner-assets` | All 79 source PNG dimensions and RGBA format |
| `core-routes` | Localized navigation, enquiry field/consent structure, preview robots metadata, industry canonical aliases, every sitemap destination and paired translation, packaged hosting metadata/migration journal |
| `auth-return-paths` | Local query/fragment preservation; rejection of external URLs and reserved auth destinations, including traversal |

The auth tests load the real standalone TypeScript helper via the declared
TypeScript compiler into disposable `work/` modules. They test URL builders,
not request identity or a deployed OAuth exchange. No extra runner is required.

These are server-render and source-helper tests. They **do not** prove hydration,
keyboard interaction, wizard validation, email-client delivery, real asset
serving, image transformation bindings, platform header injection, or persistence.
The ASSETS stub deliberately does not emulate those services. New browser tests
should intercept external handoffs and never send email.

For diagnosis without rebuilding unchanged code:

```bash
node --test tests/*.test.mjs
node tests/core-routes.test.mjs
```

Running a suite directly also exposes individual assertions on runtimes where
Worker imports interfere with the test runner's per-file output.

## Release through Sites

1. Run `npm test` and `npm run lint` from the candidate checkout. Record its
   commit SHA and any remaining warnings. Use Node >=22.13.0 on Linux.
2. Review `.openai/hosting.json`: target project, optional bindings, and whether
   a schema change is involved. Current site has no D1/R2 binding. Do not apply
   example migrations to a real database.
3. In the authorized Sites project, save/checkpoint the intended source as a
   new site version. The Sites remote builder runs `npm run build`. A GitHub
   commit/PR is a separate record; establish which commit the saved version
   contains rather than assuming automatic synchronization.
4. Inspect the saved version's build outcome/preview. Confirm `/en`, `/zh`,
   `/en/contact`, `/zh/join`, a historical event and an archive image. Check
   canonical/alternate URLs against the intended public origin.
5. Deploy that saved version with the Sites platform deployment action. Observe
   its deployment ID until success or failure. Record version, source SHA,
   deployment ID and production URL. Do not call a pending build a release.
6. On the deployed URL, repeat the public route checks and verify an image
   loads. Exercise the language switch, enquiry validation and summary editing
   without sending email. Confirm the portal remains explicitly a preview.

There is no repository `deploy` npm script or checked-in `wrangler.jsonc`.
The generated `dist/server/wrangler.json` is build output; direct Wrangler
publication would require separately configured account, assets, bindings and
hosting/auth behavior. It is not the documented production path for this site.

## Rollback and failures

Keep the previous known-good Sites version ID and source SHA in the release
record. On a failed or regressed release, use the platform to deploy that saved
version again, wait for the result, and repeat the public smoke checks. A Git
revert alone does not roll back production. Future database migrations will
need their own compatibility/rollback plan before enabling D1.

- Missing Vinext executable: let `npm run install:ci` finish; don't start another
  installer. Respect lockfile/install errors rather than retrying blindly.
- Timeout: the install/build helpers fail without automatic retries. Inspect
  the log before a controlled override using `SITES_INSTALL_TIMEOUT`,
  `SITES_INSTALL_KILL_AFTER`, `SITES_BUILD_TIMEOUT`, `SITES_BUILD_KILL_AFTER`.
- Cloudflare metadata/metrics network failure: use the optional local command
  in README if these calls are unnecessary. Don't disable TLS verification.
- Wrong canonical host: update both root metadata and sitemap origins and rerun
  the route suite.
- Missing database: expected until a binding and real schema are configured.

Disposable `.sites-runtime/`, `.wrangler/`, `work/` and `dist/` are ignored.
Application secrets belong in the hosting environment or ignored `.env*` files;
they are not needed for current public rendering.
