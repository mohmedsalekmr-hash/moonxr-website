import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import type { Metadata } from "next";
import Home from "../page";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "contact");
}

/** The contact address shows the home page with the contact window open over it (see ContactModal). */
export default function ContactPage(props: PageProps<"/[lang]/contact">) {
  return <Home {...(props as unknown as PageProps<"/[lang]">)} />;
}
