import assert from "node:assert/strict";
import test from "node:test";

const routeChecks = [
  ["why-wisetech", "Technology moves fast. Wise progress moves together.", "科技發展迅速，明智進步源於同行。"],
  ["ai-plus", "AI becomes valuable when it meets a real industry problem.", "當 AI 回應真實產業問題，才會創造價值。"],
  ["for-corporates", "Turn business challenges into tested AI initiatives.", "把業務挑戰轉化為經測試的 AI 項目。"],
  ["for-smes", "Practical AI. Clear next steps. Trusted support.", "實用 AI、清晰下一步、可信支援。"],
  ["for-startups", "Move from product promise to buyer confidence.", "由產品承諾走向買家信心。"],
  ["for-professionals", "Build the skills and relationships shaping Hong Kong’s AI economy.", "建立塑造香港 AI 經濟的技能與關係。"],
  ["for-gba-global", "Enter Hong Kong through a trusted technology network.", "透過可信科技網絡進入香港。"],
  ["members", "Meet the people and organisations building what comes next.", "認識正在建設未來的人與機構。"],
  ["solutions", "Find AI ready for the real world.", "尋找可在真實環境落地的 AI。"],
  ["events", "The next useful connection starts here.", "下一個有用連結，由這裡開始。"],
  ["activities", "Participation that continues between major events.", "讓參與延續於大型活動之間。"],
  ["activities/ai-clinics", "Bring one business challenge. Leave with clearer next steps.", "帶來一個業務挑戰，帶走更清晰下一步。"],
  ["activities/buyer-days", "Where verified business needs meet relevant technology.", "讓已核實業務需要遇上相關科技。"],
  ["activities/industry-councils", "Turn member expertise into collective industry action.", "把會員專長轉化為產業集體行動。"],
  ["activities/training", "Build AI capability people can apply at work.", "建立人們可在工作應用的 AI 能力。"],
  ["activities/gba-delegations", "Move beyond introductions into market understanding.", "由引薦走向真正市場理解。"],
  ["programmes", "Programmes that turn participation into progress.", "把參與轉化為進步的計劃。"],
  ["gba", "Hong Kong expertise. GBA opportunity. Global ambition.", "香港專長，大灣區機遇，全球視野。"],
  ["membership", "Join the network that turns participation into opportunity.", "加入把參與轉化為機遇的網絡。"],
  ["join", "Prepare your WiseTech membership enquiry.", "準備你的 WiseTech 會籍查詢。"],
  ["partner-with-us", "Build the AI+ ecosystem with us.", "與我們共同建設 AI+ 生態系統。"],
  ["partners", "79 organisations in the sourced WTIA network record.", "WTIA 來源網絡紀錄中的 79 個機構。"],
  ["insights", "Practical intelligence for the AI+ economy.", "服務 AI+ 經濟的實務情報。"],
  ["about", "From wireless connections to wise technology.", "從無線連接，走向智慧科技。"],
  ["ai-transparency", "Ask WiseTech recommends. People remain in control.", "Ask WiseTech 提供建議，決定權仍在人。"],
  ["ai-ops", "Measure usefulness without collecting private conversations.", "在不收集私人對話下衡量實用性。"],
];

const anchorChecks = [
  ["why-wisetech", ["vision", "impact", "model", "connect", "mission"]],
  ["ai-plus", ["councils", "readiness", "opportunities", "responsible"]],
  ["members", ["search", "introduction"]],
  ["solutions", ["needs", "verification", "buyer", "publish"]],
  ["events", ["calendar", "interest", "host"]],
  ["activities", ["community", "contribute", "availability"]],
  ["activities/training", ["tracks", "formats", "interest"]],
  ["programmes", ["open", "catalogue", "history"]],
  ["gba", ["pathways", "process", "current"]],
  ["partner-with-us", ["challenge", "enquiry"]],
  ["insights", ["content", "research", "subscribe"]],
  ["about", ["history", "leadership", "committees", "governance", "contact"]],
  ["ai-transparency", ["principles", "actions", "privacy"]],
  ["ai-ops", ["measurement", "outcomes", "dashboard"]],
];

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("content-test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function render(worker, path) {
  const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200, path);
  return response.text();
}

test("all required inner pages render substantial English and Traditional Chinese content", async () => {
  const worker = await loadWorker();
  for (const [route, english, chinese] of routeChecks) {
    const englishHtml = await render(worker, `/en/${route}`);
    assert.ok(englishHtml.includes(english), `Missing English content on /en/${route}`);
    const chineseHtml = await render(worker, `/zh/${route}`);
    assert.ok(chineseHtml.includes(chinese), `Missing Traditional Chinese content on /zh/${route}`);
  }
});

