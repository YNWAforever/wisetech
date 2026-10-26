# Architecture

## Request and rendering path

```text
Browser → Cloudflare Worker (worker/index.ts)
        ├─ /_vinext/image → Vinext optimizer → ASSETS / IMAGES binding
        └─ Vinext App Router
           ├─ app/layout.tsx: root metadata, structured data, global CSS
           ├─ app/page.tsx: English root homepage
           └─ app/[lang]/[[...slug]]/page.tsx: metadata + localized shell
              → WiseTechSite
                ├─ ExpansionRoute
                │  ├─ FullInnerRoute first
                │  └─ expansion pages
                └─ shell section dispatcher / content fallback
```

The app uses Next.js APIs but runs on Vinext, not a conventional Next.js server.
Vite integrates React Server Components and the Cloudflare runtime.
`WiseTechSite.tsx`, `ExpansionPages.tsx` and `FullInnerPages.tsx` are client
components that also produce server-rendered HTML. React hydration supplies
menus, filters, wizard steps and enquiry summaries.

`WiseTechSite` first calls `ExpansionRoute`, which tries `FullInnerRoute` before
its own pages. Only a `null` result reaches the shell's section dispatcher.
This order lets detailed routes such as `contact`, `join/success` and
`portal/profile` override broader sections. `FullInnerRoute` also owns programme
records, editions and most rich content pages.

Routing and metadata are separate decisions: `generateMetadata` in the localized
page does not check whether a content record exists. Unknown events/industries
use `NotFoundPage` in `ExpansionPages.tsx`; unknown programmes, portal subpages
and unmatched routes use `NotFoundInnerPage` in `FullInnerPages.tsx`. Both are
content fallbacks with HTTP 200, not framework 404 responses. Some broad section
dispatchers also accept extra path segments. Non-`zh` language segments fall
back to English; there is no supported-locale rejection gate.

## Core flows and state

| Flow | Code | Actual effect |
| --- | --- | --- |
| Discover content / switch language | `WiseTechSite.tsx`, `megaNav.ts` | Localized links; language switch preserves query and fragment in the browser |
| Prepare membership enquiry | `JoinPage` in `WiseTechSite.tsx` | Six steps of component state; no account, payment or server submission |
| Business challenge, introduction, hosting, contact | `EnquiryForm` in `FullInnerPages.tsx` | Checks required values and privacy acknowledgement; shows an encoded `mailto:` summary for user review |
| Activity updates | Footer in `WiseTechSite.tsx` | Opens a prepared email; does not create a subscription |
| Members / solutions / portal | `WiseTechSite.tsx`, `FullInnerPages.tsx` | Empty public directories and explicit account previews; no private records |
| Ask WiseTech | `Concierge` in `WiseTechSite.tsx` | Contextual hard-coded replies; no model, tools or private data access |

`EnquiryForm` prevents the native submit and uses `noValidate`: its checks are
non-empty required fields and an explicit privacy acknowledgement, not email
syntax validation. The membership wizard has separate validation; its final
review consent is currently displayed without being enforced by `next()`.

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
The unprefixed `/` renders the English homepage with `/en` as its canonical.
Six short industry aliases render the same content as their full paths and
advertise the full path in canonical/alternate links; they do not redirect.
Programme aliases (`tct`, `hkict`, `asa`) resolve content separately and are not
part of that metadata canonicalization map. Canonicals omit request query
parameters. The language switch's SSR link preserves the requested path,
including aliases; its browser click handler appends the query and fragment.

`app/sitemap.ts` enumerates 67 public paths in both languages. Portal routes and
`join/success` are `noindex, nofollow`; the explicit localized `/404` is also
non-indexable. Portal indexing applies to the whole section, including missing
subpages. Other missing routes do not automatically receive `noindex`. These
robots directives provide no account protection.

For a route change, check these independently:

1. Content dispatch and aliases in `WiseTechSite.tsx`, `ExpansionPages.tsx` and
   `FullInnerPages.tsx`, including both languages and missing-record recovery.
2. Titles, canonical aliases, alternates and indexing in
   `app/[lang]/[[...slug]]/page.tsx`; public navigation in `app/megaNav.ts`.
3. Public canonical URLs in `app/sitemap.ts`; previews and aliases stay out.
   The route tests compare sitemap pairs with the rendered head metadata.

The public origin is repeated in `app/layout.tsx`, `app/sitemap.ts` and event
JSON-LD in `ExpansionPages.tsx`; review all of them when moving domains.

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
