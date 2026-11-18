import { Fragment } from "react";
import { getContent } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";
import { projectTag } from "@/data/projects";
import Hero3D from "@/components/Hero3D";
import { Reveal } from "@/components/Media";
import { LogoMarquee } from "@/components/Logos";
import Showcase from "@/components/Showcase";
import { EcoGrid } from "@/components/Ecosystem";
import ExploreButton from "@/components/ExploreButton";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

/**
 * Home, told in six chapters:
 * 1. the 3D headset · 2. who we are · 3. our work · 4. how we work · 5. ecosystem · 6. contact
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const { ui, services, steps, projects, clients, partners, suppliers, home } = await getContent();
  if (!hasLocale(lang)) notFound();
  const rtl = lang === "ar";
  const h = ui.home;

  // each homepage section; the order and visibility are set in /admin
  const S: Record<string, React.ReactNode> = {
    hero: (
      <>
          {/* 1 — HERO: the headset */}
          <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-14 md:flex-row md:items-center md:pb-0">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_72%_45%,rgba(0,122,255,0.16),transparent_70%),radial-gradient(40%_40%_at_15%_85%,rgba(251,183,48,0.14),transparent_70%),linear-gradient(180deg,#f3f6fc,#ffffff)] rtl:bg-[radial-gradient(60%_70%_at_28%_45%,rgba(0,122,255,0.16),transparent_70%),radial-gradient(40%_40%_at_85%_85%,rgba(251,183,48,0.14),transparent_70%),linear-gradient(180deg,#f3f6fc,#ffffff)]" />
            {/* phone: the headset has its own stage above the text; desktop: full-bleed behind it */}
            <div className="hero-stage relative z-0 mt-16 h-[40svh] min-h-[270px] w-full md:absolute md:inset-0 md:mt-0 md:h-auto">
              <Hero3D rtl={rtl} lang={lang} />
            </div>
            <div className="hero-copy wrap pointer-events-none relative z-10 pt-2 md:pt-24">
              <div className="pointer-events-auto max-w-xl">
                <div className="kicker">{ui.hero.kicker[lang]}</div>
                <h1 className="font-display mt-4 text-[2.35rem] font-bold leading-[1.06] sm:text-6xl md:mt-5 lg:text-7xl">
                  {ui.hero.l1[lang]}
                  <br />
                  <span className="text-sun-deep">{ui.hero.l2a[lang]}</span> {ui.hero.l2b[lang]}
                </h1>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink/70 md:mt-6 md:text-lg">{ui.hero.sub[lang]}</p>
                <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                  <Link href={`/${lang}/projets`} className="btn btn-sun">
                    {ui.hero.cta1[lang]}
                  </Link>
                  <ExploreButton label={h.explore[lang]} />
                </div>
              </div>
            </div>
            <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />
          </section>

      </>
    ),
    about: (
      <>
          {/* 2 — WHO WE ARE */}
          <section className="pb-14 pt-16 md:pb-24 md:pt-32">
            <div className="wrap">
              <Reveal>
                <div className="kicker">{h.aboutKicker[lang]}</div>
                <p className="font-display mt-5 max-w-5xl text-[1.55rem] font-semibold leading-[1.22] md:mt-6 md:text-5xl md:leading-[1.12]">
                  {h.statementA[lang]} <span className="text-sky">{h.statementB[lang]}</span> {h.statementC[lang]}
                </p>
              </Reveal>
              {/* phone: cards to swipe; desktop: four columns */}
              <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-14 sm:grid sm:gap-x-8 sm:gap-y-8 sm:overflow-visible sm:border-t sm:border-line sm:px-0 sm:pb-0 sm:pt-10 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((s, i) => (
                  <Reveal key={s.n} delay={i * 80} className="w-[78%] shrink-0 snap-start rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-18px_rgba(11,27,63,0.35)] sm:w-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                    <div className="font-display text-sm font-semibold text-sky">{s.n}</div>
                    <h3 className="font-display mt-2 text-lg font-semibold sm:mt-3">{s.title[lang]}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70 sm:text-sm sm:text-ink/60">{s.text[lang]}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="wrap mt-12 md:mt-16">
              <div className="flex flex-col items-stretch gap-2 border-t border-line pt-8 md:flex-row md:items-center md:gap-10">
                <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 md:text-start rtl:text-sm rtl:tracking-normal">{ui.trust[lang]}</p>
                <div className="min-w-0 flex-1">
                  <LogoMarquee orgs={clients} speed={30} size={{ area: 3600, maxW: 130, maxH: 46 }} itemClass="px-8 md:px-12" />
                </div>
              </div>
            </div>
          </section>

      </>
    ),
    work: (
      <>
          {/* 3 — OUR WORK — a film strip that slides sideways as you scroll */}
          <Showcase
            items={projects.map((p) => ({
              slug: p.slug,
              href: `/${lang}/projets/${p.slug}`,
              image: p.cover.src,
              pos: p.cover.pos,
              tag: projectTag[p.category][lang],
              title: p.title[lang],
              short: p.short[lang],
              meta: p.meta[lang],
            }))}
            head={
              <>
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sun rtl:text-sm rtl:tracking-normal">
                  <span className="h-px w-8 bg-sun" />
                  {ui.work.kicker[lang]}
                </div>
                <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{h.workTitle[lang]}</h2>
              </>
            }
            all={{ href: `/${lang}/projets`, label: ui.work.seeAll[lang] }}
            hint={lang === "ar" ? "اسحب يميناً أو يساراً لتصفّح المشاريع" : "Glissez vers la gauche ou la droite pour parcourir"}
          />

      </>
    ),
    process: (
      <>
          {/* 4 — HOW WE WORK */}
          <section className="py-16 md:py-32">
            <div className="wrap">
              <Reveal>
                <div className="kicker">{h.processKicker[lang]}</div>
                <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{h.processTitle[lang]}</h2>
              </Reveal>
              <ol className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-12 sm:grid sm:gap-px sm:overflow-hidden sm:rounded-3xl sm:border sm:border-line sm:bg-line sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <Reveal as="li" key={i} delay={i * 80} className="w-[78%] shrink-0 snap-start rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-18px_rgba(11,27,63,0.35)] sm:w-auto sm:rounded-none sm:border-0 sm:p-7 sm:shadow-none md:p-8">
                    <div className="font-display text-sm font-semibold text-sky">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="font-display mt-3 text-lg font-semibold sm:mt-6">{s.title[lang]}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70 sm:text-sm sm:text-ink/60">{s.text[lang]}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

      </>
    ),
    ecosystem: (
      <>
          {/* 5 — ECOSYSTEM: partners and technology suppliers */}
          <section className="bg-soft py-16 md:py-32">
            <div className="wrap">
              <Reveal className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="kicker">{h.ecoKicker[lang]}</div>
                  <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{h.ecoTitle[lang]}</h2>
                  <p className="mt-3 max-w-xl text-[0.95rem] text-ink/70 md:mt-4 md:text-base md:text-ink/60">{h.ecoSub[lang]}</p>
                </div>
                <Link href={`/${lang}/partenaires`} className="btn btn-ghost">
                  {h.ecoCta[lang]}
                </Link>
              </Reveal>
              <Reveal className="mt-8 md:mt-12">
                <EcoGrid partners={partners} suppliers={suppliers} lang={lang} labels={{ partner: lang === "ar" ? "شريك" : "Partenaire", supplier: ui.partners.suppliers[lang] }} more={{ href: `/${lang}/partenaires#technologies`, label: lang === "ar" ? "كل التقنيات" : "Toutes nos technologies" }} />
              </Reveal>
            </div>
          </section>

      </>
    ),
    contact: (
      <>
          {/* 6 — CONTACT */}
          <CTA lang={lang} />
      </>
    ),
  };

  return (
    <Page>
      {home.filter((x) => x.visible && S[x.id]).map((x) => <Fragment key={x.id}>{S[x.id]}</Fragment>)}
    </Page>
  );
}
