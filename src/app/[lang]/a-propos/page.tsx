import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent, isShown } from "@/lib/content";
import { rimg } from "@/lib/img";
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";
import { hasLocale, href, isRtl } from "@/data/i18n";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import { HeroStack, HeroSwap, type HeroShot } from "@/components/AboutHeroVisual";
import { Commitments, YearStack } from "@/components/AboutScroll";
import Page from "@/components/Page";
import { LogoMarquee } from "@/components/Logos";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "a-propos");
}


const HERO: "swap" | "stack" = "stack";

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  const { sections, ui, about: copy, projects, clients, partners } = await getContent();
  const show = (page: string, id: string) => isShown(sections, page, id);
  const T = ui.aboutPage;
  const pillars = copy.pillars;
  const xr = copy.xr;
  if (!hasLocale(lang)) notFound();

  // timeline from the projects themselves: the year is read from each project's meta line
  const yearOf = (m: string) => m.match(/20\d\d/)?.[0] ?? null;
  const groups = new Map<string, typeof projects>();
  for (const p of projects) {
    const y = yearOf(p.meta.fr) ?? "dev";
    groups.set(y, [...(groups.get(y) ?? []), p]);
  }
  const years = [...groups.keys()].sort((a, b) => (a === "dev" ? 1 : b === "dev" ? -1 : Number(b) - Number(a)));
  // the hero photos: one per project, its cover
  const picked = (copy.heroShots ?? []).filter((x) => x.src);
  const shots: HeroShot[] = picked.length
    ? picked.map((x) => {
        const p = projects.find((q) => q.slug === x.slug);
        return { ...rimg(x.src), pos: x.pos, title: p?.title[lang] ?? "", href: p ? `${href(lang, "projets")}/${p.slug}` : href(lang, "projets") };
      })
    : projects.map((p) => ({ ...rimg(p.cover.src), pos: p.cover.pos, title: p.title[lang], href: `${href(lang, "projets")}/${p.slug}` }));
  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

  return (
    <Page>
      {/* HERO — who we are, with our work beside it */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(50%_70%_at_85%_10%,rgba(37,60,128,0.10),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)]" />
        <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <div className="kicker" style={{ animation: "rise .8s cubic-bezier(.2,.7,.2,1) both" }}>{ui.nav.about[lang]}</div>
            <h1 className="font-display mt-5 text-[2.3rem] font-bold leading-[1.06] tracking-tight md:text-6xl md:leading-[1.04]" style={{ animation: "rise .9s .08s cubic-bezier(.2,.7,.2,1) both" }}>
              {copy.title[lang]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl" style={{ animation: "rise .9s .16s cubic-bezier(.2,.7,.2,1) both" }}>{copy.sub[lang]}</p>
            <div className="mt-8" style={{ animation: "rise .9s .24s cubic-bezier(.2,.7,.2,1) both" }}>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45 rtl:tracking-normal">{copy.sectors[lang]}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {copy.sectorList[lang].map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ animation: "rise 1s .2s cubic-bezier(.2,.7,.2,1) both" }}>
            {HERO === "stack" ? <HeroStack shots={shots} rtl={isRtl(lang)} /> : <HeroSwap shots={shots} rtl={isRtl(lang)} />}
          </div>
        </div>
      </section>

      {/* XR — what the name means, each technology with one of our projects */}
      {show("about", "xr") && (
        <>
      <section className="py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <div className="max-w-3xl">
              <div className="kicker">{xr.kicker[lang]}</div>
              <h2 className="font-display mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">{xr.title[lang]}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/65">{xr.text[lang]}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
            {xr.items.map((it, i) => {
              const p = bySlug(it.slug);
              return (
                <Reveal key={it.k} delay={i * 100}>
                  <Link href={p ? `${href(lang, "projets")}/${p.slug}` : href(lang, "projets")} className="group block h-full overflow-hidden rounded-[var(--radius-lg)] bg-white ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(20,36,84,0.5)]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                      {p && <img {...rimg(p.cover.src, "(min-width: 768px) 33vw, 100vw")} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                      <span className="font-display absolute start-5 top-4 text-5xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-6xl" dir="ltr">{it.k}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold">{it.t[lang]}</h3>
                      <p className="mt-2 leading-relaxed text-ink/65">{it.d[lang]}</p>
                      {p && (
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                          <span className="min-w-0 truncate">
                            <span className="text-ink/45">{xr.example[lang]} · </span>
                            <span className="font-semibold">{p.title[lang]}</span>
                          </span>
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition group-hover:border-sun group-hover:bg-sun">
                            <span className="rtl:rotate-180">→</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
        </>
      )}

      {/* COMMITMENT — four promises: the one being read lights up */}
      {show("about", "commitments") && (
        <>
      <section className="py-20 md:py-28">
        <Commitments kicker={pillars.kicker[lang]} title={pillars.title[lang]} items={pillars.items.map((it) => ({ t: it.t[lang], d: it.d[lang] }))} />
      </section>
        </>
      )}

      {/* JOURNEY — one card per year, each sliding over the previous one */}
      {show("about", "journey") && (
        <>
      <section className="pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={T.pathK[lang]} title={T.pathT[lang]} action={<Link href={`${href(lang, "projets")}`} className="btn btn-ghost">{T.all[lang]}</Link>} />
          </Reveal>
          <div className="mt-10 md:mt-14">
            <YearStack
              years={years.map((y) => ({
                label: y === "dev" ? T.dev[lang] : y,
                dev: y === "dev",
                items: groups.get(y)!.map((p) => ({ href: `${href(lang, "projets")}/${p.slug}`, title: p.title[lang], meta: p.meta[lang], ...rimg(p.cover.src), pos: p.cover.pos })),
              }))}
            />
          </div>
        </div>
      </section>
        </>
      )}

      {/* TRUST — the clients and partners we work with */}
      {show("about", "trust") && (
        <>
      <section className="border-y border-line py-10 md:py-14">
        <div className="wrap flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 md:text-start rtl:text-sm rtl:tracking-normal">{ui.trust[lang]}</p>
          <div className="min-w-0 flex-1">
            <LogoMarquee orgs={[...clients, ...partners].filter((o, i, all) => all.findIndex((x) => x.name === o.name) === i)} speed={34} size={{ area: 3600, maxW: 130, maxH: 46 }} itemClass="px-8 md:px-12" />
          </div>
        </div>
      </section>
        </>
      )}

      {/* WHERE */}
      {show("about", "where") && (
        <>
      <section className="py-20 md:py-28">
        <div className="wrap">
          <Reveal className="grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
            <span className="grid h-20 w-20 place-items-center rounded-[1.4rem] bg-brand-soft text-brand md:h-28 md:w-28" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-9 w-9 md:h-12 md:w-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
                <circle cx="12" cy="10" r="2.4" />
              </svg>
            </span>
            <div>
              <div className="kicker">{ui.contact.city[lang]}</div>
              <h2 className="font-display mt-4 text-[1.9rem] font-bold leading-[1.12] md:text-5xl">{copy.where[lang]}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/65">{copy.whereText[lang]}</p>
            </div>
          </Reveal>
        </div>
      </section>
        </>
      )}

      <CTA lang={lang} />
    </Page>
  );
}

