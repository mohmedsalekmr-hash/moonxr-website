import { Fragment } from "react";
import { getContent } from "@/lib/content";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, href as pageHref } from "@/data/i18n";
import { projectTag } from "@/data/projects";
import Hero3D from "@/components/Hero3D";
import { Reveal } from "@/components/Media";
import { LogoMarquee } from "@/components/Logos";
import Showcase from "@/components/Showcase";
import ServiceShowcase from "@/components/ServiceShowcase";
import ProcessLine from "@/components/ProcessLine";
import { EcoGrid } from "@/components/Ecosystem";
import ExploreButton from "@/components/ExploreButton";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

/**
 * Home, told in six chapters:
 * 1. the 3D headset · 2. who we are · 3. our work · 4. how we work · 5. ecosystem · 6. contact
 */
const LOOK: "sheet" | "bridge" = "bridge";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const { ui, services, steps, projects, clients, partners, suppliers, home, explorer } = await getContent();
  if (!hasLocale(lang)) notFound();
  const rtl = lang === "ar";
  const h = ui.home;

  // each homepage section; the order and visibility are set in /admin
  const S: Record<string, React.ReactNode> = {
    hero: (
      <>
          {/* 1 — HERO: the headset */}
          <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-14 md:flex-row md:items-center md:pb-0">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_72%_45%,rgba(37,60,128,0.12),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)] rtl:bg-[radial-gradient(60%_70%_at_28%_45%,rgba(37,60,128,0.12),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)]" />
            {/* phone: the headset has its own stage above the text; desktop: full-bleed behind it */}
            <div className="hero-stage relative z-0 mt-16 h-[40svh] min-h-[270px] w-full md:absolute md:inset-0 md:mt-0 md:h-auto">
              <Hero3D rtl={rtl} lang={lang} data={explorer} />
            </div>
            <div className="hero-copy wrap pointer-events-none relative z-10 pt-2 md:pt-24">
              <div className="pointer-events-auto max-w-xl">
                <div className="kicker">{ui.hero.kicker[lang]}</div>
                <h1 className="font-display mt-4 text-[2.15rem] font-bold leading-[1.08] sm:text-6xl md:mt-5 lg:text-7xl">
                  {ui.hero.l1[lang]}
                  <br />
                  <span className="text-brand">{ui.hero.l2a[lang]}</span> {ui.hero.l2b[lang]}
                </h1>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink/75 md:mt-6 md:text-lg">{ui.hero.sub[lang]}</p>
                <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                  <Link href={`${pageHref(lang, "projets")}`} className="btn btn-sun">
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
          {/* 2 — WHAT WE DO: one sentence, four photo tiles */}
          <section className={`pt-16 md:pt-28 ${LOOK === "sheet" ? "pb-20 md:pb-32" : "pb-6 md:pb-10"}`}>
            <div className="wrap">
              <Reveal>
                <div className="kicker">{h.aboutKicker[lang]}</div>
                <h2 className="statement">
                  {h.statementA[lang]} <span className="text-brand">{h.statementB[lang]}</span> {h.statementC[lang]}
                </h2>
              </Reveal>
              <Reveal>
                <ServiceShowcase services={services} lang={lang} more={h.serviceMore[lang]} />
              </Reveal>
            </div>
            <div className="wrap mt-10 md:mt-14">
              <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-10">
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
              href: `${pageHref(lang, "projets")}/${p.slug}`,
              image: p.cover.src,
              pos: p.cover.pos,
              tag: projectTag[p.category][lang],
              title: p.title[lang],
              short: p.short[lang],
              meta: p.meta[lang],
            }))}
            look={LOOK}
            head={
              <>
                <div className={`kicker ${LOOK === "sheet" ? "!text-sun" : ""}`}>{ui.work.kicker[lang]}</div>
                <h2 className="section-title">{h.workTitle[lang]}</h2>
              </>
            }
            all={{ href: `${pageHref(lang, "projets")}`, label: ui.work.seeAll[lang] }}
            hint={ui.home.swipeHint[lang]}
          />

      </>
    ),
    process: (
      <>
          {/* 4 — HOW WE WORK: one line, four stops */}
          <section className="relative bg-white pb-12 pt-6 md:pb-16 md:pt-10">
            <div className="wrap">
              <div className="border-t border-line pt-14 md:pt-20">
                <Reveal>
                  <SectionHeader center kicker={h.processKicker[lang]} title={h.processTitle[lang]} />
                </Reveal>
                <ProcessLine steps={steps} lang={lang} />
              </div>
            </div>
          </section>

      </>
    ),
    ecosystem: (
      <>
          {/* 5 — ECOSYSTEM: partners and technology suppliers */}
          <section className="py-16 md:py-32">
            <div className="wrap">
              <Reveal>
                <SectionHeader
                  kicker={h.ecoKicker[lang]}
                  title={h.ecoTitle[lang]}
                  lead={h.ecoSub[lang]}
                  action={
                    <Link href={`${pageHref(lang, "partenaires")}`} className="btn btn-ghost">
                      {h.ecoCta[lang]}
                    </Link>
                  }
                />
              </Reveal>
              <Reveal className="mt-8 md:mt-12">
                <EcoGrid partners={partners} suppliers={suppliers} lang={lang} labels={{ partner: ui.home.partnerLabel[lang], supplier: ui.partners.suppliers[lang] }} more={{ href: `${pageHref(lang, "partenaires")}#technologies`, label: ui.home.allTech[lang] }} />
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
