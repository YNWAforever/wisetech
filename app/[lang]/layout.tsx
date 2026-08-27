export default async function LanguageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return <div lang={lang === "zh" ? "zh-Hant-HK" : "en-HK"}>{children}</div>;
}
