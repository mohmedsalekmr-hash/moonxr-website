import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";

import { Reveal } from "@/components/Media";
import { ClientIndex, PartnerFeatures, TechLogoRows } from "@/components/Ecosystem";
import CTA from "@/components/CTA";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";

export async function generateMetadata({ params }: PageProps<"/[lang]/partenaires">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "partenaires");
}



export default async function PartnersPage({ params }: PageProps<"/[lang]/partenaires">) {
  const { lang } = await params;
  const { ui, clients, partners, suppliers, projects, partnersPage: C } = await getContent();
  const extra = Object.fromEntries(partners.map((o) => [o.name, { points: o.points ?? [] }]));
  if (!hasLocale(lang)) notFound();

  return (
    <Page>
      <PageHead kicker={C.kicker[lang]} title={C.title[lang]} sub={C.sub[lang]}>
        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          <a href="#clients" className="rounded-full border border-ink/12 bg-white px-4 py-2 hover:border-ink/35">{ui.partners.clients[lang]}</a>
          <a href="#partenaires" className="rounded-full border border-ink/12 bg-white px-4 py-2 hover:border-ink/35">{ui.partners.kicker[lang]}</a>
          <a href="#technologies" className="rounded-full border border-ink/12 bg-white px-4 py-2 hover:border-ink/35">{ui.partners.suppliers[lang]}</a>
        </div>
      </PageHead>

      {/* CLIENTS */}
      <section id="clients" className="scroll-mt-20 pb-14 md:pb-24">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.clients[lang]} title={C.clientsTitle[lang]} />
          </Reveal>
          <Reveal className="mt-10">
            <ClientIndex projects={projects} orgs={clients} lang={lang} cta={C.view[lang]} />
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partenaires" className="scroll-mt-20 py-14 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.kicker[lang]} title={C.partnersTitle[lang]} />
          </Reveal>
          <Reveal className="mt-10">
            <PartnerFeatures orgs={partners} lang={lang} extra={extra} />
          </Reveal>
        </div>
      </section>

      {/* TECHNOLOGY SUPPLIERS */}
      <section id="technologies" className="scroll-mt-20 py-14 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.suppliers[lang]} title={C.techTitle[lang]} />
          </Reveal>
        </div>
        <Reveal className="mt-8 md:mt-10">
          <TechLogoRows orgs={suppliers.filter((o) => !partners.some((p) => p.name === o.name))} />
        </Reveal>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
