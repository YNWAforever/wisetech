"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ExpansionRoute } from "./ExpansionPages";
import { NotFoundInnerPage } from "./FullInnerPages";
import { megaNav } from "./megaNav";
import { mediaPartners, regionalPartners, supportingOrganisations } from "./partnerData";
import { siteVisuals, SiteVisual } from "./visualData";

export type SiteLanguage = "en" | "zh";

type WiseTechSiteProps = {
  lang?: SiteLanguage;
  path?: string[];
};

type LocalText = { en: string; zh: string };

const t = (value: LocalText, lang: SiteLanguage) => value[lang];

const industries = [
  {
    key: "commerce",
    path: "commerce-professional-services",
    name: { en: "Commerce + Professional Services", zh: "商貿 + 專業服務" },
    brief: { en: "Trusted automation, intelligence and client delivery.", zh: "以可信任自動化、智能洞察及客戶服務提升競爭力。" },
    signal: "01",
  },
  {
    key: "manufacturing",
    path: "manufacturing-robotics",
    name: { en: "Manufacturing + Robotics", zh: "製造 + 機械人" },
    brief: { en: "From operational challenge to practical deployment.", zh: "把營運挑戰轉化為可落地的技術部署。" },
    signal: "02",
  },
  {
    key: "health",
    path: "health-life-sciences",
    name: { en: "Health + Life Sciences", zh: "健康 + 生命科學" },
    brief: { en: "Human-centred adoption with evidence and care.", zh: "兼顧實證、安全與人的需要。" },
    signal: "03",
  },
  {
    key: "responsible-ai",
    path: "responsible-ai-data-cybersecurity",
    name: { en: "Responsible AI + Cybersecurity", zh: "負責任 AI + 網絡安全" },
    brief: { en: "Governance, privacy and resilience by design.", zh: "從設計開始融入管治、私隱與韌性。" },
    signal: "04",
  },
  {
    key: "retail",
    path: "retail-creative-industries",
    name: { en: "Retail + Creative Industries", zh: "零售 + 創意產業" },
    brief: { en: "New customer experiences and commercial models.", zh: "創造新的顧客體驗與商業模式。" },
    signal: "05",
  },
  {
    key: "education",
    path: "education-future-of-work",
    name: { en: "Education + Future of Work", zh: "教育 + 未來工作" },
    brief: { en: "Skills, productivity and opportunity for people.", zh: "為人才帶來技能、生產力與新機會。" },
    signal: "06",
  },
];

const audiences = [
  {
    key: "corporates",
    title: { en: "For Corporates", zh: "企業" },
    copy: { en: "Find solutions, talent and innovation partners.", zh: "尋找技術方案、人才及創新夥伴。" },
    benefits: { en: "Buyer challenges · Executive briefings · Industry councils", zh: "企業挑戰 · 高層簡報 · 產業委員會" },
    cta: { en: "Submit a business challenge", zh: "提交業務挑戰" },
    path: "submit-challenge",
    accent: "cyan",
  },
  {
    key: "smes",
    title: { en: "For SMEs", zh: "中小企" },
    copy: { en: "Turn AI opportunities into practical improvements.", zh: "把 AI 機遇轉化為實際業務改善。" },
    benefits: { en: "Readiness · Clinics · Trusted providers", zh: "準備度評估 · 診所 · 可信供應商" },
    cta: { en: "Explore an AI Clinic", zh: "探索 AI 診所" },
    path: "activities/ai-clinics",
    accent: "jade",
  },
  {
    key: "startups",
    title: { en: "For Startups", zh: "初創企業" },
    copy: { en: "Meet buyers, investors and regional partners.", zh: "連繫買家、投資者及區域夥伴。" },
    benefits: { en: "Structured visibility · Demo days · Market entry", zh: "結構化曝光 · 展示日 · 市場進入" },
    cta: { en: "Publish a solution", zh: "刊登解決方案" },
    path: "solutions#publish",
    accent: "amber",
  },
  {
    key: "professionals",
    title: { en: "For Professionals", zh: "專業人士" },
    copy: { en: "Build skills, influence industry and expand your network.", zh: "增進技能、參與產業發展並拓展網絡。" },
    benefits: { en: "Councils · Certification · Mentorship", zh: "委員會 · 專業認證 · 導師計劃" },
    cta: { en: "Explore professional membership", zh: "探索專業人士會籍" },
    path: "membership#professionals",
    accent: "blue",
  },
  {
    key: "gba",
    title: { en: "For GBA & Global Partners", zh: "大灣區及國際夥伴" },
    copy: { en: "Connect with Hong Kong technology and market opportunities.", zh: "連接香港科技力量與市場機遇。" },
    benefits: { en: "Soft landing · Delegations · Buyer matching", zh: "落地支援 · 考察團 · 買家配對" },
    cta: { en: "Discuss market access", zh: "洽談市場拓展" },
    path: "gba",
    accent: "violet",
  },
];

const programmes = [
  {
    name: "Tech Connect Series",
    tag: { en: "AI adoption", zh: "AI 應用" },
    copy: { en: "An industry-oriented programme connecting practical AI knowledge with operational development.", zh: "連接實務 AI 知識與企業營運發展的產業計劃。" },
    proof: { en: "Published format: 10 workshops · 2 seminars · 1 conference", zh: "已公布形式：10 場工作坊 · 2 場研討會 · 1 場大型會議" },
    slug: "tech-connect",
  },
  {
    name: "Asia Smart Innovation Awards",
    tag: { en: "Regional innovation", zh: "區域創新" },
    copy: { en: "A regional platform recognising applied technology and market-ready innovation across Asia.", zh: "表揚亞洲應用科技及具市場潛力創新的區域平台。" },
    proof: { en: "2025 edition: participants from 17 Asian regions", zh: "2025 年度：來自亞洲 17 個地區的團隊參與" },
    slug: "asia-smart-innovation-awards",
  },
  {
    name: "HKICT Startup Award",
    tag: { en: "Startup credibility", zh: "初創認受性" },
    copy: { en: "A recognised pathway for technology startups to demonstrate innovation and build visibility.", zh: "讓科技初創展示創新能力、建立市場認受性的發展路徑。" },
    proof: { en: "Historical records retained", zh: "保留歷屆紀錄" },
    slug: "hkict-startup-award",
  },
  {
    name: "CPAI",
    tag: { en: "Skills + certification", zh: "技能 + 認證" },
    copy: { en: "Professional development in generative AI for business innovation and applications.", zh: "聚焦生成式 AI 商業創新與應用的專業培訓。" },
    proof: { en: "Programme information subject to the current published edition", zh: "詳情以現行公布版本為準" },
    slug: "cpai",
  },
];

const archiveStories = [
  {
    image: "/archive/tech-connect-ai-leaders.webp",
    title: { en: "Tech Connect 4.0 — AI Leaders’ Summit", zh: "Tech Connect 4.0 — AI 領袖峰會" },
    copy: { en: "Industry leaders and participants gathered around practical AI adoption.", zh: "產業領袖與參加者聚首交流實務 AI 應用。" },
    alt: { en: "Group photograph at the WTIA Tech Connect 4.0 AI Leaders’ Summit", zh: "WTIA Tech Connect 4.0 AI 領袖峰會團體照" },
  },
  {
    image: "/archive/tech-connect-community.webp",
    title: { en: "Tech Connect 4.0 — Community seminar", zh: "Tech Connect 4.0 — 社群研討會" },
    copy: { en: "A candid view of the audience, speakers and conversations behind the programme.", zh: "紀錄計劃現場的觀眾、講者與真實交流。" },
    alt: { en: "Audience and speaker during a WTIA Tech Connect community seminar", zh: "WTIA Tech Connect 社群研討會上的觀眾與講者" },
  },
  {
    image: "/archive/asia-smart-summit.webp",
    title: { en: "Asia Smart Innovation Awards Summit 2025", zh: "亞洲智慧創新大獎峰會 2025" },
    copy: { en: "A regional community of innovators meeting in Hong Kong.", zh: "區內創新者在香港匯聚交流。" },
    alt: { en: "Group photograph at the Asia Smart Innovation Awards Summit 2025", zh: "亞洲智慧創新大獎峰會 2025 團體照" },
  },
  {
    image: "/archive/asia-smart-shanghai.webp",
    title: { en: "Asia Smart Innovation Awards — Shanghai delegation", zh: "亞洲智慧創新大獎 — 上海考察團" },
    copy: { en: "Regional exchange in action, documented through the WTIA archive.", zh: "由 WTIA 歷史紀錄見證的區域交流行動。" },
    alt: { en: "Asia Smart Innovation Awards delegation visiting an innovation centre in Shanghai", zh: "亞洲智慧創新大獎考察團到訪上海創新中心" },
  },
];

const membershipPlans = [
  {
    name: { en: "Professional", zh: "專業人士" },
    copy: { en: "Learn, contribute and connect across the industry.", zh: "學習、參與並連接不同產業。" },
    benefits: { en: ["Events and councils", "Skills pathways", "Professional network"], zh: ["活動及委員會", "技能發展路徑", "專業人脈網絡"] },
  },
  {
    name: { en: "Startup", zh: "初創企業" },
    copy: { en: "Build trusted visibility and meet buyers.", zh: "建立可信曝光並接觸買家。" },
    benefits: { en: ["Organisation profile", "Solution listing", "Programme access"], zh: ["機構專頁", "解決方案刊登", "計劃參與機會"] },
  },
  {
    name: { en: "SME", zh: "中小企" },
    copy: { en: "Adopt AI practically and find growth partners.", zh: "務實應用 AI 並尋找增長夥伴。" },
    benefits: { en: ["AI readiness", "Provider introductions", "Market clinics"], zh: ["AI 準備度評估", "供應商引薦", "市場診所"] },
  },
  {
    name: { en: "Corporate", zh: "企業" },
    copy: { en: "Source solutions and shape industry action.", zh: "尋找方案並推動產業行動。" },
    benefits: { en: ["Company seats", "Buyer challenges", "Executive briefings"], zh: ["企業席位", "買家挑戰", "高層簡報"] },
  },
  {
    name: { en: "Strategic Partner", zh: "策略夥伴" },
    copy: { en: "Help build Hong Kong’s AI+ platform.", zh: "共同建設香港 AI+ 產業平台。" },
    benefits: { en: ["Mission partnership", "Programme co-creation", "Regional visibility"], zh: ["使命伙伴關係", "共同設計計劃", "區域曝光"] },
  },
];

