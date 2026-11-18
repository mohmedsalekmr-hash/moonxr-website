import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";
import PageHead from "@/components/PageHead";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "من نحن" : "À propos" };
}


export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  const { ui, services, about: copy } = await getContent();
  const pillars = copy.pillars;
  if (!hasLocale(lang)) notFound();
  return (
    <Page>
      <PageHead kicker={ui.nav.about[lang]} title={copy.title[lang]} sub={copy.sub[lang]} />

      <section className="pb-14 md:pb-20">
        <div className="wrap">
          <img src="/media/photos/moov-wide.webp" alt="" width={1080} height={608} className="aspect-[16/8] w-full rounded-[var(--radius-lg)] border border-line object-cover" />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{ui.services.kicker[lang]}</div>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold md:text-5xl">{ui.services.title[lang]}</h2>
          </Reveal>
          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-10 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 90} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <div className="card flex h-full gap-4 p-5 sm:gap-5 sm:p-7">
                  <div className="font-display text-sm font-semibold text-brand">{s.n}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{s.title[lang]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.text[lang]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <Reveal>
            <div className="kicker">{copy.sectors[lang]}</div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {copy.sectorList[lang].map((s) => (
                <li key={s} className="font-display py-4 text-xl font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="kicker">{ui.contact.city[lang]}</div>
            <h3 className="font-display mt-6 text-2xl font-semibold">{copy.where[lang]}</h3>
            <p className="mt-3 leading-relaxed text-ink/60">{copy.whereText[lang]}</p>
          </Reveal>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="bg-soft py-16 md:py-28">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{pillars.kicker[lang]}</div>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{pillars.title[lang]}</h2>
          </Reveal>
          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-14 sm:grid sm:gap-10 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pillars.items.map((it, i) => (
              <Reveal key={i} delay={i * 90} className="w-[78%] shrink-0 snap-start rounded-[var(--radius-sm)] bg-white p-5 sm:w-auto sm:rounded-none sm:border-t-2 sm:border-ink/10 sm:bg-transparent sm:p-0 sm:pt-6">
                <div className="font-display text-sm font-semibold text-brand">0{i + 1}</div>
                <h3 className="font-display mt-3 text-lg font-semibold">{it.t[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{it.d[lang]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
