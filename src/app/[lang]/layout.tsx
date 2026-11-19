import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Sora, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { hasLocale, locales, LANG } from "@/data/i18n";
import { alternates } from "@/lib/seo";
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
  const l = hasLocale(lang) ? lang : "fr";
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return {
    metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
    title: {
      default: {
        fr: "Moon XR — La réalité virtuelle en Mauritanie",
        ar: "Moon XR — الواقع الافتراضي في موريتانيا",
        en: "Moon XR — Virtual reality in Mauritania",
      }[l],
      template: "%s · Moon XR",
    },
    description: {
      fr: "Division technologie immersive de Moon Technology : événements VR, simulateurs de formation et accompagnement sur site, à Nouakchott.",
      ar: "قسم التقنيات التفاعلية في Moon Technology: فعاليات الواقع الافتراضي، ومحاكيات التدريب، والمرافقة في الموقع.",
      en: "The immersive technology division of Moon Technology: VR events, training simulators and on-site support, in Nouakchott.",
    }[l],
    alternates: alternates(l),
    openGraph: {
      type: "website",
      siteName: "Moon XR",
      locale: LANG[l].og,
      alternateLocale: locales.filter((x) => x !== l).map((x) => LANG[x].og),
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { ui, contact } = await getContent();
  return (
    <html lang={LANG[lang].html} dir={LANG[lang].dir} translate="no" className={`${sora.variable} ${inter.variable} ${arabic.variable}`} suppressHydrationWarning>
      <head>
        {/* the site is already in French, Arabic and English: no "Translate this page?" prompt from the browser */}
        <meta name="google" content="notranslate" />
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
          <img src="/media/logos/moonxr-l.svg?v=2" alt="" width={1920} height={467} className="intro-logo" />
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
