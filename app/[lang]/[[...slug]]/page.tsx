import type { Metadata } from "next";
import WiseTechSite, { SiteLanguage } from "../../WiseTechSite";

type LocalizedPageProps = {
  params: Promise<{ lang: string; slug?: string[] }>;
};

const pageTitles: Record<string, { en: string; zh: string }> = {
  "why-wisetech": { en: "Why WiseTech", zh: "為何選擇 WiseTech" },
  "ai-plus": { en: "AI+ Industries", zh: "AI+ 產業" },
  "ai-plus/commerce": { en: "Commerce + Professional Services", zh: "商貿 + 專業服務" },
  "ai-plus/commerce-professional-services": { en: "Commerce + Professional Services", zh: "商貿 + 專業服務" },
  "ai-plus/manufacturing": { en: "Manufacturing + Robotics", zh: "製造 + 機械人" },
  "ai-plus/manufacturing-robotics": { en: "Manufacturing + Robotics", zh: "製造 + 機械人" },
  "ai-plus/health": { en: "Health + Life Sciences", zh: "健康 + 生命科學" },
  "ai-plus/health-life-sciences": { en: "Health + Life Sciences", zh: "健康 + 生命科學" },
  "ai-plus/retail": { en: "Retail + Creative Industries", zh: "零售 + 創意產業" },
  "ai-plus/retail-creative-industries": { en: "Retail + Creative Industries", zh: "零售 + 創意產業" },
  "ai-plus/education": { en: "Education + Future of Work", zh: "教育 + 未來工作" },
  "ai-plus/education-future-of-work": { en: "Education + Future of Work", zh: "教育 + 未來工作" },
  "ai-plus/responsible-ai": { en: "Responsible AI + Data + Cyber", zh: "負責任 AI + 數據 + 網絡安全" },
  "ai-plus/responsible-ai-data-cybersecurity": { en: "Responsible AI + Data + Cyber", zh: "負責任 AI + 數據 + 網絡安全" },
  members: { en: "Member Directory", zh: "會員名錄" },
  solutions: { en: "AI Solutions Marketplace", zh: "AI 解決方案市場" },
  membership: { en: "Membership", zh: "會籍" },
  join: { en: "Join WiseTech", zh: "加入 WiseTech" },
  events: { en: "Events", zh: "活動" },
  "events/asia-smart-innovation-awards-summit-2025": { en: "Asia Smart Innovation Awards Summit 2025", zh: "Asia Smart Innovation Awards Summit 2025" },
  "events/smart-innovation-meets-genai": { en: "Smart Innovation Meets GenAI", zh: "Smart Innovation Meets GenAI" },
  activities: { en: "Activities", zh: "參與活動" },
  "activities/ai-clinics": { en: "AI Implementation Clinics", zh: "AI 落地診所" },
  "activities/buyer-days": { en: "Corporate Buyer Days", zh: "企業買家日" },
  "activities/industry-councils": { en: "Industry Councils", zh: "產業委員會" },
  "activities/training": { en: "Training & Certification", zh: "培訓及認證" },
  "activities/gba-delegations": { en: "GBA Delegations", zh: "大灣區考察團" },
  "activities/community": { en: "Community Events", zh: "社群活動" },
  "activities/mentoring-volunteering": { en: "Mentoring & Volunteering", zh: "導師及義工" },
  "host-an-activity": { en: "Host an Activity", zh: "主辦活動" },
  "for-corporates": { en: "For Corporates", zh: "企業路徑" },
  "for-smes": { en: "For SMEs", zh: "中小企路徑" },
  "for-startups": { en: "For Startups", zh: "初創企業路徑" },
  "for-professionals": { en: "For Professionals", zh: "專業人士路徑" },
  "for-gba-global": { en: "For GBA & Global Partners", zh: "大灣區及國際夥伴路徑" },
  programmes: { en: "Programmes", zh: "計劃" },
  "programmes/tech-connect": { en: "Tech Connect Series", zh: "Tech Connect 智創互聯" },
  "programmes/tct": { en: "Tech Connect Series", zh: "Tech Connect 智創互聯" },
  "programmes/hkict-startup-award": { en: "HKICT Startup Award", zh: "香港資訊及通訊科技獎初創企業獎" },
  "programmes/hkict": { en: "HKICT Startup Award", zh: "香港資訊及通訊科技獎初創企業獎" },
  "programmes/asia-smart-innovation-awards": { en: "Asia Smart Innovation Awards", zh: "亞洲智慧創新大獎" },
  "programmes/asia-smart-innovation-awards/2025": { en: "Asia Smart Innovation Awards 2025", zh: "亞洲智慧創新大獎 2025" },
  "programmes/asa": { en: "Asia Smart Innovation Awards", zh: "亞洲智慧創新大獎" },
  "programmes/cpai": { en: "CPAI", zh: "CPAI" },
  "programmes/launchpad": { en: "Launch Pad", zh: "Launch Pad" },
  gba: { en: "GBA Gateway", zh: "大灣區通道" },
  "gba/market-entry": { en: "GBA Market Entry", zh: "大灣區市場進入" },
  "gba/delegations": { en: "GBA Delegations", zh: "大灣區考察團" },
  "gba/soft-landing": { en: "GBA Soft Landing", zh: "大灣區落地支援" },
  "gba/partner-network": { en: "GBA Partner Network", zh: "大灣區夥伴網絡" },
  "gba/gone-global": { en: "Gone Global", zh: "走向國際" },
  insights: { en: "Insights", zh: "洞察" },
  "insights/case-studies": { en: "Case Studies", zh: "案例研究" },
  "insights/guides": { en: "Practical Guides", zh: "實務指南" },
  "insights/industry-perspectives": { en: "Industry Perspectives", zh: "產業觀點" },
  "insights/responsible-ai": { en: "Responsible AI Insights", zh: "負責任 AI 洞察" },
  "insights/gba-intelligence": { en: "GBA Intelligence", zh: "大灣區情報" },
  "insights/event-replays": { en: "Event Replays", zh: "活動重溫" },
  "partner-with-us": { en: "Partner With Us", zh: "與我們合作" },
  partners: { en: "Partners & Network", zh: "夥伴及網絡" },
  about: { en: "About", zh: "關於我們" },
  "about/history": { en: "Association History", zh: "商會歷史" },
  "about/leadership": { en: "Leadership", zh: "領導團隊" },
  "about/committees": { en: "Committees", zh: "委員會" },
  "about/governance": { en: "Governance", zh: "管治" },
  "responsible-ai": { en: "Responsible AI", zh: "負責任 AI" },
  verification: { en: "Verification Standards", zh: "核實標準" },
  "submit-challenge": { en: "Submit a Business Challenge", zh: "提交業務挑戰" },
  "request-introduction": { en: "Request an Introduction", zh: "申請引薦" },
  contact: { en: "Contact", zh: "聯絡" },
  accessibility: { en: "Accessibility", zh: "無障礙" },
  privacy: { en: "Privacy", zh: "私隱" },
  terms: { en: "Terms", zh: "條款" },
  portal: { en: "Member Portal", zh: "會員平台" },
  "join/success": { en: "Membership Activation", zh: "會籍啟動" },
  "ai-transparency": { en: "AI Transparency", zh: "AI 透明度" },
  "ai-ops": { en: "AI Operations", zh: "AI 營運" },
  search: { en: "Search", zh: "搜尋" },
};

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { lang: rawLang, slug = [] } = await params;
  const lang: SiteLanguage = rawLang === "zh" ? "zh" : "en";
  const section = slug[0] || "home";
  const routeKey = slug.join("/");
  const canonicalAliases: Record<string, string> = {
    "ai-plus/commerce": "ai-plus/commerce-professional-services",
    "ai-plus/manufacturing": "ai-plus/manufacturing-robotics",
    "ai-plus/health": "ai-plus/health-life-sciences",
    "ai-plus/retail": "ai-plus/retail-creative-industries",
    "ai-plus/education": "ai-plus/education-future-of-work",
    "ai-plus/responsible-ai": "ai-plus/responsible-ai-data-cybersecurity",
  };
  const canonicalKey = canonicalAliases[routeKey] ?? routeKey;
  const label = pageTitles[routeKey]?.[lang] || pageTitles[section]?.[lang] || "WiseTech Hong Kong";
  const title: Metadata["title"] = section === "home"
    ? { absolute: "WiseTech Hong Kong" }
    : label;
  const socialTitle = section === "home" ? "WiseTech Hong Kong" : label + " | WiseTech Hong Kong";
  const description = section === "home"
    ? (lang === "en"
      ? "WiseTech Hong Kong connects trusted AI+ adoption, events, members, solutions, programmes and GBA market opportunities."
      : "WiseTech Hong Kong 連接可信 AI+ 應用、活動、會員、方案、計劃及大灣區市場機遇。[官方中文名稱待正式批准]")
    : (lang === "en"
      ? `Explore ${label} through WiseTech Hong Kong: practical guidance, current status, verified history and a clear next action.`
      : `透過 WiseTech Hong Kong 探索${label}：實務指引、現行狀態、已核實歷史及清晰下一步。[官方中文名稱待正式批准]`);
  const privatePreview = section === "portal" || routeKey === "join/success" || routeKey === "404";
  return {
    title,
    description,
    alternates: {
      canonical: "/" + lang + (canonicalKey ? "/" + canonicalKey : ""),
      languages: {
        en: "/en" + (canonicalKey ? "/" + canonicalKey : ""),
        "zh-Hant": "/zh" + (canonicalKey ? "/" + canonicalKey : ""),
      },
    },
    openGraph: { title: socialTitle, description, images: ["/og-wtia-blue.png"], locale: lang === "zh" ? "zh_HK" : "en_HK" },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: ["/og-wtia-blue.png"] },
    robots: privatePreview ? { index: false, follow: false } : undefined,
  };
}

export default async function LocalizedPage({ params }: LocalizedPageProps) {
  const { lang: rawLang, slug = [] } = await params;
  const lang: SiteLanguage = rawLang === "zh" ? "zh" : "en";
  return <WiseTechSite lang={lang} path={slug} />;
}
