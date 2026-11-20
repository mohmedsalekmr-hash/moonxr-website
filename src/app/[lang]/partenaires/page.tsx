import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";

import { Reveal } from "@/components/Media";
import { ClientStories, LogoWall, PartnerSpotlights } from "@/components/PartnersShowcase";
import { SectionNav, TechGrid } from "@/components/PartnersNav";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/partenaires">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "partenaires");
}

export default async function PartnersPage({ params }: PageProps<"/[lang]/partenaires">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { ui, clients, partners, suppliers, projects, partnersPage: C } = await getContent();

  // each technology once: partners are not repeated among the suppliers
  const techs = suppliers.filter((o) => !partners.some((p) => p.name === o.name));
  const nav = [
    { id: "clients", label: ui.partners.clients[lang] },
    { id: "partenaires", label: ui.partners.kicker[lang] },
    { id: "technologies", label: C.tech[lang] },
  ];

  // the wall: every logo once, each pointing to the section where it is presented
  const seen = new Set<string>();
  const wall = [
    ...clients.map((org) => ({ org, to: "clients", label: nav[0].label })),
    ...partners.map((org) => ({ org, to: "partenaires", label: nav[1].label })),
    ...techs.map((org) => ({ org, to: "technologies", label: nav[2].label })),
  ].filter((w) => w.org.logo && !seen.has(w.org.name) && seen.add(w.org.name));

  const cats = [
    { id: "industry", label: C.catIndustry[lang] },
    { id: "education", label: C.catEducation[lang] },
    { id: "safety", label: C.catSafety[lang] },
    { id: "platform", label: C.catPlatform[lang] },
  ];
  const techItems = techs.map((o) => ({ ...o, roleText: o.role?.[lang], catText: cats.find((c) => c.id === o.category)?.label }));

  return (
    <Page>
      {/* HERO: the title, then the whole ecosystem at a glance */}
      <section className="grain relative overflow-hidden pb-12 pt-32 md:pb-20 md:pt-40">
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <div className="kicker">{C.kicker[lang]}</div>
            <h1 className="font-display mt-5 max-w-xl text-[2rem] font-bold leading-[1.1] md:text-6xl md:leading-[1.08]">{C.title[lang]}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">{C.sub[lang]}</p>
          </div>
          <LogoWall items={wall} />
        </div>
      </section>

      <SectionNav items={nav} />

      {/* CLIENTS */}
      <section id="clients" className="scroll-mt-32 py-14 md:scroll-mt-40 md:py-20">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.clients[lang]} title={C.clientsTitle[lang]} />
          </Reveal>
          <Reveal className="mt-8 md:mt-10">
            <ClientStories projects={projects} orgs={clients} lang={lang} cta={C.view[lang]} />
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partenaires" className="scroll-mt-32 border-t border-line py-14 md:scroll-mt-40 md:py-20">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.kicker[lang]} title={C.partnersTitle[lang]} />
          </Reveal>
          <div className="mt-10 md:mt-14">
            <PartnerSpotlights orgs={partners} projects={projects} lang={lang} labels={{ related: C.related[lang], view: C.view[lang] }} />
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section id="technologies" className="scroll-mt-32 border-t border-line py-14 md:scroll-mt-40 md:py-20">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={ui.partners.suppliers[lang]} title={C.techTitle[lang]} />
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">{C.techSub[lang]}</p>
          </Reveal>
          <div className="mt-8">
            <TechGrid orgs={techItems} cats={cats} all={C.all[lang]} />
          </div>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
