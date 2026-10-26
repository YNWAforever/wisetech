# Architecture

## Request and rendering path

```text
Browser → Cloudflare Worker (worker/index.ts)
        ├─ /_vinext/image → Vinext optimizer → ASSETS / IMAGES binding
        └─ Vinext App Router
           ├─ app/layout.tsx: root metadata, structured data, global CSS
           ├─ app/page.tsx: English root homepage
           └─ app/[lang]/[[...slug]]/page.tsx: metadata + localized shell
              → WiseTechSite → ExpansionRoute → FullInnerRoute / page fallback
```

The app uses Next.js APIs but runs on Vinext, not a conventional Next.js server.
Vite integrates React Server Components and the Cloudflare runtime.
`WiseTechSite.tsx`, `ExpansionPages.tsx` and `FullInnerPages.tsx` are client
components that also produce server-rendered HTML. React hydration supplies
menus, filters, wizard steps and enquiry summaries.

`ExpansionRoute` is tried before the shell's section dispatcher. Its detailed
pages can override broad route families. `FullInnerRoute` resolves rich content,
programme records, task forms and preview subpages. Add a route in the correct
layer, then update navigation, localized metadata and sitemap deliberately.
Unknown content currently renders a helpful fallback with HTTP 200; that is a
known limitation, not an HTTP 404 guarantee. Non-`zh` language segments currently
fall back to English.

## Core flows and state

| Flow | Code | Actual effect |
| --- | --- | --- |
| Discover content / switch language | `WiseTechSite.tsx`, `megaNav.ts` | Localized links; language switch preserves query and fragment in the browser |
| Prepare membership enquiry | `JoinPage` in `WiseTechSite.tsx` | Six steps of component state; no account, payment or server submission |
| Business challenge, introduction, hosting, contact | `EnquiryForm` in `FullInnerPages.tsx` | Checks required values and privacy acknowledgement; shows an encoded `mailto:` summary for user review |
| Activity updates | Footer in `WiseTechSite.tsx` | Opens a prepared email; does not create a subscription |
| Members / solutions / portal | `WiseTechSite.tsx`, `FullInnerPages.tsx` | Empty public directories and explicit account previews; no private records |
| Ask WiseTech | `Concierge` in `WiseTechSite.tsx` | Contextual hard-coded replies; no model, tools or private data access |

Drafts use React state only and are lost on reload. No enquiry API receives the
form data. Actual sending depends on the user's email client and decision to
send. The membership draft does not persist or automatically email the entered
fields. Do not treat completion screens as evidence of a submitted application.

## Content and indexing

Content lives in TSX and typed data (`megaNav.ts`, `partnerData.ts`,
`visualData.ts`). `public/archive/` contains WTIA historical photography;
`public/partners/` has 79 normalized logos. Historical listings do not establish
current relationships or open registration.

Localized route metadata defines titles, canonicals and language alternates.
`app/sitemap.ts` enumerates 67 public paths in both languages. Portal routes and
`join/success` are `noindex, nofollow`; they are not protected accounts.
The public origin is hard-coded in both `app/layout.tsx` and `app/sitemap.ts`;
change both together when moving domains.

## Runtime and optional services

`.openai/hosting.json` identifies the Sites project and currently declares
`d1: null` and `r2: null`. `vite.config.ts` simulates bindings only if declared.
`db/schema.ts` is empty; `db/index.ts` expects a D1 binding named `DB` and throws
when absent. `examples/d1/` is example code outside the active `app/` tree.
Do not infer a live database from those scaffolding files.

`app/chatgpt-auth.ts` is an unused optional identity adapter. It reads
platform-injected headers and creates same-origin sign-in/out return paths.
Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt` and `/callback`.
Identity is not membership authorization. A future protected route needs a
server-side access policy, trusted header injection and per-request rendering;
portal `noindex` metadata provides none of these controls.

## Build boundary

`scripts/sites-env.sh` gives build/install tools disposable project-local home,
cache, temporary and Wrangler paths. `build-verified.sh` runs a bounded Vinext
build. `build/sites-vite-plugin.ts` copies hosting metadata and migration files
to `dist/.openai/`; Vite emits server code into `dist/server/` and browser assets
into `dist/client/`. Keep those directories together when deploying.

See [operations](docs/operations.md) for commands and [engineering risks](docs/engineering.md)
for boundaries to address before adding real accounts or submissions.
