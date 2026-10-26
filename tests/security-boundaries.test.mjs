import assert from "node:assert/strict";
import test from "node:test";

// Exercise the compiled Worker entry point, including image validation and SSR.
// Run after npm run build; no network, account, or database is needed.
const { default: worker } = await import("../dist/server/index.js");
const ctx = { waitUntil() {}, passThroughOnException() {} };
const missingAssets = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};

function imageRequest(source, width = "640", quality = "75") {
  const url = new URL("http://localhost/_vinext/image");
  url.search = new URLSearchParams({ url: source, w: width, q: quality });
  return new Request(url);
}

test("image endpoint rejects remote URLs before fetching an asset", async () => {
  let assetFetches = 0;
  const env = {
    ASSETS: {
      fetch: async () => {
        assetFetches += 1;
        throw new Error("Invalid image sources must not be fetched");
      },
    },
  };
  for (const source of [
    "https://example.invalid/image.png",
    "http://127.0.0.1/image.png",
    "//example.invalid/image.png",
    "/\\example.invalid/image.png",
    "data:image/svg+xml,<svg/>",
  ]) {
    const response = await worker.fetch(imageRequest(source), env, ctx);
    assert.equal(response.status, 400, source);
    await response.text();
  }
  assert.equal(assetFetches, 0);
});

test("image endpoint rejects invalid dimensions and quality before asset access", async () => {
  const env = {
    ASSETS: { fetch: async () => { throw new Error("Invalid parameters reached assets"); } },
  };
  for (const [width, quality] of [["999999", "75"], ["-1", "75"], ["641", "75"], ["640", "101"], ["640", "0"]]) {
    const response = await worker.fetch(imageRequest("/image.png", width, quality), env, ctx);
    assert.equal(response.status, 400, `${width}/${quality}`);
    await response.text();
  }
});

test("image endpoint refuses SVG and HTML even when an asset exists", async () => {
  for (const type of ["image/svg+xml", "text/html"]) {
    const env = {
      ASSETS: {
        fetch: async () => new Response("<script>alert('audit')</script>", { headers: { "Content-Type": type } }),
      },
    };
    const response = await worker.fetch(imageRequest("/untrusted-image"), env, ctx);
    assert.equal(response.status, 400, type);
    assert.doesNotMatch(await response.text(), /<script>/);
  }
});

test("public portal previews do not render a supplied identity or access a database", async () => {
  const env = {
    ...missingAssets,
    get DB() { throw new Error("Public previews must not read member data"); },
  };
  for (const path of ["/en/portal", "/en/portal/profile", "/zh/portal/profile"]) {
    const request = new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", "oai-authenticated-user-email": "audit-person@example.invalid" },
    });
    const response = await worker.fetch(request, env, ctx);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /noindex/);
    assert.doesNotMatch(html, /audit-person@example\.invalid/);
    assert.match(html, /Preview only|只供預覽/);
  }
});

test("record placeholders escape reflected markup in requested slugs", async () => {
  const input = "<script>alert('audit')</script>";
  const request = new Request(`http://localhost/en/members/${encodeURIComponent(input)}`, {
    headers: { accept: "text/html" },
  });
  const response = await worker.fetch(request, missingAssets, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.doesNotMatch(html, /<script>alert\(['"]audit['"]\)<\/script>/i);
  assert.match(html, /&lt;script&gt;/i);
});
