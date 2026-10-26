import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTypeScript } from "./helpers/load-typescript.mjs";

const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const origin = "https://wisetech-hong-kong.laichiwillyjp.chatgpt.site";
async function render(path) {
  const response = await worker.fetch(new Request(origin + path, { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type"), /text\/html/);
  return response.text();
}

for (const lang of ["en", "zh"]) {
  test(`${lang} core navigation preserves the current route when switching language`, async () => {
    for (const route of ["", "/join", "/request-introduction", "/events", "/ai-plus/commerce-professional-services"]) {
      const html = await render(`/${lang}${route}`);
      assert.ok(html.includes(`lang="${lang === "en" ? "en-HK" : "zh-Hant-HK"}"`));
      assert.ok(html.includes(`href="/${lang === "en" ? "zh" : "en"}${route}"`), route);
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
      assert.ok(!form.includes('action="http'), "enquiry must not post externally");
      assert.ok(html.includes(lang === "en" ? "does not submit, pay, publish" : "不會自動提交、付款、發布"));
    }
  });

  test(`${lang} account and activation previews cannot be indexed`, async () => {
    for (const route of ["portal", "portal/profile", "join/success"]) {
      const html = await render(`/${lang}/${route}`);
      assert.match(html, /<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/);
    }
  });

  test(`${lang} industry aliases advertise the full canonical route and bilingual alternates`, async () => {
    const html = await render(`/${lang}/ai-plus/commerce`);
    assert.match(html, new RegExp(`<link[^>]*rel="canonical"[^>]*href="${origin}/${lang}/ai-plus/commerce-professional-services"`));
    for (const [language, prefix] of [["en", "en"], ["zh-Hant", "zh"]]) {
      assert.ok(html.includes(`hrefLang="${language}" href="${origin}/${prefix}/ai-plus/commerce-professional-services"`));
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
    for (const alternate of Object.values(entry.alternates.languages)) assert.ok(urls.has(alternate), alternate);
    const html = await render(url.pathname);
    assert.ok(!html.includes("This page has moved—or the opportunity has changed."), url.pathname);
    assert.ok(!html.includes("此頁面已移動，或機會狀態已有改變。"), url.pathname);
    assert.ok(!html.includes('content="noindex, nofollow"'), url.pathname);
  }
});

test("deployable artifact includes the exact hosting config and migration journal", async () => {
  for (const path of ["hosting.json", "drizzle/meta/_journal.json"]) {
    const source = path === "hosting.json" ? ".openai/hosting.json" : path;
    assert.equal(await readFile(new URL(`../dist/.openai/${path}`, import.meta.url), "utf8"), await readFile(new URL(`../${source}`, import.meta.url), "utf8"));
  }
});