function hrefFor(lang: SiteLanguage, path = "") {
  return "/" + lang + (path ? "/" + path : "");
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Brand({ lang }: { lang: SiteLanguage }) {
  return (
    <a className="brand" href={hrefFor(lang)} aria-label="WiseTech Hong Kong home">
      <span className="brand-logo-wrap">
        <img src="/brand/wtia-legacy-logo.png" alt="Hong Kong Wireless Technology Industry Association — WTIA logo" width={2001} height={721} />
      </span>
      <span className="brand-copy">
        <strong>WiseTech Hong Kong</strong>
        <small>{lang === "en" ? "The evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association" : "Hong Kong Wireless Technology Industry Association 持續發展中的 AI+ 產業平台 · 中文法定名稱待正式批准"}</small>
      </span>
    </a>
  );
}

function Header({ lang, currentPath }: { lang: SiteLanguage; currentPath: string[] }) {
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeMenuTimerRef = useRef<number | null>(null);
  const otherLang = lang === "en" ? "zh" : "en";
  const translatedPath = "/" + otherLang + (currentPath.length ? "/" + currentPath.join("/") : "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(null);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const active = menu;
        setMenu(null);
        triggerRefs.current[active]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  useEffect(() => () => {
    if (closeMenuTimerRef.current !== null) window.clearTimeout(closeMenuTimerRef.current);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const mobileTrigger = mobileTriggerRef.current;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(mobileDialogRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') || []);
    mobileDialogRef.current?.querySelector<HTMLElement>(".mobile-menu-top>button")?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mobileTrigger?.focus();
    };
  }, [mobileOpen]);

  const cancelMenuClose = () => {
    if (closeMenuTimerRef.current === null) return;
    window.clearTimeout(closeMenuTimerRef.current);
    closeMenuTimerRef.current = null;
  };

  const scheduleMenuClose = () => {
    cancelMenuClose();
    closeMenuTimerRef.current = window.setTimeout(() => {
      setMenu(null);
      closeMenuTimerRef.current = null;
    }, 180);
  };

  const openMenu = (id: string) => {
    cancelMenuClose();
    setMenu(id);
  };

  const onDesktopKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const index = megaNav.findIndex((item) => item.id === id);
    const focusTrigger = (nextIndex: number) => {
      const next = megaNav[(nextIndex + megaNav.length) % megaNav.length];
      setMenu(null);
      triggerRefs.current[next.id]?.focus();
    };

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTrigger(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTrigger(index + 1);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusTrigger(event.key === "Home" ? 0 : megaNav.length - 1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (menu === id && event.key !== "ArrowDown") {
        setMenu(null);
        return;
      }
      openMenu(id);
      window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`#mega-${id} a`)?.focus());
    }
  };

  const mobileLinksFor = (id: string) => {
    const group = megaNav.find((entry) => entry.id === id);
    if (!group) return [];
    const allLinks = group.columns.flatMap((column) => column.links);
    return allLinks.slice(0, 5);
  };

  const section = currentPath[0] || "home";
  const activeGroup = (id: string) => (
    id === "events-activities" ? ["events", "activities", "host-an-activity"].includes(section) :
    id === "members-solutions" ? ["members", "solutions", "membership", "join", "portal", "partners", "partner-with-us", "submit-challenge", "request-introduction"].includes(section) :
    id === "ai-plus" ? section === "ai-plus" :
    id === "programmes-gba" ? ["programmes", "gba"].includes(section) :
    ["insights", "about", "why-wisetech", "responsible-ai", "verification", "ai-transparency", "ai-ops", "search", "contact", "accessibility", "privacy", "terms"].includes(section)
  );

  return (
    <>
      {announcementVisible && <div className="announcement">
        <span className="announcement-dot" aria-hidden="true" />
        <span>{lang === "en" ? "Help shape the next AI+ industry activity" : "共同策劃下一個 AI+ 產業活動"}</span>
        <a href={hrefFor(lang, "events#interest")}>{lang === "en" ? "Register interest" : "登記興趣"} <Arrow /></a>
        <button className="announcement-close" onClick={() => setAnnouncementVisible(false)} aria-label={lang === "en" ? "Dismiss announcement" : "關閉公告"}>×</button>
      </div>}
      <header
        ref={headerRef}
        className={(scrolled ? "site-header scrolled" : "site-header") + (announcementVisible ? "" : " no-announcement")}
        onMouseEnter={cancelMenuClose}
        onMouseLeave={scheduleMenuClose}
        onFocusCapture={cancelMenuClose}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenu(null);
        }}
      >
        <div className="header-inner">
          <Brand lang={lang} />
          <nav className="desktop-nav" aria-label={lang === "en" ? "Primary navigation" : "主要導覽"}>
            {megaNav.map((item) => (
              <button
                key={item.id}
                ref={(node) => { triggerRefs.current[item.id] = node; }}
                id={`mega-trigger-${item.id}`}
                className={`${menu === item.id ? "nav-button active" : "nav-button"}${activeGroup(item.id) ? " current" : ""}${item.eventFirst ? " event-first" : ""}`}
                aria-expanded={menu === item.id}
                aria-controls={"mega-" + item.id}
                aria-haspopup="true"
                aria-current={activeGroup(item.id) ? "page" : undefined}
                onKeyDown={(event) => onDesktopKeyDown(event, item.id)}
                onClick={() => setMenu(menu === item.id ? null : item.id)}
                onMouseEnter={() => openMenu(item.id)}
              >
                {t(item.navLabel, lang)} <span aria-hidden="true">⌄</span>
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <a className="search-link" href={hrefFor(lang, "search")} aria-label={lang === "en" ? "Search WiseTech" : "搜尋 WiseTech"}>⌕</a>
            <a className="language-link" href={translatedPath} onClick={(event) => { event.preventDefault(); window.location.assign(translatedPath + window.location.search + window.location.hash); }}>{lang === "en" ? "繁中" : "EN"}</a>
            <a className="signin-link" href={hrefFor(lang, "portal")}>{lang === "en" ? "Member sign in" : "會員登入"}</a>
            <a className="button button-small" href={hrefFor(lang, "join")}>{lang === "en" ? "Join WiseTech" : "加入 WiseTech"}</a>
            <button ref={mobileTriggerRef} className="mobile-trigger" aria-expanded={mobileOpen} aria-controls="mobile-site-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label={lang === "en" ? (mobileOpen ? "Close menu" : "Open menu") : (mobileOpen ? "關閉選單" : "開啟選單")}>
              <span /><span />
            </button>
          </div>
        </div>
        {megaNav.map((item) => menu === item.id && (
          <section className={`mega-menu-v2${item.eventFirst ? " mega-event" : ""}`} id={"mega-" + item.id} aria-labelledby={`mega-trigger-${item.id}`} key={item.id}>
            <div className="mega-menu-main">
              <div className="mega-menu-heading">
                <div>
                  <span>{lang === "en" ? "Explore" : "探索"}</span>
                  <strong>{t(item.label, lang)}</strong>
                </div>
                <a href={hrefFor(lang, item.path)} onClick={() => setMenu(null)}>{lang === "en" ? "View overview" : "查看總覽"}<Arrow /></a>
              </div>
              <div className="mega-columns">
                {item.columns.map((column) => <div className="mega-column" key={column.title.en}><p className="mega-column-title">{t(column.title, lang)}</p>{column.links.map((link) => <a href={hrefFor(lang, link.path)} key={`${link.path}-${link.label.en}`} onClick={() => setMenu(null)}>{t(link.label, lang)}<Arrow /></a>)}</div>)}
              </div>
            </div>
            <aside className="mega-feature-v2">
              <span className="status-label">{t(item.feature.label, lang)}</span>
              <strong className="mega-feature-title">{t(item.feature.title, lang)}</strong>
              <p>{t(item.feature.copy, lang)}</p>
              <a href={hrefFor(lang, item.feature.path)} onClick={() => setMenu(null)}>{t(item.feature.cta, lang)} <Arrow /></a>
            </aside>
          </section>
        ))}
      </header>
      {mobileOpen && (
        <div ref={mobileDialogRef} className="mobile-menu" id="mobile-site-menu" role="dialog" aria-modal="true" aria-label={lang === "en" ? "Site menu" : "網站選單"}>
          <div className="mobile-menu-top"><Brand lang={lang} /><button onClick={() => setMobileOpen(false)} aria-label={lang === "en" ? "Close menu" : "關閉選單"}>×</button></div>
          <nav className="mobile-priority-actions" aria-label={lang === "en" ? "Priority actions" : "主要操作"}>
            <a className="mobile-event-action" href={hrefFor(lang, "events?status=open")} onClick={() => setMobileOpen(false)}>{lang === "en" ? "Find an Event" : "尋找活動"}<Arrow /></a>
            <a href={hrefFor(lang, "join")} onClick={() => setMobileOpen(false)}>{lang === "en" ? "Join WiseTech" : "加入 WiseTech"}<Arrow /></a>
          </nav>
          <nav className="mobile-utilities" aria-label={lang === "en" ? "Utility navigation" : "實用導覽"}>
            <a href={hrefFor(lang, "search")} onClick={() => setMobileOpen(false)}>{lang === "en" ? "Search" : "搜尋"}</a>
            <a href={hrefFor(lang, "portal")} onClick={() => setMobileOpen(false)}>{lang === "en" ? "Member sign in" : "會員登入"}</a>
            <a href={translatedPath} onClick={(event) => { event.preventDefault(); window.location.assign(translatedPath + window.location.search + window.location.hash); }}>{lang === "en" ? "繁體中文" : "English"}</a>
          </nav>
          <p className="eyebrow">{lang === "en" ? "Explore the ecosystem" : "探索生態系統"}</p>
          <div className="mobile-accordions">
            {megaNav.map((item) => {
              const open = mobileSection === item.id;
              return <section key={item.id} className={item.eventFirst ? "mobile-accordion event-first" : "mobile-accordion"}>
                <button aria-expanded={open} aria-controls={`mobile-panel-${item.id}`} onClick={() => setMobileSection(open ? null : item.id)}>{t(item.label, lang)}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
                {open && <div id={`mobile-panel-${item.id}`} className="mobile-accordion-panel">{mobileLinksFor(item.id).map((link, linkIndex, links) => <a className={linkIndex === links.length - 1 ? "mobile-view-all" : undefined} href={hrefFor(lang, link.path)} key={`${item.id}-${link.path}`} onClick={() => setMobileOpen(false)}>{t(link.label, lang)}<Arrow /></a>)}</div>}
              </section>;
            })}
          </div>
        </div>
      )}
    </>
  );
}

function Hero({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="/archive/tech-connect-ai-leaders.webp" alt={lang === "en" ? "Speakers and organisers at WTIA Tech Connect AI for ALL in Hong Kong" : "WTIA Tech Connect 全民 AI 香港活動的講者及主辦團隊"} width={1800} height={1013} fetchPriority="high" />
      <div className="hero-scrim" />
      <div className="network-field" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="hero-content shell">
        <p className="eyebrow light">WiseTech Hong Kong</p>
        <h1 id="hero-title">{lang === "en" ? "How can Hong Kong lead the AI+ era?" : "香港如何引領 AI+ 時代？"}</h1>
        <p>{lang === "en" ? "WiseTech Hong Kong is the evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association—connecting corporates, SMEs, startups, professionals, academia, investors, public bodies, GBA partners and international markets." : "WiseTech Hong Kong 是 Hong Kong Wireless Technology Industry Association 持續發展中的 AI+ 產業平台，連結企業、中小企、初創、專業人士、學界、投資者、公共機構、大灣區夥伴及國際市場。中文法定名稱待正式批准。"}</p>
        <div className="hero-actions">
          <a className="button" href={hrefFor(lang, "events?status=open")}>{lang === "en" ? "Find Event or Activity" : "尋找活動或參與機會"} <Arrow /></a>
          <a className="text-link light-link" href={hrefFor(lang, "join")}>{lang === "en" ? "Join WiseTech" : "加入 WiseTech"} <Arrow /></a>
          <a className="text-link light-link" href={hrefFor(lang, "members")}>{lang === "en" ? "Explore Members & Solutions" : "探索會員及方案"} <Arrow /></a>
        </div>
      </div>
      <div className="hero-note">{lang === "en" ? "Tech Connect · AI for ALL · Hong Kong" : "Tech Connect · 全民 AI · 香港"}</div>
      <div className="hero-scroll" aria-hidden="true"><span /> {lang === "en" ? "Discover" : "向下探索"}</div>
    </section>
  );
}

function LegacyNetwork({ lang }: { lang: SiteLanguage }) {
  const [active, setActive] = useState<"supporting" | "regional" | "media">("supporting");
  const categories = {
    supporting: {
      label: lang === "en" ? "Supporting Organizations" : "支持機構",
      directory: "supporting",
      partners: supportingOrganisations,
    },
    regional: {
      label: lang === "en" ? "Regional Partners" : "區域夥伴",
      directory: "regional",
      partners: regionalPartners,
    },
    media: {
      label: lang === "en" ? "Media Partners" : "媒體夥伴",
      directory: "media",
      partners: mediaPartners,
    },
  } as const;
  const selected = categories[active];
  const previewCount = Math.min(12, selected.partners.length);

  return (
    <section className="legacy-network" aria-labelledby="legacy-network-title">
      <div className="shell">
        <div className="legacy-network-heading">
          <div>
            <p className="eyebrow">{lang === "en" ? "Built on real relationships" : "承接真實合作網絡"}</p>
            <h2 id="legacy-network-title">{lang === "en" ? "A network with history—and a future." : "有歷史根基，也有未來方向的網絡。"}</h2>
          </div>
          <div className="legacy-network-note">
            <p>{lang === "en" ? "These logos are sourced from WTIA’s historical supporting, regional and media network listings. Inclusion does not imply a current relationship unless separately confirmed." : "標誌來自 WTIA 過往的支持機構、區域夥伴及媒體夥伴名單；除非另有確認，列入名單並不代表現時合作關係。"}</p>
            <a href={hrefFor(lang, "partners")}>{lang === "en" ? "View all 79 partner records" : "查看全部 79 個夥伴紀錄"} <Arrow /></a>
          </div>
        </div>

        <div className="legacy-tabs" role="group" aria-label={lang === "en" ? "WTIA network categories" : "WTIA 網絡分類"}>
          {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => (
            <button
              key={key}
              className={active === key ? "active" : ""}
              aria-pressed={active === key}
              onClick={() => setActive(key)}
            >
              <span>{categories[key].label}</span>
              <b>{String(categories[key].partners.length).padStart(2, "0")}</b>
            </button>
          ))}
        </div>

        <div
          className="legacy-logo-rail"
          id="legacy-partner-panel"
          aria-live="polite"
        >
          {selected.partners.slice(0, previewCount).map((partner) => (
            <article className="legacy-logo-card" key={partner.file}>
              <div className="legacy-logo-image">
                <img
                  src={`/partners/${selected.directory}/${partner.file}`}
                  alt={`${partner.name} logo`}
                  width={960}
                  height={606}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3>{partner.name}</h3>
            </article>
          ))}
        </div>
        <div className="legacy-directory-action"><p>{lang === "en" ? `Showing ${previewCount} of ${selected.partners.length} records in this category.` : `顯示此分類 ${selected.partners.length} 個紀錄中的 ${previewCount} 個。`}</p><a className="button button-dark" href={hrefFor(lang, "partners")}>{lang === "en" ? "View All Partners" : "查看所有夥伴"} <Arrow /></a></div>
      </div>
    </section>
  );
}

