import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Sora, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { hasLocale, locales } from "@/data/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { ContentProvider } from "@/components/ContentProvider";
import { getContent } from "@/lib/content";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", weight: ["400", "500", "600", "700"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const ar = lang === "ar";
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return {
    metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
    title: {
      default: ar ? "Moon XR — الواقع الافتراضي في موريتانيا" : "Moon XR — La réalité virtuelle en Mauritanie",
      template: "%s · Moon XR",
    },
    description: ar
      ? "قسم التقنيات التفاعلية في Moon Technology: فعاليات الواقع الافتراضي، ومحاكيات التدريب، والمرافقة في الموقع."
      : "Division technologie immersive de Moon Technology : événements VR, simulateurs de formation et accompagnement sur site, à Nouakchott.",
    icons: { icon: "/favicon.svg" },
    openGraph: { images: ["/media/photos/moov-wide.webp"] },
  };
}

export const viewport: Viewport = { themeColor: "#0a1431" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { ui, contact } = await getContent();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={`${sora.variable} ${inter.variable} ${arabic.variable}`} suppressHydrationWarning>
      <head>
        {/* the intro animation plays once per visit */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('mx-intro'))document.documentElement.classList.add('mx-seen');sessionStorage.setItem('mx-intro','1')}catch(e){}",
          }}
        />
      </head>
      <body>
        <ContentProvider value={{ ui, contact }}>
        <div className="intro" aria-hidden="true">
          <img src="/media/logos/moonxr-l.svg" alt="" width={1920} height={315} className="intro-logo" />
          <span className="intro-bar" />
        </div>
        <SmoothScroll />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </ContentProvider>
      </body>
    </html>
  );
}
