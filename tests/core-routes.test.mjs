import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTypeScript } from "./helpers/load-typescript.mjs";

const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const origin = "https://wisetech-hong-kong.laichiwillyjp.chatgpt.site";
const industryAliases = [
  ["commerce", "commerce-professional-services"],
  ["manufacturing", "manufacturing-robotics"],
  ["health", "health-life-sciences"],
  ["retail", "retail-creative-industries"],
  ["education", "education-future-of-work"],
  ["responsible-ai", "responsible-ai-data-cybersecurity"],
];

// Inspect actual head tags, not matching strings embedded in the RSC payload.
function headLinks(html, rel) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "missing document head");
  return [...head.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)]
      .map(([, name, value]) => [name.toLowerCase(), value])))
    .filter((link) => link.rel === rel);
}

function assertRouteMetadata(html, lang, route = "") {
  const suffix = route ? `/${route}` : "";
  assert.deepEqual(headLinks(html, "canonical").map((link) => link.href), [`${origin}/${lang}${suffix}`]);
  const alternates = headLinks(html, "alternate").filter((link) => link.hreflang);
  assert.equal(alternates.length, 2, "expected exactly two language alternates");
  assert.deepEqual(Object.fromEntries(alternates.map((link) => [link.hreflang, link.href])), {
    en: `${origin}/en${suffix}`,
    "zh-Hant": `${origin}/zh${suffix}`,
  });
}

