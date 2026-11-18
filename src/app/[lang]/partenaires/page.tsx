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
  return { title: lang === "ar" ? "شركاؤنا" : "Partenaires" };
}



export default async function PartnersPage({ params }: PageProps<"/[lang]/partenaires">) {
  const { lang } = await params;
  const { ui, clients, partners, suppliers, projects, partnersPage: C } = await getContent();
  const clientCount = projects.filter((p) => p.facts.some((f) => f.k.fr === "Client")).length;
  const extra = Object.fromEntries(partners.map((o) => [o.name, { points: o.points ?? [] }]));
  if (!hasLocale(lang)) notFound();

  return (
    <Page>
      <PageHead kicker={C.kicker[lang]} title={C.title[lang]} sub={C.sub[lang]}>
        <nav aria-label={C.kicker[lang]} className="mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-white">
          {[
            { href: "#clients", n: clientCount, l: ui.partners.clients[lang] },
            { href: "#partenaires", n: partners.length, l: ui.partners.kicker[lang] },
            { href: "#technologies", n: suppliers.length, l: lang === "ar" ? "تقنيات" : "Technologies" },
          ].map((s, i) => (
            <a key={s.href} href={s.href} className={`group p-4 transition-colors hover:bg-brand-soft md:p-6 ${i ? "border-s border-line" : ""}`}>
              <div className="font-display text-3xl font-bold text-brand md:text-4xl">{s.n}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/60 md:text-sm">
                {s.l} <span className="transition-transform group-hover:translate-y-0.5">↓</span>
              </div>
            </a>
          ))}
        </nav>
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
