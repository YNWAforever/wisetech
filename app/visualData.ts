export type SiteVisual = {
  src: string;
  alt: { en: string; zh: string };
  caption: { en: string; zh: string };
};

export const siteVisuals = {
  adoption: {
    src: "/archive/tech-connect-ai-leaders.webp",
    alt: {
      en: "Speakers and organisers at WTIA Tech Connect AI for ALL in Hong Kong.",
      zh: "WTIA Tech Connect 全民 AI 香港活動的講者及主辦團隊。",
    },
    caption: {
      en: "WTIA Tech Connect brought industry leaders together around practical AI adoption.",
      zh: "WTIA Tech Connect 匯聚產業領袖，推動 AI 實務應用。",
    },
  },
  community: {
    src: "/archive/tech-connect-community.webp",
    alt: {
      en: "Audience attending an in-person WTIA Tech Connect community session in Hong Kong.",
      zh: "參加 WTIA Tech Connect 香港實體社群活動的現場觀眾。",
    },
    caption: {
      en: "An in-person WTIA community session connecting technology with industry needs.",
      zh: "WTIA 實體社群活動，把科技連接產業需要。",
    },
  },
  gba: {
    src: "/archive/asia-smart-shanghai.webp",
    alt: {
      en: "WTIA representatives and regional partners at the Asia Smart Innovation Awards 2025 Shanghai exchange.",
      zh: "WTIA 代表與區域夥伴參與亞洲智慧創新大獎 2025 上海交流活動。",
    },
    caption: {
      en: "Hong Kong innovators connecting with regional partners through an established WTIA programme.",
      zh: "香港創新者透過 WTIA 現有計劃連接區域夥伴。",
    },
  },
  governance: {
    src: "/archive/asia-smart-summit.webp",
    alt: {
      en: "Industry guests and organisers at the Asia Smart Innovation Awards Summit 2025 in Hong Kong.",
      zh: "產業嘉賓及主辦團隊出席香港亞洲智慧創新大獎峰會 2025。",
    },
    caption: {
      en: "The Asia Smart Innovation Awards Summit 2025 brought the regional innovation community together.",
      zh: "亞洲智慧創新大獎峰會 2025 匯聚區域創新社群。",
    },
  },
  membership: {
    src: "/archive/asia-smart-kickoff.webp",
    alt: {
      en: "Organisers and partners launching the Asia Smart Innovation Awards 2025 programme.",
      zh: "主辦團隊及夥伴啟動亞洲智慧創新大獎 2025 計劃。",
    },
    caption: {
      en: "A long-standing network of organisers and partners supporting technology innovation.",
      zh: "由主辦團隊與夥伴長期建立、支持科技創新的網絡。",
    },
  },
} satisfies Record<string, SiteVisual>;

export type SiteVisualKey = keyof typeof siteVisuals;

export function visualForRoute(path: string): SiteVisual {
  if (path === "gba" || path.startsWith("gba/") || path === "for-gba-global") return siteVisuals.gba;
  if (path === "insights" || path.startsWith("insights/") || path === "ai-transparency" || path === "ai-ops" || path === "about") return siteVisuals.governance;
  if (
    path === "events" || path.startsWith("events/") || path === "activities" || path.startsWith("activities/") ||
    path === "programmes" || path.startsWith("programmes/") || path === "partner-with-us"
  ) return siteVisuals.community;
  if (path === "members" || path.startsWith("members/") || path === "membership" || path === "join" || path === "portal" || path === "for-professionals") return siteVisuals.membership;
  return siteVisuals.adoption;
}