async function render(path) {
  const response = await worker.fetch(new Request(origin + path, { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type"), /text\/html/);
  return response.text();
}

test("the unprefixed homepage uses the English canonical and language switch", async () => {
  const html = await render("/?from=legacy");
  assertRouteMetadata(html, "en");
  assert.match(html, /class="language-link" href="\/zh"/);
});

for (const lang of ["en", "zh"]) {
  test(`${lang} core navigation preserves the current route when switching language`, async () => {
    for (const route of ["", "/join", "/request-introduction", "/events", "/ai-plus/commerce-professional-services"]) {
      const html = await render(`/${lang}${route}`);
      assert.ok(html.includes(`lang="${lang === "en" ? "en-HK" : "zh-Hant-HK"}"`));
      assert.ok(html.includes(`class="language-link" href="/${lang === "en" ? "zh" : "en"}${route}"`), route);
      assert.match(html, /id="main-content"/);
    }
  });

  test(`${lang} enquiry routes expose labelled fields, privacy consent and preparation controls`, async () => {
    for (const route of ["submit-challenge", "request-introduction", "host-an-activity", "contact"]) {
      const html = await render(`/${lang}/${route}`);
      const form = html.match(/<form class="task-form"[\s\S]*?<\/form>/)?.[0];
      assert.ok(form, route);
      assert.match(form, /<label>[^<]+<(?:input|textarea)/);
      assert.match(form, /type="email"/);
      assert.match(form, /class="consent"/);
      assert.match(form, /type="checkbox"/);
      assert.match(form, /type="submit"/);
      assert.doesNotMatch(form, /\s(?:action|formaction)=/i, "enquiry must not declare a submission endpoint");
      const labels = [...form.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)].map((match) => match[1]);
      const controls = form.match(/<(?:input|textarea)\b/g) ?? [];
      assert.equal(labels.length, controls.length, `every control needs its own label: ${route}`);
      for (const label of labels) assert.match(label, /<(?:input|textarea)\b/);
      assert.equal((form.match(/type="email"/g) ?? []).length, 1, route);
      assert.doesNotMatch(form, /\schecked(?:[\s=>])/, "privacy acknowledgement must start unchecked");
      assert.doesNotMatch(html, /class="task-summary"/, "a fresh visit must start with the draft form");
      assert.ok(html.includes(lang === "en" ? "does not submit, pay, publish" : "不會自動提交、付款、發布"));
    }
  });

  test(`${lang} portal and activation previews and the explicit 404 cannot be indexed`, async () => {
    const portalPages = [
      "profile", "company", "seats", "directory", "introductions", "solution", "events",
      "programmes", "councils", "gba", "documents", "billing", "preferences",
    ];
    const routes = ["portal", ...portalPages.map((page) => `portal/${page}`),
      "portal/missing", "portal/profile/missing", "join/success", "404"];
    for (const route of routes) {
      const html = await render(`/${lang}/${route}`);
      assert.match(html, /<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/);
      assertRouteMetadata(html, lang, route);
    }
  });

  for (const [alias, canonical] of industryAliases) {
    test(`${lang} industry alias ${alias} keeps canonical content and query-free metadata`, async () => {
      const html = await render(`/${lang}/ai-plus/${alias}?from=legacy&topic=AI%2B`);
      const canonicalHtml = await render(`/${lang}/ai-plus/${canonical}`);
      assertRouteMetadata(html, lang, `ai-plus/${canonical}`);
      assertRouteMetadata(canonicalHtml, lang, `ai-plus/${canonical}`);
      const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0];
      assert.ok(heading, alias);
      assert.equal(heading, canonicalHtml.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0], alias);
      assert.ok(html.includes(`class="language-link" href="/${lang === "en" ? "zh" : "en"}/ai-plus/${alias}"`));
    });
  }

  test(`${lang} missing routes retain localized recovery links in both fallback renderers`, async () => {
    const routes = [
      ["not-a-route", true], ["programmes/not-a-programme", true], ["portal/profile/missing", true],
      ["events/not-an-event", false], ["ai-plus/not-an-industry", false],
    ];
    for (const [route, rich] of routes) {
      // These are content fallbacks today; render() also pins the current HTTP 200.
      const html = await render(`/${lang}/${route}`);
      const main = html.match(/<main\b[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/)?.[1];
      assert.ok(main, route);
      const heading = rich
        ? (lang === "en" ? "This page has moved—or the opportunity has changed." : "此頁面已移動，或機會狀態已有改變。")
        : (lang === "en" ? "We couldn’t find this page." : "我們找不到這個頁面。");
      assert.ok(main.includes(heading), route);
      for (const target of rich ? ["search", "events", "contact"] : ["", "events"]) {
        assert.ok(main.includes(`href="/${lang}${target ? `/${target}` : ""}"`), `${route}: ${target}`);
      }
      assert.ok(html.includes(`class="language-link" href="/${lang === "en" ? "zh" : "en"}/${route}"`));
    }
  });
}

test("every sitemap destination renders real public content with a paired translation", async () => {
  const { default: sitemap } = await loadTypeScript("app/sitemap.ts");
  const entries = sitemap();
  const urls = new Set(entries.map((entry) => entry.url));
  assert.equal(urls.size, entries.length, "duplicate sitemap URLs");
  assert.ok(entries.length >= 130, "public route families unexpectedly removed");
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, origin);
    assert.ok(!/\/(portal|join\/success)(\/|$)/.test(url.pathname));
    const [, lang, ...segments] = url.pathname.split("/");
    assert.ok(["en", "zh"].includes(lang), url.pathname);
    const suffix = segments.length ? `/${segments.join("/")}` : "";
    const languages = { en: `${origin}/en${suffix}`, "zh-Hant": `${origin}/zh${suffix}` };
    assert.deepEqual(entry.alternates.languages, languages, url.pathname);
    for (const alternate of Object.values(languages)) {
      assert.ok(urls.has(alternate), alternate);
      assert.deepEqual(entries.find((entry) => entry.url === alternate).alternates.languages, languages, alternate);
    }
    const html = await render(url.pathname);
    assertRouteMetadata(html, lang, segments.join("/"));
    assert.match(html, /<h1\b[^>]*>/, url.pathname);
    assert.ok(!html.includes("This page has moved—or the opportunity has changed."), url.pathname);
    assert.ok(!html.includes("此頁面已移動，或機會狀態已有改變。"), url.pathname);
    assert.ok(!html.includes("We couldn’t find this page."), url.pathname);
    assert.ok(!html.includes("我們找不到這個頁面。"), url.pathname);
    assert.ok(!html.includes('content="noindex, nofollow"'), url.pathname);
  }
});

test("deployable artifact includes the exact hosting config and migration journal", async () => {
  for (const path of ["hosting.json", "drizzle/meta/_journal.json"]) {
    const source = path === "hosting.json" ? ".openai/hosting.json" : path;
    assert.equal(await readFile(new URL(`../dist/.openai/${path}`, import.meta.url), "utf8"), await readFile(new URL(`../${source}`, import.meta.url), "utf8"));
  }
});
