# WiseTech Hong Kong

English and Traditional Chinese public site for the evolving AI+ platform of
Hong Kong Wireless Technology Industry Association (WTIA). Built with React 19,
Next.js App Router conventions and Vinext/Vite; deployed as a Cloudflare Worker
through Sites. This is a content and enquiry prototype: no live member database,
payments, registration, subscription service or model API is connected.

## Run locally

Use Node.js **>=22.13.0**, npm, and Linux with `bash`, `flock`, `curl` and GNU
`timeout`. The helper scripts are not native macOS/Windows scripts; use Linux or
WSL. Versions are locked in `package-lock.json`.

```bash
npm run install:ci
npm run dev -- --port 5173 --strictPort
```

Open `http://localhost:5173/en` and `/zh`. On a network-restricted development
machine, optional Cloudflare metadata/metrics calls can be disabled for this
process:

```bash
CLOUDFLARE_CF_FETCH_ENABLED=false WRANGLER_SEND_METRICS=false npm run dev -- --port 5173 --strictPort
```

If a Sites lifecycle has already installed dependencies, reuse them. The install
helper performs one bounded, locked `npm ci`; don't run concurrent installs.
No `.env` file or application secrets are required for the current public site.

## Verify

```bash
npm test         # build fresh dist, then run all Node tests
npm run lint     # ESLint; currently reports existing image-element warnings
```

For a focused edit after a successful build:

```bash
node --test tests/auth-return-paths.test.mjs
node --test tests/core-routes.test.mjs
```

Worker tests import `dist/server/index.js`; rerun `npm run build` after changing
application code. A test run against old `dist` does not verify source changes.
See [test coverage and limitations](docs/operations.md#test-contract).

## Build and deploy

```bash
npm run build
npm run start -- --port 5173
curl --fail --silent http://localhost:5173/en > /dev/null
curl --fail --silent http://localhost:5173/zh > /dev/null
```

`dist/` is a Worker artifact, not a static export. Sites builds the saved site
version using `npm run build`; deployment is a separate platform action. Pushing
a GitHub PR alone does not prove a Sites version was saved or deployed. Follow
[the release and rollback runbook](docs/operations.md#release-through-sites).

## Where to change things

- [Architecture and flow boundaries](ARCHITECTURE.md)
- [Operations, test contract and release checks](docs/operations.md)
- [Risk map and next three engineering investments](docs/engineering.md)

Edit pages and bilingual content under `app/`, assets under `public/`, and
navigation groups in `app/megaNav.ts`. Keep English and Traditional Chinese
routes and current-versus-historical status consistent. The present public
identity uses WiseTech Hong Kong; the legal organisation remains WTIA.
