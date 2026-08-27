import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("full-inner-test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function render(worker, path) {
  const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200, path);
  return response.text();
}

test("expanded public routes provide a specific purpose, honest status, evidence and next action", async () => {
  const worker = await loadWorker();
  const routes = [
    ["activities/community", "Build useful relationships across the ecosystem."],
    ["activities/mentoring-volunteering", "Contribute experience where it can create value."],
    ["gba/market-entry", "Prepare before you enter the market."],
    ["gba/delegations", "A market mission begins before the journey."],
    ["gba/soft-landing", "Arrive with context, partners and a responsible plan."],
    ["gba/partner-network", "Find the right relationship—not just another logo."],
    ["gba/gone-global", "Market progress needs more than a travel photograph."],
    ["insights/case-studies", "Outcomes with the evidence attached."],
    ["insights/guides", "Clear guidance for the next decision."],
    ["insights/industry-perspectives", "Domain knowledge before broad conclusions."],
    ["insights/responsible-ai", "Governance people can use in real work."],
    ["insights/gba-intelligence", "Market context before market activity."],
    ["insights/event-replays", "Keep learning after the event ends."],
    ["about/history", "Twenty-five years of industry development."],
    ["about/leadership", "Accountability begins with current, approved information."],
    ["about/committees", "Clear mandates. Useful participation. Visible accountability."],
    ["about/governance", "Trust is an operating practice."],
    ["responsible-ai", "Practical progress needs responsible choices."],
    ["verification", "Understand what a WiseTech badge can mean."],
    ["programmes/launchpad", "Launch Pad"],
    ["programmes/asia-smart-innovation-awards/2025", "Completed 2025 edition record"],
  ];
  for (const [route, heading] of routes) {
    const html = await render(worker, `/en/${route}`);
    assert.ok(html.includes(heading), `Missing route-specific content on ${route}`);
    assert.ok(html.includes("Current status"), `Missing current status on ${route}`);
    assert.ok(html.includes("Your next step"), `Missing next action on ${route}`);
    assert.match(html, /\/archive\//, `Missing real WTIA image on ${route}`);
    assert.ok(!html.includes("VERIFIED WTIA ARCHIVE"), `Internal archive wording on ${route}`);
  }
});

test("task routes prepare transparent enquiries without claiming an automatic submission", async () => {
  const worker = await loadWorker();
  for (const route of ["submit-challenge", "request-introduction", "host-an-activity", "contact"]) {
    const html = await render(worker, `/en/${route}`);
    assert.ok(html.includes("task-form"), `Missing task form on ${route}`);
    assert.ok(html.includes("email"), `Missing email handoff on ${route}`);
    assert.ok(html.includes("does not"), `Missing action boundary on ${route}`);
  }
});

test("portal subpages remain explicit previews and unknown routes have a useful 404 state", async () => {
  const worker = await loadWorker();
  const portal = await render(worker, "/en/portal/profile");
  assert.ok(portal.includes("Preview only — no account or private member data is connected."));
  assert.ok(portal.includes("noindex"));

  const missing = await render(worker, "/en/this-route-does-not-exist");
  assert.ok(missing.includes("This page has moved—or the opportunity has changed."));
  assert.ok(missing.includes("Search WiseTech"));
});

test("Traditional Chinese task and trust routes retain full content parity", async () => {
  const worker = await loadWorker();
  const checks = [
    ["submit-challenge", "由業務問題開始，而不是技術規格。"],
    ["request-introduction", "安全引薦由目的及同意開始。"],
    ["about/governance", "信任是一種營運實踐。"],
    ["privacy", "了解資料流向及用途。"],
    ["accessibility", "讓更多人都能使用的 WiseTech 體驗。"],
  ];
  for (const [route, heading] of checks) {
    const html = await render(worker, `/zh/${route}`);
    assert.ok(html.includes(heading), `Missing Traditional Chinese content on ${route}`);
  }
});
