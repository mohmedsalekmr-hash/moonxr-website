import { pageMeta } from "@/lib/seo";
import { hasLocale, type Locale } from "@/data/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactStage from "@/components/ContactStage";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "contact");
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <ContactStage lang={lang} />;
}