function RealCommunity({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="archive-proof" aria-labelledby="archive-proof-title">
      <div className="shell">
        <div className="archive-proof-heading">
          <div>
            <p className="eyebrow">{lang === "en" ? "From the WTIA archive" : "WTIA 真實活動紀錄"}</p>
            <h2 id="archive-proof-title">{lang === "en" ? "Real people. Real programmes. A platform with history." : "真實人物、真實計劃，一個承接歷史的平台。"}</h2>
          </div>
          <div>
            <p>{lang === "en" ? "A look back at the people, programmes and regional exchanges that have shaped the WTIA community." : "回顧塑造 WTIA 社群的人物、計劃及區域交流活動。"}</p>
            <a className="text-link" href="https://hkwtia.org/photo-gallery/" target="_blank" rel="noreferrer">{lang === "en" ? "View the official photo gallery" : "查看官方相片集"} <Arrow /></a>
          </div>
        </div>
        <div className="archive-photo-grid">
          {archiveStories.map((story, index) => (
            <figure className={index === 0 ? "archive-photo-card archive-photo-feature" : "archive-photo-card"} key={story.image}>
              <div className="archive-photo-media"><img src={story.image} alt={t(story.alt, lang)} loading="lazy" decoding="async" /></div>
              <figcaption>
                <span>{lang === "en" ? "WTIA Event Highlights" : "WTIA 活動回顧"}</span>
                <h3>{t(story.title, lang)}</h3>
                <p>{t(story.copy, lang)}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceSection({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section audience-section shell">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">{lang === "en" ? "Your pathway" : "你的路徑"}</p><h2>{lang === "en" ? "Where do you want to create impact?" : "你希望在哪裡創造影響？"}</h2></div>
        <p>{lang === "en" ? "Different ambitions need different routes. Start with the outcome you want—not the structure of an institution." : "不同目標需要不同路徑。先從你希望達成的成果開始，而不是從機構架構開始。"}</p>
      </div>
      <div className="audience-grid">
        {audiences.map((item, index) => (
          <a className={"audience-card accent-" + item.accent} href={hrefFor(lang, item.path)} key={item.key}>
            <span className="card-index">0{index + 1}</span>
            <h3>{t(item.title, lang)}</h3>
            <p>{t(item.copy, lang)}</p>
            <span className="benefit-line">{t(item.benefits, lang)}</span>
            <b>{t(item.cta, lang)} <Arrow /></b>
          </a>
        ))}
      </div>
    </section>
  );
}

function Ecosystem({ lang }: { lang: SiteLanguage }) {
  const [selected, setSelected] = useState(industries[0].key);
  const current = industries.find((industry) => industry.key === selected) || industries[0];
  return (
    <section className="section shell ecosystem-section">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">AI + Industry</p><h2>{lang === "en" ? "One ecosystem. Every industry moving forward." : "一個生態系統，推動每個產業向前。"}</h2></div>
        <p>{lang === "en" ? "Six industry pathways organise practical questions around technology, knowledge, programmes and market access. Active councils will be named only when confirmed." : "六條產業路徑把實務問題連接科技、知識、計劃及市場拓展；現行委員會只會在確認後具名公布。"}</p>
      </div>
      <div className="ecosystem-board">
        <div className="industry-list" role="list">
          {industries.map((industry) => (
            <button key={industry.key} className={selected === industry.key ? "industry-button active" : "industry-button"} onClick={() => setSelected(industry.key)}>
              <span>{industry.signal}</span><b>{t(industry.name, lang)}</b><Arrow />
            </button>
          ))}
        </div>
        <div className="industry-focus" aria-live="polite">
          <div className="orbital-map" aria-hidden="true"><i /><i /><i /><i /><span>AI+</span></div>
          <p className="eyebrow">{lang === "en" ? "Selected industry pathway" : "已選產業路徑"}</p>
          <h3>{t(current.name, lang)}</h3>
          <p>{t(current.brief, lang)}</p>
          <ul>
            <li>{lang === "en" ? "Industry challenges" : "產業挑戰"}</li>
            <li>{lang === "en" ? "Relevant solution categories" : "相關方案類別"}</li>
            <li>{lang === "en" ? "Programmes + events" : "計劃 + 活動"}</li>
          </ul>
          <a className="text-link" href={hrefFor(lang, "ai-plus/" + current.path)}>{lang === "en" ? "Enter this ecosystem" : "進入此生態系統"} <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function OpportunityBoard({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section opportunity-section" id="open-now" aria-labelledby="open-now-title">
      <div className="shell">
        <div className="section-heading split-heading inverse">
          <div><p className="eyebrow light">{lang === "en" ? "Open now" : "現正開放"}</p><h2 id="open-now-title">{lang === "en" ? "What can you join today?" : "今天有甚麼可以參加？"}</h2></div>
          <p>{lang === "en" ? "Only activities with confirmed dates, eligibility and registration details appear here." : "只有日期、資格及報名詳情已確認的活動，才會在此顯示。"}</p>
        </div>
        <div className="honest-empty" aria-live="polite">
          <span className="pulse-ring" aria-hidden="true" />
          <div><p className="status-label">{lang === "en" ? "Current availability" : "目前狀態"}</p><h3>{lang === "en" ? "No activities are currently open." : "目前未有活動開放報名。"}</h3><p>{lang === "en" ? "Register for activity updates, or bring the team a defined business challenge to help shape a useful future session." : "登記接收活動通知，或向團隊提出明確業務挑戰，協助策劃實用的未來活動。"}</p></div>
          <div className="open-now-actions"><a className="button button-light" href={hrefFor(lang, "events#interest")}>{lang === "en" ? "Get activity updates" : "接收活動通知"} <Arrow /></a><a className="text-link light-link" href={hrefFor(lang, "submit-challenge")}>{lang === "en" ? "Submit a challenge" : "提交挑戰"} <Arrow /></a></div>
        </div>
      </div>
    </section>
  );
}

function MarketProducts({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section shell product-section">
      <div className="section-heading"><p className="eyebrow">Demand + Supply</p><h2>{lang === "en" ? "Connections built for implementation" : "為真正落地而建立的連結"}</h2></div>
      <div className="product-split">
        <article className="product-panel directory-panel">
          <div className="product-panel-head"><span>01</span><span className="status-label">{lang === "en" ? "Member Directory" : "會員名錄"}</span></div>
          <h3>{lang === "en" ? "Meet the people shaping what comes next." : "認識正在塑造未來的人。"}</h3>
          <div className="mock-search"><span aria-hidden="true">⌕</span>{lang === "en" ? "Search organisations, expertise or markets" : "搜尋機構、專長或市場"}</div>
          <div className="tag-row"><span>{lang === "en" ? "Industry" : "產業"}</span><span>{lang === "en" ? "Market" : "市場"}</span><span>{lang === "en" ? "Business intent" : "合作意向"}</span></div>
          <p>{lang === "en" ? "The directory is ready for approved public profiles, with controlled visibility and consent-based introductions. No live member records are shown yet." : "名錄已準備承載獲批公開的專頁，並設有可控可見度及需獲同意的引薦流程；目前尚未顯示現行會員紀錄。"}</p>
          <a className="text-link" href={hrefFor(lang, "members")}>{lang === "en" ? "Discover members" : "探索會員"} <Arrow /></a>
        </article>
        <article className="product-panel marketplace-panel">
          <div className="product-panel-head"><span>02</span><span className="status-label">{lang === "en" ? "AI Solutions Marketplace" : "AI 解決方案市場"}</span></div>
          <h3>{lang === "en" ? "Find AI ready for the real world." : "尋找可在真實環境落地的 AI。"}</h3>
          <div className="solution-schematic"><i /><i /><i /><b>AI+</b></div>
          <div className="tag-row"><span>{lang === "en" ? "Use case" : "用途"}</span><span>{lang === "en" ? "Deployment" : "部署"}</span><span>{lang === "en" ? "Verification" : "核實"}</span></div>
          <p>{lang === "en" ? "The planned marketplace will compare maturity, deployment, security, market coverage and reviewed evidence. No live solution records are shown yet." : "規劃中的方案市場將比較成熟度、部署方式、安全、市場覆蓋及經審閱證據；目前尚未顯示現行方案紀錄。"}</p>
          <a className="text-link" href={hrefFor(lang, "solutions")}>{lang === "en" ? "Explore solutions" : "探索解決方案"} <Arrow /></a>
        </article>
      </div>
    </section>
  );
}

function ProgrammeShowcase({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section programme-section">
      <div className="shell">
        <div className="section-heading split-heading"><div><p className="eyebrow">{lang === "en" ? "Programmes + awards" : "計劃 + 獎項"}</p><h2>{lang === "en" ? "Participation that turns into progress" : "把參與轉化為進步"}</h2></div><p>{lang === "en" ? "Existing programme equity is retained and reframed around clear outcomes, audiences and the next action." : "保留現有計劃的品牌資產，並以成果、受眾及下一步行動重新呈現。"}</p></div>
        <div className="programme-grid">
          {programmes.map((programme, index) => (
            <article className={index === 0 ? "programme-card feature" : "programme-card"} key={programme.slug}>
              <div><span className="status-label">{t(programme.tag, lang)}</span><span className="card-index">0{index + 1}</span></div>
              <h3>{programme.name}</h3>
              <p>{t(programme.copy, lang)}</p>
              <small>{t(programme.proof, lang)}</small>
              <a href={hrefFor(lang, "programmes/" + programme.slug)}>{lang === "en" ? "View programme" : "查看計劃"} <Arrow /></a>
            </article>
          ))}
        </div>
        <a className="button button-dark" href={hrefFor(lang, "programmes")}>{lang === "en" ? "View all programmes" : "查看所有計劃"} <Arrow /></a>
      </div>
    </section>
  );
}

function EventsPreview({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section shell events-preview">
      <div className="section-heading split-heading"><div><p className="eyebrow">{lang === "en" ? "Upcoming Events & Activities" : "即將舉行活動及參與機會"}</p><h2>{lang === "en" ? "A useful event is a journey, not a single date." : "有用活動是一段旅程，而不只是一個日期。"}</h2></div><p>{lang === "en" ? "No new dates are currently confirmed. See how discovery, preparation and follow-through will work, or explore the completed 2025 records." : "目前尚未有新日期獲確認。你可先了解活動發現、準備及跟進流程，或瀏覽 2025 已完成紀錄。"}</p></div>
      <div className="event-stage-grid">
        {[
          ["01", lang === "en" ? "Before" : "活動前", lang === "en" ? "Recommendations · pricing · capacity · matchmaking" : "推薦 · 票價 · 名額 · 配對"],
          ["02", lang === "en" ? "During" : "活動中", lang === "en" ? "Check-in · sessions · questions · meetings" : "登記 · 議程 · 提問 · 會面"],
          ["03", lang === "en" ? "After" : "活動後", lang === "en" ? "Resources · introductions · follow-up · outcomes" : "資源 · 引薦 · 跟進 · 成果"],
        ].map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
      <div className="event-empty"><div><span className="status-label">{lang === "en" ? "Current availability" : "目前狀態"}</span><h3>{lang === "en" ? "No activities are currently open." : "目前未有活動開放報名。"}</h3></div><a className="button button-dark" href={hrefFor(lang, "events")}>{lang === "en" ? "View Open Now & Past Events" : "查看現正開放及過往活動"} <Arrow /></a></div>
    </section>
  );
}

function ImpactSection({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="impact-section">
      <div className="shell impact-grid">
        <div><p className="eyebrow light">{lang === "en" ? "Published evidence" : "已公布資料"}</p><h2>{lang === "en" ? "Clear facts, with their context attached." : "每項數據，都附有清晰脈絡。"}</h2><p>{lang === "en" ? "These figures describe available WTIA programme, event and network records. They are not presented as current Association-wide impact totals." : "以下數字描述現有 WTIA 計劃、活動及網絡紀錄，並不代表商會現時的整體影響總數。"}</p><a className="text-link light-link" href="https://hkwtia.org/" target="_blank" rel="noreferrer">{lang === "en" ? "Review the WTIA source" : "查看 WTIA 資料來源"} <Arrow /></a></div>
        <div className="impact-metrics">
          <div><strong>17</strong><span>{lang === "en" ? "Asian regions represented" : "個亞洲地區參與"}</span><small>{lang === "en" ? "Definition: regions represented in the Asia Smart Innovation Awards 2025 programme · Period: 2025" : "定義：亞洲智慧創新大獎 2025 計劃所涵蓋地區 · 期間：2025"}</small></div>
          <div><strong>2</strong><span>{lang === "en" ? "completed event records" : "個已完成活動紀錄"}</span><small>{lang === "en" ? "Definition: completed 2025 events with original WTIA pages available on this site · Period: July–October 2025" : "定義：本網站備有 WTIA 原頁面的 2025 已完成活動 · 期間：2025 年 7 月至 10 月"}</small></div>
          <div><strong>79</strong><span>{lang === "en" ? "historical network listings" : "個過往網絡紀錄"}</span><small>{lang === "en" ? "Definition: 58 supporting, 15 regional and 6 media listings sourced from WTIA · Current relationship status not confirmed" : "定義：來自 WTIA 的 58 個支持機構、15 個區域及 6 個媒體名單 · 現時關係狀態未確認"}</small></div>
          <div className="method-card"><span className="status-label">{lang === "en" ? "Source note" : "來源說明"}</span><p>{lang === "en" ? "Source: original WTIA public pages. Last reviewed 25 August 2026." : "來源：WTIA 原有公開頁面。最後檢視：2026 年 8 月 25 日。"}</p></div>
        </div>
      </div>
    </section>
  );
}

function OutcomesSection({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section shell outcomes-section">
      <div className="section-heading split-heading"><div><p className="eyebrow">{lang === "en" ? "Outcome stories" : "成果故事"}</p><h2>{lang === "en" ? "Results should be specific, attributable and permission-cleared." : "成果必須具體、有清晰歸屬並獲授權公開。"}</h2></div><p>{lang === "en" ? "A case is published only when the participating organisation, challenge, action, reporting period and result can be stated responsibly." : "只有在參與機構、挑戰、行動、報告期及成果均可負責任地交代時，案例才會發布。"}</p></div>
      <div className="outcome-template">
        <div className="outcome-visual"><span>{lang === "en" ? "Publishing framework" : "發布框架"}</span><b>{lang === "en" ? "Challenge → Connection → Action → Result" : "挑戰 → 連結 → 行動 → 成果"}</b></div>
        <div><span className="status-label">{lang === "en" ? "Current availability" : "目前狀態"}</span><h3>{lang === "en" ? "No public case study is available yet." : "目前尚未有公開案例。"}</h3><p>{lang === "en" ? "The Association will add outcome stories only after the evidence, attribution and permission to publish have been confirmed. This avoids turning participation into an unsupported success claim." : "商會只會在證據、歸屬及發布許可獲確認後加入成果故事，避免把參與誤寫成未獲支持的成功聲稱。"}</p><a className="text-link" href={hrefFor(lang, "partner-with-us#enquiry")}>{lang === "en" ? "Discuss a measurable initiative" : "洽談可量度項目"} <Arrow /></a></div>
      </div>
    </section>
  );
}

function GbaSection({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="gba-section">
      <div className="gba-map" aria-hidden="true"><span className="hk-node">HK</span><span className="gz-node">GZ</span><span className="sz-node">SZ</span><span className="world-node">↗</span><i /><i /><i /></div>
      <div className="shell gba-copy"><p className="eyebrow light">GBA Gateway</p><h2>{lang === "en" ? "Hong Kong expertise. GBA opportunity. Global ambition." : "香港專長，大灣區機遇，全球視野。"}</h2><p>{lang === "en" ? "A practical route for market entry, soft landing, delegations, buyer matching and long-term regional partnerships." : "提供市場進入、落地支援、考察團、買家配對及長期區域合作的實務路徑。"}</p><div className="hero-actions"><a className="button button-light" href={hrefFor(lang, "gba")}>{lang === "en" ? "Explore GBA Gateway" : "探索大灣區通道"} <Arrow /></a><a className="text-link light-link" href={hrefFor(lang, "activities/gba-delegations")}>{lang === "en" ? "View delegations" : "查看考察團"} <Arrow /></a></div></div>
    </section>
  );
}

function ConversionPaths({ lang }: { lang: SiteLanguage }) {
  return (
    <section className="section conversion-section">
      <div className="shell">
        <div className="section-heading split-heading"><div><p className="eyebrow">{lang === "en" ? "Take part" : "投入參與"}</p><h2>{lang === "en" ? "Choose the relationship that fits your goal." : "按你的目標，選擇合適參與關係。"}</h2></div><p>{lang === "en" ? "Membership supports ongoing participation. Partnership starts with a defined audience, initiative and intended outcome." : "會籍支援持續參與；夥伴合作則由清晰受眾、項目及預期成果開始。"}</p></div>
        <div className="conversion-grid">
          <article>
            <span className="status-label">{lang === "en" ? "Membership" : "會籍"}</span>
            <h3>{lang === "en" ? "Build an active route into the ecosystem." : "建立持續參與生態系統的路徑。"}</h3>
            <p>{lang === "en" ? "Choose a pathway for professionals, startups, SMEs, corporates or strategic partners. Current fees and final entitlements are provided by the membership team." : "專業人士、初創、中小企、企業及策略夥伴可選擇相應路徑；現行費用及最終權益由會員團隊提供。"}</p>
            <ul><li>{lang === "en" ? "Relevant activities and knowledge" : "相關活動及知識"}</li><li>{lang === "en" ? "Profile and visibility choices" : "專頁及可見度選擇"}</li><li>{lang === "en" ? "A practical first-90-day journey" : "實用的首 90 天旅程"}</li></ul>
            <div><a className="button button-dark" href={hrefFor(lang, "membership")}>{lang === "en" ? "Compare Membership" : "比較會籍"} <Arrow /></a><a className="text-link" href={hrefFor(lang, "join")}>{lang === "en" ? "Prepare a membership enquiry" : "準備會籍查詢"} <Arrow /></a></div>
          </article>
          <article>
            <span className="status-label">{lang === "en" ? "Partnership" : "夥伴合作"}</span>
            <h3>{lang === "en" ? "Co-create a useful industry initiative." : "共同設計有用的產業項目。"}</h3>
            <p>{lang === "en" ? "Work with the Association on a business challenge, programme, knowledge initiative, event or market-access pathway with a defined purpose." : "與商會就業務挑戰、計劃、知識項目、活動或市場拓展路徑合作，並清楚界定目的。"}</p>
            <ul><li>{lang === "en" ? "Purpose and audience defined first" : "先界定目的及受眾"}</li><li>{lang === "en" ? "Roles and public claims agreed" : "協定角色及公開聲稱"}</li><li>{lang === "en" ? "Next steps and outcomes made clear" : "清楚列明下一步及成果"}</li></ul>
            <div><a className="button button-dark" href={hrefFor(lang, "partner-with-us")}>{lang === "en" ? "Start a Partnership" : "展開合作"} <Arrow /></a><a className="text-link" href={hrefFor(lang, "partners")}>{lang === "en" ? "Meet the Network" : "認識夥伴網絡"} <Arrow /></a></div>
          </article>
        </div>
      </div>
    </section>
  );
}

function HomePage({ lang }: { lang: SiteLanguage }) {
  return <><Hero lang={lang} /><OpportunityBoard lang={lang} /><AudienceSection lang={lang} /><EventsPreview lang={lang} /><MarketProducts lang={lang} /><OutcomesSection lang={lang} /><Ecosystem lang={lang} /><ProgrammeShowcase lang={lang} /><GbaSection lang={lang} /><ImpactSection lang={lang} /><RealCommunity lang={lang} /><LegacyNetwork lang={lang} /><ConversionPaths lang={lang} /></>;
}

function PageHero({ lang, eyebrow, title, copy, visual }: { lang: SiteLanguage; eyebrow: string; title: string; copy: string; visual?: SiteVisual }) {
  const cue = eyebrow.toLowerCase();
  const resolvedVisual = visual ?? (
    cue.includes("gba") || cue.includes("大灣區") ? siteVisuals.gba :
    cue.includes("member") || cue.includes("會員") || cue.includes("membership") || cue.includes("join") || cue.includes("加入") ? siteVisuals.membership :
    cue.includes("event") || cue.includes("活動") || cue.includes("programme") || cue.includes("計劃") ? siteVisuals.community :
    cue.includes("transparency") || cue.includes("透明") || cue.includes("operations") || cue.includes("營運") || cue.includes("insight") || cue.includes("洞察") || cue.includes("about") || cue.includes("關於") ? siteVisuals.governance :
    siteVisuals.adoption
  );
  return (
    <section className="page-hero">
      <figure className="page-hero-photo">
        <img src={resolvedVisual.src} alt={t(resolvedVisual.alt, lang)} decoding="async" />
        <figcaption>{t(resolvedVisual.caption, lang)}</figcaption>
      </figure>
      <div className="page-hero-art" aria-hidden="true"><i /><i /><i /><span>W+</span></div>
      <div className="shell"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{copy}</p><div className="breadcrumb"><a href={hrefFor(lang)}>{lang === "en" ? "Home" : "首頁"}</a><span>/</span><b>{eyebrow}</b></div></div>
    </section>
  );
}

function PendingRecordPage({ lang, kind, slug, backPath }: { lang: SiteLanguage; kind: LocalText; slug: string; backPath: string }) {
  const requestedRecord = slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  return <><PageHero lang={lang} eyebrow={t(kind, lang)} title={lang === "en" ? "This profile is coming soon." : "此專頁即將推出。"} copy={lang === "en" ? "We’re preparing the latest information for “" + requestedRecord + "”. Explore the current directory in the meantime." : "我們正整理「" + requestedRecord + "」的最新資料，期間可先瀏覽現有名錄。"} /><section className="section shell standard-page"><div className="standard-lead"><p className="eyebrow">{lang === "en" ? "Coming soon" : "即將推出"}</p><h2>{lang === "en" ? "A clearer profile is on the way." : "更完整清晰的專頁正在準備中。"}</h2><p>{lang === "en" ? "The upcoming profile will bring together the organisation’s expertise, interests and ways to connect." : "新專頁將整合機構專長、合作興趣及聯繫方式。"}</p></div><a className="button button-dark" href={hrefFor(lang, backPath)}>{lang === "en" ? "Return to listings" : "返回名錄"} <Arrow /></a></section></>;
}

function DirectoryPage({ lang }: { lang: SiteLanguage }) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prompts = lang === "en" ? ["Search organisations", "Search professionals", "Find AI providers", "Find corporate buyers", "Find GBA partners", "Find mentors and talent"] : ["搜尋機構", "搜尋專業人士", "尋找 AI 供應商", "尋找企業買家", "尋找大灣區夥伴", "尋找導師及人才"];
  const filters = lang === "en" ? ["Industry", "Member type", "AI capability", "Business interest", "Market coverage", "Organisation size", "Looking to buy", "Looking to sell", "Looking for partners", "Available to mentor"] : ["產業", "會員類型", "AI 能力", "合作興趣", "市場覆蓋", "機構規模", "有意採購", "有意銷售", "尋找夥伴", "可擔任導師"];
  const steps = lang === "en" ? [
    ["Discover", "Find a relevant approved public profile."], ["Explain", "State why you want to connect without sharing sensitive data."], ["Recipient review", "The recipient chooses whether to accept the request."], ["Supported introduction", "WiseTech can facilitate where fit and consent are clear."], ["Choose the next step", "Both sides decide whether and how to continue."],
  ] : [
    ["發掘", "尋找相關已批准公開專頁。"], ["說明", "交代連結原因，同時不分享敏感資料。"], ["接收方審閱", "接收方自行決定是否接受申請。"], ["支援引薦", "在配合度及同意清晰時，由 WiseTech 協助。"], ["選擇下一步", "雙方自行決定是否及如何繼續。"],
  ];
  return <>
    <PageHero lang={lang} eyebrow={lang === "en" ? "Member Directory" : "會員名錄"} title={lang === "en" ? "Meet the people and organisations building what comes next." : "認識正在建設未來的人與機構。"} copy={lang === "en" ? "Discover approved profiles by industry, capability, business interest and market coverage—then request a trusted introduction without exposing private contact details." : "按產業、能力、合作興趣及市場覆蓋探索已批准專頁，並在不公開私人聯絡資料下申請可信引薦。"} />
    <section className="section shell directory-page" id="search">
      <div className="directory-prompts" aria-label={lang === "en" ? "Suggested searches" : "建議搜尋"}>{prompts.map((prompt) => <button type="button" onClick={() => { setQuery(prompt); setSubmitted(true); }} key={prompt}>{prompt}<Arrow /></button>)}</div>
      <form className="directory-search" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label htmlFor="member-search">{lang === "en" ? "Search the directory" : "搜尋會員名錄"}</label><div><input id="member-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === "en" ? "Organisation, expertise or market" : "機構、專長或市場"} /><button className="button button-dark" type="submit">{lang === "en" ? "Search" : "搜尋"}</button></div></form>
      <div className="directory-layout"><aside><p className="eyebrow">{lang === "en" ? "Refine" : "篩選"}</p>{filters.map((filter) => <button type="button" key={filter}>{filter}<span>+</span></button>)}</aside><div className="results-area"><div className="results-head"><span>{submitted ? (lang === "en" ? "Search results" : "搜尋結果") : (lang === "en" ? "Member profiles" : "會員專頁")}</span><button type="button">{lang === "en" ? "Most relevant" : "最相關"}⌄</button></div><div className="honest-empty light-empty"><span className="pulse-ring" /><div><h2>{lang === "en" ? "The member directory is being updated." : "會員名錄正在更新。"}</h2><p>{query ? (lang === "en" ? "We could not find a current profile for “" + query + "”. Try a broader search or ask our team for an introduction." : "暫時找不到「" + query + "」的相關專頁。請嘗試較廣泛搜尋，或聯絡團隊安排引薦。") : (lang === "en" ? "New organisation and professional profiles will appear here as the WiseTech community grows." : "隨著 WiseTech 社群發展，新的機構及專業人士專頁將陸續在此登場。")}</p></div><a className="button button-dark" href={hrefFor(lang, "request-introduction")}>{lang === "en" ? "Ask for an introduction" : "查詢引薦"}</a></div></div></div>
    </section>
    <section className="section directory-intro" id="introduction"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Make the right connection" : "建立合適連結"}</p><h2>{lang === "en" ? "Introductions are purposeful and consent-based." : "引薦以目的及同意為基礎。"}</h2><p>{lang === "en" ? "The directory supports discovery without turning private contact details into a public list." : "名錄支援發掘，同時不把私人聯絡資料變成公開名單。"}</p></div><div className="intro-process">{steps.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><div className="directory-actions"><a className="button button-dark" href={hrefFor(lang, "request-introduction")}>{lang === "en" ? "Request an introduction" : "申請引薦"}</a><a className="text-link" href={hrefFor(lang, "join")}>{lang === "en" ? "Join the directory" : "加入名錄"} <Arrow /></a><a className="text-link" href={hrefFor(lang, "portal")}>{lang === "en" ? "Complete your member profile" : "完成會員專頁"} <Arrow /></a></div></div></section>
    <section className="event-interest"><div className="shell event-interest-grid"><div><p className="eyebrow light">{lang === "en" ? "Meet through activity" : "透過活動認識"}</p><h2>{lang === "en" ? "A useful event can add context before an introduction." : "有用活動可在引薦前建立脈絡。"}</h2><p>{lang === "en" ? "Browse reviewed activities without exposing private attendee information." : "在不公開私人參加者資料下瀏覽已審核活動。"}</p></div><a className="button button-light" href={hrefFor(lang, "events")}>{lang === "en" ? "Find an activity" : "尋找活動"} <Arrow /></a></div></section>
  </>;
}

function SolutionsPage({ lang }: { lang: SiteLanguage }) {
  const [active, setActive] = useState("all");
  const needs = lang === "en" ? ["Customer engagement", "Sales", "Marketing", "Knowledge management", "Data and analytics", "Operations", "Cybersecurity", "Manufacturing", "Retail", "Healthcare", "Education", "Professional services"] : ["顧客互動", "銷售", "市場推廣", "知識管理", "數據及分析", "營運", "網絡安全", "製造", "零售", "醫療健康", "教育", "專業服務"];
  const badges = lang === "en" ? [
    ["Member Verified", "The provider’s active membership identity has been checked; this is not a technical guarantee."], ["Deployment Verified", "A defined deployment claim has been reviewed against required evidence."], ["Responsible AI Reviewed", "Specified governance information has been reviewed; scope and date remain visible."], ["GBA Ready", "Defined market-readiness evidence has been reviewed for the stated market."], ["Programme Graduate", "Participation in an approved programme edition has been confirmed."], ["Award Winner", "The award, edition and category have been confirmed from an approved source."],
  ] : [
    ["會員已核實", "供應商有效會員身份已核實；這並不等同技術保證。"], ["部署已核實", "明確部署聲稱已按所需證據審閱。"], ["負責任 AI 已審閱", "指定管治資料已審閱，並持續顯示範圍及日期。"], ["大灣區準備", "指定市場的準備度證據已審閱。"], ["計劃畢業團隊", "已確認參與指定已批准計劃屆次。"], ["獎項得主", "已從批准來源確認獎項、屆次及類別。"],
  ];
  return <>
    <PageHero lang={lang} eyebrow={lang === "en" ? "AI Solutions Marketplace" : "AI 解決方案市場"} title={lang === "en" ? "Find AI ready for the real world." : "尋找可在真實環境落地的 AI。"} copy={lang === "en" ? "Search member solutions by business problem, industry, maturity, deployment model and market availability." : "按業務問題、產業、成熟度、部署模式及市場可用性搜尋會員方案。"} />
    <section className="section shell solutions-page" id="needs"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Search by business need" : "按業務需要搜尋"}</p><h2>{lang === "en" ? "Start with the work to improve." : "由需要改善的工作開始。"}</h2><p>{lang === "en" ? "Explore solution categories based on the business outcome you want to achieve." : "按你希望達成的業務成果，探索合適的方案類別。"}</p></div><div className="solution-needs">{needs.map((need, index) => <button type="button" className={active === String(index) ? "active" : ""} onClick={() => setActive(String(index))} key={need}><span>{String(index + 1).padStart(2, "0")}</span>{need}<Arrow /></button>)}</div><div className="honest-empty light-empty"><span className="pulse-ring" /><div><h2>{lang === "en" ? "The AI solutions directory is growing." : "AI 解決方案名錄正在擴展。"}</h2><p>{lang === "en" ? "Tell us what you need and our team can help identify relevant solution categories and member expertise." : "告訴我們你的需要，團隊可協助尋找相關方案類別及會員專長。"}</p></div><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Solution%20discovery">{lang === "en" ? "Find a solution" : "尋找方案"}</a></div></section>
    <section className="section solution-verification" id="verification"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Proposed badge definitions" : "擬議標章定義"}</p><h2>{lang === "en" ? "A future badge must say exactly what was reviewed—and no more." : "未來標章必須只代表已審閱的明確範圍。"}</h2><p>{lang === "en" ? "These are intended definitions, not badges currently awarded. Criteria, scope, reviewer and review date must be published before use; membership alone never equals a technical, security, performance or commercial guarantee." : "以下為擬議定義，並非現時已頒發標章。使用前必須公布準則、範圍、審閱者及審閱日期；會員身份本身絕不等同技術、安全、效能或商業保證。"}</p></div><div className="badge-grid">{badges.map(([name, copy]) => <article key={name}><span>○</span><h3>{name}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section shell solution-pathways"><article id="buyer"><p className="eyebrow">{lang === "en" ? "Buyer pathway" : "買家路徑"}</p><h2>{lang === "en" ? "Not sure what solution to search for?" : "未確定應搜尋甚麼方案？"}</h2><p>{lang === "en" ? "Describe the business challenge and WiseTech can help identify relevant solution categories and approved member providers—without exposing confidential details." : "描述業務挑戰，WiseTech 可協助辨識相關方案類別及已批准會員供應商，同時不公開機密資料。"}</p><a className="button button-dark" href={hrefFor(lang, "submit-challenge")}>{lang === "en" ? "Submit a buyer brief" : "提交買家簡報"}</a></article><article id="publish"><p className="eyebrow">{lang === "en" ? "Provider pathway" : "供應商路徑"}</p><h2>{lang === "en" ? "Have a solution ready for industry?" : "已有可服務產業的方案？"}</h2><p>{lang === "en" ? "Publish a structured, buyer-friendly listing with implementation, deployment, security, responsible AI and evidence information clearly separated." : "刊登結構清晰、買家易用的資料，分別列明落地、部署、安全、負責任 AI 及證據。"}</p><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Publish%20an%20AI%20solution">{lang === "en" ? "Publish your solution" : "刊登你的方案"}</a></article></section>
    <section className="event-interest"><div className="shell event-interest-grid"><div><p className="eyebrow light">{lang === "en" ? "See solutions in context" : "在脈絡中了解方案"}</p><h2>{lang === "en" ? "Use Buyer Days and clinics to connect a solution to a real need." : "透過企業買家日及診所，把方案連接真實需要。"}</h2><p>{lang === "en" ? "Only reviewed activities appear as bookable or open." : "只有已審核活動會顯示為可預約或開放。"}</p></div><a className="button button-light" href={hrefFor(lang, "events")}>{lang === "en" ? "Explore activities" : "探索活動"} <Arrow /></a></div></section>
  </>;
}

function MembershipPage({ lang }: { lang: SiteLanguage }) {
  const dimensions = lang === "en" ? ["Directory access", "Public profile", "Solution listings", "Introduction requests", "Event access", "Council participation", "Training benefits", "Programme eligibility", "Company seats", "Buyer briefs", "GBA support", "Partnership opportunities"] : ["名錄存取", "公開專頁", "方案刊登", "引薦申請", "活動參與", "委員會參與", "培訓權益", "計劃資格", "企業席位", "買家簡報", "大灣區支援", "合作機會"];
  const first90 = lang === "en" ? [
    ["Complete your profile", "Set approved public and member-only visibility."], ["Select industries and interests", "Improve relevant activity and content recommendations."], ["Join a relevant activity", "Choose a reviewed event, clinic, council or learning route."], ["Publish your organisation or solution", "Add structured information for review."], ["Request or receive an introduction", "Use a purpose-led and consent-based process."], ["Review programmes and market opportunities", "Check current status, eligibility and next actions."],
  ] : [
    ["完成專頁", "設定已批准公開及會員專屬可見度。"], ["選擇產業及興趣", "改善相關活動及內容推薦。"], ["參加相關活動", "選擇已審核活動、診所、委員會或學習路徑。"], ["刊登機構或方案", "加入結構化資料供審閱。"], ["申請或接收引薦", "採用目標導向及需經同意的流程。"], ["檢視計劃及市場機會", "核對現行狀態、資格及下一步。"],
  ];
  return <>
    <PageHero lang={lang} eyebrow={lang === "en" ? "Membership" : "會籍"} title={lang === "en" ? "Join the network that turns participation into opportunity." : "加入把參與轉化為機遇的網絡。"} copy={lang === "en" ? "Explore working membership pathways by goal, then confirm current availability, fees and entitlements with the membership team." : "按目標探索工作中的會籍路徑，再向會員團隊確認現時供應、費用及權益。"} />
    <section className="section shell plans-page" id="compare"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Working membership pathways" : "工作中的會籍路徑"}</p><h2>{lang === "en" ? "Choose how you want to participate." : "選擇你希望如何參與。"}</h2><p>{lang === "en" ? "These pathways show intended fit for professionals, startups, SMEs, corporates and strategic partners. Final availability and entitlements require Association confirmation." : "這些路徑展示專業人士、初創、中小企、企業及策略夥伴的擬議配合；最終供應及權益須由商會確認。"}</p></div><div className="plan-grid">{membershipPlans.map((plan, index) => <article id={["professionals", "startups", "smes", "corporates", "partners"][index]} key={plan.name.en}><span className="card-index">0{index + 1}</span><h2>{t(plan.name, lang)}</h2><p>{t(plan.copy, lang)}</p><ul>{plan.benefits[lang].map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><a className="text-link" href={hrefFor(lang, "join?plan=" + plan.name.en.toLowerCase().replace(" ", "-"))}>{lang === "en" ? "Discuss this pathway" : "洽談此路徑"} <Arrow /></a></article>)}</div><div className="pricing-note"><span className="status-label">{lang === "en" ? "Fees and entitlements" : "費用及權益"}</span><p>{lang === "en" ? "Contact the membership team to confirm current availability, approved fees, final entitlements and application guidance." : "請聯絡會員團隊，確認現時供應、已批准費用、最終權益及申請指引。"}</p></div></section>
    <section className="section membership-comparison"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Compare membership" : "比較會籍"}</p><h2>{lang === "en" ? "Compare what matters before choosing." : "選擇前比較真正重要的項目。"}</h2><p>{lang === "en" ? "Consider the access, visibility, activities, introductions and regional support that best match your goals." : "比較最配合你目標的參與機會、曝光、活動、引薦及區域支援。"}</p></div><div className="membership-dimensions">{dimensions.map((dimension, index) => <article key={dimension}><span>{String(index + 1).padStart(2, "0")}</span><h3>{dimension}</h3><p>{lang === "en" ? "Contact the membership team for tier-specific details." : "各級別詳情可向會員團隊查詢。"}</p></article>)}</div></div></section>
    <section className="section shell first-90"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Your first 90 days" : "首 90 天"}</p><h2>{lang === "en" ? "Membership begins with useful actions." : "會籍由有用行動開始。"}</h2><p>{lang === "en" ? "The sequence helps new members become discoverable, connected and active without exposing information they have not approved." : "這個次序協助新會員建立曝光、連結及參與，同時不公開未獲批准的資料。"}</p></div><div className="intro-process">{first90.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><div className="directory-actions"><a className="button button-dark" href={hrefFor(lang, "join")}>{lang === "en" ? "Join WiseTech" : "加入 WiseTech"}</a><a className="text-link" href="mailto:contact@hkwtia.org?subject=Membership%20enquiry">{lang === "en" ? "Speak with the membership team" : "聯絡會籍團隊"} <Arrow /></a></div></section>
  </>;
}

function JoinPage({ lang }: { lang: SiteLanguage }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [visibility, setVisibility] = useState("members");
  const [error, setError] = useState("");
  const roadmap = lang === "en" ? ["Choose a working pathway", "Prepare contact details", "Complete a personal profile", "Add organisation details", "Select interests", "Set directory visibility", "Confirm communication preferences", "Review fees and next steps with the team", "Begin approved onboarding"] : ["選擇工作中的路徑", "準備聯絡資料", "完成個人專頁", "加入機構資料", "選擇興趣", "設定名錄可見度", "確認通訊偏好", "與團隊檢視費用及下一步", "開始獲批導入旅程"];
  const next = () => {
    if (step === 1 && !plan) return setError(lang === "en" ? "Select a membership pathway to continue." : "請先選擇會籍類型。 ");
    if (step === 2 && (!name || !email.includes("@"))) return setError(lang === "en" ? "Enter your name and a valid email address." : "請輸入姓名及有效電郵地址。 ");
    if (step === 3 && !organisation) return setError(lang === "en" ? "Enter your organisation name." : "請輸入機構名稱。 ");
    setError(""); setStep(Math.min(step + 1, 6));
  };
  return <><PageHero lang={lang} eyebrow={lang === "en" ? "Membership enquiry" : "會籍查詢"} title={lang === "en" ? "Prepare your WiseTech membership enquiry." : "準備你的 WiseTech 會籍查詢。"} copy={lang === "en" ? "Choose a working pathway and prepare the information the membership team needs. Nothing is submitted or paid on this page." : "選擇工作中的路徑並準備會員團隊所需資料；本頁不會提交申請或處理付款。"} />
    <section className="section join-roadmap"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Your membership journey" : "你的會籍旅程"}</p><h2>{lang === "en" ? "Know what happens before you begin." : "開始前先了解整個流程。"}</h2><p>{lang === "en" ? "Follow each step from choosing a membership to building your profile, completing payment and starting onboarding." : "由選擇會籍、建立專頁、完成付款到開始會員導入，逐步了解整個流程。"}</p></div><ol>{roadmap.map((label, index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span>{label}</li>)}</ol></div></section>
    <section className="section shell join-page"><div className="join-progress" aria-label={lang === "en" ? "Application progress" : "申請進度"}>{[1,2,3,4,5,6].map((number) => <span key={number} className={step >= number ? "active" : ""}><b>{number}</b><i /></span>)}</div><div className="join-card">
      {step === 1 && <div><p className="eyebrow">01 · {lang === "en" ? "Select membership" : "選擇會籍"}</p><h2>{lang === "en" ? "How do you want to participate?" : "你希望如何參與？"}</h2><div className="join-options">{membershipPlans.map((item) => <button key={item.name.en} className={plan === item.name.en ? "selected" : ""} onClick={() => setPlan(item.name.en)}><strong>{t(item.name, lang)}</strong><span>{t(item.copy, lang)}</span></button>)}</div></div>}
      {step === 2 && <div><p className="eyebrow">02 · {lang === "en" ? "Your details" : "個人資料"}</p><h2>{lang === "en" ? "Create your membership contact." : "建立你的會員聯絡資料。"}</h2><div className="form-grid"><label>{lang === "en" ? "Full name" : "姓名"}<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>{lang === "en" ? "Email" : "電郵"}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label></div></div>}
      {step === 3 && <div><p className="eyebrow">03 · {lang === "en" ? "Organisation" : "機構"}</p><h2>{lang === "en" ? "Tell us where you create value." : "告訴我們你在哪裡創造價值。"}</h2><div className="form-grid"><label>{lang === "en" ? "Organisation name" : "機構名稱"}<input value={organisation} onChange={(event) => setOrganisation(event.target.value)} /></label><label>{lang === "en" ? "Primary industry" : "主要產業"}<select><option>{lang === "en" ? "Select an industry" : "選擇產業"}</option>{industries.map((industry) => <option key={industry.key}>{t(industry.name, lang)}</option>)}</select></label></div></div>}
      {step === 4 && <div><p className="eyebrow">04 · {lang === "en" ? "Visibility + interests" : "可見度 + 興趣"}</p><h2>{lang === "en" ? "You control what the network can see." : "你可控制網絡內可見的資料。"}</h2><fieldset><legend>{lang === "en" ? "Default organisation visibility" : "機構資料預設可見度"}</legend>{[["public", lang === "en" ? "Public" : "公開"], ["members", lang === "en" ? "Members only" : "只限會員"], ["staff", lang === "en" ? "Association staff only" : "只限商會團隊"]].map(([value, label]) => <label className="radio-line" key={value}><input type="radio" name="visibility" checked={visibility === value} onChange={() => setVisibility(value)} />{label}</label>)}</fieldset><div className="interest-grid">{industries.map((industry) => <label key={industry.key}><input type="checkbox" />{t(industry.name, lang)}</label>)}</div></div>}
      {step === 5 && <div><p className="eyebrow">05 · {lang === "en" ? "Review" : "檢查"}</p><h2>{lang === "en" ? "Review your application draft." : "檢查你的申請草稿。"}</h2><dl className="review-list"><div><dt>{lang === "en" ? "Membership" : "會籍"}</dt><dd>{plan}</dd></div><div><dt>{lang === "en" ? "Contact" : "聯絡人"}</dt><dd>{name} · {email}</dd></div><div><dt>{lang === "en" ? "Organisation" : "機構"}</dt><dd>{organisation}</dd></div><div><dt>{lang === "en" ? "Visibility" : "可見度"}</dt><dd>{visibility}</dd></div></dl><label className="consent"><input type="checkbox" required />{lang === "en" ? "I agree that the Association team may review this membership enquiry." : "我同意商會團隊審閱此會籍查詢。"}</label></div>}
      {step === 6 && <div className="join-success"><span>✓</span><p className="eyebrow">{lang === "en" ? "Thank you" : "多謝你"}</p><h2>{lang === "en" ? "Your membership enquiry is ready." : "你的會籍查詢已準備好。"}</h2><p>{lang === "en" ? "Contact the membership team to complete the application and begin with the actions most relevant to your role." : "請聯絡會員團隊完成申請，並由最配合你角色的行動開始。"}</p><div className="onboarding-actions">{[
        [lang === "en" ? "Complete your profile" : "完成專頁", "portal"], [lang === "en" ? "Publish your organisation" : "刊登機構", "portal"], [lang === "en" ? "Add an AI solution" : "加入 AI 方案", "solutions#publish"], [lang === "en" ? "Find an event" : "尋找活動", "events"], [lang === "en" ? "Join an industry council" : "加入產業委員會", "activities/industry-councils"], [lang === "en" ? "AI Readiness" : "AI 準備度", "ai-plus#readiness"], [lang === "en" ? "Invite colleagues" : "邀請同事", "portal"], [lang === "en" ? "Explore GBA Gateway" : "探索大灣區通道", "gba"],
      ].map(([label, path]) => <a href={hrefFor(lang, path)} key={label}>{label}<Arrow /></a>)}</div><a className="button button-dark" href={hrefFor(lang, "portal")}>{lang === "en" ? "Preview member portal" : "預覽會員平台"} <Arrow /></a></div>}
      {error && <p className="form-error" role="alert">{error}</p>}{step < 6 && <div className="join-actions">{step > 1 && <button className="text-link" onClick={() => { setStep(step - 1); setError(""); }}>{lang === "en" ? "Back" : "上一步"}</button>}<button className="button button-dark" onClick={next}>{step === 5 ? (lang === "en" ? "Complete draft" : "完成草稿") : (lang === "en" ? "Continue" : "繼續")} <Arrow /></button></div>}
    </div></section></>;
}

function ProgrammesPage({ lang, detail }: { lang: SiteLanguage; detail?: string }) {
  const programme = programmes.find((item) => item.slug === detail);
  if (detail && programme) return <><PageHero lang={lang} eyebrow={t(programme.tag, lang)} title={programme.name} copy={t(programme.copy, lang)} /><section className="section shell detail-page"><div className="detail-main"><p className="lead">{t(programme.proof, lang)}</p><h2>{lang === "en" ? "Built around a clear next action" : "以清晰的下一步為核心"}</h2><p>{lang === "en" ? "Discover the programme purpose, intended audience, participation journey and previous editions in one place." : "在同一頁面了解計劃目的、目標受眾、參與旅程及歷屆內容。"}</p><div className="stage-row"><span>{lang === "en" ? "Discover" : "了解"}</span><span>{lang === "en" ? "Apply" : "申請"}</span><span>{lang === "en" ? "Participate" : "參與"}</span><span>{lang === "en" ? "Follow through" : "跟進"}</span></div></div><aside className="detail-aside"><span className="status-label">{lang === "en" ? "What’s next" : "最新動向"}</span><h3>{lang === "en" ? "The next edition is coming soon" : "下一屆計劃即將公布"}</h3><p>{lang === "en" ? "Contact the programme team for upcoming dates and participation details." : "歡迎聯絡計劃團隊，查詢即將公布的日期及參與詳情。"}</p><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Programme%20enquiry">{lang === "en" ? "Ask the programme team" : "聯絡計劃團隊"}</a></aside></section></>;
  const groupings = lang === "en" ? ["Open for Applications", "Active Programmes", "Upcoming Programmes", "Awards", "Professional Learning", "Market Access", "Programme History"] : ["開放申請", "進行中計劃", "即將推出", "獎項", "專業學習", "市場拓展", "計劃歷史"];
  return <><PageHero lang={lang} eyebrow={lang === "en" ? "Programmes" : "計劃"} title={lang === "en" ? "Programmes that turn participation into progress." : "把參與轉化為進步的計劃。"} copy={lang === "en" ? "Explore awards, learning, market-access and industry-development programmes across the WiseTech ecosystem." : "探索 WiseTech 生態系統的獎項、學習、市場拓展及產業發展計劃。"} />
    <section className="section programme-status" id="open"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Programme catalogue" : "計劃目錄"}</p><h2>{lang === "en" ? "Find a programme that moves you forward." : "尋找推動你向前的計劃。"}</h2><p>{lang === "en" ? "Explore programmes by purpose, audience, participation stage and previous editions." : "按目的、受眾、參與階段及歷屆內容探索不同計劃。"}</p></div><div className="programme-groupings">{groupings.map((grouping, index) => <a href={index === 0 ? "#open-state" : index === 6 ? "#history" : "#catalogue"} key={grouping}><span>{String(index + 1).padStart(2, "0")}</span>{grouping}<Arrow /></a>)}</div><div className="inner-honest" id="open-state"><span className="pulse-ring" aria-hidden="true" /><div><p className="status-label">{lang === "en" ? "Open applications" : "開放申請"}</p><h3>{lang === "en" ? "New application dates are coming soon." : "新一輪申請日期即將公布。"}</h3><p>{lang === "en" ? "Join the update list for upcoming editions, eligibility information and key dates." : "加入通知名單，接收新一屆計劃、參加資格及重要日期。"}</p></div><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Programme%20updates">{lang === "en" ? "Get programme updates" : "接收計劃通知"} <Arrow /></a></div></div></section>
    <div id="catalogue"><ProgrammeShowcase lang={lang} /></div>
    <section className="section programme-history" id="history"><div className="shell"><div className="inner-section-heading"><p className="eyebrow">{lang === "en" ? "Programme history" : "計劃歷史"}</p><h2>{lang === "en" ? "Built on programmes with lasting value." : "承接具長遠價值的計劃經驗。"}</h2><p>{lang === "en" ? "Explore the history of Tech Connect Series, Asia Smart Innovation Awards, HKICT Startup Award and CPAI, with new programme information added as it becomes available." : "探索 Tech Connect Series、Asia Smart Innovation Awards、HKICT Startup Award 及 CPAI 的發展歷程；新計劃資訊將陸續加入。"}</p></div><div className="directory-actions"><a className="button button-dark" href={hrefFor(lang, "events")}>{lang === "en" ? "View related activities" : "查看相關活動"} <Arrow /></a><a className="text-link" href={hrefFor(lang, "partner-with-us")}>{lang === "en" ? "Become a programme partner" : "成為計劃夥伴"} <Arrow /></a></div></div></section>
  </>;
}

function EventsPage({ lang }: { lang: SiteLanguage }) {
  const [view, setView] = useState("upcoming");
  return <><PageHero lang={lang} eyebrow={lang === "en" ? "Events" : "活動"} title={lang === "en" ? "Meet the people building the next economy." : "遇見正在建設新經濟的人。"} copy={lang === "en" ? "Event discovery, preparation, participation and follow-through in one connected journey." : "把活動發現、準備、參與及跟進連成一個完整旅程。"} />
    <section className="section shell events-page"><div className="view-switch">{[["upcoming", lang === "en" ? "Upcoming" : "即將舉行"], ["archive", lang === "en" ? "Event highlights" : "活動回顧"], ["journey", lang === "en" ? "Member journey" : "會員旅程"]].map(([key, label]) => <button className={view === key ? "active" : ""} onClick={() => setView(key)} key={key}>{label}</button>)}</div>
      {view === "upcoming" && <div className="honest-empty light-empty"><span className="pulse-ring" /><div><h2>{lang === "en" ? "New event dates are coming soon." : "新一輪活動日期即將公布。"}</h2><p>{lang === "en" ? "Join the activity list to receive updates on capacity, pricing, accessibility and networking opportunities." : "加入活動通知名單，接收名額、收費、無障礙安排及交流機會等最新消息。"}</p></div><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Upcoming%20events">{lang === "en" ? "Get event updates" : "接收活動通知"}</a></div>}
      {view === "archive" && <div className="archive-grid"><article><span>16 OCT 2025</span><h2>Asia Smart Innovation Awards Summit 2025</h2><p>{lang === "en" ? "Ballroom I & II, Cordis Hong Kong · Past event" : "香港康得思酒店宴會廳 I 及 II · 過往活動"}</p><a href="https://hkwtia.org/event/asia-smart-innovation-awards-summit-2025/" target="_blank" rel="noreferrer">{lang === "en" ? "View event page" : "查看活動頁面"} <Arrow /></a></article><article><span>11 JUL 2025</span><h2>Smart Innovation Meets GenAI</h2><p>{lang === "en" ? "KOHO, Kwun Tong · Past event" : "觀塘 KOHO · 過往活動"}</p><a href="https://hkwtia.org/event/smart-innovation-meets-genai-trends-shaping-the-next-decade-of-startups/" target="_blank" rel="noreferrer">{lang === "en" ? "View event page" : "查看活動頁面"} <Arrow /></a></article></div>}
      {view === "journey" && <div className="journey-grid">{[["Before", "Recommendations, member pricing, tickets, capacity, accessibility and people to meet."], ["During", "QR check-in, sessions, questions, polls, meetings and consent-based resources."], ["After", "Reviewed summaries, certificates, introductions, feedback and outcome tracking."]].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h2>{lang === "en" ? title : ["活動前", "活動中", "活動後"][index]}</h2><p>{lang === "en" ? copy : ["推薦、會員票價、門票、名額、無障礙資訊及會面建議。", "QR 登記、議程、提問、投票、會面及經同意提供的資源。", "經審閱摘要、證書、引薦、意見及成果追蹤。"][index]}</p></article>)}</div>}
    </section></>;
}

function GbaPage({ lang, detail }: { lang: SiteLanguage; detail?: string }) {
  const title = detail === "delegations" ? (lang === "en" ? "Delegations built for follow-through." : "以成果跟進為本的考察團。") : detail === "soft-landing" ? (lang === "en" ? "Land in market with the right local context." : "以合適的本地支援進入市場。") : (lang === "en" ? "Hong Kong expertise. GBA opportunity. Global ambition." : "香港專長，大灣區機遇，全球視野。");
  return <><PageHero lang={lang} eyebrow="GBA Gateway" title={title} copy={lang === "en" ? "Market entry, partner discovery, buyer matching and trusted local guidance in one connected pathway." : "以一條連貫路徑，提供市場進入、夥伴發掘、買家配對及可信本地指引。"} /><section className="section shell gba-page"><div className="gba-route-board"><div className="route-map" aria-hidden="true"><span>Hong Kong</span><span>Shenzhen</span><span>Guangzhou</span><i /><i /></div><div><p className="eyebrow">Hong Kong + GBA</p><h2>{lang === "en" ? "A bridge is valuable only when it leads somewhere." : "橋樑只有通往成果，才真正有價值。"}</h2><p>{lang === "en" ? "Before launch, each programme should define the target market, named landing partners, participant fit, intended meetings and post-mission follow-up." : "每個計劃在推出前，應清楚列明目標市場、具名落地夥伴、參加者條件、預期會面及活動後跟進。"}</p></div></div><div className="service-grid">{(lang === "en" ? [["Market entry", "Local context, sector pathways and practical preparation."], ["Soft landing", "Introductions to approved service and ecosystem partners."], ["Buyer matching", "Purpose-led meetings with consent and outcome tracking."], ["Delegations", "Curated missions with preparation and structured follow-through."]] : [["市場進入", "提供本地脈絡、產業路徑及實務準備。"], ["落地支援", "引薦已批准的服務及生態夥伴。"], ["買家配對", "按明確目的安排會面，並在同意下追蹤成果。"], ["考察團", "策劃考察、事前準備及結構化跟進。"]]).map(([name, copy], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p></article>)}</div></section></>;
}

function PartnersPage({ lang }: { lang: SiteLanguage }) {
  const categories = [
    {
      key: "supporting",
      label: { en: "Supporting Organisations", zh: "支持機構" },
      directory: "supporting",
      partners: supportingOrganisations,
      relationship: { en: "Listed by WTIA as a supporting organisation in the source network.", zh: "在 WTIA 來源網絡中列為支持機構。" },
    },
    {
      key: "regional",
      label: { en: "Regional Partners", zh: "區域夥伴" },
      directory: "regional",
      partners: regionalPartners,
      relationship: { en: "Listed by WTIA as a regional partner in the source network.", zh: "在 WTIA 來源網絡中列為區域夥伴。" },
    },
    {
      key: "media",
      label: { en: "Media Partners", zh: "媒體夥伴" },
      directory: "media",
      partners: mediaPartners,
      relationship: { en: "Listed by WTIA as a media partner in the source network.", zh: "在 WTIA 來源網絡中列為媒體夥伴。" },
    },
  ] as const;

  return <>
    <PageHero lang={lang} eyebrow={lang === "en" ? "Partner ecosystem" : "夥伴生態系統"} title={lang === "en" ? "79 organisations in the sourced WTIA network record." : "WTIA 來源網絡紀錄中的 79 個機構。"} copy={lang === "en" ? "Browse supporting organisations, regional partners and media partners carried forward from WTIA’s public listings, with relationship status stated honestly." : "瀏覽承接自 WTIA 公開名單的支持機構、區域夥伴及媒體夥伴；每項紀錄均清楚交代關係狀態。"} visual={siteVisuals.membership} />
    <section className="section partner-directory-page">
      <div className="shell">
        <div className="partner-source-note"><div><p className="eyebrow">{lang === "en" ? "Relationship context" : "關係脈絡"}</p><h2>{lang === "en" ? "Historical source records, not automatic current endorsements." : "過往來源紀錄，不自動代表現時支持或背書。"}</h2></div><div><p>{lang === "en" ? "Names and logos come from WTIA’s public Supporting Organisations, Regional Partners and Media Partners listings. Current relationship, activity and endorsement status has not been independently confirmed for these records." : "名稱及標誌來自 WTIA 公開的支持機構、區域夥伴及媒體夥伴名單。這些紀錄的現時關係、活動及背書狀態尚未逐項確認。"}</p><a className="text-link" href="https://hkwtia.org/" target="_blank" rel="noreferrer">{lang === "en" ? "View the WTIA source" : "查看 WTIA 來源"} <Arrow /></a></div></div>
        <nav className="partner-category-nav" aria-label={lang === "en" ? "Partner record categories" : "夥伴紀錄分類"}>{categories.map((category) => <a href={`#partners-${category.key}`} key={category.key}><span>{t(category.label, lang)}</span><b>{category.partners.length}</b></a>)}</nav>
        {categories.map((category) => <section className="partner-record-group" id={`partners-${category.key}`} key={category.key} aria-labelledby={`partners-${category.key}-title`}>
          <div className="partner-record-heading"><div><p className="eyebrow">{lang === "en" ? "Source category" : "來源分類"}</p><h2 id={`partners-${category.key}-title`}>{t(category.label, lang)}</h2></div><p>{lang === "en" ? `${category.partners.length} historical network records. Current status is unconfirmed unless separately published.` : `${category.partners.length} 個過往網絡紀錄；除非另有公布，現時狀態尚未確認。`}</p></div>
          <div className="partner-record-grid">{category.partners.map((partner) => <article className="partner-record-card" key={partner.file}>
            <div className="partner-record-logo"><img src={`/partners/${category.directory}/${partner.file}`} alt={`${partner.name} logo`} width={960} height={606} loading="lazy" decoding="async" /></div>
            <div className="partner-record-body"><span className="partner-status">{lang === "en" ? "Historical WTIA listing" : "WTIA 過往名單"}</span><h3>{partner.name}</h3><dl><div><dt>{lang === "en" ? "Relationship" : "關係"}</dt><dd>{t(category.relationship, lang)}</dd></div><div><dt>{lang === "en" ? "Related activity" : "相關活動"}</dt><dd>{lang === "en" ? "General WTIA ecosystem listing; no specific programme is recorded in this source." : "WTIA 一般生態網絡名單；此來源未有記錄特定計劃。"}</dd></div><div><dt>{lang === "en" ? "Current status" : "現時狀態"}</dt><dd>{lang === "en" ? "Unconfirmed" : "尚未確認"}</dd></div></dl></div>
          </article>)}</div>
        </section>)}
        <div className="partner-confirmation"><div><p className="eyebrow">{lang === "en" ? "Update a record" : "更新紀錄"}</p><h2>{lang === "en" ? "Represent one of these organisations?" : "你是否代表以上機構？"}</h2><p>{lang === "en" ? "Contact the team to confirm the present relationship, correct a listing or discuss a new collaboration." : "請聯絡團隊確認現時關係、修正名單，或洽談新合作。"}</p></div><a className="button button-light" href="mailto:contact@hkwtia.org?subject=Partner%20record%20update">{lang === "en" ? "Contact the team" : "聯絡團隊"} <Arrow /></a></div>
      </div>
    </section>
  </>;
}

function PortalPage({ lang }: { lang: SiteLanguage }) {
  const [tab, setTab] = useState("overview");
  const tabs = lang === "en" ? [["overview", "Overview"], ["profile", "Profile"], ["introductions", "Introductions"], ["events", "Events"], ["billing", "Billing"]] : [["overview", "總覽"], ["profile", "專頁"], ["introductions", "引薦"], ["events", "活動"], ["billing", "帳單"]];
  return <><PageHero lang={lang} eyebrow={lang === "en" ? "Member Portal Preview" : "會員平台預覽"} title={lang === "en" ? "A preview of the future opportunity dashboard." : "未來機遇儀表板預覽。"} copy={lang === "en" ? "This concept shows how membership, connections, programmes and events could come together. It is not a signed-in account and displays no private member data." : "此概念展示會籍、連結、計劃及活動如何整合；這不是已登入帳戶，亦不顯示私人會員資料。"} /><section className="portal-shell shell"><aside><Brand lang={lang} />{tabs.map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</aside><section className="portal-main"><div className="portal-top"><div><p className="eyebrow">{lang === "en" ? "Concept dashboard" : "概念儀表板"}</p><h2>{tabs.find(([key]) => key === tab)?.[1]}</h2></div><span className="status-label">{lang === "en" ? "Preview only · no account data" : "只供預覽 · 沒有帳戶資料"}</span></div><div className="portal-grid"><article className="portal-feature"><span>{lang === "en" ? "Membership" : "會籍"}</span><h3>{lang === "en" ? "A future account could show membership status, profile progress and renewal information here." : "未來帳戶可在此顯示會籍狀態、專頁進度及續會資訊。"}</h3><div className="progress-bar"><i /></div><small>{lang === "en" ? "Illustrative profile progress" : "示意專頁進度"}</small></article><article><span>{lang === "en" ? "Introductions" : "引薦"}</span><strong>—</strong><small>{lang === "en" ? "No account connected" : "未連接帳戶"}</small></article><article><span>{lang === "en" ? "Events" : "活動"}</span><strong>—</strong><small>{lang === "en" ? "No account connected" : "未連接帳戶"}</small></article><article><span>{lang === "en" ? "Opportunities" : "機遇"}</span><strong>—</strong><small>{lang === "en" ? "No account connected" : "未連接帳戶"}</small></article></div><div className="portal-empty"><h3>{lang === "en" ? "Portal access is not available through this concept page." : "此概念頁暫不提供平台登入。"}</h3><p>{lang === "en" ? "Contact the Association team if you need help with an existing account or want to discuss the future member experience." : "如需現有帳戶支援，或希望洽談未來會員體驗，請聯絡商會團隊。"}</p><a className="button button-dark" href="mailto:contact@hkwtia.org?subject=Member%20portal%20enquiry">{lang === "en" ? "Contact the team" : "聯絡團隊"}</a></div></section></section></>;
}

function StandardPage({ lang, path }: { lang: SiteLanguage; path: string[] }) {
  const section = path[0] || "";
  const detail = path[1];
  const content: Record<string, { eyebrow: LocalText; title: LocalText; copy: LocalText }> = {
    "why-wisetech": { eyebrow: { en: "Why WiseTech", zh: "為何選擇 WiseTech" }, title: { en: "Technology + Wisdom. Ideas + real impact.", zh: "科技 + 智慧，理念 + 真實影響。" }, copy: { en: "WiseTech Hong Kong organises the people, knowledge, technology and market opportunity required for responsible AI+ adoption.", zh: "WiseTech Hong Kong 匯聚負責任 AI+ 應用所需的人才、知識、科技與市場機遇。" } },
    "ai-plus": { eyebrow: { en: "AI+ Industries", zh: "AI+ 產業" }, title: { en: "Turn AI ambition into industry action.", zh: "把 AI 願景轉化為產業行動。" }, copy: { en: "Focused councils connect business demand with trusted solutions, practical programmes and measurable follow-through.", zh: "聚焦產業的委員會，把商業需求與可信方案、實務計劃及可量度跟進連接起來。" } },
    "insights": { eyebrow: { en: "Insights", zh: "洞察" }, title: { en: "Knowledge people can use—not noise they have to filter.", zh: "提供可採用的知識，而不是需要自行過濾的雜訊。" }, copy: { en: "Research, practical guidance, case evidence and perspectives for responsible AI+ adoption.", zh: "為負責任 AI+ 應用提供研究、實務指引、案例證據及觀點。" } },
    "partner-with-us": { eyebrow: { en: "Partner With Us", zh: "與我們合作" }, title: { en: "Help build the platform the AI+ economy needs.", zh: "共同建設 AI+ 經濟所需的平台。" }, copy: { en: "Choose a clear route: strategic mission, corporate innovation, programme, research or regional market access.", zh: "選擇清晰合作路徑：策略使命、企業創新、計劃、研究或區域市場進入。" } },
    "about": { eyebrow: { en: "About", zh: "關於我們" }, title: { en: "From wireless connection to wise technology.", zh: "從無線連接，走向智慧科技。" }, copy: { en: "A future-facing public brand built on the Association’s history, relationships and role in Hong Kong technology.", zh: "以前瞻公共品牌承接商會在香港科技界的歷史、關係與角色。" } },
    "ai-transparency": { eyebrow: { en: "AI Transparency", zh: "AI 透明度" }, title: { en: "Ask WiseTech recommends. People remain in control.", zh: "Ask WiseTech 提供建議，決定權仍在人。" }, copy: { en: "The Concierge uses approved Association content, cites its sources, states uncertainty and never silently submits, pays, publishes or contacts a member.", zh: "智能助理只使用已批准的商會內容、列明資料來源及不確定性，亦不會在未經同意下提交、付款、發布或聯絡會員。" } },
    "ai-ops": { eyebrow: { en: "AI Operations", zh: "AI 營運" }, title: { en: "Measure usefulness without collecting private conversations.", zh: "在不收集私人對話下衡量實用性。" }, copy: { en: "Operational reporting focuses on safe aggregate signals, answer quality and escalation—not sensitive member details.", zh: "營運報告聚焦安全匯總訊號、回答質素及轉交處理，而不是敏感會員資料。" } },
  };
  const selected = content[section] || content.about;
  const title = detail && section === "ai-plus" ? (industries.find((industry) => industry.key === detail)?.name[lang] || t(selected.title, lang)) : detail && section === "about" ? (lang === "en" ? "From Wireless to Wise Technology." : "從 Wireless 走向 Wise Technology。") : t(selected.title, lang);
  return <><PageHero lang={lang} eyebrow={t(selected.eyebrow, lang)} title={title} copy={t(selected.copy, lang)} />
    <section className="section shell standard-page"><div className="standard-lead"><p className="eyebrow">Technology + Wisdom</p><h2>{section === "partner-with-us" ? (lang === "en" ? "Five ways to build with us" : "五種共同建設方式") : (lang === "en" ? "One ecosystem connecting demand with capability" : "一個連接需求與能力的生態系統")}</h2><p>{lang === "en" ? "Explore practical ways to connect with Hong Kong’s AI+ industry community and move from interest to action." : "探索連結香港 AI+ 產業社群的實務方式，由興趣走向行動。"}</p></div>
      {section === "ai-plus" ? <div className="service-grid">{industries.map((industry, index) => <a className="service-link" href={hrefFor(lang, "ai-plus/" + industry.key)} key={industry.key}><span>0{index + 1}</span><h3>{t(industry.name, lang)}</h3><p>{t(industry.brief, lang)}</p><Arrow /></a>)}</div> : section === "partner-with-us" ? <div className="service-grid">{(lang === "en" ? [["Strategic partnership", "Support the two-year AI+ mission."], ["Corporate innovation", "Launch challenges and implementation pilots."], ["Programme sponsorship", "Build visible, outcome-led participation."], ["Research partnership", "Co-create trusted benchmarks and guidance."], ["GBA partnership", "Open practical cross-border pathways."]] : [["策略夥伴", "支持兩年 AI+ 產業使命。"], ["企業創新", "發起挑戰與落地試點。"], ["計劃贊助", "建立具成果及可見度的參與。"], ["研究夥伴", "共同建立可信基準與指引。"], ["大灣區夥伴", "開拓實務跨境路徑。"]]).map(([name, copy], index) => <article id={"path-" + (index + 1)} key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p><a href="mailto:contact@hkwtia.org?subject=WiseTech%20partnership">{lang === "en" ? "Start a conversation" : "展開對話"} <Arrow /></a></article>)}</div> : <div className="principle-grid">{(lang === "en" ? [["Human", "Technology starts with real people and real work."], ["Trusted", "Evidence, governance and transparent claims matter."], ["Practical", "Connection must lead toward implementation."], ["Open", "Every audience has a clear route into the ecosystem."]] : [["以人為本", "科技從真實的人與工作開始。"], ["可信", "重視證據、管治及透明聲稱。"], ["務實", "連結必須通往真正落地。"], ["開放", "每類受眾都有清晰參與路徑。"]]).map(([name, copy], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p></article>)}</div>}
    </section></>;
}

function Footer({ lang }: { lang: SiteLanguage }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "error" | "success">("idle");
  const subscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail.includes("@")) {
      setNewsletterState("error");
      return;
    }
    setNewsletterState("success");
    window.location.assign(`mailto:contact@hkwtia.org?subject=${encodeURIComponent("WiseTech activity updates")}&body=${encodeURIComponent(`Please add ${newsletterEmail} to the WiseTech activity update list.`)}`);
  };
  return (
    <footer className="site-footer">
      <div className="shell footer-top"><div className="footer-brand"><Brand lang={lang} /><p>{lang === "en" ? "An AI+ industry platform connecting practical adoption, useful knowledge, market access and relevant people." : "連接實務 AI+ 應用、有用知識、市場拓展及相關人才的產業平台。"}</p><small>{lang === "en" ? "WiseTech Hong Kong — the evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association." : "WiseTech Hong Kong — Hong Kong Wireless Technology Industry Association 持續發展中的 AI+ 產業平台。[官方中文名稱待正式批准]"}</small></div><div className="footer-newsletter"><p className="eyebrow light">{lang === "en" ? "Activity updates" : "活動通知"}</p><h2>{lang === "en" ? "What should Hong Kong build next?" : "香港下一步應建設甚麼？"}</h2>{newsletterState === "success" ? <div className="newsletter-success" role="status"><span>↗</span><p>{lang === "en" ? "Your email app should open with a prepared request. This page does not create a subscription automatically." : "你的電郵程式應會開啟並備妥查詢；本頁不會自動建立訂閱。"}</p></div> : <form onSubmit={subscribe} noValidate><label className="sr-only" htmlFor="newsletter-email">Email</label><input id="newsletter-email" type="email" value={newsletterEmail} onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterState("idle"); }} placeholder={lang === "en" ? "Work email" : "工作電郵"} aria-invalid={newsletterState === "error"} /><button aria-label={lang === "en" ? "Prepare activity-update email" : "準備活動通知電郵"}>↗</button></form>}{newsletterState === "error" && <p className="newsletter-error" role="alert">{lang === "en" ? "Enter a valid work email." : "請輸入有效工作電郵。"}</p>}</div></div>
      <div className="shell footer-links"><div><strong>{lang === "en" ? "Explore" : "探索"}</strong><a href={hrefFor(lang, "why-wisetech")}>{lang === "en" ? "Why WiseTech" : "為何選擇 WiseTech"}</a><a href={hrefFor(lang, "ai-plus")}>AI+ Industries</a><a href={hrefFor(lang, "programmes")}>{lang === "en" ? "Programmes" : "計劃"}</a><a href={hrefFor(lang, "events")}>{lang === "en" ? "Events" : "活動"}</a></div><div><strong>{lang === "en" ? "Connect" : "連結"}</strong><a href={hrefFor(lang, "members")}>{lang === "en" ? "Member Directory" : "會員名錄"}</a><a href={hrefFor(lang, "solutions")}>{lang === "en" ? "AI Solutions" : "AI 解決方案"}</a><a href={hrefFor(lang, "partners")}>{lang === "en" ? "Partners & Network" : "夥伴及網絡"}</a><a href={hrefFor(lang, "gba")}>GBA Gateway</a><a href={hrefFor(lang, "partner-with-us")}>{lang === "en" ? "Partner with us" : "與我們合作"}</a></div><div><strong>{lang === "en" ? "Membership" : "會籍"}</strong><a href={hrefFor(lang, "membership")}>{lang === "en" ? "Compare plans" : "比較會籍"}</a><a href={hrefFor(lang, "join")}>{lang === "en" ? "Join WiseTech" : "加入 WiseTech"}</a><a href={hrefFor(lang, "portal")}>{lang === "en" ? "Member portal" : "會員平台"}</a><a href={hrefFor(lang, "ai-transparency")}>{lang === "en" ? "AI transparency" : "AI 透明度"}</a></div><div><strong>{lang === "en" ? "Contact" : "聯絡"}</strong><a href={hrefFor(lang, "contact")}>{lang === "en" ? "Contact WiseTech" : "聯絡 WiseTech"}</a><a href="mailto:contact@hkwtia.org">contact@hkwtia.org</a><a href="tel:+85229899164">+852 2989 9164</a><address>4/F, KOHO<br />73–75 Hung To Road<br />Kwun Tong, Hong Kong</address></div></div>
      <div className="shell footer-bottom"><strong>Technology + Wisdom. Hong Kong + The World.</strong><div><a href={hrefFor(lang, "privacy")}>{lang === "en" ? "Privacy" : "私隱"}</a><a href={hrefFor(lang, "terms")}>{lang === "en" ? "Terms" : "條款"}</a><a href={hrefFor(lang, "accessibility")}>{lang === "en" ? "Accessibility" : "無障礙"}</a><a href={hrefFor(lang === "en" ? "zh" : "en")}>{lang === "en" ? "繁體中文" : "English"}</a></div></div>
    </footer>
  );
}

function Concierge({ lang, path }: { lang: SiteLanguage; path: string[] }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const section = path[0] || "home";
  const prompts = useMemo(() => {
    if (section === "membership" || section === "join") return lang === "en" ? ["Which membership suits my organisation?", "What benefits do startups receive?"] : ["哪種會籍適合我的機構？", "初創企業可獲得甚麼權益？"];
    if (section === "members") return lang === "en" ? ["Find providers serving SMEs", "How do introductions work?"] : ["尋找服務中小企的供應商", "引薦流程如何運作？"];
    if (section === "events") return lang === "en" ? ["Which event is relevant to retail?", "Show Cantonese events"] : ["哪些活動適合零售業？", "顯示粵語活動"];
    return lang === "en" ? ["How can WiseTech help my organisation?", "Show the AI+ industry pathways"] : ["WiseTech 如何幫助我的機構？", "顯示 AI+ 產業路徑"];
  }, [section, lang]);
  const reply = () => {
    if (section === "membership" || section === "join") setAnswer(lang === "en" ? "Start with your goal: Startup focuses on verified visibility and programmes; SME on practical adoption; Corporate on sourcing, seats and challenges. Official fees remain subject to Association approval. Compare membership →" : "先從目標出發：初創會籍著重可信曝光及計劃；中小企著重實務應用；企業會籍著重採購、席位及挑戰。正式費用有待商會批准。前往比較會籍 →");
    else setAnswer(lang === "en" ? "I can guide you using approved WiseTech pages. This concept does not access private member data or take action for you. The most relevant starting point is the AI+ ecosystem overview →" : "我可根據已批准的 WiseTech 頁面提供指引。本概念版不會讀取私人會員資料，亦不會代你採取行動。最相關的起點是 AI+ 生態系統總覽 →");
  };
  return <div className={open ? "concierge open" : "concierge"}><button className="concierge-trigger" onClick={() => setOpen(!open)} aria-expanded={open}><span>W+</span>{lang === "en" ? "Ask WiseTech" : "問 WiseTech"}</button>{open && <div className="concierge-panel" role="dialog" aria-label="Ask WiseTech"><div className="concierge-head"><div><span>W+</span><strong>Ask WiseTech</strong></div><button onClick={() => setOpen(false)} aria-label={lang === "en" ? "Close" : "關閉"}>×</button></div><p>{lang === "en" ? "I use approved Association information and keep people in control." : "我只使用已批准的商會資料，並讓人保留決定權。"}</p><div className="prompt-list">{prompts.map((prompt) => <button onClick={reply} key={prompt}>{prompt}<Arrow /></button>)}</div>{answer && <div className="concierge-answer" aria-live="polite">{answer}</div>}<a href={hrefFor(lang, "ai-transparency")}>{lang === "en" ? "How this assistant works" : "了解智能助理運作方式"}</a></div>}</div>;
}

export default function WiseTechSite({ lang = "en", path = [] }: WiseTechSiteProps) {
  const section = path[0] || "home";
  let page;
  const expandedPage = ExpansionRoute({ lang, path });
  if (expandedPage) page = expandedPage;
  else if (section === "home") page = <HomePage lang={lang} />;
  else if (section === "members") page = path[1] ? <PendingRecordPage lang={lang} kind={{ en: "Member Profile", zh: "會員專頁" }} slug={path[1]} backPath="members" /> : <DirectoryPage lang={lang} />;
  else if (section === "solutions") page = path[1] ? <PendingRecordPage lang={lang} kind={{ en: "Solution Profile", zh: "解決方案專頁" }} slug={path[1]} backPath="solutions" /> : <SolutionsPage lang={lang} />;
  else if (section === "membership") page = <MembershipPage lang={lang} />;
  else if (section === "join") page = <JoinPage lang={lang} />;
  else if (section === "events") page = path[1] ? <PendingRecordPage lang={lang} kind={{ en: "Event Record", zh: "活動紀錄" }} slug={path[1]} backPath="events" /> : <EventsPage lang={lang} />;
  else if (section === "programmes") page = path.length === 1 ? <ProgrammesPage lang={lang} /> : <NotFoundInnerPage lang={lang} path={path.join("/")} />;
  else if (section === "gba") page = path.length === 1 ? <GbaPage lang={lang} /> : <NotFoundInnerPage lang={lang} path={path.join("/")} />;
  else if (section === "partners") page = <PartnersPage lang={lang} />;
  else if (section === "portal") page = <PortalPage lang={lang} />;
  else if (section === "insights" && path[1]) page = <PendingRecordPage lang={lang} kind={{ en: "Insight", zh: "洞察" }} slug={path[1]} backPath="insights" />;
  else if (path.length === 1 && ["why-wisetech", "ai-plus", "insights", "partner-with-us", "about", "ai-transparency", "ai-ops"].includes(section)) page = <StandardPage lang={lang} path={path} />;
  else page = <NotFoundInnerPage lang={lang} path={path.join("/")} />;
  return <div className="site-root" lang={lang === "zh" ? "zh-Hant-HK" : "en-HK"}><Header lang={lang} currentPath={path} /><main id="main-content">{page}{section !== "home" && <div className="page-updated"><div className="shell"><span>{lang === "en" ? "Content last updated 25 August 2026" : "內容最後更新：2026 年 8 月 25 日"}</span><p>{lang === "en" ? "Current dates, availability and relationship status are shown only when confirmed." : "現行日期、名額及關係狀態只會在確認後顯示。"}</p></div></div>}</main><Footer lang={lang} /><Concierge lang={lang} path={path} /></div>;
}
