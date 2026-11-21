import { pageMeta } from "@/lib/seo";
import { hasLocale, type Locale } from "@/data/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactStage, { type ContactBg } from "@/components/ContactStage";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "contact");
}

/** Background on trial: ?bg=aurora shows the drifting colours, otherwise the rising moon. */
export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const bg: ContactBg = (await searchParams).bg === "aurora" ? "aurora" : "moon";
  return <ContactStage lang={lang} bg={bg} />;
}
