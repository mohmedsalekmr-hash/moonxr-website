import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";

import { Reveal } from "@/components/Media";
import { ClientCards, PartnerFeatures, TechWall } from "@/components/Ecosystem";
import CTA from "@/components/CTA";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";

export async function generateMetadata({ params }: PageProps<"/[lang]/partenaires">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "شركاؤنا" : "Partenaires" };
}



export default async function PartnersPage({ params }: PageProps<"/[lang]/partenaires">) {
  const { lang } = await params;
  const { ui, clients, partners, suppliers, partnersPage: C } = await getContent();
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
            <div className="kicker">{ui.partners.clients[lang]}</div>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-5xl">{C.clientsTitle[lang]}</h2>
          </Reveal>
          <Reveal className="mt-12">
            <ClientCards
              lang={lang}
              cta={C.view[lang]}
              items={[
                { org: clients[0], href: `/${lang}/projets/moov-mauritel`, image: "/media/photos/moov-wide.webp", pos: "60% 40%", label: { fr: "Lancement 5G", ar: "إطلاق الجيل الخامس" } },
                { org: clients[1], href: `/${lang}/projets/mattel`, image: "/media/photos/mattel-bus-smile.webp", pos: "50% 30%", label: { fr: "Lancement 5G", ar: "إطلاق الجيل الخامس" } },
                { org: { name: "EETFP", logo: "", r: 1 }, href: `/${lang}/projets/eetfp`, image: "/media/photos/eetfp-simulator.webp", pos: "60% 30%", label: { fr: "Lycée technique · 3 simulateurs de soudage", ar: "الثانوية الفنية · 3 محاكيات لحام" } },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partenaires" className="scroll-mt-20 bg-soft py-14 md:py-24">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{ui.partners.kicker[lang]}</div>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-5xl">{C.partnersTitle[lang]}</h2>
          </Reveal>
          <Reveal className="mt-12">
            <PartnerFeatures orgs={partners} lang={lang} extra={extra} />
          </Reveal>
        </div>
      </section>

      {/* TECHNOLOGY SUPPLIERS */}
      <section id="technologies" className="scroll-mt-20 py-14 md:py-24">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="kicker">{ui.partners.suppliers[lang]}</div>
              <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold md:text-5xl">{C.techTitle[lang]}</h2>
            </div>
            <p className="max-w-xs text-sm text-ink/60">{C.techSub[lang]}</p>
          </Reveal>
          <Reveal className="mt-12">
            <TechWall orgs={suppliers} lang={lang} />
          </Reveal>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
