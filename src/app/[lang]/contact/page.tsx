import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";
import PageHead from "@/components/PageHead";
import Page from "@/components/Page";
import ContactForm from "@/components/ContactForm";
import ContactList from "@/components/ContactList";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "تواصل معنا" : "Contact" };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const { ui } = await getContent();
  if (!hasLocale(lang)) notFound();
  const c = ui.contact;
  return (
    <Page>
      <PageHead kicker={ui.nav.contact[lang]} title={c.title[lang]} sub={c.sub[lang]} />
      <section className="pb-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ContactForm lang={lang} />
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="kicker">{c.direct[lang]}</div>
            <div className="mt-6">
              <ContactList lang={lang} tone="light" />
            </div>
          </aside>
        </div>
      </section>
    </Page>
  );
}
