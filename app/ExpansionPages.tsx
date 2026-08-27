"use client";

import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { FullInnerRoute } from "./FullInnerPages";
import { siteVisuals, SiteVisual, visualForRoute } from "./visualData";

type Language = "en" | "zh";
type LocalText = { en: string; zh: string };

type Item = {
  title: LocalText;
  copy: LocalText;
  path?: string;
};

type ContentSection = {
  id: string;
  eyebrow: LocalText;
  title: LocalText;
  copy: LocalText;
  items?: Item[];
  ordered?: boolean;
  honestEmpty?: LocalText;
};

type PageSpec = {
  eyebrow: LocalText;
  title: LocalText;
  copy: LocalText;
  primary: { label: LocalText; path: string };
  secondary?: { label: LocalText; path: string };
  sections: ContentSection[];
  recommendations?: Item[];
  close: {
    title: LocalText;
    copy: LocalText;
    actions: Array<{ label: LocalText; path: string }>;
  };
};

type VerifiedEvent = {
  slug: string;
  title: string;
  date: string;
  dateLabel: LocalText;
  type: LocalText;
  venue: LocalText;
  city: LocalText;
  format: LocalText;
  status: "completed";
  sourceUrl: string;
  sourceNote: LocalText;
  image: string;
  imageAlt: LocalText;
};

const L = (en: string, zh: string): LocalText => ({ en, zh });
const tx = (value: LocalText, lang: Language) => value[lang];
const hrefFor = (lang: Language, path = "") => `/${lang}${path ? `/${path}` : ""}`;
const Arrow = () => <span aria-hidden="true">↗</span>;
const item = (en: string, zh: string, enCopy: string, zhCopy: string, path?: string): Item => ({
  title: L(en, zh),
  copy: L(enCopy, zhCopy),
  path,
});

export const verifiedEvents: VerifiedEvent[] = [
  {
    slug: "asia-smart-innovation-awards-summit-2025",
    title: "Asia Smart Innovation Awards Summit 2025",
    date: "2025-10-16",
    dateLabel: L("16 October 2025", "2025 年 10 月 16 日"),
    type: L("Awards summit", "大獎峰會"),
    venue: L("Ballroom I & II, Cordis Hong Kong", "香港康得思酒店宴會廳 I 及 II"),
    city: L("Hong Kong", "香港"),
    format: L("In person", "實體"),
    status: "completed",
    sourceUrl: "https://hkwtia.org/event/asia-smart-innovation-awards-summit-2025/",
    image: "/archive/asia-smart-summit.webp",
    imageAlt: L("Group photograph at the Asia Smart Innovation Awards Summit 2025", "亞洲智慧創新大獎峰會 2025 團體照"),
    sourceNote: L(
      "Event details are based on the original WTIA event page.",
      "活動資料來自 WTIA 原活動頁面。",
    ),
  },
  {
    slug: "smart-innovation-meets-genai",
    title: "Smart Innovation Meets GenAI",
    date: "2025-07-11",
    dateLabel: L("11 July 2025", "2025 年 7 月 11 日"),
    type: L("Industry event", "產業活動"),
    venue: L("KOHO, Kwun Tong", "觀塘 KOHO"),
    city: L("Hong Kong", "香港"),
    format: L("In person", "實體"),
    status: "completed",
    sourceUrl: "https://hkwtia.org/event/smart-innovation-meets-genai-trends-shaping-the-next-decade-of-startups/",
    image: "/archive/smart-innovation-genai.webp",
    imageAlt: L("Official WTIA event visual for Smart Innovation Meets GenAI", "Smart Innovation Meets GenAI 的 WTIA 官方活動視覺"),
    sourceNote: L(
      "Event details are based on the original WTIA event page.",
      "活動資料來自 WTIA 原活動頁面。",
    ),
  },
];

function InnerHero({ lang, spec, visual }: { lang: Language; spec: PageSpec; visual?: SiteVisual }) {
  const resolvedVisual = visual ?? (
    spec.eyebrow.en === "Insights" ? siteVisuals.governance :
    spec.eyebrow.en === "Partner With Us" ? siteVisuals.community :
    siteVisuals.adoption
  );
  return (
    <section className="page-hero inner-page-hero">
      <figure className="page-hero-photo">
        <img src={resolvedVisual.src} alt={tx(resolvedVisual.alt, lang)} />
        <figcaption>{tx(resolvedVisual.caption, lang)}</figcaption>
      </figure>
      <div className="page-hero-art" aria-hidden="true"><i /><i /><i /><span>W+</span></div>
      <div className="shell">
        <p className="eyebrow light">{tx(spec.eyebrow, lang)}</p>
        <h1>{tx(spec.title, lang)}</h1>
        <p>{tx(spec.copy, lang)}</p>
        <div className="inner-hero-actions">
          <a className="button button-light" href={hrefFor(lang, spec.primary.path)}>{tx(spec.primary.label, lang)} <Arrow /></a>
          {spec.secondary && <a className="text-link light-link" href={hrefFor(lang, spec.secondary.path)}>{tx(spec.secondary.label, lang)} <Arrow /></a>}
        </div>
        <div className="breadcrumb"><a href={hrefFor(lang)}>{lang === "en" ? "Home" : "首頁"}</a><span>/</span><b>{tx(spec.eyebrow, lang)}</b></div>
      </div>
    </section>
  );
}

function ContentCards({ lang, section }: { lang: Language; section: ContentSection }) {
  if (!section.items?.length) return null;
  return (
    <div className={`inner-card-grid${section.ordered ? " ordered" : ""}`}>
      {section.items.map((entry, index) => {
        const content = <>
          {section.ordered && <span className="inner-card-index">{String(index + 1).padStart(2, "0")}</span>}
          <h3>{tx(entry.title, lang)}</h3>
          <p>{tx(entry.copy, lang)}</p>
          {entry.path && <b>{lang === "en" ? "Explore this route" : "探索此路徑"} <Arrow /></b>}
        </>;
        return entry.path
          ? <a className="inner-card" href={hrefFor(lang, entry.path)} key={entry.title.en}>{content}</a>
          : <article className="inner-card" key={entry.title.en}>{content}</article>;
      })}
    </div>
  );
}

function HonestAvailability({ lang, copy }: { lang: Language; copy: LocalText }) {
  return (
    <div className="inner-honest" role="status">
      <span className="pulse-ring" aria-hidden="true" />
      <div>
        <p className="status-label">{lang === "en" ? "Coming next" : "最新動向"}</p>
        <h3>{lang === "en" ? "New opportunities are on the way." : "新一輪機會即將公布。"}</h3>
        <p>{tx(copy, lang)}</p>
      </div>
      <a className="button button-dark" href={hrefFor(lang, "events#interest")}>{lang === "en" ? "Register interest" : "登記興趣"} <Arrow /></a>
    </div>
  );
}

function Recommendations({ lang, items }: { lang: Language; items: Item[] }) {
  return (
    <section className="section recommendation-section" aria-labelledby="recommended-participation">
      <div className="shell">
        <div className="inner-section-heading">
          <p className="eyebrow">{lang === "en" ? "Recommended ways to participate" : "建議參與方式"}</p>
          <h2 id="recommended-participation">{lang === "en" ? "Choose the next step that fits your goal." : "按你的目標選擇下一步。"}</h2>
          <p>{lang === "en" ? "These suggestions use only the page you are viewing—not private behaviour or hidden profile data." : "這些建議只根據你正在瀏覽的頁面，不會使用私人行為或隱藏專頁資料。"}</p>
        </div>
        <ContentCards lang={lang} section={{ id: "recommendations", eyebrow: L("", ""), title: L("", ""), copy: L("", ""), items }} />
      </div>
    </section>
  );
}

function ClosingBand({ lang, close }: { lang: Language; close: PageSpec["close"] }) {
  return (
    <section className="inner-closing">
      <div className="shell inner-closing-grid">
        <div><p className="eyebrow light">{lang === "en" ? "Take the next step" : "採取下一步"}</p><h2>{tx(close.title, lang)}</h2><p>{tx(close.copy, lang)}</p></div>
        <div className="inner-closing-actions">
          {close.actions.map((action, index) => <a className={index === 0 ? "button button-light" : "text-link light-link"} href={hrefFor(lang, action.path)} key={action.label.en}>{tx(action.label, lang)} <Arrow /></a>)}
        </div>
      </div>
    </section>
  );
}

type PracticalGuide = {
  title: LocalText;
  copy: LocalText;
  steps: Item[];
};

const practicalGuides: Record<"adoption" | "community" | "membership" | "gba" | "governance", PracticalGuide> = {
  adoption: {
    title: L("A practical route from AI question to action.", "由 AI 問題走向實際行動。"),
    copy: L("Use this route to turn broad interest into a defined challenge, a suitable activity and an accountable next step.", "沿着這條路徑，把廣泛興趣轉化為明確挑戰、合適活動及具負責人的下一步。"),
    steps: [
      item("Define the challenge", "界定挑戰", "Describe the workflow, customer need or industry problem you want to improve.", "說明你希望改善的工作流程、客戶需要或產業問題。"),
      item("Check readiness", "檢視準備度", "Consider data, systems, people, risk and the operational limits around the work.", "考慮數據、系統、人員、風險及工作上的實際限制。"),
      item("Choose a route", "選擇路徑", "Use a clinic, council, buyer challenge, programme or solution search when relevant.", "按需要選擇診所、委員會、買家挑戰、計劃或方案搜尋。"),
      item("Agree the next action", "確認下一步", "Name an owner, a useful outcome and the next decision before moving forward.", "推進前先確認負責人、有用成果及下一個決定。"),
    ],
  },
  community: {
    title: L("Make participation useful before, during and after.", "令每次參與在活動前、中、後都有價值。"),
    copy: L("A good event is more than attendance. It should help the right people prepare, connect and continue the work.", "好活動不只計算出席人數，更要讓合適的人做好準備、建立連結並延續工作。"),
    steps: [
      item("Choose for relevance", "按相關性選擇", "Check the audience, purpose, format and expected value before joining.", "參加前先了解受眾、目的、形式及預期價值。"),
      item("Prepare useful context", "準備有用資料", "Bring a concise question, challenge, capability or market objective.", "準備簡潔問題、挑戰、能力或市場目標。"),
      item("Connect with purpose", "有目的地連結", "Use sessions and introductions to explore a defined topic—not generic networking.", "透過場次及引薦探索明確議題，而不是泛泛交流。"),
      item("Follow through", "持續跟進", "Record useful resources, agreed introductions and the next action after the event.", "活動後記錄有用資源、已同意引薦及下一步行動。"),
    ],
  },
  membership: {
    title: L("Turn membership into an active pathway.", "把會籍轉化為持續參與路徑。"),
    copy: L("The value starts with a clear profile and grows through relevant activities, contribution and consent-based introductions.", "價值由清晰專頁開始，並透過相關活動、貢獻及經同意引薦持續累積。"),
    steps: [
      item("Choose the right membership", "選擇合適會籍", "Match the plan to your organisation, professional role and intended participation.", "按你的機構、專業角色及參與方式選擇計劃。"),
      item("Build a useful profile", "建立有用專頁", "State your expertise, industries, markets and what you want to contribute or find.", "列明專長、產業、市場，以及你希望貢獻或尋找甚麼。"),
      item("Select your interests", "選擇關注範疇", "Follow the councils, activities, programmes and markets that matter to you.", "關注與你相關的委員會、活動、計劃及市場。"),
      item("Connect with consent", "經同意建立連結", "Use a clear purpose and mutual consent for any requested introduction.", "任何引薦均以清晰目的及雙方同意為基礎。"),
    ],
  },
  gba: {
    title: L("Move from market interest to informed entry.", "由市場興趣走向有準備的市場進入。"),
    copy: L("Market access works best when the objective, readiness, partner type and post-visit follow-up are clear from the start.", "市場拓展要有效，應由一開始釐清目標、準備度、夥伴類型及訪問後跟進。"),
    steps: [
      item("Define the market goal", "界定市場目標", "Clarify the city, sector, customer and commercial outcome you want to explore.", "釐清希望探索的城市、產業、客戶及商業成果。"),
      item("Review readiness", "檢視準備度", "Check proposition, localisation, compliance, capacity and decision ownership.", "檢查定位、本地化、合規、承接能力及決策責任。"),
      item("Identify relevant partners", "辨識相關夥伴", "Focus on the local capability, buyer or ecosystem relationship the objective requires.", "聚焦目標所需的本地能力、買家或生態關係。"),
      item("Plan the follow-through", "規劃後續行動", "Set owners, timing and next decisions before the delegation or meeting ends.", "在考察或會面結束前確認負責人、時間及下一個決定。"),
    ],
  },
  governance: {
    title: L("Build trust through clear decisions and evidence.", "以清晰決定及證據建立信任。"),
    copy: L("Responsible use is practical work: state the purpose, use appropriate evidence, keep people in control and provide a correction route.", "負責任應用是實務工作：說明目的、採用合適證據、保留人的決定權，並提供更正途徑。"),
    steps: [
      item("State the purpose", "說明目的", "Explain what the system or programme is intended to help people do.", "解釋系統或計劃希望協助使用者完成甚麼。"),
      item("Use appropriate evidence", "採用合適證據", "Separate verified facts, professional judgement and recommendations.", "清楚區分已核實事實、專業判斷及建議。"),
      item("Keep human oversight", "保留人員監督", "Route sensitive, uncertain or high-impact decisions to an accountable person.", "把敏感、不確定或高影響決定交由具問責的人員處理。"),
      item("Review and correct", "檢視及更正", "Track usefulness and provide a clear way to question, correct or remove information.", "追蹤實用性，並提供清晰途徑讓使用者提出疑問、更正或移除資料。"),
    ],
  },
};

function guideForVisual(visual: SiteVisual): PracticalGuide {
  if (visual === siteVisuals.community) return practicalGuides.community;
  if (visual === siteVisuals.membership) return practicalGuides.membership;
  if (visual === siteVisuals.gba) return practicalGuides.gba;
  if (visual === siteVisuals.governance) return practicalGuides.governance;
  return practicalGuides.adoption;
}