test("event records are completed resources and do not expose an open registration action", async () => {
  const worker = await loadWorker();
  for (const [slug, image] of [
    ["asia-smart-innovation-awards-summit-2025", "/archive/asia-smart-summit.webp"],
    ["smart-innovation-meets-genai", "/archive/smart-innovation-genai.webp"],
  ]) {
    const html = await render(worker, `/en/events/${slug}`);
    assert.ok(html.includes("Completed"));
    assert.ok(html.includes("WTIA event page"));
    assert.ok(!html.includes(">Register now<"));
    assert.ok(html.includes("https://schema.org/EventCompleted"));
    assert.ok(html.includes(image), `Missing verified event image ${image}`);
  }
});

test("homepage includes clearly labelled WTIA archive photography", async () => {
  const worker = await loadWorker();
  const html = await render(worker, "/en");
  assert.ok(html.includes("From the WTIA archive"));
  assert.ok(html.includes("WTIA Event Highlights"));
  assert.ok(html.includes("/archive/tech-connect-ai-leaders.webp"));
  assert.ok(html.includes("/archive/asia-smart-summit.webp"));
  assert.ok(html.includes("https://hkwtia.org/photo-gallery/"));
  for (const internalPhrase of ["Verified WTIA archive", "Verified-data mode", "Editorial concept image", "Integrity rule", "Editorial standard"]) {
    assert.ok(!html.includes(internalPhrase), `Homepage still exposes internal phrase: ${internalPhrase}`);
  }
});

test("public-facing routes avoid internal content-governance labels", async () => {
  const worker = await loadWorker();
  for (const route of ["events", "insights", "programmes", "membership", "search"]) {
    const html = await render(worker, `/en/${route}`);
    for (const internalPhrase of ["Verified-data mode", "Approved-content mode", "approved public platform", "Source archive"]) {
      assert.ok(!html.includes(internalPhrase), `${route} still exposes internal phrase: ${internalPhrase}`);
    }
  }
});

test("navigation hash targets exist on their destination pages", async () => {
  const worker = await loadWorker();
  for (const [route, anchors] of anchorChecks) {
    const html = await render(worker, `/en/${route}`);
    for (const anchor of anchors) assert.match(html, new RegExp(`id=["']${anchor}["']`), `${route}#${anchor}`);
  }
});

test("route families render relevant real WTIA activity photography", async () => {
  const worker = await loadWorker();
  const checks = [
    ["/en/ai-plus", "/archive/tech-connect-ai-leaders.webp"],
    ["/en/events", "/archive/tech-connect-community.webp"],
    ["/en/membership", "/archive/asia-smart-kickoff.webp"],
    ["/en/ai-transparency", "/archive/asia-smart-summit.webp"],
    ["/en/gba", "/archive/asia-smart-shanghai.webp"],
  ];
  for (const [route, asset] of checks) {
    const html = await render(worker, route);
    assert.ok(html.includes(asset), `Missing ${asset} on ${route}`);
  }
});

test("primary navigation is simplified to five clear groups", async () => {
  const worker = await loadWorker();
  const html = await render(worker, "/en");
  const navButtons = html.match(/<button[^>]*class="nav-button[^"]*"[^>]*>/g) ?? [];
  assert.equal(navButtons.length, 5);
  const labels = [...html.matchAll(/<button[^>]*class="nav-button[^"]*"[^>]*>([\s\S]*?)<\/button>/g)]
    .map((match) => match[1].replace(/<span[\s\S]*?<\/span>/g, "").replace(/<!--[\s\S]*?-->/g, "").trim());
  assert.deepEqual(labels, ["Events", "Members", "AI+ Industries", "Programmes", "Insights"]);
});

test("public brand and legal organisation remain distinct", async () => {
  const worker = await loadWorker();
  const html = await render(worker, "/en");
  assert.ok(html.includes("WiseTech Hong Kong"));
  assert.ok(html.includes("evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association"));
  assert.ok(!html.includes("Hong Kong Wise Technology Association"));
});

test("partner directory presents all sourced records as historical unless confirmed", async () => {
  const worker = await loadWorker();
  const html = await render(worker, "/en/partners");
  assert.ok(html.includes("Supporting Organisations"));
  assert.ok(html.includes("Regional Partners"));
  assert.ok(html.includes("Media Partners"));
  assert.ok(html.includes("Historical WTIA listing"));
  assert.ok(html.includes("Current status"));
});

test("key page families include practical next-step guidance", async () => {
  const worker = await loadWorker();
  const checks = [
    ["/en/ai-plus", "A practical route from AI question to action."],
    ["/en/activities", "Make participation useful before, during and after."],
    ["/en/for-professionals", "Turn membership into an active pathway."],
    ["/en/gba", "Move from market interest to informed entry."],
    ["/en/ai-transparency", "Build trust through clear decisions and evidence."],
  ];
  for (const [route, heading] of checks) {
    const html = await render(worker, route);
    assert.ok(html.includes(heading), `Missing practical guidance on ${route}`);
  }
});
