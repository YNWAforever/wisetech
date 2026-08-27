import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://wisetech-hong-kong.laichiwillyjp.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WiseTech Hong Kong",
    template: "%s | WiseTech Hong Kong",
  },
  description:
    "WiseTech Hong Kong is the evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association.",
  applicationName: "WiseTech Hong Kong",
  keywords: [
    "AI Hong Kong",
    "AI industry association",
    "Hong Kong technology",
    "GBA market access",
    "AI solutions marketplace",
    "technology membership",
  ],
  authors: [{ name: "Hong Kong Wireless Technology Industry Association" }],
  creator: "Hong Kong Wireless Technology Industry Association",
  publisher: "Hong Kong Wireless Technology Industry Association",
  alternates: {
    canonical: "/en",
    languages: { en: "/en", "zh-Hant": "/zh" },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "WiseTech Hong Kong",
    title: "WiseTech Hong Kong",
    description: "The evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association.",
    images: [{ url: "/og-wtia-blue.png", width: 1200, height: 630, alt: "WTIA legacy mark — How can Hong Kong lead the AI+ era?" }],
    locale: "en_HK",
  },
  twitter: {
    card: "summary_large_image",
    title: "WiseTech Hong Kong",
    description: "The evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association.",
    images: ["/og-wtia-blue.png"],
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  icons: {
    icon: [{ url: "/brand/wtia-favicon.png", type: "image/png" }],
    shortcut: "/brand/wtia-favicon.png",
    apple: "/brand/wtia-favicon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": siteUrl + "/#organization",
      name: "Hong Kong Wireless Technology Industry Association",
      alternateName: ["WiseTech Hong Kong", "HKWTA", "WTIA"],
      url: siteUrl,
      email: "contact@hkwtia.org",
      telephone: "+852-2989-9164",
      address: {
        "@type": "PostalAddress",
        streetAddress: "4/F, KOHO, 73-75 Hung To Road",
        addressLocality: "Kwun Tong",
        addressRegion: "Kowloon",
        addressCountry: "HK",
      },
      description: "WiseTech Hong Kong is the evolving AI+ industry platform of the Hong Kong Wireless Technology Industry Association.",
    },
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      url: siteUrl,
      name: "WiseTech Hong Kong",
      publisher: { "@id": siteUrl + "/#organization" },
      inLanguage: ["en-HK", "zh-Hant-HK"],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-HK">
      <body>
        <a className="sr-only sr-only-focusable" href="#main-content">Skip to main content</a>
        <div>{children}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