function PracticalGuideSection({ lang, visual }: { lang: Language; visual: SiteVisual }) {
  const guide = guideForVisual(visual);
  return (
    <section className="page-practical" aria-labelledby="page-practical-title">
      <div className="shell">
        <div className="page-practical-heading">
          <p className="eyebrow">{lang === "en" ? "How to use this pathway" : "如何使用這條路徑"}</p>
          <h2 id="page-practical-title">{tx(guide.title, lang)}</h2>
          <p>{tx(guide.copy, lang)}</p>
        </div>
        <ol className="page-practical-steps">
          {guide.steps.map((step, index) => (
            <li key={step.title.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{tx(step.title, lang)}</h3>
              <p>{tx(step.copy, lang)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EditorialEvidence({ lang, visual }: { lang: Language; visual: SiteVisual }) {
  const content = visual === siteVisuals.gba ? {
    image: "/archive/asia-smart-summit.webp",
    alt: L("Industry guests and organisers at the Asia Smart Innovation Awards Summit 2025", "產業嘉賓及主辦團隊出席亞洲智慧創新大獎峰會 2025"),
    label: L("Regional participation", "區域參與"),
    title: L("Market access grows through prepared, relevant relationships.", "市場拓展建基於充分準備及相關關係。"),
    copy: L("The 2025 Asia Smart Innovation Awards programme included participants from 17 Asian regions. This programme fact provides context; it is not presented as a current partnership or market-entry outcome.", "2025 亞洲智慧創新大獎計劃包括來自亞洲 17 個地區的參加者。這項計劃事實只提供脈絡，並不代表現行合作或市場進入成果。"),
  } : visual === siteVisuals.governance ? {
    image: "/archive/tech-connect-community.webp",
    alt: L("Audience at an in-person WTIA Tech Connect community session", "WTIA Tech Connect 實體社群活動的現場觀眾"),
    label: L("Human-centred practice", "以人為本的實踐"),
    title: L("Trust becomes visible in how people participate.", "信任體現在人們如何參與。"),
    copy: L("Clear sources, current status, accessible participation and human accountability turn broad technology ideas into a more useful public platform.", "清晰來源、現行狀態、無障礙參與及人的問責，把宏觀科技理念轉化為更有用的公共平台。"),
  } : visual === siteVisuals.membership ? {
    image: "/archive/asia-smart-kickoff.webp",
    alt: L("Organisers and partners launching the Asia Smart Innovation Awards 2025", "主辦團隊及夥伴啟動亞洲智慧創新大獎 2025"),
    label: L("Participation in context", "有脈絡的參與"),
    title: L("Membership is a route into useful action.", "會籍是通往有用行動的路徑。"),
    copy: L("Profiles, activities, programmes and introductions create value only when their status, permissions and next steps are clear.", "專頁、活動、計劃及引薦只有在狀態、權限及下一步清晰時，才能創造價值。"),
  } : visual === siteVisuals.community ? {
    image: "/archive/smart-innovation-genai.webp",
    alt: L("Official WTIA event visual for Smart Innovation Meets GenAI", "Smart Innovation Meets GenAI 的 WTIA 官方活動視覺"),
    label: L("Real event record", "真實活動紀錄"),
    title: L("Useful activity stays useful after the date.", "有用活動在日期過後仍然有價值。"),
    copy: L("Completed 2025 records retain their original date, venue and WTIA source while visitors continue into current activity pathways.", "2025 已完成紀錄保留原日期、場地及 WTIA 來源，訪客亦可繼續探索現行參與路徑。"),
  } : {
    image: "/archive/tech-connect-community.webp",
    alt: L("Audience and speaker during a WTIA Tech Connect community seminar", "WTIA Tech Connect 社群研討會上的觀眾與講者"),
    label: L("From discussion to action", "由討論走向行動"),
    title: L("Technology becomes useful through people and context.", "科技透過人與脈絡變得有用。"),
    copy: L("WiseTech connects a practical question to relevant knowledge, activity and an accountable next step—without turning participation into an unsupported outcome claim.", "WiseTech 把實務問題連接相關知識、活動及具問責的下一步，同時不把參與誤寫成未有證據支持的成果。"),
  };
  return <section className="editorial-evidence"><div className="shell editorial-evidence-grid"><figure><img src={content.image} alt={tx(content.alt, lang)} loading="lazy" decoding="async" /></figure><div><p className="eyebrow light">{tx(content.label, lang)}</p><h2>{tx(content.title, lang)}</h2><p>{tx(content.copy, lang)}</p><small>{lang === "en" ? "WTIA activity photography · context reviewed 25 August 2026" : "WTIA 活動相片 · 脈絡最後檢視：2026 年 8 月 25 日"}</small></div></div></section>;
}

function ContentPage({ lang, spec, visual = siteVisuals.adoption }: { lang: Language; spec: PageSpec; visual?: SiteVisual }) {
  return <>
    <InnerHero lang={lang} spec={spec} visual={visual} />
    <PracticalGuideSection lang={lang} visual={visual} />
    <EditorialEvidence lang={lang} visual={visual} />
    {spec.sections.map((section, index) => (
      <section className={`section inner-section${index % 2 ? " inner-section-tint" : ""}`} id={section.id} key={section.id}>
        <div className="shell">
          <div className="inner-section-heading">
            <p className="eyebrow">{tx(section.eyebrow, lang)}</p>
            <h2>{tx(section.title, lang)}</h2>
            <p>{tx(section.copy, lang)}</p>
          </div>
          <ContentCards lang={lang} section={section} />
          {section.honestEmpty && <HonestAvailability lang={lang} copy={section.honestEmpty} />}
        </div>
      </section>
    ))}
    {spec.recommendations && <Recommendations lang={lang} items={spec.recommendations} />}
    <ClosingBand lang={lang} close={spec.close} />
  </>;
}

const whySpec: PageSpec = {
  eyebrow: L("Why WiseTech", "為何 WiseTech"),
  title: L("Technology moves fast. Wise progress moves together.", "科技發展迅速，明智進步源於同行。"),
  copy: L(
    "WiseTech connects industry knowledge, trusted technology, practical implementation and regional opportunity so AI progress creates value for people and organisations.",
    "WiseTech 連結產業知識、可信科技、實務落地及區域機遇，讓 AI 進步為人與機構創造真正價值。",
  ),
  primary: { label: L("Explore the AI+ ecosystem", "探索 AI+ 生態系統"), path: "ai-plus" },
  secondary: { label: L("Join WiseTech", "加入 WiseTech"), path: "join" },
  sections: [
    {
      id: "vision",
      eyebrow: L("The opportunity", "當前機遇"),
      title: L("Hong Kong does not need more AI conversation. It needs more trusted adoption.", "香港需要的不只是更多 AI 討論，而是更多可信應用。"),
      copy: L("The Association brings demand, capability, evidence and follow-through into the same ecosystem—helping organisations move from interest to a clear next action.", "商會把需求、能力、證據及跟進放在同一個生態系統，協助機構由興趣走向清晰行動。"),
      items: [
        item("Industry demand", "產業需求", "Start with a real operating or market problem.", "由真實營運或市場問題開始。"),
        item("Trusted capability", "可信能力", "Make relevant technology and expertise easier to discover.", "讓合適科技與專長更容易被發現。"),
        item("Practical implementation", "實務落地", "Create routes for testing, adoption and structured follow-through.", "建立測試、應用及有系統跟進的路徑。"),
        item("Regional opportunity", "區域機遇", "Connect Hong Kong strengths with GBA and international markets.", "把香港優勢連接大灣區及國際市場。"),
      ],
    },
    {
      id: "impact",
      eyebrow: L("Our impact model", "我們的影響模式"),
      title: L("Five stages from possibility to progress.", "由可能走到進步的五個階段。"),
      copy: L("Each stage needs a defined owner, next action and evidence of movement—not only attendance or reach.", "每個階段都需要清晰負責人、下一步及進展證據，而不只計算出席或觸及。"),
      ordered: true,
      items: [
        item("Discover", "發現", "Clarify the challenge, need or market objective.", "釐清挑戰、需要或市場目標。"),
        item("Connect", "連接", "Bring together relevant people, knowledge and capability.", "匯聚相關人才、知識及能力。"),
        item("Test", "測試", "Compare approaches and shape a practical pilot.", "比較方案並設計可行試點。"),
        item("Adopt", "應用", "Support implementation, governance and organisational readiness.", "支援落地、管治及組織準備。"),
        item("Scale", "擴展", "Track outcomes, market access and repeatable value.", "追蹤成果、市場拓展及可複製價值。"),
      ],
    },
    {
      id: "model",
      eyebrow: L("Technology + Wisdom", "科技 + 智慧"),
      title: L("Capability needs direction.", "能力需要方向。"),
      copy: L("Technology expands what is possible; wisdom guides what is useful, responsible and worth sustaining.", "科技擴大可能；智慧則引導甚麼真正有用、負責任並值得持續。"),
      items: [
        item("Human judgement", "人的判斷", "People remain accountable for goals, trade-offs and decisions.", "人仍須為目標、取捨與決定負責。"),
        item("Responsible adoption", "負責任應用", "Privacy, security, governance and transparency are designed in.", "從設計加入私隱、安全、管治及透明度。"),
        item("Industry relevance", "產業相關性", "Solutions are considered in the context of real work and constraints.", "在真實工作與限制脈絡下評估方案。"),
        item("Measurable impact", "可量度影響", "Progress is linked to defined outcomes and reporting periods.", "把進展連繫明確成果與報告期。"),
      ],
    },
    {
      id: "connect",
      eyebrow: L("Choose your pathway", "選擇你的路徑"),
      title: L("Different ambitions need different routes.", "不同目標需要不同路徑。"),
      copy: L("Start with what you want to accomplish and move into the relevant people, activities and support.", "由你希望達成的成果出發，連接相關人才、活動及支援。"),
      items: [
        item("Corporates", "企業", "Source capability and turn defined challenges into tested initiatives.", "尋找能力，把明確挑戰轉化為試驗項目。", "for-corporates"),
        item("SMEs", "中小企", "Find a practical first use case and build a 90-day action plan.", "尋找首個實務用例並建立 90 天行動計劃。", "for-smes"),
        item("Startups", "初創企業", "Build buyer confidence, visibility and market readiness.", "建立買家信心、曝光及市場準備度。", "for-startups"),
        item("Professionals", "專業人士", "Learn, contribute, mentor and shape industry practice.", "學習、貢獻、擔任導師並塑造產業實務。", "for-professionals"),
        item("GBA & Global", "大灣區及國際夥伴", "Enter Hong Kong through a trusted technology network.", "透過可信科技網絡進入香港。", "for-gba-global"),
      ],
    },
    {
      id: "mission",
      eyebrow: L("Two-year AI+ mission", "兩年 AI+ 使命"),
      title: L("Build the adoption infrastructure behind the headlines.", "建立新聞標題背後的應用基建。"),
      copy: L("The strategic direction prioritises industry councils, adoption pathways, capability building, trusted market access and outcome reporting. Targets publish only after governance approval.", "策略方向聚焦產業委員會、應用路徑、能力建設、可信市場拓展及成果報告；目標只會在管治審批後公布。"),
      honestEmpty: L("Current verified activities will appear here once their owner, date, eligibility and registration state are approved.", "現行活動在負責人、日期、資格及報名狀態獲批後，才會在此顯示。"),
    },
  ],
  close: {
    title: L("Join the network building Hong Kong’s AI+ future.", "加入建設香港 AI+ 未來的網絡。"),
    copy: L("Participate as a member, attend a useful activity or build a trusted partnership.", "以會員身份參與、出席實用活動，或建立可信夥伴關係。"),
    actions: [
      { label: L("Join WiseTech", "加入 WiseTech"), path: "join" },
      { label: L("Events & Activities", "活動與參與"), path: "events" },
      { label: L("Become a partner", "成為夥伴"), path: "partner-with-us" },
    ],
  },
};

const aiPlusSpec: PageSpec = {
  eyebrow: L("AI+ Industries", "AI+ 產業"),
  title: L("AI becomes valuable when it meets a real industry problem.", "當 AI 回應真實產業問題，才會創造價值。"),
  copy: L("Six focused councils connect business demand with relevant capability, responsible adoption and practical next steps.", "六個聚焦產業的委員會，把商業需求與相關能力、負責任應用及實務下一步連接起來。"),
  primary: { label: L("Find your industry", "尋找你的產業"), path: "ai-plus#councils" },
  secondary: { label: L("Join an AI+ activity", "參加 AI+ 活動"), path: "activities" },
  sections: [
    {
      id: "councils",
      eyebrow: L("Six industry councils", "六個產業委員會"),
      title: L("Focus expertise where adoption happens.", "把專長聚焦到真正應用場景。"),
      copy: L("Each council is designed to define priority challenges, useful solution categories, practical activities and publishable outputs. Current members or meetings appear only after approval.", "每個委員會均旨在釐清優先挑戰、相關方案類別、實務活動及可發布成果；現任成員或會議只會在審批後顯示。"),
      items: [
        item("Commerce + Professional Services", "商貿 + 專業服務", "Client delivery, knowledge work, reporting and trusted automation.", "客戶服務、知識工作、報告及可信自動化。", "ai-plus/commerce-professional-services"),
        item("Manufacturing + Robotics", "製造 + 機械人", "Operations, quality, maintenance, logistics and robotics adoption.", "營運、品質、維護、物流及機械人應用。", "ai-plus/manufacturing-robotics"),
        item("Health + Life Sciences", "健康 + 生命科學", "Evidence, workflow, privacy and human-centred care.", "實證、流程、私隱及以人為本的照護。", "ai-plus/health-life-sciences"),
        item("Retail + Creative Industries", "零售 + 創意產業", "Customer experience, content, commerce and new business models.", "顧客體驗、內容、商貿及新商業模式。", "ai-plus/retail-creative-industries"),
        item("Education + Future of Work", "教育 + 未來工作", "Skills, productivity, assessment and workforce transition.", "技能、生產力、評估及人才轉型。", "ai-plus/education-future-of-work"),
        item("Responsible AI + Data + Cyber", "負責任 AI + 數據 + 網絡安全", "Governance, privacy, security, resilience and accountable adoption.", "管治、私隱、安全、韌性及問責應用。", "ai-plus/responsible-ai-data-cybersecurity"),
      ],
    },
    {
      id: "readiness",
      eyebrow: L("Three ways to start", "三種起步方式"),
      title: L("Begin with your real need.", "從你的真實需要開始。"),
      copy: L("A clear starting point makes discovery and follow-through more useful.", "清晰起點讓發掘及跟進更有用。"),
      items: [
        item("I have a business challenge", "我有業務挑戰", "Define the problem, context, constraints and desired improvement.", "釐清問題、脈絡、限制及期望改善。", "activities/buyer-days"),
        item("I offer an AI solution", "我提供 AI 方案", "Structure evidence, deployment information and buyer-ready positioning.", "整理證據、部署資料及買家導向定位。", "solutions#publish"),
        item("I need capability", "我需要建立能力", "Choose a clinic, briefing, workshop, course or approved certification route.", "選擇診所、簡報、工作坊、課程或已批准認證路徑。", "activities/training"),
      ],
    },
    {
      id: "opportunities",
      eyebrow: L("Open opportunities", "開放機會"),
      title: L("One place for useful ways to participate.", "集中尋找有用參與方式。"),
      copy: L("Buyer briefs, council seats, clinics, research calls, speaking opportunities and applications require a verified owner, deadline and eligibility rule before publication.", "買家簡報、委員會席位、診所、研究徵集、講者及申請機會，均須先核實負責人、截止日期及資格。"),
      honestEmpty: L("No reviewed open AI+ opportunity is currently published. Register interest by audience and industry to hear when a relevant route is approved.", "目前未有已審核的開放 AI+ 機會；可按受眾及產業登記興趣，待相關路徑獲批後接收通知。"),
    },
    {
      id: "responsible",
      eyebrow: L("Responsible adoption", "負責任應用"),
      title: L("Useful AI must also be governable.", "有用的 AI 也必須可管治。"),
      copy: L("Every adoption pathway should make ownership, data use, human oversight, security, evidence and monitoring visible.", "每條應用路徑均應清楚交代責任、數據用途、人為監督、安全、證據及監察。"),
      items: [
        item("Purpose", "目的", "Define the intended outcome and who may be affected.", "界定預期成果及可能受影響人士。"),
        item("Data", "數據", "Confirm permission, quality, minimisation and retention.", "確認權限、質素、最少化及保留安排。"),
        item("Human oversight", "人為監督", "Keep accountable people in consequential decisions.", "在重要決定中保留具問責的人為監督。"),
        item("Security", "安全", "Assess access, suppliers, failure modes and resilience.", "評估存取、供應商、失效模式及韌性。"),
        item("Evidence", "證據", "Test performance against the actual use case and constraints.", "按真實用例及限制測試表現。"),
        item("Monitoring", "監察", "Track outcomes, incidents and changing risk after launch.", "推出後追蹤成果、事故及風險變化。"),
      ],
    },
  ],
  close: {
    title: L("Choose the route that moves your AI work forward.", "選擇推進 AI 工作的路徑。"),
    copy: L("Start with a challenge, a solution or a council contribution.", "由挑戰、方案或委員會貢獻開始。"),
    actions: [
      { label: L("Submit a challenge", "提交挑戰"), path: "submit-challenge" },
      { label: L("Find a solution", "尋找方案"), path: "solutions" },
      { label: L("Join a council", "加入委員會"), path: "activities/industry-councils" },
    ],
  },
};

const audienceSpecs: Record<string, PageSpec> = {
  "for-corporates": {
    eyebrow: L("For Corporates", "企業路徑"),
    title: L("Turn business challenges into tested AI initiatives.", "把業務挑戰轉化為經測試的 AI 項目。"),
    copy: L("WiseTech helps corporate teams define needs, discover relevant capability, structure fair conversations and move toward practical pilots.", "WiseTech 協助企業團隊釐清需求、發掘相關能力、建立公平對話，並走向實務試點。"),
    primary: { label: L("Submit a corporate challenge", "提交企業挑戰"), path: "submit-challenge" },
    secondary: { label: L("Explore Buyer Days", "探索企業買家日"), path: "activities/buyer-days" },
    sections: [
      { id: "benefits", eyebrow: L("What you gain", "你可獲得"), title: L("A clearer route from demand to decision.", "由需求走向決策的更清晰路徑。"), copy: L("Support is organised around the problem, relevant evidence and an accountable next step.", "支援圍繞問題、相關證據及具問責的下一步。"), items: [
        item("Challenge definition", "挑戰釐清", "Turn a broad ambition into a concise, reviewable brief.", "把宏觀願景轉化為可審閱的簡潔簡報。"),
        item("Curated solution discovery", "策展式方案發掘", "Identify relevant categories and approved provider profiles.", "辨識相關類別及已批准供應商專頁。"),
        item("Buyer Days", "企業買家日", "Create structured conversations around verified needs.", "圍繞已核實需求建立有結構的對話。"),
        item("Executive briefings", "高層簡報", "Compare opportunity, risk and organisational implications.", "比較機會、風險及組織影響。"),
        item("Industry councils", "產業委員會", "Shape shared priorities and practical outputs.", "共同塑造優先事項及實務成果。"),
        item("Responsible AI support", "負責任 AI 支援", "Make governance and human oversight part of adoption.", "把管治及人為監督融入應用。"),
        item("Pilot pathways", "試點路徑", "Structure next steps without overstating readiness.", "在不誇大準備度下建立下一步。"),
        item("GBA market access", "大灣區市場拓展", "Prepare for relevant regional introductions and missions.", "為相關區域引薦及考察作準備。"),
      ] },
      { id: "process", eyebrow: L("How it works", "運作方式"), title: L("Six steps from challenge to evidence.", "由挑戰走向證據的六步。"), copy: L("Every stage clarifies who decides what happens next.", "每個階段都清楚界定誰決定下一步。"), ordered: true, items: [
        item("Submit", "提交", "Describe the business problem, context and desired improvement.", "描述業務問題、脈絡及期望改善。"),
        item("Review", "審閱", "Confirm scope, confidentiality and participation criteria.", "確認範圍、保密及參與準則。"),
        item("Discover", "發掘", "Identify relevant solution categories and providers.", "辨識相關方案類別及供應商。"),
        item("Compare", "比較", "Use a structured brief and consistent meeting format.", "採用結構化簡報及一致會面形式。"),
        item("Pilot", "試點", "Agree on ownership, evidence, governance and timeframe.", "協定責任、證據、管治及時間表。"),
        item("Review outcomes", "檢視成果", "Decide whether to stop, adapt, adopt or scale.", "決定停止、調整、應用或擴展。"),
      ] },
    ],
    recommendations: [
      item("Corporate Buyer Days", "企業買家日", "Meet relevant providers around a defined need.", "圍繞明確需要與相關供應商會面。", "activities/buyer-days"),
      item("Executive briefings", "高層簡報", "Build shared understanding before committing resources.", "在投入資源前建立共同理解。", "activities/training"),
      item("GBA Gateway", "大灣區通道", "Prepare a market objective before partner matching.", "在夥伴配對前準備市場目標。", "gba"),
    ],
    close: { title: L("Bring one defined challenge to the ecosystem.", "把一個明確挑戰帶進生態系統。"), copy: L("The team can review fit, confidentiality and the most useful participation route.", "團隊可審閱配合度、保密及最有用參與路徑。"), actions: [{ label: L("Submit a corporate challenge", "提交企業挑戰"), path: "submit-challenge" }, { label: L("Explore AI+ industries", "探索 AI+ 產業"), path: "ai-plus" }] },
  },
  "for-smes": {
    eyebrow: L("For SMEs", "中小企路徑"),
    title: L("Practical AI. Clear next steps. Trusted support.", "實用 AI、清晰下一步、可信支援。"),
    copy: L("Start with a useful business problem, understand readiness and build a focused 90-day action plan.", "由有用的業務問題開始，了解準備度，並建立聚焦的 90 天行動計劃。"),
    primary: { label: L("Register interest in an AI Clinic", "登記 AI 診所興趣"), path: "activities/ai-clinics#interest" },
    secondary: { label: L("Explore SME membership", "探索中小企會籍"), path: "membership#smes" },
    sections: [
      { id: "benefits", eyebrow: L("Practical support", "實務支援"), title: L("Start small enough to learn—and useful enough to matter.", "從足以學習的小步開始，同時創造實際價值。"), copy: L("Support covers readiness, discovery, learning, introductions and market opportunity.", "支援涵蓋準備度、發掘、學習、引薦及市場機遇。"), items: [
        item("Readiness assessment", "準備度評估", "Understand goals, data, systems, people and constraints.", "了解目標、數據、系統、人員及限制。"),
        item("SME clinics", "中小企診所", "Clarify one use case and a practical next step.", "釐清一個用例及實務下一步。"),
        item("Trusted solution discovery", "可信方案發掘", "Compare relevant categories and approved profiles.", "比較相關類別及已批准專頁。"),
        item("Practical workshops", "實務工作坊", "Build skills around work people actually do.", "圍繞真實工作建立技能。"),
        item("Funding and market guidance", "資助及市場指引", "Use only current, verified programme information.", "只採用現行及已核實計劃資料。"),
        item("Introductions", "引薦", "Request consent-based connections with a clear purpose.", "按清晰目的申請需經同意的連結。"),
        item("Buyer and partner access", "買家及夥伴拓展", "Prepare before entering curated conversations.", "在進入策展式對話前做好準備。"),
        item("GBA opportunities", "大灣區機遇", "Assess readiness before pursuing regional activity.", "在參與區域活動前評估準備度。"),
      ] },
      { id: "problems", eyebrow: L("Start with the business problem", "從業務問題開始"), title: L("Where could work become clearer or more effective?", "哪些工作可變得更清晰或有效？"), copy: L("Common starting points help frame a conversation; they do not assume AI is always the answer.", "常見起點有助建立對話，但不假設 AI 永遠是答案。"), items: ["Customer service|客戶服務", "Sales and lead management|銷售及潛在客戶管理", "Marketing and content|市場推廣及內容", "Internal knowledge|內部知識", "Reporting|報告", "Operations|營運", "Finance and administration|財務及行政", "Talent and training|人才及培訓"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Define the current process, friction and desired improvement.", "界定現行流程、阻力及期望改善。"); }) },
      { id: "first-90-days", eyebrow: L("Your first 90 days", "首 90 天"), title: L("A practical sequence for learning and action.", "兼顧學習與行動的實務次序。"), copy: L("Timing depends on readiness and capacity; this is a pathway, not a promise of results.", "實際時間取決於準備度及能力；這是路徑，不是成果承諾。"), ordered: true, items: [
        item("Complete readiness assessment", "完成準備度評估", "Clarify goal, systems, data and ownership.", "釐清目標、系統、數據及責任。"),
        item("Attend an AI Clinic", "參加 AI 診所", "Bring one business problem for structured discussion.", "帶同一個業務問題進行結構化討論。"),
        item("Meet relevant providers", "會見相關供應商", "Use an approved, consent-based introduction route.", "採用已批准及需經同意的引薦路徑。"),
        item("Select one use case", "選擇一個用例", "Prioritise usefulness, feasibility and manageable risk.", "優先考慮實用性、可行性及可控風險。"),
        item("Develop an action plan", "制定行動計劃", "Define evidence, people, controls and the next review.", "界定證據、人員、管控及下次檢視。"),
        item("Review progress", "檢視進展", "Decide what to stop, adapt or continue.", "決定停止、調整或繼續。"),
      ] },
    ],
    recommendations: [item("AI Clinics", "AI 診所", "Bring one challenge and leave with clearer next steps.", "帶同一個挑戰，離開時獲得更清晰下一步。", "activities/ai-clinics"), item("SME learning", "中小企學習", "Choose practical workshops based on real work.", "按真實工作選擇實務工作坊。", "activities/training"), item("Find solutions", "尋找方案", "Search by business problem, maturity and deployment.", "按業務問題、成熟度及部署搜尋。", "solutions")],
    close: { title: L("Bring one business problem.", "帶來一個業務問題。"), copy: L("No current clinic date is implied; register interest for the next approved session.", "本頁不暗示現有診所日期；可登記興趣，接收下一場已批准場次。"), actions: [{ label: L("Register clinic interest", "登記診所興趣"), path: "activities/ai-clinics#interest" }, { label: L("Compare membership", "比較會籍"), path: "membership" }] },
  },
  "for-startups": {
    eyebrow: L("For Startups", "初創企業路徑"),
    title: L("Move from product promise to buyer confidence.", "由產品承諾走向買家信心。"),
    copy: L("Demonstrate real value, meet qualified buyers, improve market readiness and build regional connections.", "展示真實價值、接觸合適買家、提升市場準備度並建立區域連結。"),
    primary: { label: L("Publish your solution", "刊登你的方案"), path: "solutions#publish" },
    secondary: { label: L("Explore startup membership", "探索初創會籍"), path: "membership#startups" },
    sections: [
      { id: "benefits", eyebrow: L("Build opportunity", "建立機會"), title: L("Visibility works best when it is structured and credible.", "結構清晰、具可信度的曝光最有價值。"), copy: L("The platform supports approved profiles, buyer conversations, programmes, mentors and market access.", "平台支援已批准專頁、買家對話、計劃、導師及市場拓展。"), items: [
        item("Verified solution profile", "已核實方案專頁", "Present buyer-friendly capability and deployment information.", "以買家易用方式呈現能力及部署資料。"),
        item("Corporate Buyer Days", "企業買家日", "Respond to defined needs through a structured process.", "透過結構化流程回應明確需求。"),
        item("Demo Days", "展示日", "Show a product when a reviewed activity is available.", "在活動獲審核後展示產品。"),
        item("Awards and programmes", "獎項及計劃", "Use current eligibility and edition status only.", "只採用現行資格及屆次狀態。"),
        item("Mentors and investors", "導師及投資者", "Request relevant introductions without exposing private contacts.", "在不公開私人聯絡資料下申請相關引薦。"),
        item("Case studies", "案例研究", "Publish evidence only with organisation approval.", "只在機構批准後發布成果證據。"),
        item("GBA landing partners", "大灣區落地夥伴", "Prepare market objectives before matching.", "在配對前準備市場目標。"),
        item("Badges", "標章", "Use programme and deployment badges only with defined evidence.", "計劃及部署標章只在具明確證據下使用。"),
      ] },
      { id: "buyer-confidence", eyebrow: L("Build buyer confidence", "建立買家信心"), title: L("Make the proof easy to understand.", "讓證據易於理解。"), copy: L("A buyer-ready profile separates marketing claims from reviewed information.", "買家導向專頁會把市場聲稱與已審閱資料清楚分開。"), items: ["Business problem|業務問題", "Target industry|目標產業", "Product maturity|產品成熟度", "Deployment model|部署模式", "Security and data|安全及數據", "Implementation timeframe|落地時間", "Evidence and references|證據及參考", "Responsible AI controls|負責任 AI 管控"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Provide concise, reviewable information and mark anything not yet verified.", "提供簡潔、可審閱資料，並標示尚未核實內容。"); }) },
    ],
    recommendations: [item("Corporate Buyer Days", "企業買家日", "Prepare a concise response to a defined challenge.", "為明確挑戰準備簡潔回應。", "activities/buyer-days"), item("Programmes", "計劃", "Review approved editions, status and eligibility.", "檢視已批准屆次、狀態及資格。", "programmes"), item("GBA Delegations", "大灣區考察團", "Assess readiness before joining a mission.", "參加考察前先評估準備度。", "activities/gba-delegations")],
    close: { title: L("Show buyers what is ready—and what still needs proof.", "向買家清楚展示已準備與仍需證明的部分。"), copy: L("Publish a structured solution for Association review.", "提交結構化方案供商會審閱。"), actions: [{ label: L("Publish your solution", "刊登你的方案"), path: "solutions#publish" }, { label: L("Explore Buyer Days", "探索企業買家日"), path: "activities/buyer-days" }] },
  },
  "for-professionals": {
    eyebrow: L("For Professionals", "專業人士路徑"),
    title: L("Build the skills and relationships shaping Hong Kong’s AI economy.", "建立塑造香港 AI 經濟的技能與關係。"),
    copy: L("Join industry discussions, professional learning, mentorship and community activity across the WiseTech network.", "參與 WiseTech 網絡的產業討論、專業學習、導師及社群活動。"),
    primary: { label: L("Explore professional membership", "探索專業人士會籍"), path: "membership#professionals" },
    secondary: { label: L("View activities", "查看活動"), path: "activities" },
    sections: [
      { id: "benefits", eyebrow: L("Professional value", "專業價值"), title: L("Learn, contribute and connect with purpose.", "以明確目的學習、貢獻及連結。"), copy: L("Participation can include a professional profile, councils, learning, events, mentoring, speaking, volunteering and opportunity discovery.", "參與方式可包括專業專頁、委員會、學習、活動、導師、講者、義工及機會發掘。"), items: ["Professional member profile|專業會員專頁", "Industry councils|產業委員會", "Training and certification|培訓及認證", "Member event access|會員活動", "Mentoring|導師機會", "Speaking and volunteering|講者及義工", "Talent and project opportunities|人才及項目機會", "Cross-industry connections|跨產業連結"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Available through the relevant approved route and participation criteria.", "按相關已批准路徑及參與準則提供。"); }) },
      { id: "pathways", eyebrow: L("Participation pathways", "參與路徑"), title: L("Choose how you want to contribute.", "選擇你的貢獻方式。"), copy: L("The strongest professional network combines learning with useful contribution.", "最有價值的專業網絡把學習與實際貢獻結合。"), items: ["Learn|學習", "Contribute|貢獻", "Mentor|擔任導師", "Speak|擔任講者", "Volunteer|參與義工", "Connect|建立連結"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Select interests and visibility in your member profile.", "在會員專頁選擇興趣及可見度。"); }) },
    ],
    recommendations: [item("Industry Councils", "產業委員會", "Apply expertise to shared industry priorities.", "把專長應用於共同產業優先事項。", "activities/industry-councils"), item("Training", "培訓", "Choose a track you can apply at work.", "選擇可在工作應用的學習路徑。", "activities/training"), item("Mentoring & Volunteering", "導師及義工", "Register how you would like to contribute.", "登記你希望貢獻的方式。", "activities/mentoring-volunteering")],
    close: { title: L("Build capability and help others move forward.", "建立能力，並協助他人向前。"), copy: L("Professional membership provides a structured route into learning and contribution.", "專業人士會籍提供進入學習及貢獻的結構化路徑。"), actions: [{ label: L("Explore professional membership", "探索專業人士會籍"), path: "membership#professionals" }, { label: L("Join a council", "加入委員會"), path: "activities/industry-councils" }] },
  },
  "for-gba-global": {
    eyebrow: L("For GBA & Global Partners", "大灣區及國際夥伴路徑"),
    title: L("Enter Hong Kong through a trusted technology network.", "透過可信科技網絡進入香港。"),
    copy: L("Connect with Hong Kong companies, technology providers, industry programmes and market-entry opportunities through a purpose-led pathway.", "透過目標導向路徑，連接香港企業、科技供應商、產業計劃及市場進入機會。"),
    primary: { label: L("Discuss a market-access partnership", "洽談市場拓展合作"), path: "partner-with-us" },
    secondary: { label: L("Explore GBA Gateway", "探索大灣區通道"), path: "gba" },
    sections: [
      { id: "benefits", eyebrow: L("Market-access value", "市場拓展價值"), title: L("Move from first contact to useful local context.", "由初次接觸走向有用本地脈絡。"), copy: L("Every route starts with a market objective and readiness—not a promise of introductions or commercial results.", "每條路徑都由市場目標及準備度開始，而不是承諾引薦或商業成果。"), items: ["Hong Kong partner discovery|香港夥伴發掘", "Local buyer introductions|本地買家引薦", "Landing support|落地支援", "Delegations|考察團", "Joint events|聯合活動", "Technology sourcing|科技採購", "Programme collaboration|計劃合作", "Internationalisation support|國際化支援"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Provided when fit, consent, ownership and follow-up are clear.", "在配合度、同意、責任及跟進清晰時提供。"); }) },
    ],
    recommendations: [item("GBA Gateway", "大灣區通道", "Define your market objective and readiness.", "界定市場目標及準備度。", "gba"), item("GBA Delegations", "大灣區考察團", "Understand the full preparation-to-follow-up journey.", "了解由準備到跟進的完整旅程。", "activities/gba-delegations"), item("Member Directory", "會員名錄", "Discover approved public profiles without exposing private contacts.", "在不公開私人聯絡資料下探索已批准公開專頁。", "members")],
    close: { title: L("Start with the market outcome you want.", "先釐清你希望達成的市場成果。"), copy: L("The team can discuss readiness, partner type and a suitable collaboration route.", "團隊可洽談準備度、夥伴類型及合適合作路徑。"), actions: [{ label: L("Discuss a market-access partnership", "洽談市場拓展合作"), path: "partner-with-us" }, { label: L("Explore the Gateway", "探索大灣區通道"), path: "gba" }] },
  },
};

const activitiesOverviewSpec: PageSpec = {
  eyebrow: L("Activities", "參與活動"),
  title: L("Participation that continues between major events.", "讓參與延續於大型活動之間。"),
  copy: L("Join smaller, focused formats designed to turn discussion into learning, introductions and implementation.", "參與小型、聚焦的活動，把討論轉化為學習、引薦及落地。"),
  primary: { label: L("Find an activity", "尋找活動"), path: "events" },
  secondary: { label: L("Register interest", "登記興趣"), path: "events#interest" },
  sections: [
    { id: "formats", eyebrow: L("Activity types", "活動類型"), title: L("Choose the format that fits the work to be done.", "按需要完成的工作選擇活動形式。"), copy: L("Recurring formats have a defined purpose and expected outcome. A next date appears only after review.", "恆常活動有清晰目的及預期成果；下一個日期只會在審核後顯示。"), items: [
      item("AI Implementation Clinics", "AI 落地診所", "Clarify one use case and identify practical next steps.", "釐清一個用例並辨識實務下一步。", "activities/ai-clinics"),
      item("Corporate Buyer Days", "企業買家日", "Connect verified business needs with relevant member solutions.", "把已核實業務需求與相關會員方案連接。", "activities/buyer-days"),
      item("Industry Councils", "產業委員會", "Turn member expertise into shared priorities and outputs.", "把會員專長轉化為共同優先事項及成果。", "activities/industry-councils"),
      item("Training & Certification", "培訓及認證", "Build capability people can apply at work.", "建立可在工作應用的能力。", "activities/training"),
      item("GBA Delegations", "大灣區考察團", "Combine preparation, market intelligence, meetings and follow-up.", "結合準備、市場情報、會面及跟進。", "activities/gba-delegations"),
      item("Community Mixers", "社群聚會", "Create open or member-only relationship-building opportunities.", "建立公開或會員專屬的關係拓展機會。", "activities/community"),
      item("Mentoring & Volunteering", "導師及義工", "Contribute expertise and support emerging talent or programmes.", "貢獻專長並支援新興人才或計劃。", "activities/mentoring-volunteering"),
    ] },
    { id: "community", eyebrow: L("Community Mixers", "社群聚會"), title: L("Build relationships between major events.", "在大型活動之間持續建立關係。"), copy: L("Open and member-only gatherings should state their audience, purpose, format and registration status clearly before publication.", "公開及會員專屬聚會在發布前，應清楚列明受眾、目的、形式及報名狀態。"), items: [item("Open community", "公開社群", "Create an accessible first route into the ecosystem.", "建立容易參與的生態系統起點。", "activities/community"), item("Member connection", "會員連結", "Use consent and purpose for any suggested introduction.", "任何建議引薦均以同意及目的為本。", "request-introduction"), item("Topic-led gathering", "議題聚會", "Organise around a useful question rather than generic networking.", "圍繞有用問題，而不是泛泛交流。", "host-an-activity")] },
    { id: "contribute", eyebrow: L("Mentoring & Volunteering", "導師及義工"), title: L("Contribute experience where it can help.", "在能夠帶來幫助的地方貢獻經驗。"), copy: L("Members can register interests in mentoring, speaking, volunteering or programme support. Roles appear only with approved scope and expectations.", "會員可登記導師、講者、義工或計劃支援興趣；角色只會在範圍及期望獲批後顯示。"), items: [item("Mentor", "擔任導師", "Support emerging talent or programme participants.", "支援新興人才或計劃參加者。", "activities/mentoring-volunteering"), item("Speak", "擔任講者", "Propose practical expertise for a reviewed topic.", "為已審閱議題建議實務專長。", "host-an-activity"), item("Volunteer", "參與義工", "Support delivery through a clearly defined role.", "透過清晰界定角色支援執行。", "activities/mentoring-volunteering")] },
    { id: "availability", eyebrow: L("Next sessions", "下一場次"), title: L("Status must be useful and accurate.", "活動狀態必須有用並準確。"), copy: L("Activity records support purpose, audience, cadence, eligibility, next date, deadline, membership requirement, owner and expected outcome.", "活動紀錄支援目的、受眾、頻率、資格、下一日期、截止日、會籍要求、負責人及預期成果。"), honestEmpty: L("No reviewed next session is currently published. Register interest in a format so the team can share an approved opportunity when available.", "目前未有已審核下一場次；可按活動形式登記興趣，待機會獲批後由團隊通知。") },
  ],
  close: { title: L("Turn interest into useful participation.", "把興趣轉化為有用參與。"), copy: L("Choose an activity type or help shape the next topic.", "選擇活動類型，或協助塑造下一個議題。"), actions: [{ label: L("Browse events", "瀏覽活動"), path: "events" }, { label: L("Propose an activity", "建議活動"), path: "host-an-activity" }] },
};

const activitySpecs: Record<string, PageSpec> = {
  "activities/ai-clinics": {
    eyebrow: L("AI Implementation Clinics", "AI 落地診所"),
    title: L("Bring one business challenge. Leave with clearer next steps.", "帶來一個業務挑戰，帶走更清晰下一步。"),
    copy: L("Focused sessions for organisations exploring a practical AI opportunity—without assuming AI is always the answer.", "為探索實務 AI 機會的機構而設的聚焦場次，同時不假設 AI 永遠是答案。"),
    primary: { label: L("View clinic availability", "查看診所狀態"), path: "events?activity=clinic" },
    secondary: { label: L("Register interest", "登記興趣"), path: "activities/ai-clinics#interest" },
    sections: [
      { id: "who", eyebrow: L("Who should join", "適合對象"), title: L("For teams ready to clarify—not pitch.", "適合準備釐清問題，而不是推銷的團隊。"), copy: L("Clinics are designed for SMEs, corporate teams, organisations comparing approaches and members preparing an internal case.", "診所適合中小企、企業團隊、比較不同方法的機構，以及準備內部商業理據的會員。"), items: [
        item("SMEs", "中小企", "Identify a practical first use case.", "辨識首個實務用例。"),
        item("Corporate teams", "企業團隊", "Validate an opportunity before solution selection.", "在選擇方案前驗證機會。"),
        item("Comparing approaches", "比較方法的機構", "Understand trade-offs and readiness considerations.", "了解取捨及準備度考慮。"),
        item("Internal business cases", "內部商業理據", "Strengthen the problem statement and next-step logic.", "強化問題陳述及下一步邏輯。"),
      ] },
      { id: "prepare", eyebrow: L("What to bring", "需要準備"), title: L("Useful context makes the session useful.", "有用脈絡令場次更有用。"), copy: L("Do not share confidential data in an open form. The team can confirm a suitable route first.", "不要在公開表格分享機密資料；團隊可先確認合適路徑。"), items: ["One business problem|一個業務問題", "Current process|現行流程", "Desired improvement|期望改善", "Data or system context|數據或系統脈絡", "Operational constraints|營運限制"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Bring a concise description that can be discussed safely.", "準備可安全討論的簡潔描述。"); }) },
      { id: "outcomes", eyebrow: L("What participants receive", "參加者可獲得"), title: L("Clarity before commitment.", "在投入前先建立清晰。"), copy: L("Outputs depend on the challenge and available evidence; no deployment or commercial outcome is guaranteed.", "成果取決於挑戰及可用證據；不保證部署或商業成果。"), items: ["Clearer use-case definition|更清晰用例定義", "Initial readiness considerations|初步準備度考慮", "Relevant solution categories|相關方案類別", "Suggested next actions|建議下一步", "Potential introductions where appropriate|合適時的潛在引薦"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Recorded as a practical follow-up, subject to review and consent.", "記錄為實務跟進，並須審閱及同意。"); }) },
      { id: "interest", eyebrow: L("Availability", "活動狀態"), title: L("No current clinic date is implied.", "本頁不暗示現有診所日期。"), copy: L("A session becomes bookable only when date, facilitator, capacity, eligibility and registration state are approved.", "只有日期、主持人、名額、資格及報名狀態獲批後，場次才可預約。"), honestEmpty: L("Register interest and identify your audience and industry; the team can contact you when a relevant clinic is approved.", "登記興趣並選擇受眾及產業；相關診所獲批後，團隊可聯絡你。") },
    ],
    close: { title: L("Bring one challenge—not a full transformation plan.", "帶來一個挑戰，而不是完整轉型計劃。"), copy: L("Start by registering interest in the next approved clinic.", "先登記下一場已批准診所的興趣。"), actions: [{ label: L("Register clinic interest", "登記診所興趣"), path: "events#interest" }, { label: L("For SMEs", "中小企路徑"), path: "for-smes" }] },
  },
  "activities/buyer-days": {
    eyebrow: L("Corporate Buyer Days", "企業買家日"),
    title: L("Where verified business needs meet relevant technology.", "讓已核實業務需要遇上相關科技。"),
    copy: L("Structured conversations between organisations with defined challenges and members with potentially suitable solutions.", "在有明確挑戰的機構與可能具合適方案的會員之間，建立有結構的對話。"),
    primary: { label: L("Submit a buyer challenge", "提交買家挑戰"), path: "submit-challenge" },
    secondary: { label: L("Apply as a provider", "申請成為方案供應商"), path: "solutions#publish" },
    sections: [
      { id: "process", eyebrow: L("Curated process", "策展式流程"), title: L("A fair route from need to meeting.", "由需求走向會面的公平路徑。"), copy: L("Participation is based on fit and published criteria—not private access or payment for relevance.", "參與以配合度及已發布準則為基礎，而不是私人關係或付費排名。"), ordered: true, items: [
        item("Challenge submitted", "提交挑戰", "Buyer provides a concise problem and context.", "買家提供簡潔問題及脈絡。"),
        item("Requirements reviewed", "審閱需求", "Scope, confidentiality and criteria are clarified.", "釐清範圍、保密及準則。"),
        item("Providers identified", "辨識供應商", "Relevant approved profiles are considered.", "考慮相關已批准專頁。"),
        item("Concise responses", "簡潔回應", "Providers respond to the same core brief.", "供應商按同一核心簡報回應。"),
        item("Meetings curated", "策劃會面", "Conversations focus on fit, evidence and next steps.", "對話聚焦配合度、證據及下一步。"),
        item("Follow-up chosen", "選擇跟進", "Both sides decide whether and how to continue.", "雙方決定是否及如何繼續。"),
      ] },
      { id: "value", eyebrow: L("For both sides", "雙方價值"), title: L("Clear context improves the conversation.", "清晰脈絡改善對話。"), copy: L("Buyers reduce irrelevant outreach; providers understand the business context and participation rules.", "買家減少不相關推銷；供應商了解業務脈絡及參與規則。"), items: [
        item("For buyers", "買家", "Efficient discovery, curated selection, structured meetings and follow-up support.", "高效發掘、策展式篩選、結構化會面及跟進支援。"),
        item("For providers", "方案供應商", "Clear context, qualified conversations, consistent expectations and fair criteria.", "清晰脈絡、合適對話、一致期望及公平準則。"),
      ] },
    ],
    close: { title: L("Start on the side that matches your role.", "按你的角色選擇起點。"), copy: L("Submit a defined need or prepare a buyer-ready solution profile.", "提交明確需要，或準備買家導向方案專頁。"), actions: [{ label: L("Submit a buyer challenge", "提交買家挑戰"), path: "submit-challenge" }, { label: L("Publish a solution", "刊登方案"), path: "solutions#publish" }] },
  },
  "activities/industry-councils": {
    eyebrow: L("Industry Councils", "產業委員會"),
    title: L("Turn member expertise into collective industry action.", "把會員專長轉化為產業集體行動。"),
    copy: L("Domain leaders, technology providers, professionals and partners work around practical priorities with clear governance.", "產業領袖、科技供應商、專業人士及夥伴圍繞實務優先事項，在清晰管治下合作。"),
    primary: { label: L("Apply to join a council", "申請加入委員會"), path: "events#interest" },
    secondary: { label: L("Explore six industries", "探索六個產業"), path: "ai-plus" },
    sections: [
      { id: "outputs", eyebrow: L("Council outputs", "委員會成果"), title: L("Useful work that can move beyond the meeting room.", "讓有用工作走出會議室。"), copy: L("Outputs publish only after review, with ownership, evidence and audience clearly stated.", "成果只會在審閱後發布，並清楚列明責任、證據及受眾。"), items: ["Buyer and adoption briefs|買家及應用簡報", "Industry roundtables|產業圓桌", "Practical guidance|實務指引", "Clinics and pilot opportunities|診所及試點機會", "Research and surveys|研究及調查", "Policy recommendations|政策建議", "Public case studies|公開案例", "Annual priorities and progress|年度優先事項及進度"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Published only when the underlying work is approved and attributable.", "只在基礎工作獲批及可歸屬時發布。"); }) },
      { id: "participation", eyebrow: L("Participation", "參與方式"), title: L("Contribution comes with responsibilities.", "貢獻亦伴隨責任。"), copy: L("Each council should publish eligibility, cadence, member duties, leadership, conflicts and the boundary between public and member-only work.", "每個委員會應公布資格、會議頻率、成員責任、領導、利益衝突，以及公開與會員專屬工作的界線。"), items: [
        item("Eligibility", "資格", "Match expertise, role and the council’s current priorities.", "配合專長、角色及委員會現行優先事項。"),
        item("Cadence", "會議頻率", "Publish the approved rhythm and expected preparation.", "公布已批准節奏及準備期望。"),
        item("Responsibilities", "成員責任", "Contribute constructively, protect confidentiality and follow through.", "作建設性貢獻、保障機密並落實跟進。"),
        item("Leadership", "領導", "Make chairing, decision rights and term clear.", "清楚列明主席、決策權及任期。"),
        item("Conflicts of interest", "利益衝突", "Declare commercial interests and manage them transparently.", "申報商業利益並透明管理。"),
        item("Publication boundary", "發布界線", "Separate public outputs from member-only working material.", "區分公開成果與會員專屬工作資料。"),
      ] },
    ],
    close: { title: L("Bring expertise and a willingness to build together.", "帶來專長及共同建設的意願。"), copy: L("Council membership or open seats are never implied before approval.", "委員會成員或空缺席位不會在審批前被暗示。"), actions: [{ label: L("Register council interest", "登記委員會興趣"), path: "events#interest" }, { label: L("View AI+ industries", "查看 AI+ 產業"), path: "ai-plus" }] },
  },
  "activities/training": {
    eyebrow: L("Training & Certification", "培訓及認證"),
    title: L("Build AI capability people can apply at work.", "建立人們可在工作應用的 AI 能力。"),
    copy: L("Practical learning for executives, teams, professionals and technology providers, with approved certification routes clearly labelled.", "為高層、團隊、專業人士及科技供應商提供實務學習，並清楚標示已批准認證路徑。"),
    primary: { label: L("View training availability", "查看培訓狀態"), path: "events?activity=training" },
    secondary: { label: L("Register interest", "登記興趣"), path: "events#interest" },
    sections: [
      { id: "tracks", eyebrow: L("Learning tracks", "學習路徑"), title: L("Choose the capability the work requires.", "選擇工作所需能力。"), copy: L("Current syllabus, trainer, accreditation, fee and date publish only from the approved edition.", "現行課程、導師、認證、收費及日期只會從已批准版本發布。"), items: ["AI for Business Leaders|商業領袖 AI", "AI Readiness for SMEs|中小企 AI 準備度", "Responsible AI and Governance|負責任 AI 及管治", "AI Product and Provider Readiness|AI 產品及供應商準備度", "AI for Sales and Marketing|銷售及市場推廣 AI", "AI for Operations|營運 AI", "Industry-specific Workshops|產業專題工作坊", "CPAI and approved programmes|CPAI 及已批准計劃"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Designed around practical application and clearly stated learning outcomes.", "以實務應用及清楚學習成果為核心。"); }) },
      { id: "formats", eyebrow: L("Formats", "形式"), title: L("Match depth to the learning goal.", "按學習目標選擇深度。"), copy: L("Choose a learning format that fits your team, schedule and desired outcome.", "按團隊需要、時間及期望成果選擇合適學習形式。"), items: ["Executive briefing|高層簡報", "Half-day workshop|半日工作坊", "Full-day workshop|全日工作坊", "Multi-session course|多節課程", "Corporate team programme|企業團隊計劃", "Certificate programme|證書課程"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Session details will include duration, prerequisites and assessment where relevant.", "場次詳情將按需要列明時長、先修要求及評核方式。"); }) },
      { id: "interest", eyebrow: L("Availability", "活動狀態"), title: L("Upcoming sessions require reviewed records.", "即將舉行場次需要已審核紀錄。"), copy: L("No unapproved course date or certificate claim is displayed.", "不顯示未批准課程日期或證書聲稱。"), honestEmpty: L("Register interest by audience and learning track to receive a relevant approved session when available.", "按受眾及學習路徑登記興趣，在相關場次獲批後接收通知。") },
    ],
    close: { title: L("Build capability for real work.", "為真實工作建立能力。"), copy: L("Choose a learning track or review the current approved programme catalogue.", "選擇學習路徑，或查看現行已批准計劃目錄。"), actions: [{ label: L("Register training interest", "登記培訓興趣"), path: "events#interest" }, { label: L("View programmes", "查看計劃"), path: "programmes" }] },
  },
  "activities/gba-delegations": {
    eyebrow: L("GBA Delegations", "大灣區考察團"),
    title: L("Move beyond introductions into market understanding.", "由引薦走向真正市場理解。"),
    copy: L("Structured preparation, market intelligence, partner meetings and follow-up for organisations with a defined market objective.", "為具明確市場目標的機構提供結構化準備、市場情報、夥伴會面及跟進。"),
    primary: { label: L("Explore delegation availability", "查看考察團狀態"), path: "events?activity=delegation" },
    secondary: { label: L("Discuss a market goal", "洽談市場目標"), path: "partner-with-us" },
    sections: [
      { id: "journey", eyebrow: L("Delegation journey", "考察旅程"), title: L("Preparation and follow-through are part of the programme.", "準備及跟進同樣是計劃的一部分。"), copy: L("A delegation should be assessed by relevant learning, meetings and next steps—not travel alone.", "考察團應以相關學習、會面及下一步評估，而不只是行程。"), ordered: true, items: [
        item("Pre-delegation briefing", "考察前簡報", "Set market context, objectives and expectations.", "建立市場脈絡、目標及期望。"),
        item("Readiness review", "準備度審閱", "Confirm fit, materials, capacity and constraints.", "確認配合度、資料、能力及限制。"),
        item("Market and partner matching", "市場及夥伴配對", "Identify relevant meeting types with consent.", "在同意下辨識相關會面類型。"),
        item("Meetings and visits", "會面及參訪", "Use a clear purpose for each scheduled interaction.", "為每個已安排互動設定清晰目的。"),
        item("Group debrief", "小組總結", "Separate signals, assumptions and next actions.", "區分訊號、假設及下一步。"),
        item("Opportunity follow-up", "機會跟進", "Support relevant introductions and ownership.", "支援相關引薦及責任分配。"),
        item("Outcome review", "成果檢視", "Review progress within a defined reporting period.", "在明確報告期內檢視進展。"),
      ] },
      { id: "participants", eyebrow: L("Typical participation", "常見參加者"), title: L("Different roles, one market objective.", "不同角色，同一市場目標。"), copy: L("Final eligibility belongs to the approved delegation record.", "最終資格以已批准考察團紀錄為準。"), items: ["Technology providers|科技供應商", "Corporate innovators|企業創新團隊", "Startups|初創企業", "SMEs|中小企", "Investors|投資者", "Research and institutional partners|研究及機構夥伴"].map((entry) => { const [en, zh] = entry.split("|"); return item(en, zh, "Participation depends on mission fit, readiness and capacity.", "參與取決於考察目標配合度、準備度及名額。"); }) },
      { id: "interest", eyebrow: L("What’s next", "最新動向"), title: L("The next delegation is being planned.", "下一次考察團正在籌備。"), copy: L("Tell us your target market and business objective so we can shape a more relevant programme.", "告訴我們你的目標市場及業務目的，讓我們策劃更切合需要的行程。"), honestEmpty: L("Discuss your market objective or register interest in a future delegation.", "洽談你的市場目標，或登記未來考察團的興趣。") },
    ],
    close: { title: L("Start with readiness—not the flight.", "由準備度開始，而不是由機票開始。"), copy: L("Define your market objective and the people you need to meet.", "界定市場目標及需要會見的人。"), actions: [{ label: L("Discuss market access", "洽談市場拓展"), path: "partner-with-us" }, { label: L("Explore GBA Gateway", "探索大灣區通道"), path: "gba" }] },
  },
};

const gbaSpec: PageSpec = {
  eyebrow: L("GBA Gateway", "大灣區通道"),
  title: L("Hong Kong expertise. GBA opportunity. Global ambition.", "香港專長，大灣區機遇，全球視野。"),
  copy: L("Discover markets, build trusted relationships and move from first contact toward practical collaboration.", "發掘市場、建立可信關係，並由初次接觸走向實務合作。"),
  primary: { label: L("Discuss your market-access goal", "洽談你的市場拓展目標"), path: "partner-with-us" },
  secondary: { label: L("Explore delegations", "探索考察團"), path: "activities/gba-delegations" },
  sections: [
    { id: "pathways", eyebrow: L("Market-entry pathways", "市場進入路徑"), title: L("Start with where you want to go—and why.", "先釐清希望進入哪個市場，以及原因。"), copy: L("The Gateway supports directional pathways; specific partners or opportunities appear only when verified.", "通道提供方向性路徑；具體夥伴或機會只會在核實後顯示。"), items: [
      item("Enter Hong Kong", "進入香港", "Understand local context and relevant ecosystem routes.", "了解本地脈絡及相關生態路徑。"),
      item("Enter the GBA", "進入大灣區", "Prepare by market, sector and partner type.", "按市場、產業及夥伴類型準備。"),
      item("Find a local partner", "尋找本地夥伴", "Use a purpose-led, consent-based introduction.", "採用目標導向及需經同意的引薦。"),
      item("Join a delegation", "參加考察團", "Move through briefing, readiness, meetings and follow-up.", "經過簡報、準備、會面及跟進。", "activities/gba-delegations"),
      item("Meet buyers", "會見買家", "Prepare a defined need or buyer-ready solution.", "準備明確需要或買家導向方案。", "activities/buyer-days"),
      item("Find GBA-ready solutions", "尋找大灣區準備方案", "Use approved marketplace evidence and availability.", "採用已批准市場資料及可用性。", "solutions"),
      item("Become a landing partner", "成為落地夥伴", "Discuss a verified service and collaboration model.", "洽談已核實服務及合作模式。", "partner-with-us"),
    ] },
    { id: "process", eyebrow: L("How the Gateway works", "通道運作方式"), title: L("Six steps toward a useful next move.", "走向有用下一步的六個階段。"), copy: L("No introduction is promised before fit, consent and purpose are clear.", "在配合度、同意及目的清晰前，不承諾任何引薦。"), ordered: true, items: [
      item("Define the market objective", "界定市場目標", "Clarify location, sector, customer and desired outcome.", "釐清地點、產業、客戶及期望成果。"),
      item("Assess readiness", "評估準備度", "Review proposition, evidence, capacity and constraints.", "檢視價值主張、證據、能力及限制。"),
      item("Prioritise", "確定優先次序", "Choose a market and partner type.", "選擇市場及夥伴類型。"),
      item("Join a relevant activity", "參加相關活動", "Use a briefing, clinic or delegation when approved.", "在獲批後參加簡報、診所或考察團。"),
      item("Receive relevant introductions", "接收相關引薦", "Proceed only with purpose and recipient consent.", "只在目的清晰及接收方同意下進行。"),
      item("Track the next step", "追蹤下一步", "Record ownership, timing and outcome review.", "記錄責任、時間及成果檢視。"),
    ] },
    { id: "current", eyebrow: L("Current opportunities", "現行機會"), title: L("Find your next route into the GBA.", "尋找進入大灣區的下一條路徑。"), copy: L("Explore delegations, Landing Days, briefings, buyer meetings, partner calls and programme applications as they become available.", "探索陸續推出的考察團、落地日、簡報、買家會面、夥伴徵集及計劃申請。"), honestEmpty: L("Discuss your market objective or register interest for the next relevant route.", "洽談你的市場目標，或登記下一個相關路徑的興趣。") },
  ],
  close: { title: L("Turn market interest into market readiness.", "把市場興趣轉化為市場準備。"), copy: L("Start with the objective, context and partner type you need.", "由你需要的目標、脈絡及夥伴類型開始。"), actions: [{ label: L("Discuss your market-access goal", "洽談市場拓展目標"), path: "partner-with-us" }, { label: L("Explore delegations", "探索考察團"), path: "activities/gba-delegations" }] },
};

const aboutSpec: PageSpec = {
  eyebrow: L("About WiseTech Hong Kong", "關於 WiseTech Hong Kong"),
  title: L("From wireless connections to wise technology.", "從無線連接，走向智慧科技。"),
  copy: L("Building on the Association’s history since 2001, WiseTech Hong Kong is evolving to support trusted AI adoption, cross-industry collaboration and regional opportunity.", "WiseTech Hong Kong 承接商會自 2001 年以來的歷史，正逐步發展以支援可信 AI 應用、跨產業合作及區域機遇。"),
  primary: { label: L("Why WiseTech", "為何 WiseTech"), path: "why-wisetech" },
  secondary: { label: L("Contact us", "聯絡我們"), path: "about#contact" },
  sections: [
    { id: "mission", eyebrow: L("Our mission", "我們的使命"), title: L("Make technology adoption more useful, trusted and connected.", "讓科技應用更有用、更可信、更互聯。"), copy: L("The public platform connects people, industry knowledge, capability and market access around real-world outcomes.", "公共平台圍繞真實成果，連接人才、產業知識、能力及市場拓展。"), items: [
      item("Trusted adoption", "可信應用", "Help organisations move with evidence, governance and human judgement.", "以證據、管治及人的判斷協助機構前進。"),
      item("Cross-industry collaboration", "跨產業合作", "Create routes for demand and capability to meet.", "建立讓需求與能力相遇的路徑。"),
      item("Regional opportunity", "區域機遇", "Connect Hong Kong, the GBA and international markets.", "連接香港、大灣區及國際市場。"),
      item("Measurable follow-through", "可量度跟進", "Report outcomes with clear definitions and periods.", "以清晰定義及報告期公布成果。"),
    ] },
    { id: "history", eyebrow: L("Our evolution", "我們的演進"), title: L("A future-facing public platform built on an established association.", "建基於既有商會、面向未來的公共平台。"), copy: L("WiseTech Hong Kong — the evolving public platform of the Hong Kong Wireless Technology Industry Association.", "WiseTech Hong Kong — Hong Kong Wireless Technology Industry Association 正在演進的公共平台。"), items: [
      item("Since 2001", "始於 2001 年", "The Association’s history and relationships provide the foundation for the next chapter.", "商會的歷史及關係為下一章奠定基礎。"),
      item("Public brand transition", "公共品牌轉型", "WiseTech Hong Kong is the working public brand for this future experience.", "WiseTech Hong Kong 是這個未來體驗的工作公共品牌。"),
      item("Legal-name integrity", "法定名稱誠信", "The site does not imply that the legal name has changed before formal approval.", "網站不會在正式批准前暗示法定名稱已更改。"),
      item("Chinese legal name", "中文法定名稱", "Official Chinese legal name: [Pending formal approval].", "官方中文法定名稱：[待正式批准]。"),
    ] },
    { id: "leadership", eyebrow: L("Leadership", "領導團隊"), title: L("Profiles publish only when current appointments are confirmed.", "現任職務獲確認後才會發布專頁。"), copy: L("No person, title or committee seat is invented in this concept. Approved profiles can connect to councils, insights and activities.", "本概念版不虛構任何人士、職銜或委員會席位；已批准專頁可連接委員會、洞察及活動。"), honestEmpty: L("Connect the approved governance source to publish current leadership records.", "連接已批准管治資料來源後，才發布現任領導紀錄。") },
    { id: "committees", eyebrow: L("Committees", "委員會"), title: L("Clear mandates, participation and accountability.", "清晰職權、參與及問責。"), copy: L("Committee pages should state purpose, eligibility, leadership, term, conflicts and public outputs.", "委員會頁面應列明目的、資格、領導、任期、利益衝突及公開成果。"), items: [item("Industry Councils", "產業委員會", "Member-led work around practical adoption priorities.", "由會員帶領，聚焦實務應用優先事項。", "activities/industry-councils"), item("Programme governance", "計劃管治", "Keep criteria, partners, decisions and editions traceable.", "讓準則、夥伴、決定及屆次可追溯。"), item("Responsible AI commitments", "負責任 AI 承諾", "Publish how AI tools are used and where people remain in control.", "公布 AI 工具用途及人如何保留控制。", "ai-transparency") ] },
    { id: "governance", eyebrow: L("Governance", "管治"), title: L("Trust is operational, not decorative.", "信任來自營運，而不是裝飾。"), copy: L("Governance covers content approval, data visibility, conflicts, responsible AI, reporting methods and escalation.", "管治涵蓋內容審批、資料可見度、利益衝突、負責任 AI、報告方法及上報機制。"), items: [item("Content integrity", "內容誠信", "Claims, dates, status and relationships require a source and owner.", "聲稱、日期、狀態及關係均需有來源及負責人。"), item("Privacy and consent", "私隱及同意", "Private contacts and introductions remain permission-based.", "私人聯絡資料及引薦維持權限為本。"), item("AI transparency", "AI 透明度", "Automated recommendations disclose their basis and limits.", "自動推薦會披露基礎及限制。", "ai-transparency"), item("Impact reporting", "影響報告", "Every metric needs a definition, period and method.", "每項指標均需定義、報告期及方法。", "ai-ops") ] },
    { id: "contact", eyebrow: L("Contact", "聯絡"), title: L("Start with the team and the right purpose.", "以清晰目的聯絡團隊。"), copy: L("General enquiries: contact@hkwtia.org · +852 2989 9164 · 4/F, KOHO, 73–75 Hung To Road, Kwun Tong, Hong Kong.", "一般查詢：contact@hkwtia.org · +852 2989 9164 · 香港九龍觀塘鴻圖道 73–75 號 KOHO 4 樓。"), items: [item("Membership", "會籍", "Compare pathways or speak with the membership team.", "比較路徑或聯絡會籍團隊。", "membership"), item("Partnerships", "合作", "Choose a strategic, programme, event, research or GBA route.", "選擇策略、計劃、活動、研究或大灣區路徑。", "partner-with-us"), item("Activities", "活動", "Find an event or propose a useful format.", "尋找活動或建議有用形式。", "events") ] },
  ],
  close: { title: L("Build the next chapter with clear purpose.", "以清晰目的共同建設下一章。"), copy: L("Join, partner or participate in a useful activity.", "加入、合作或參與有用活動。"), actions: [{ label: L("Join WiseTech", "加入 WiseTech"), path: "join" }, { label: L("Partner with us", "與我們合作"), path: "partner-with-us" }, { label: L("Find an event", "尋找活動"), path: "events" }] },
};

const aiTransparencySpec: PageSpec = {
  eyebrow: L("AI Transparency", "AI 透明度"),
  title: L("Ask WiseTech recommends. People remain in control.", "Ask WiseTech 提供建議，決定權仍在人。"),
  copy: L(
    "The Association’s assistant is designed to guide people through approved public information, explain the basis of a recommendation and stop before any consequential action.",
    "商會智能助理旨在以已批准公開資料提供導向、解釋建議基礎，並在任何重要行動前停止。",
  ),
  primary: { label: L("Explore approved content", "探索已批准內容"), path: "search" },
  secondary: { label: L("Contact the team", "聯絡團隊"), path: "about#contact" },
  sections: [
    {
      id: "principles",
      eyebrow: L("Operating principles", "運作原則"),
      title: L("Useful guidance needs visible boundaries.", "有用指引需要清晰界線。"),
      copy: L("Every AI-supported answer should make its source, confidence, limitations and next human decision understandable.", "每項 AI 支援回答都應讓使用者了解資料來源、信心程度、限制及下一個由人作出的決定。"),
      items: [
        item("Approved sources", "已批准來源", "Use reviewed Association pages and connected records, not hidden personal data.", "使用已審閱商會頁面及已連接紀錄，而不是隱藏個人資料。"),
        item("Explain the basis", "解釋基礎", "State why a route is suggested and which facts support it.", "說明建議某路徑的原因及所依據事實。"),
        item("Show uncertainty", "顯示不確定性", "Mark unavailable, outdated or unverified information instead of guessing.", "標示未有、過時或未核實資料，而不是猜測。"),
        item("Human choice", "由人選擇", "Present options and trade-offs without pretending to make the final decision.", "提供選項及取捨，不假裝代替使用者作最終決定。"),
      ],
    },
    {
      id: "actions",
      eyebrow: L("Action controls", "行動管控"),
      title: L("No silent submissions, payments, publishing or introductions.", "不會靜默提交、付款、發布或作出引薦。"),
      copy: L("Consequential actions require a clear preview, the right permissions and an explicit confirmation from the person responsible.", "重要行動需要清晰預覽、適當權限及負責人的明確確認。"),
      ordered: true,
      items: [
        item("Prepare", "準備", "Draft or pre-fill information without sending it.", "草擬或預填資料，但不發送。"),
        item("Review", "審閱", "Show the recipient, content, consequence and data used.", "顯示接收方、內容、後果及所用資料。"),
        item("Confirm", "確認", "Ask the authorised person to approve the exact action.", "要求獲授權人士批准確切行動。"),
        item("Record", "記錄", "Keep an appropriate audit record and route exceptions to a person.", "保留適當審計紀錄，並把例外情況轉交人員。"),
      ],
    },
    {
      id: "privacy",
      eyebrow: L("Privacy and fairness", "私隱與公平"),
      title: L("Personalisation begins with permission.", "個人化由許可開始。"),
      copy: L("The live platform should separate public, member-only and staff-only information; recommendations must not expose private contact, attendance or commercial data.", "正式平台應分隔公開、會員專屬及團隊專屬資料；推薦不得公開私人聯絡、出席或商業資料。"),
      items: [
        item("Data minimisation", "資料最少化", "Use only the data needed for the stated purpose.", "只使用達成既定目的所需的資料。"),
        item("Visibility controls", "可見度控制", "Respect record-level permissions across directories, events and introductions.", "在名錄、活動及引薦中遵守紀錄層級權限。"),
        item("Correction route", "更正路徑", "Give people a clear way to question, correct or remove information.", "讓使用者可清楚提出疑問、更正或移除資料。"),
        item("Human escalation", "轉交人員", "Move ambiguous, sensitive or high-impact questions to the Association team.", "把含糊、敏感或高影響問題轉交商會團隊。"),
      ],
    },
  ],
  close: {
    title: L("Trust grows when the system shows its limits.", "系統清楚顯示限制，才能建立信任。"),
    copy: L("Use Ask WiseTech for orientation, then choose the approved page or person responsible for the next action.", "使用 Ask WiseTech 導航，再選擇負責下一步的已批准頁面或人員。"),
    actions: [{ label: L("Search approved content", "搜尋已批准內容"), path: "search" }, { label: L("View AI operations", "查看 AI 營運"), path: "ai-ops" }],
  },
};

const aiOpsSpec: PageSpec = {
  eyebrow: L("AI Operations", "AI 營運"),
  title: L("Measure usefulness without collecting private conversations.", "在不收集私人對話下衡量實用性。"),
  copy: L("AI operations reporting should help the Association improve answer quality, content coverage, safe escalation and real-world outcomes through defined aggregate measures.", "AI 營運報告應透過定義清晰的匯總指標，協助商會改善回答質素、內容覆蓋、安全轉交及真實成果。"),
  primary: { label: L("Read the transparency approach", "閱讀透明度原則"), path: "ai-transparency" },
  secondary: { label: L("Explore the impact model", "探索影響模式"), path: "why-wisetech#impact" },
  sections: [
    {
      id: "measurement",
      eyebrow: L("Measurement charter", "量度章程"),
      title: L("Every number needs a definition, period, source and owner.", "每個數字都需要定義、期間、來源及負責人。"),
      copy: L("A dashboard is useful only when a reader can understand what changed, over what period and how the measure was produced.", "儀表板只有在讀者能理解改變內容、期間及計算方式時才有用。"),
      items: [
        item("Usefulness", "實用性", "Measure whether guidance helped a person reach a relevant approved next step.", "量度指引是否協助使用者到達相關已批准下一步。"),
        item("Answer quality", "回答質素", "Review groundedness, currency, uncertainty and safe refusal patterns.", "檢視依據、時效、不確定性及安全拒答模式。"),
        item("Coverage gaps", "內容缺口", "Aggregate unanswered intents to prioritise reviewed content—not to profile individuals.", "匯總未獲回答的意圖以優先建立已審閱內容，而不是建立個人分析。"),
        item("Escalation", "轉交處理", "Track whether sensitive or unresolved questions reach the right human owner.", "追蹤敏感或未解決問題是否到達合適人員。"),
      ],
    },
    {
      id: "outcomes",
      eyebrow: L("Outcome path", "成果路徑"),
      title: L("Follow the journey, not private conversation text.", "追蹤旅程，而不是私人對話文字。"),
      copy: L("Safe aggregate events can show whether people move from discovery to an approved activity, introduction, programme, market-access or membership route.", "安全匯總事件可顯示使用者是否由探索走向已批准活動、引薦、計劃、市場拓展或會籍路徑。"),
      ordered: true,
      items: [
        item("Discover", "探索", "A visitor finds a relevant approved route.", "訪客找到相關已批准路徑。"),
        item("Engage", "參與", "They open a useful event, guide, directory or solution view.", "使用者開啟有用活動、指引、名錄或方案頁面。"),
        item("Act", "行動", "They explicitly start a registration, enquiry or introduction request.", "使用者明確開始報名、查詢或引薦申請。"),
        item("Follow through", "跟進", "The responsible owner records the next step and outcome status.", "負責人記錄下一步及成果狀態。"),
      ],
    },
    {
      id: "dashboard",
      eyebrow: L("Current dashboard", "現行儀表板"),
      title: L("No synthetic performance numbers are presented.", "不會展示虛構績效數字。"),
      copy: L("The operational view will publish only after approved event definitions, consent boundaries, data owners, reporting periods and quality-review methods are connected.", "營運檢視只會在已批准事件定義、同意界線、資料負責人、報告期及質素審閱方法接入後發布。"),
      honestEmpty: L("Verified aggregate AI-operations data is not connected. The framework is ready without implying current usage, accuracy, conversion or satisfaction levels.", "已核實匯總 AI 營運資料尚未接入；框架已準備就緒，但不暗示現行使用量、準確度、轉化或滿意度。"),
    },
  ],
  close: {
    title: L("Improve the system without compromising the people it serves.", "在不犧牲服務對象的前提下改善系統。"),
    copy: L("Combine transparent AI behaviour, defined measures and human review.", "結合透明 AI 行為、清晰指標及人工審閱。"),
    actions: [{ label: L("Read AI transparency", "閱讀 AI 透明度"), path: "ai-transparency" }, { label: L("Explore impact reporting", "探索影響報告"), path: "why-wisetech#impact" }],
  },
};

function IndustryPage({ lang, slug }: { lang: Language; slug: string }) {
  type IndustryDefinition = {
    title: LocalText;
    copy: LocalText;
    challenges: Array<[string, string]>;
    opportunities: Array<[string, string]>;
    responsibility: Array<[string, string]>;
    primary: LocalText;
  };
  const industries: Record<string, IndustryDefinition> = {
    commerce: {
      title: L("Smarter service, stronger judgement and more useful knowledge.", "更智慧的服務、更穩健的判斷、更有用的知識。"),
      copy: L("Explore responsible AI applications across finance, legal, accounting, consulting, property and other professional-service environments.", "探索金融、法律、會計、顧問、地產及其他專業服務環境的負責任 AI 應用。"),
      challenges: [["Client service and response", "客戶服務及回應"], ["Research and document review", "研究及文件審閱"], ["Knowledge management", "知識管理"], ["Commercial analysis", "商業分析"], ["Compliance workflow", "合規流程"]],
      opportunities: [["Knowledge retrieval", "知識檢索"], ["Workflow assistance", "工作流程支援"], ["Relationship management", "客戶關係管理"], ["Reporting support", "報告支援"]],
      responsibility: [["Confidential information", "機密資料"], ["Professional accountability", "專業問責"], ["Explainability and records", "可解釋性及紀錄"], ["Human review", "人為審閱"]],
      primary: L("Join the Commerce & Professional Services Council", "加入商貿及專業服務委員會"),
    },
    manufacturing: {
      title: L("Move industrial intelligence closer to real operations.", "讓工業智能更貼近真實營運。"),
      copy: L("Connect manufacturing, robotics, IoT, industrial software and operational teams around practical adoption.", "連接製造、機械人、物聯網、工業軟件及營運團隊，推動實務應用。"),
      challenges: [["Quality consistency", "品質一致性"], ["Equipment uptime", "設備正常運作"], ["Production planning", "生產規劃"], ["Energy use", "能源使用"], ["Supply-chain visibility", "供應鏈可見度"]],
      opportunities: [["Visual inspection", "視覺檢測"], ["Predictive maintenance", "預測性維護"], ["Worker assistance", "工作人員支援"], ["Edge AI and robotics", "邊緣 AI 及機械人"]],
      responsibility: [["Operational safety", "營運安全"], ["Human override", "人員覆蓋控制"], ["Integration resilience", "整合韌性"], ["Uptime and monitoring", "正常運作及監察"]],
      primary: L("Explore Manufacturing Activities", "探索製造業活動"),
    },
    health: {
      title: L("Advance health innovation with evidence, governance and care.", "以實證、管治及關懷推動健康創新。"),
      copy: L("Bring healthcare, life-science, research and technology communities together around responsible use. WiseTech does not provide medical advice, and published listings are not clinical endorsements.", "匯聚醫療、生命科學、研究及科技社群，推動負責任使用。WiseTech 不提供醫療意見，已發布名單亦不代表臨床背書。"),
      challenges: [["Administrative workload", "行政工作量"], ["Research workflow", "研究流程"], ["Service planning", "服務規劃"], ["Patient communication", "病人溝通"], ["Knowledge access", "知識存取"]],
      opportunities: [["Operational support", "營運支援"], ["Research assistance", "研究支援"], ["Knowledge retrieval", "知識檢索"], ["Population and service analysis", "人口及服務分析"]],
      responsibility: [["Clinical validation", "臨床驗證"], ["Professional oversight", "專業監督"], ["Privacy and security", "私隱及安全"], ["Regulatory process", "監管程序"]],
      primary: L("Join a Health & Life Sciences Briefing", "參加健康及生命科學簡報"),
    },
    retail: {
      title: L("Create better customer experiences without losing human originality.", "創造更佳顧客體驗，同時保留人的原創性。"),
      copy: L("Explore AI across retail, commerce, media, marketing, design and creative production.", "探索 AI 在零售、商貿、媒體、市場推廣、設計及創意製作的應用。"),
      challenges: [["Customer insight", "顧客洞察"], ["Merchandising", "商品策劃"], ["Campaign workflow", "推廣流程"], ["Content operations", "內容營運"], ["Store and service operations", "店舖及服務營運"]],
      opportunities: [["Personalisation", "個人化"], ["Demand and inventory insight", "需求及庫存洞察"], ["Creative assistance", "創意支援"], ["Service workflow", "服務流程"]],
      responsibility: [["Copyright and licensing", "版權及授權"], ["Disclosure and provenance", "披露及來源"], ["Brand safety", "品牌安全"], ["Customer privacy", "顧客私隱"]],
      primary: L("Find Retail and Creative Solutions", "尋找零售及創意方案"),
    },
    education: {
      title: L("Build capability for work that keeps changing.", "為不斷轉變的工作建立能力。"),
      copy: L("Connect educators, employers, training providers and technology teams around responsible learning and workforce transformation.", "連接教育工作者、僱主、培訓機構及科技團隊，推動負責任學習及人才轉型。"),
      challenges: [["AI literacy", "AI 素養"], ["Staff development", "員工發展"], ["Knowledge support", "知識支援"], ["Assessment workflow", "評估流程"], ["Skills visibility", "技能可見度"]],
      opportunities: [["Learning design", "學習設計"], ["Workplace assistance", "工作場所支援"], ["Organisational learning", "組織學習"], ["Career and skills insight", "職涯及技能洞察"]],
      responsibility: [["Assessment integrity", "評估誠信"], ["Learner privacy", "學員私隱"], ["Accessibility", "無障礙"], ["Teacher and manager oversight", "教師及管理人員監督"]],
      primary: L("Explore Training and Council Activities", "探索培訓及委員會活動"),
    },
    "responsible-ai": {
      title: L("Build confidence before scale.", "擴展前先建立信心。"),
      copy: L("Help organisations understand governance, data protection, cybersecurity, model risk and human oversight as part of AI adoption.", "協助機構把管治、資料保障、網絡安全、模型風險及人為監督納入 AI 應用。"),
      challenges: [["AI governance", "AI 管治"], ["Data protection", "資料保障"], ["Cybersecurity", "網絡安全"], ["Vendor and model risk", "供應商及模型風險"], ["Incident response", "事故處理"]],
      opportunities: [["Readiness checklist", "準備度清單"], ["Procurement questions", "採購問題"], ["Data-risk workshop", "數據風險工作坊"], ["Executive briefing", "高層簡報"]],
      responsibility: [["Human accountability", "人的問責"], ["Transparency", "透明度"], ["Evaluation", "評估"], ["Ongoing monitoring", "持續監察"]],
      primary: L("Explore Responsible AI Support", "探索負責任 AI 支援"),
    },
  };
  const selected = industries[slug] || industries.commerce;
  const spec: PageSpec = {
    eyebrow: L("AI+ Industry", "AI+ 產業"),
    title: selected.title,
    copy: selected.copy,
    primary: { label: selected.primary, path: slug === "retail" ? "solutions" : slug === "education" ? "activities/training" : slug === "responsible-ai" ? "responsible-ai" : "events#interest" },
    secondary: { label: L("Find relevant solutions", "尋找相關方案"), path: "solutions" },
    sections: [
      { id: "challenges", eyebrow: L("Current business challenges", "現行業務挑戰"), title: L("Start with the work that needs to improve.", "由需要改善的工作開始。"), copy: L("These are practical starting questions, not claims that every organisation needs the same technology.", "這些是實務起點，並不代表每個機構都需要相同科技。"), items: selected.challenges.map(([en, zh]) => item(en, zh, "Define the current process, desired outcome, owner and constraints.", "界定現行流程、期望成果、負責人及限制。")) },
      { id: "opportunities", eyebrow: L("Practical opportunity areas", "實務機會範疇"), title: L("Connect a defined problem to a relevant solution category.", "把明確問題連接相關方案類別。"), copy: L("Provider profiles and activities appear only when their public information and status are approved.", "供應商專頁及活動只會在公開資料及狀態獲批後顯示。"), items: selected.opportunities.map(([en, zh]) => item(en, zh, "Compare maturity, implementation effort, evidence and operational fit.", "比較成熟度、落地工作、證據及營運配合度。", "solutions")) },
      { id: "responsibility", eyebrow: L("Responsible adoption", "負責任應用"), title: L("Good adoption makes the boundaries visible.", "良好應用會清楚顯示界線。"), copy: L("WiseTech provides general industry guidance, not legal, medical or regulatory advice.", "WiseTech 提供一般產業指引，並非法律、醫療或監管意見。"), items: selected.responsibility.map(([en, zh]) => item(en, zh, "Assign an accountable owner and review the evidence before scale.", "擴展前先分配具問責負責人並檢視證據。")) },
      { id: "related", eyebrow: L("Related activity", "相關活動"), title: L("Choose a route into the work.", "選擇進入工作的路徑。"), copy: L("No current session or open seat is implied.", "本頁不暗示現有場次或開放席位。"), items: [item("Industry Councils", "產業委員會", "Understand participation and governance.", "了解參與及管治。", "activities/industry-councils"), item("AI Clinics", "AI 診所", "Clarify a practical use case.", "釐清實務用例。", "activities/ai-clinics"), item("Member Directory", "會員名錄", "Discover approved public profiles.", "探索已批准公開專頁。", "members"), item("Programmes", "計劃", "Review verified editions and status.", "檢視已核實屆次及狀態。", "programmes"), item("Events", "活動", "See reviewed opportunities and the completed library.", "查看已審核機會及完成活動資料庫。", "events"), item("Submit a challenge", "提交挑戰", "Bring a defined business problem for review.", "提交明確業務問題供審閱。", "submit-challenge") ] },
    ],
    close: { title: L("Move one industry question forward.", "推進一個產業問題。"), copy: L("Contribute a challenge, explore relevant solutions or join an approved activity.", "提出挑戰、探索相關方案或參與已批准活動。"), actions: [{ label: selected.primary, path: slug === "retail" ? "solutions" : slug === "education" ? "activities/training" : slug === "responsible-ai" ? "responsible-ai" : "events#interest" }, { label: L("Submit a challenge", "提交挑戰"), path: "submit-challenge" }] },
  };
  return <ContentPage lang={lang} spec={spec} visual={siteVisuals.adoption} />;
}

function EventCard({ lang, event }: { lang: Language; event: VerifiedEvent }) {
  return (
    <article className="event-card-v2">
      <div className="event-date-block">
        <img className="event-card-photo" src={event.image} alt={tx(event.imageAlt, lang)} loading="lazy" />
        <time dateTime={event.date}>{tx(event.dateLabel, lang)}</time>
        <span>{tx(event.type, lang)}</span>
      </div>
      <div className="event-card-body">
        <span className="event-status completed">{lang === "en" ? "Completed" : "已完成"}</span>
        <h3>{event.title}</h3>
        <p>{tx(event.sourceNote, lang)}</p>
        <dl>
          <div><dt>{lang === "en" ? "Format" : "形式"}</dt><dd>{tx(event.format, lang)}</dd></div>
          <div><dt>{lang === "en" ? "Venue" : "場地"}</dt><dd>{tx(event.venue, lang)}</dd></div>
          <div><dt>{lang === "en" ? "Audience · language · price" : "受眾 · 語言 · 收費"}</dt><dd>{lang === "en" ? "Not recorded in the approved source used here" : "本頁所用已批准來源未有記錄"}</dd></div>
        </dl>
        <div className="event-card-actions">
          <a className="button button-dark" href={hrefFor(lang, `events/${event.slug}`)}>{lang === "en" ? "View completed record" : "查看完成紀錄"} <Arrow /></a>
          <a className="text-link" href={event.sourceUrl} target="_blank" rel="noreferrer">{lang === "en" ? "View original event page" : "查看原活動頁面"} <Arrow /></a>
        </div>
      </div>
    </article>
  );
}

type EventFilters = {
  date: string;
  eventType: string;
  activity: string;
  audience: string;
  industry: string;
  format: string;
  language: string;
  location: string;
  members: string;
  price: string;
  status: string;
  view: string;
};

const defaultFilters: EventFilters = {
  date: "all", eventType: "all", activity: "all", audience: "all", industry: "all",
  format: "all", language: "all", location: "all", members: "all", price: "all", status: "open", view: "cards",
};
const eventFilterKeys = Object.keys(defaultFilters) as Array<keyof EventFilters>;

function EventsLandingPage({ lang }: { lang: Language }) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [queryReady, setQueryReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const next = { ...defaultFilters };
      eventFilterKeys.forEach((key) => {
        const value = params.get(key);
        if (value) next[key] = value;
      });
      if (params.get("date") === "completed" && !params.has("status")) next.status = "completed";
      setFilters(next);
      setQueryReady(true);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  useEffect(() => {
    if (!queryReady) return;
    const params = new URLSearchParams();
    eventFilterKeys.forEach((key) => { if (filters[key] !== defaultFilters[key]) params.set(key, filters[key]); });
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [filters, queryReady]);

  const results = useMemo(() => verifiedEvents.filter((event) => {
    if (["upcoming", "week", "month", "next-month"].includes(filters.date)) return false;
    if (filters.date === "completed" && event.status !== "completed") return false;
    if (filters.status === "completed" && event.status !== "completed") return false;
    if (filters.status === "open") return false;
    if (filters.eventType !== "all" && tx(event.type, "en").toLowerCase().replaceAll(" ", "-") !== filters.eventType) return false;
    if (filters.format !== "all" && filters.format !== "in-person") return false;
    if (filters.location !== "all" && filters.location !== "hong-kong") return false;
    if ([filters.activity, filters.audience, filters.industry, filters.language, filters.members, filters.price].some((value) => value !== "all" && value !== "not-recorded")) return false;
    return true;
  }), [filters]);

  const set = (key: keyof EventFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const labels: Array<{ key: keyof EventFilters; en: string; zh: string; options: Array<[string, string, string]> }> = [
    { key: "date", en: "Date", zh: "日期", options: [["all", "All dates", "所有日期"], ["upcoming", "Upcoming", "即將舉行"], ["week", "This week", "本星期"], ["month", "This month", "本月"], ["next-month", "Next month", "下月"], ["completed", "Completed", "已完成"]] },
    { key: "eventType", en: "Event type", zh: "活動類型", options: [["all", "All types", "所有類型"], ["awards-summit", "Awards summit", "大獎峰會"], ["industry-event", "Industry event", "產業活動"]] },
    { key: "activity", en: "Activity type", zh: "參與類型", options: [["all", "All activities", "所有活動"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "audience", en: "Audience", zh: "受眾", options: [["all", "All audiences", "所有受眾"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "industry", en: "Industry", zh: "產業", options: [["all", "All industries", "所有產業"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "format", en: "Format", zh: "形式", options: [["all", "All formats", "所有形式"], ["in-person", "In person", "實體"]] },
    { key: "language", en: "Language", zh: "語言", options: [["all", "All languages", "所有語言"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "location", en: "Location", zh: "地點", options: [["all", "All locations", "所有地點"], ["hong-kong", "Hong Kong", "香港"]] },
    { key: "members", en: "Access", zh: "參加資格", options: [["all", "All access", "所有資格"], ["member-only", "Members only", "只限會員"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "price", en: "Price", zh: "收費", options: [["all", "All prices", "所有收費"], ["not-recorded", "Not recorded", "未有記錄"]] },
    { key: "status", en: "Registration state", zh: "報名狀態", options: [["all", "All states", "所有狀態"], ["open", "Registration open", "開放報名"], ["completed", "Completed", "已完成"]] },
  ];
  const commonFilters = labels.filter((filter) => ["date", "eventType", "location"].includes(filter.key));
  const advancedFilters = labels.filter((filter) => !["date", "eventType", "location"].includes(filter.key));
  const quickTab = filters.status === "completed" && filters.date === "completed" ? "past" : filters.members === "member-only" ? "member" : filters.date === "month" ? "month" : filters.date === "upcoming" ? "upcoming" : filters.status === "open" && filters.date === "all" ? "open" : "";
  const setQuickTab = (tab: string) => {
    if (tab === "past") return setFilters({ ...defaultFilters, date: "completed", status: "completed" });
    if (tab === "member") return setFilters({ ...defaultFilters, members: "member-only", status: "open" });
    if (tab === "month") return setFilters({ ...defaultFilters, date: "month", status: "open" });
    if (tab === "upcoming") return setFilters({ ...defaultFilters, date: "upcoming", status: "open" });
    setFilters(defaultFilters);
  };
  const openState = quickTab !== "past";

  const spec: PageSpec = {
    eyebrow: L("Events", "活動"),
    title: L("The next useful connection starts here.", "下一個有用連結，由這裡開始。"),
    copy: L("Discover discussions, clinics, Buyer Days, training, delegations and gatherings designed to create practical next steps.", "探索產業討論、診所、企業買家日、培訓、考察團及聚會，創造實務下一步。"),
    primary: { label: L("View Open Now", "查看現正開放"), path: "events?status=open" },
    secondary: { label: L("View activity types", "查看活動類型"), path: "activities" },
    sections: [],
    close: { title: L("Bring an important industry conversation to the community.", "把重要產業對話帶到社群。"), copy: L("Propose an activity, host an event or become an event partner.", "建議活動、主辦活動或成為活動夥伴。"), actions: [] },
  };

  return <>
    <InnerHero lang={lang} spec={spec} visual={siteVisuals.community} />
    <section className="section event-discovery" id="calendar">
      <div className="shell">
        <div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Open now" : "現正開放"}</p><h2>{lang === "en" ? "Find a confirmed activity—or register for updates." : "尋找已確認活動，或登記接收通知。"}</h2><p>{lang === "en" ? "Open activities appear only when dates, eligibility and registration details are confirmed. Completed records remain available under Past Events." : "只有日期、資格及報名詳情已確認的活動才會顯示；完成紀錄可在「過往活動」查看。"}</p></div>
        <div className="event-quick-tabs" role="group" aria-label={lang === "en" ? "Event timing" : "活動時間"}>{[["open", "Open Now", "現正開放"], ["month", "This Month", "本月"], ["upcoming", "Upcoming", "即將舉行"], ["member", "Member Only", "只限會員"], ["past", "Past Events", "過往活動"]].map(([key, en, zh]) => <button type="button" className={quickTab === key ? "active" : ""} aria-pressed={quickTab === key} onClick={() => setQuickTab(key)} key={key}>{lang === "en" ? en : zh}</button>)}</div>
        <div className="activity-type-strip" aria-label={lang === "en" ? "Browse by activity type" : "按活動類型瀏覽"}>
          {[
            ["Flagship Events", "旗艦活動", "events"], ["AI Clinics", "AI 診所", "activities/ai-clinics"], ["Corporate Buyer Days", "企業買家日", "activities/buyer-days"], ["Industry Councils", "產業委員會", "activities/industry-councils"], ["Training & Certification", "培訓及認證", "activities/training"], ["Startup Demo Days", "初創展示日", "activities"], ["GBA Delegations", "大灣區考察團", "activities/gba-delegations"], ["Community Mixers", "社群聚會", "activities#community"],
          ].map(([en, zh, path]) => <a href={hrefFor(lang, path)} key={en}>{lang === "en" ? en : zh}<Arrow /></a>)}
        </div>
        <form className="event-filter-panel" aria-label={lang === "en" ? "Filter events" : "篩選活動"} onSubmit={(event) => event.preventDefault()}>
          <div className="event-filter-head"><div><p className="eyebrow">{lang === "en" ? "Refine results" : "細化結果"}</p><h2>{lang === "en" ? "Search the event library" : "搜尋活動資料庫"}</h2></div><button type="button" className="text-link" onClick={() => setFilters(defaultFilters)}>{lang === "en" ? "Reset to Open Now" : "重設為現正開放"}</button></div>
          <div className="event-filter-grid">
            {commonFilters.map((filter) => <label key={filter.key}>{lang === "en" ? filter.en : filter.zh}<select value={filters[filter.key]} onChange={(event) => set(filter.key, event.target.value)}>{filter.options.map(([value, en, zh]) => <option value={value} key={value}>{lang === "en" ? en : zh}</option>)}</select></label>)}
          </div>
          <details className="advanced-event-filters"><summary>{lang === "en" ? "Advanced filters" : "進階篩選"}<span aria-hidden="true">+</span></summary><div className="event-filter-grid">{advancedFilters.map((filter) => <label key={filter.key}>{lang === "en" ? filter.en : filter.zh}<select value={filters[filter.key]} onChange={(event) => set(filter.key, event.target.value)}>{filter.options.map(([value, en, zh]) => <option value={value} key={value}>{lang === "en" ? en : zh}</option>)}</select></label>)}</div></details>
        </form>
        <div className="event-results-head"><p role="status" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {lang === "en" ? "events found" : "項活動"}</p><div className="event-view-switch" role="group" aria-label={lang === "en" ? "Event view" : "活動顯示方式"}><button type="button" className={filters.view === "cards" ? "active" : ""} onClick={() => set("view", "cards")}>{lang === "en" ? "Cards" : "卡片"}</button><button type="button" className={filters.view === "calendar" ? "active" : ""} onClick={() => set("view", "calendar")}>{lang === "en" ? "Calendar" : "日曆"}</button></div></div>
        {results.length ? filters.view === "calendar" ? <div className="event-calendar-view">{results.map((event) => <a href={hrefFor(lang, `events/${event.slug}`)} key={event.slug}><time dateTime={event.date}>{tx(event.dateLabel, lang)}</time><div><span>{lang === "en" ? "Completed" : "已完成"}</span><h3>{event.title}</h3><p>{tx(event.venue, lang)}</p></div><Arrow /></a>)}</div> : <div className="event-library">{results.map((event) => <EventCard lang={lang} event={event} key={event.slug} />)}</div> : <div className="inner-honest"><span className="pulse-ring" aria-hidden="true" /><div><p className="status-label">{lang === "en" ? (openState ? "Current availability" : "No results") : (openState ? "目前狀態" : "沒有結果")}</p><h3>{lang === "en" ? (openState ? "No activities are currently open." : "No event matches these filters.") : (openState ? "目前未有活動開放報名。" : "沒有活動符合這些篩選。")}</h3><p>{lang === "en" ? (openState ? "Get activity updates, or switch to Past Events to explore the two completed 2025 records." : "Reset to Open Now or adjust the filters.") : (openState ? "接收活動通知，或切換至「過往活動」瀏覽兩個 2025 已完成紀錄。" : "重設為現正開放，或調整篩選。")}</p></div><div className="event-empty-actions">{openState && <a className="button button-dark" href="#interest">{lang === "en" ? "Get activity updates" : "接收活動通知"}</a>}<button type="button" className="text-link" onClick={() => setQuickTab(openState ? "past" : "open")}>{lang === "en" ? (openState ? "View past events" : "Reset to Open Now") : (openState ? "查看過往活動" : "重設為現正開放")}</button></div></div>}
      </div>
    </section>
    <Recommendations lang={lang} items={[item("AI Clinics", "AI 診所", "Clarify one practical challenge.", "釐清一個實務挑戰。", "activities/ai-clinics"), item("Industry Councils", "產業委員會", "Contribute to shared priorities.", "為共同優先事項作貢獻。", "activities/industry-councils"), item("GBA Delegations", "大灣區考察團", "Prepare for structured market access.", "為結構化市場拓展作準備。", "activities/gba-delegations")]} />
    <section className="section event-interest" id="interest"><div className="shell event-interest-grid"><div><p className="eyebrow light">{lang === "en" ? "Activity alerts" : "活動通知"}</p><h2>{lang === "en" ? "Tell us what you want to join next." : "告訴我們你希望參加甚麼活動。"}</h2><p>{lang === "en" ? "Share your interests and we’ll keep you informed about relevant WiseTech activities and opportunities." : "分享你的興趣，我們會通知你相關的 WiseTech 活動及機會。"}</p></div><a className="button button-light" href="mailto:contact@hkwtia.org?subject=WiseTech%20activity%20interest">{lang === "en" ? "Get activity updates" : "接收活動通知"} <Arrow /></a></div></section>
    <section className="inner-closing" id="host"><div className="shell inner-closing-grid"><div><p className="eyebrow light">{lang === "en" ? "Host or partner" : "主辦或合作"}</p><h2>{lang === "en" ? "Bring an important industry conversation to the WiseTech community." : "把重要產業對話帶到 WiseTech 社群。"}</h2><p>{lang === "en" ? "Propose an activity, host an event or become an event partner—with purpose, audience and intended outcome clearly defined." : "建議活動、主辦活動或成為活動夥伴，並清楚界定目的、受眾及預期成果。"}</p></div><div className="inner-closing-actions"><a className="button button-light" href="mailto:contact@hkwtia.org?subject=Propose%20a%20WiseTech%20activity">{lang === "en" ? "Propose an activity" : "建議活動"} <Arrow /></a><a className="text-link light-link" href={hrefFor(lang, "partner-with-us")}>{lang === "en" ? "Become an event partner" : "成為活動夥伴"} <Arrow /></a></div></div></section>
  </>;
}

function EventDetailPage({ lang, event }: { lang: Language; event: VerifiedEvent }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    eventStatus: "https://schema.org/EventCompleted",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: tx(event.venue, "en"), address: { "@type": "PostalAddress", addressLocality: "Hong Kong", addressCountry: "HK" } },
    description: tx(event.sourceNote, "en"),
    image: `https://wisetech-hong-kong.laichiwillyjp.chatgpt.site${event.image}`,
    organizer: { "@type": "Organization", name: "Hong Kong Wireless Technology Industry Association", url: "https://hkwtia.org/" },
    url: `https://wisetech-hong-kong.laichiwillyjp.chatgpt.site/${lang}/events/${event.slug}`,
  };
  return <div className="event-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="event-detail-hero" style={{ "--event-photo": `url("${event.image}")` } as CSSProperties}><div className="shell"><div className="event-detail-meta"><span className="event-status completed">{lang === "en" ? "Past event" : "過往活動"}</span><span>{tx(event.type, lang)}</span></div><h1>{event.title}</h1><p>{lang === "en" ? "Look back at this WTIA industry event and continue exploring related WiseTech activities." : "回顧這項 WTIA 產業活動，並繼續探索相關 WiseTech 活動。"}</p><p className="event-image-note">{lang === "en" ? "WTIA event highlight" : "WTIA 活動回顧"} · <a href={event.sourceUrl} target="_blank" rel="noreferrer">{lang === "en" ? "View original event page" : "查看原活動頁面"} <Arrow /></a></p><div className="event-detail-facts"><div><span>{lang === "en" ? "Date" : "日期"}</span><time dateTime={event.date}>{tx(event.dateLabel, lang)}</time></div><div><span>{lang === "en" ? "Venue" : "場地"}</span><strong>{tx(event.venue, lang)}</strong></div><div><span>{lang === "en" ? "Format" : "形式"}</span><strong>{tx(event.format, lang)}</strong></div><div><span>{lang === "en" ? "Event status" : "活動狀態"}</span><strong>{lang === "en" ? "Completed" : "已完成"}</strong></div></div></div><span className="sr-only">{tx(event.imageAlt, lang)}</span></section>
    <section className="section event-detail-content"><div className="shell event-detail-layout"><div className="event-detail-main">
      <section><p className="eyebrow">{lang === "en" ? "Event overview" : "活動概覽"}</p><h2>{lang === "en" ? "A meeting point for ideas, people and industry progress." : "連結想法、人才與產業進步的交流平台。"}</h2><p>{tx(event.sourceNote, lang)}</p><p>{lang === "en" ? "This page keeps the event’s date, venue and original WTIA reference together, making it easier to revisit the programme and discover related opportunities." : "本頁整合活動日期、場地及原有 WTIA 參考資料，方便重溫計劃並探索相關機會。"}</p></section>
      <section><p className="eyebrow">{lang === "en" ? "Event information" : "活動資料"}</p><h2>{lang === "en" ? "Key details at a glance." : "活動重點一目了然。"}</h2><dl className="practical-grid"><div><dt>{lang === "en" ? "Date" : "日期"}</dt><dd><time dateTime={event.date}>{tx(event.dateLabel, lang)}</time></dd></div><div><dt>{lang === "en" ? "Venue" : "場地"}</dt><dd>{tx(event.venue, lang)}</dd></div><div><dt>{lang === "en" ? "City" : "城市"}</dt><dd>{tx(event.city, lang)}</dd></div><div><dt>{lang === "en" ? "Format" : "形式"}</dt><dd>{tx(event.format, lang)}</dd></div></dl></section>
      <section><p className="eyebrow">{lang === "en" ? "Continue exploring" : "繼續探索"}</p><h2>{lang === "en" ? "Discover more activities and industry connections." : "探索更多活動與產業連結。"}</h2><div className="resource-state"><span>{lang === "en" ? "WTIA event page" : "WTIA 活動頁面"}</span><p>{lang === "en" ? "Visit the original event page for the published event information, then explore current WiseTech pathways for your next connection." : "瀏覽原活動頁面了解已發布資料，再探索現有 WiseTech 路徑，展開下一個連結。"}</p><a className="text-link" href={event.sourceUrl} target="_blank" rel="noreferrer">{lang === "en" ? "View original event page" : "查看原活動頁面"} <Arrow /></a></div></section>
    </div><aside className="event-detail-aside"><p className="eyebrow">{lang === "en" ? "Related routes" : "相關路徑"}</p><h2>{lang === "en" ? "Continue with a current pathway." : "繼續現行參與路徑。"}</h2><a href={hrefFor(lang, "events")}>{lang === "en" ? "Event library" : "活動資料庫"}<Arrow /></a><a href={hrefFor(lang, "activities")}>{lang === "en" ? "Activity types" : "活動類型"}<Arrow /></a><a href={hrefFor(lang, "ai-plus")}>AI+ Industries<Arrow /></a><a href={hrefFor(lang, "programmes")}>{lang === "en" ? "Programmes" : "計劃"}<Arrow /></a><a href={hrefFor(lang, "insights")}>{lang === "en" ? "Insights & resources" : "洞察及資源"}<Arrow /></a></aside></div></section>
    <div className="event-action-bar" aria-label={lang === "en" ? "Past event actions" : "過往活動操作"}><div><time dateTime={event.date}>{tx(event.dateLabel, lang)}</time><strong>{lang === "en" ? "Past event" : "過往活動"}</strong></div><div><a className="text-link" href={event.sourceUrl} target="_blank" rel="noreferrer">{lang === "en" ? "Original event page" : "原活動頁面"}</a><a className="button button-dark" href={hrefFor(lang, "events")}>{lang === "en" ? "Explore more activities" : "探索更多活動"} <Arrow /></a></div></div>
  </div>;
}

function PartnerPage({ lang }: { lang: Language }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  const spec: PageSpec = {
    eyebrow: L("Partner With Us", "與我們合作"),
    title: L("Build the AI+ ecosystem with us.", "與我們共同建設 AI+ 生態系統。"),
    copy: L("Create useful industry programmes, trusted knowledge, market opportunity and measurable impact through a clearly defined partnership.", "透過清晰界定的合作，共同創造有用產業計劃、可信知識、市場機遇及可量度影響。"),
    primary: { label: L("Start a partnership conversation", "展開合作對話"), path: "partner-with-us#enquiry" },
    secondary: { label: L("Explore our mission", "探索我們的使命"), path: "why-wisetech#mission" }, sections: [], close: { title: L("", ""), copy: L("", ""), actions: [] },
  };
  const pathways = [
    item("Strategic Partnership", "策略夥伴", "Support the two-year AI+ mission and selected ecosystem initiatives.", "支持兩年 AI+ 使命及指定生態倡議。"),
    item("Corporate Innovation Challenge", "企業創新挑戰", "Bring a defined business challenge to the member network.", "把明確業務挑戰帶到會員網絡。"),
    item("Programme Partnership", "計劃合作", "Support awards, learning, market access or startup programmes.", "支持獎項、學習、市場拓展或初創計劃。"),
    item("Event Partnership", "活動合作", "Co-create an event, workshop, Buyer Day or executive roundtable.", "共同策劃活動、工作坊、企業買家日或高層圓桌。"),
    item("Research Partnership", "研究合作", "Develop practical reports, surveys, benchmarks and adoption guidance.", "發展實務報告、調查、基準及應用指引。"),
    item("GBA Partnership", "大灣區合作", "Build delegations, landing support and regional partner networks.", "建立考察團、落地支援及區域夥伴網絡。"),
  ];
  return <><InnerHero lang={lang} spec={spec} /><section className="section inner-section" id="pathways"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Six partnership pathways" : "六種合作路徑"}</p><h2>{lang === "en" ? "Choose the role and outcome before the format." : "先選擇角色與成果，再選擇形式。"}</h2><p>{lang === "en" ? "Choose a partnership route that fits your audience, objective and intended outcome." : "按你的受眾、目標及預期成果，選擇合適合作路徑。"}</p></div><div id="challenge" className="anchor-offset" /><ContentCards lang={lang} section={{ id: "partner-pathways", eyebrow: L("", ""), title: L("", ""), copy: L("", ""), items: pathways }} /></div></section><section className="section partner-enquiry" id="enquiry"><div className="shell partner-enquiry-grid"><div><p className="eyebrow">{lang === "en" ? "Partnership enquiry" : "合作查詢"}</p><h2>{lang === "en" ? "Start with the purpose." : "由合作目的開始。"}</h2><p>{lang === "en" ? "Outline your partnership idea and use the summary to start a conversation with the WiseTech team." : "簡介你的合作構思，並以整理好的摘要與 WiseTech 團隊展開對話。"}</p></div>{sent ? <div className="form-success" role="status"><span>✓</span><h3>{lang === "en" ? "Your enquiry summary is ready." : "你的查詢摘要已準備好。"}</h3><p>{lang === "en" ? "Email contact@hkwtia.org to continue the conversation with the team.": "請電郵 contact@hkwtia.org，與團隊繼續商討。"}</p><button className="text-link" onClick={() => setSent(false)}>{lang === "en" ? "Prepare another enquiry" : "準備另一份查詢"}</button></div> : <form className="partner-form" onSubmit={submit}><div className="form-grid"><label>{lang === "en" ? "Organisation" : "機構"}<input required /></label><label>{lang === "en" ? "Contact name and email" : "聯絡人及電郵"}<input required /></label><label>{lang === "en" ? "Partnership interest" : "合作興趣"}<select required defaultValue=""><option value="" disabled>{lang === "en" ? "Select a pathway" : "選擇合作路徑"}</option>{pathways.map((pathway) => <option key={pathway.title.en}>{tx(pathway.title, lang)}</option>)}</select></label><label>{lang === "en" ? "Industry" : "產業"}<input /></label><label>{lang === "en" ? "Desired audience" : "目標受眾"}<input /></label><label>{lang === "en" ? "Proposed timing" : "建議時間"}<input /></label><label>{lang === "en" ? "Approximate scale" : "大概規模"}<input /></label></div><label>{lang === "en" ? "Objective and message" : "目標及訊息"}<textarea required rows={6} /></label><button className="button button-dark" type="submit">{lang === "en" ? "Prepare enquiry" : "整理查詢"} <Arrow /></button></form>}</div></section><ClosingBand lang={lang} close={{ title: L("Build something useful, trusted and measurable.", "共同建設有用、可信及可量度的成果。"), copy: L("Choose a partnership pathway and define the audience, objective and intended next step.", "選擇合作路徑，並界定受眾、目標及預期下一步。"), actions: [{ label: L("Start a conversation", "展開對話"), path: "partner-with-us#enquiry" }, { label: L("Explore events", "探索活動"), path: "events" }] }} /></>;
}

function InsightsPage({ lang }: { lang: Language }) {
  const [filter, setFilter] = useState("all");
  const filters = ["Case Studies|案例研究", "Practical Guides|實務指南", "Industry Perspectives|產業觀點", "Policy & Responsible AI|政策及負責任 AI", "GBA Intelligence|大灣區情報", "Event Replays|活動重溫", "Programme Updates|計劃消息", "Association News|商會消息"];
  const spec: PageSpec = { eyebrow: L("Insights", "洞察"), title: L("Practical intelligence for the AI+ economy.", "服務 AI+ 經濟的實務情報。"), copy: L("Explore implementation stories, market signals, responsible AI guidance and perspectives from the WiseTech community.", "探索落地故事、市場訊號、負責任 AI 指引及 WiseTech 社群觀點。"), primary: { label: L("Receive WiseTech insights", "接收 WiseTech 洞察"), path: "insights#subscribe" }, secondary: { label: L("Explore events", "探索活動"), path: "events" }, sections: [], close: { title: L("", ""), copy: L("", ""), actions: [] } };
  return <>
    <InnerHero lang={lang} spec={spec} />
    <section className="section inner-section" id="content"><div className="shell">
      <div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Content hub" : "內容中心"}</p><h2>{lang === "en" ? "Knowledge you can put to work." : "可付諸實行的知識。"}</h2><p>{lang === "en" ? "Explore member outcomes, practical guidance, buyer-demand signals, market-entry learning, council perspectives and event summaries." : "探索會員成果、實務指引、買家需求訊號、市場拓展經驗、委員會觀點及活動摘要。"}</p></div>
      <div className="insight-filters" role="group" aria-label={lang === "en" ? "Insight filters" : "洞察篩選"}><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>{lang === "en" ? "All" : "全部"}</button>{filters.map((entry, index) => { const [en, zh] = entry.split("|"); return <button className={filter === String(index) ? "active" : ""} onClick={() => setFilter(String(index))} key={en}>{lang === "en" ? en : zh}</button>; })}</div>
      <div className="inner-honest" role="status"><span className="pulse-ring" aria-hidden="true" /><div><p className="status-label">{lang === "en" ? "More insights coming soon" : "更多洞察即將推出"}</p><h3>{lang === "en" ? "New stories, guides and event highlights are on the way." : "新故事、指南及活動回顧將陸續登場。"}</h3><p>{lang === "en" ? "Have practical experience or an industry perspective to share? We welcome contributions from the community." : "如你有實務經驗或產業觀點想分享，歡迎向社群投稿。"}</p></div><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Contribute%20a%20WiseTech%20insight">{lang === "en" ? "Propose a contribution" : "建議投稿"} <Arrow /></a></div>
    </div></section>
    <section className="section inner-section inner-section-tint" id="research"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Research quality" : "研究質素"}</p><h2>{lang === "en" ? "Useful research starts with a clear question." : "有用研究，由清晰問題開始。"}</h2><p>{lang === "en" ? "Our research approach makes the scope, method, period and contributors easy to understand." : "我們的研究方法清楚交代範圍、方法、期間及參與者。"}</p></div><ContentCards lang={lang} section={{ id: "research-rules", eyebrow: L("", ""), title: L("", ""), copy: L("", ""), items: [item("Scope", "範圍", "State what the work covers and does not cover.", "列明研究涵蓋及不涵蓋的內容。"), item("Method", "方法", "Explain data sources, sample and limitations.", "解釋資料來源、樣本及限制。"), item("Period", "期間", "Make the observation and publication dates visible.", "清楚顯示觀察及發布日期。"), item("Attribution", "歸屬", "Credit authors, partners and funders accurately.", "準確列明作者、夥伴及資助者。")] }} /></div></section>
    <section className="event-interest" id="subscribe"><div className="shell event-interest-grid"><div><p className="eyebrow light">{lang === "en" ? "WiseTech Insights" : "WiseTech 洞察"}</p><h2>{lang === "en" ? "Get knowledge and opportunities in your inbox." : "把產業知識與機遇帶到你的收件箱。"}</h2><p>{lang === "en" ? "Join the update list for new guides, event highlights, programmes and community opportunities." : "加入通知名單，接收新指南、活動回顧、計劃及社群機遇。"}</p></div><a className="button button-light" href="mailto:contact@hkwtia.org?subject=WiseTech%20Insights%20subscription">{lang === "en" ? "Join the update list" : "加入通知名單"} <Arrow /></a></div></section>
    <ClosingBand lang={lang} close={{ title: L("Turn useful knowledge into a practical next step.", "把有用知識轉化為實務下一步。"), copy: L("Connect an insight to an industry, activity, programme, member or membership route.", "把洞察連接產業、活動、計劃、會員或會籍路徑。"), actions: [{ label: L("Explore AI+ industries", "探索 AI+ 產業"), path: "ai-plus" }, { label: L("Find an event", "尋找活動"), path: "events" }, { label: L("Join WiseTech", "加入 WiseTech"), path: "join" }] }} />
  </>;
}

function SearchPage({ lang }: { lang: Language }) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const routes = [item("Events & Activities", "活動與參與", "Find events, activity formats and past highlights.", "尋找活動、參與形式及過往回顧。", "events"), item("Member Directory", "會員名錄", "Search organisation and professional profiles.", "搜尋機構及專業人士專頁。", "members"), item("AI Solutions", "AI 解決方案", "Search by business need, maturity and deployment model.", "按業務需要、成熟度及部署模式搜尋。", "solutions"), item("Programmes", "計劃", "Review purpose, eligibility and historical editions.", "檢視目的、資格及歷屆版本。", "programmes"), item("Insights", "洞察", "Explore practical knowledge and resources.", "探索實務知識及資源。", "insights")];
  const spec: PageSpec = { eyebrow: L("Search", "搜尋"), title: L("Find the right route into the ecosystem.", "找到進入生態系統的合適路徑。"), copy: L("Search WiseTech events, members, solutions, programmes and insights.", "搜尋 WiseTech 活動、會員、方案、計劃及洞察。"), primary: { label: L("Browse events", "瀏覽活動"), path: "events" }, sections: [], close: { title: L("", ""), copy: L("", ""), actions: [] } };
  return <><InnerHero lang={lang} spec={spec} /><section className="section inner-section"><div className="shell"><form className="site-search-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label htmlFor="site-search">{lang === "en" ? "Search WiseTech" : "搜尋 WiseTech"}</label><div><input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === "en" ? "Try events, AI clinic, GBA or membership" : "嘗試活動、AI 診所、大灣區或會籍"} /><button className="button button-dark">{lang === "en" ? "Search" : "搜尋"}</button></div></form>{submitted && <p className="search-feedback" role="status">{lang === "en" ? `Choose a route below to continue exploring “${query}”.` : `請在下方選擇路徑，繼續探索「${query}」。`}</p>}<ContentCards lang={lang} section={{ id: "search-routes", eyebrow: L("", ""), title: L("", ""), copy: L("", ""), items: routes }} /></div></section></>;
}

function NotFoundPage({ lang, path }: { lang: Language; path: string }) {
  const spec: PageSpec = { eyebrow: L("Page not found", "找不到頁面"), title: L("We couldn’t find this page.", "我們找不到這個頁面。"), copy: L(`The address “${path}” may have changed. Return home or explore current WiseTech events.`, `「${path}」的網址可能已更改。你可以返回首頁或探索最新 WiseTech 活動。`), primary: { label: L("Go to the homepage", "返回首頁"), path: "" }, secondary: { label: L("Find an event", "尋找活動"), path: "events" }, sections: [], close: { title: L("", ""), copy: L("", ""), actions: [] } };
  return <InnerHero lang={lang} spec={spec} />;
}

export function ExpansionRoute({ lang, path }: { lang: Language; path: string[] }): ReactNode {
  const key = path.join("/");
  const fullInnerPage = FullInnerRoute({ lang, path });
  if (fullInnerPage) return fullInnerPage;
  if (key === "why-wisetech") return <ContentPage lang={lang} spec={whySpec} visual={visualForRoute(key)} />;
  if (key === "ai-transparency") return <ContentPage lang={lang} spec={aiTransparencySpec} visual={siteVisuals.governance} />;
  if (key === "ai-ops") return <ContentPage lang={lang} spec={aiOpsSpec} visual={siteVisuals.governance} />;
  if (key === "ai-plus") return <ContentPage lang={lang} spec={aiPlusSpec} visual={visualForRoute(key)} />;
  if (path[0] === "ai-plus" && path[1]) {
    const aliases: Record<string, string> = {
      "commerce-professional-services": "commerce",
      "manufacturing-robotics": "manufacturing",
      "health-life-sciences": "health",
      "retail-creative-industries": "retail",
      "education-future-of-work": "education",
      "responsible-ai-data-cybersecurity": "responsible-ai",
    };
    const industrySlug = aliases[path[1]] ?? path[1];
    return ["commerce", "manufacturing", "health", "retail", "education", "responsible-ai"].includes(industrySlug)
      ? <IndustryPage lang={lang} slug={industrySlug} />
      : <NotFoundPage lang={lang} path={key} />;
  }
  if (audienceSpecs[key]) return <ContentPage lang={lang} spec={audienceSpecs[key]} visual={visualForRoute(key)} />;
  if (key === "activities") return <ContentPage lang={lang} spec={activitiesOverviewSpec} visual={visualForRoute(key)} />;
  if (activitySpecs[key]) return <ContentPage lang={lang} spec={activitySpecs[key]} visual={visualForRoute(key)} />;
  if (key === "events") return <EventsLandingPage lang={lang} />;
  if (path[0] === "events" && path[1]) {
    const event = verifiedEvents.find((entry) => entry.slug === path[1]);
    return event ? <EventDetailPage lang={lang} event={event} /> : <NotFoundPage lang={lang} path={key} />;
  }
  if (key === "gba") return <ContentPage lang={lang} spec={gbaSpec} visual={visualForRoute(key)} />;
  if (key === "partner-with-us") return <PartnerPage lang={lang} />;
  if (key === "insights") return <InsightsPage lang={lang} />;
  if (key === "about") return <ContentPage lang={lang} spec={aboutSpec} visual={visualForRoute(key)} />;
  if (key === "about/history") return <ContentPage lang={lang} spec={aboutSpec} visual={siteVisuals.governance} />;
  if (key === "search") return <SearchPage lang={lang} />;
  return null;
}
