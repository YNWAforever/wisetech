export type NavLanguage = "en" | "zh";

export type NavText = { en: string; zh: string };

export type NavLink = {
  label: NavText;
  path: string;
};

export type MegaNavGroup = {
  id: string;
  label: NavText;
  navLabel: NavText;
  path: string;
  eventFirst?: boolean;
  columns: Array<{
    title: NavText;
    links: NavLink[];
  }>;
  feature: {
    label: NavText;
    title: NavText;
    copy: NavText;
    cta: NavText;
    path: string;
  };
};

const link = (en: string, zh: string, path: string): NavLink => ({ label: { en, zh }, path });

// Five task-led groups. Each menu keeps four priority links, one clear “view all”
// route and a single featured next step so the navigation stays easy to scan.
export const megaNav: MegaNavGroup[] = [
  {
    id: "events-activities",
    label: { en: "Events & Activities", zh: "活動及參與" },
    navLabel: { en: "Events", zh: "活動" },
    path: "events",
    eventFirst: true,
    columns: [
      {
        title: { en: "Find what is open", zh: "尋找現正開放項目" },
        links: [
          link("Open Now", "現正開放", "events?status=open"),
          link("AI Clinics", "AI 診所", "activities/ai-clinics"),
        ],
      },
      {
        title: { en: "Take part", zh: "投入參與" },
        links: [
          link("Corporate Buyer Days", "企業買家日", "activities/buyer-days"),
          link("Industry Councils", "產業委員會", "activities/industry-councils"),
          link("View All Events & Activities", "查看所有活動及參與方式", "activities"),
        ],
      },
    ],
    feature: {
      label: { en: "Open now", zh: "現正開放" },
      title: { en: "No activities are currently open.", zh: "目前未有開放報名的活動。" },
      copy: { en: "Register for updates and we’ll share confirmed dates, eligibility and booking details when available.", zh: "登記接收通知；日期、資格及報名詳情確認後，我們會與你分享。" },
      cta: { en: "Get activity updates", zh: "接收活動通知" },
      path: "events#interest",
    },
  },
  {
    id: "members-solutions",
    label: { en: "Members & Solutions", zh: "會員及方案" },
    navLabel: { en: "Members", zh: "會員" },
    path: "members",
    columns: [
      {
        title: { en: "Discover capability", zh: "發掘合適能力" },
        links: [
          link("Member Directory", "會員名錄", "members"),
          link("AI Solutions", "AI 解決方案", "solutions"),
        ],
      },
      {
        title: { en: "Join the ecosystem", zh: "加入生態系統" },
        links: [
          link("Request an Introduction", "申請引薦", "request-introduction"),
          link("Submit a Business Challenge", "提交業務挑戰", "submit-challenge"),
          link("View All Members & Solutions", "查看會員及方案總覽", "members"),
        ],
      },
    ],
    feature: {
      label: { en: "Member platform", zh: "會員平台" },
      title: { en: "Bring a real business need into the network.", zh: "把真實業務需要帶進網絡。" },
      copy: { en: "Prepare a buyer brief without exposing confidential information or implying a guaranteed match.", zh: "在不公開機密資料或暗示保證配對下準備買家簡報。" },
      cta: { en: "Submit a challenge", zh: "提交挑戰" },
      path: "submit-challenge",
    },
  },
  {
    id: "ai-plus",
    label: { en: "AI+ Industries", zh: "AI+ 產業" },
    navLabel: { en: "AI+ Industries", zh: "AI+ 產業" },
    path: "ai-plus",
    columns: [
      {
        title: { en: "Start with industry", zh: "由產業需要開始" },
        links: [
          link("AI+ Overview", "AI+ 總覽", "ai-plus"),
          link("Commerce & Professional Services", "商貿及專業服務", "ai-plus/commerce-professional-services"),
        ],
      },
      {
        title: { en: "Build responsibly", zh: "負責任地實踐" },
        links: [
          link("Manufacturing & Robotics", "製造及機械人", "ai-plus/manufacturing-robotics"),
          link("Responsible AI, Data & Cyber", "負責任 AI、數據及網絡安全", "ai-plus/responsible-ai-data-cybersecurity"),
          link("View All AI+ Industries", "查看所有 AI+ 產業", "ai-plus"),
        ],
      },
    ],
    feature: {
      label: { en: "AI+ adoption", zh: "AI+ 應用" },
      title: { en: "Start with a real industry problem.", zh: "由真實產業問題開始。" },
      copy: { en: "Move from a practical challenge to relevant knowledge, people and an informed next step.", zh: "由實務挑戰出發，連接相關知識、人才及清晰下一步。" },
      cta: { en: "Explore AI+", zh: "探索 AI+" },
      path: "ai-plus",
    },
  },
  {
    id: "programmes-gba",
    label: { en: "Programmes & GBA", zh: "計劃及大灣區" },
    navLabel: { en: "Programmes", zh: "計劃" },
    path: "programmes",
    columns: [
      {
        title: { en: "Build capability", zh: "建立能力" },
        links: [
          link("All Programmes", "所有計劃", "programmes"),
          link("Launch Pad", "Launch Pad", "programmes/launchpad"),
        ],
      },
      {
        title: { en: "Access markets", zh: "拓展市場" },
        links: [
          link("Market Entry", "市場進入", "gba/market-entry"),
          link("GBA Delegations", "大灣區考察團", "activities/gba-delegations"),
          link("View All Programmes & GBA", "查看所有計劃及大灣區支援", "programmes"),
        ],
      },
    ],
    feature: {
      label: { en: "Programme status", zh: "計劃狀態" },
      title: { en: "Prepare the market objective before the introduction.", zh: "引薦前先準備市場目標。" },
      copy: { en: "Use the market-entry pathway to clarify readiness, partner type and follow-through.", zh: "利用市場進入路徑釐清準備度、夥伴類型及跟進。" },
      cta: { en: "Explore market entry", zh: "探索市場進入" },
      path: "gba/market-entry",
    },
  },
  {
    id: "insights-about",
    label: { en: "Insights & About", zh: "洞察及關於" },
    navLabel: { en: "Insights", zh: "洞察" },
    path: "insights",
    columns: [
      {
        title: { en: "Use trusted knowledge", zh: "善用可信知識" },
        links: [
          link("Case Studies", "案例研究", "insights/case-studies"),
          link("Practical Guides", "實務指南", "insights/guides"),
        ],
      },
      {
        title: { en: "Understand the Association", zh: "認識商會" },
        links: [
          link("About the Association", "關於商會", "about"),
          link("Responsible AI", "負責任 AI", "responsible-ai"),
          link("View All Insights & About", "查看洞察及關於總覽", "insights"),
        ],
      },
    ],
    feature: {
      label: { en: "Technology + Wisdom", zh: "科技 + 智慧" },
      title: { en: "Practical progress needs responsible choices.", zh: "實務進步需要負責任選擇。" },
      copy: { en: "Explore human accountability, data protection, security, transparency and ongoing evaluation.", zh: "探索人的問責、資料保障、安全、透明度及持續評估。" },
      cta: { en: "Responsible AI", zh: "負責任 AI" },
      path: "responsible-ai",
    },
  },
];
