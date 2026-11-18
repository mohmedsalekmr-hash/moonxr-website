import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, ui, services, steps } from "@/data/i18n";
import { projects, projectTag, clients, partners, suppliers } from "@/data/projects";
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
  if (!hasLocale(lang)) notFound();
  const rtl = lang === "ar";
  const h = ui.home;

  return (
    <Page>
      {/* 1 — HERO: the headset */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 md:items-center md:pb-0">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_72%_45%,rgba(0,122,255,0.16),transparent_70%),radial-gradient(40%_40%_at_15%_85%,rgba(251,183,48,0.14),transparent_70%),linear-gradient(180deg,#f3f6fc,#ffffff)] rtl:bg-[radial-gradient(60%_70%_at_28%_45%,rgba(0,122,255,0.16),transparent_70%),radial-gradient(40%_40%_at_85%_85%,rgba(251,183,48,0.14),transparent_70%),linear-gradient(180deg,#f3f6fc,#ffffff)]" />
        <div className="hero-stage absolute inset-0 z-0">
          <Hero3D rtl={rtl} lang={lang} />
        </div>
        <div className="hero-copy wrap pointer-events-none relative z-10 pt-24">
          <div className="pointer-events-auto max-w-xl">
            <div className="kicker">{ui.hero.kicker[lang]}</div>
            <h1 className="font-display mt-5 text-[2.6rem] font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              {ui.hero.l1[lang]}
              <br />
              <span className="text-sun-deep">{ui.hero.l2a[lang]}</span> {ui.hero.l2b[lang]}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">{ui.hero.sub[lang]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${lang}/projets`} className="btn btn-sun">
                {ui.hero.cta1[lang]}
              </Link>
              <ExploreButton label={h.explore[lang]} />
            </div>
          </div>
        </div>
        <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 2 — WHO WE ARE */}
      <section className="pb-20 pt-24 md:pb-24 md:pt-32">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{h.aboutKicker[lang]}</div>
            <p className="font-display mt-6 max-w-5xl text-[1.9rem] font-semibold leading-[1.18] md:text-5xl md:leading-[1.12]">
              {h.statementA[lang]} <span className="text-sky">{h.statementB[lang]}</span> {h.statementC[lang]}
            </p>
          </Reveal>
          <div className="mt-14 grid gap-x-8 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="font-display text-sm font-semibold text-sky">{s.n}</div>
                <h3 className="font-display mt-3 text-lg font-semibold">{s.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.text[lang]}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="wrap mt-16">
          <div className="flex items-center gap-6 border-t border-line pt-8 md:gap-10">
            <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink/40 rtl:text-sm rtl:tracking-normal">{ui.trust[lang]}</p>
            <div className="min-w-0 flex-1">
              <LogoMarquee orgs={clients} speed={30} size={{ area: 3600, maxW: 130, maxH: 46 }} itemClass="px-8 md:px-12" />
            </div>
          </div>
        </div>
      </section>

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

      {/* 4 — HOW WE WORK */}
      <section className="py-24 md:py-32">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{h.processKicker[lang]}</div>
            <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{h.processTitle[lang]}</h2>
          </Reveal>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="bg-white p-7 md:p-8">
                <div className="font-display text-sm font-semibold text-sky">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-6 text-lg font-semibold">{s.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.text[lang]}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — ECOSYSTEM: partners and technology suppliers */}
      <section className="bg-soft py-24 md:py-32">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="kicker">{h.ecoKicker[lang]}</div>
              <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{h.ecoTitle[lang]}</h2>
              <p className="mt-4 max-w-xl text-ink/60">{h.ecoSub[lang]}</p>
            </div>
            <Link href={`/${lang}/partenaires`} className="btn btn-ghost">
              {h.ecoCta[lang]}
            </Link>
          </Reveal>
          <Reveal className="mt-12">
            <EcoGrid partners={partners} suppliers={suppliers} lang={lang} labels={{ partner: lang === "ar" ? "شريك" : "Partenaire", supplier: ui.partners.suppliers[lang] }} more={{ href: `/${lang}/partenaires#technologies`, label: lang === "ar" ? "كل التقنيات" : "Toutes nos technologies" }} />
          </Reveal>
        </div>
      </section>

      {/* 6 — CONTACT */}
      <CTA lang={lang} />
    </Page>
  );
}
