import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import { rimg } from "@/lib/img";
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";
import { hasLocale, href } from "@/data/i18n";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import Page from "@/components/Page";
import { LogoMarquee } from "@/components/Logos";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "a-propos");
}


export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  const { ui, about: copy, projects, clients, partners } = await getContent();
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
  // the photo ribbon: every project's cover, then its other pictures, each once
  const seen = new Set<string>();
  const ribbon = projects
    .flatMap((p) => [p.cover.src, ...p.scenes.filter((s) => s.media.type === "image").map((s) => s.media.src)].map((src) => ({ src, p })))
    .filter((x) => !seen.has(x.src) && seen.add(x.src))
    .slice(0, 14);
  const rowA = ribbon.filter((_, i) => i % 2 === 0);
  const rowB = ribbon.filter((_, i) => i % 2 === 1);
  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

  return (
    <Page>
      {/* HERO — who we are, in one sentence, then our work moving underneath */}
      <section className="relative overflow-hidden pt-28 md:pt-40">
        <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(50%_70%_at_85%_10%,rgba(37,60,128,0.10),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)]" />
        <div className="wrap">
          <div className="kicker" style={{ animation: "rise .8s cubic-bezier(.2,.7,.2,1) both" }}>{ui.nav.about[lang]}</div>
          <h1 className="font-display mt-5 max-w-5xl text-[2.3rem] font-bold leading-[1.06] tracking-tight md:text-7xl md:leading-[1.02]" style={{ animation: "rise .9s .08s cubic-bezier(.2,.7,.2,1) both" }}>
            {copy.title[lang]}
          </h1>
          <div className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-6 md:mt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-16" style={{ animation: "rise .9s .16s cubic-bezier(.2,.7,.2,1) both" }}>
            <p className="max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">{copy.sub[lang]}</p>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45 rtl:tracking-normal">{copy.sectors[lang]}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {copy.sectorList[lang].map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-3 md:mt-20 md:space-y-4">
          <Ribbon items={rowA} lang={lang} />
          <Ribbon items={rowB} lang={lang} reverse />
        </div>
      </section>

      {/* XR — what the name means, each technology with one of our projects */}
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

      {/* COMMITMENT — four promises, large and numbered */}
      <section className="py-20 md:py-28">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <div className="kicker">{pillars.kicker[lang]}</div>
              <h2 className="font-display mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">{pillars.title[lang]}</h2>
            </div>
          </Reveal>
          <ol className="divide-y divide-line border-y border-line">
            {pillars.items.map((it, i) => (
              <Reveal key={i} delay={i * 80}>
                <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-7 md:grid-cols-[5rem_minmax(0,1fr)] md:py-9">
                  <span className="font-display text-3xl font-bold text-brand/25 md:text-5xl">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold md:text-2xl">{it.t[lang]}</h3>
                    <p className="mt-2 leading-relaxed text-ink/65 md:text-lg">{it.d[lang]}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* JOURNEY — a vertical line, newest first */}
      <section className="py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={T.pathK[lang]} title={T.pathT[lang]} action={<Link href={`${href(lang, "projets")}`} className="btn btn-ghost">{T.all[lang]}</Link>} />
          </Reveal>
          <div className="relative mt-12 md:mt-16">
            <span className="absolute inset-y-2 start-[7px] w-px bg-line md:start-[11px]" aria-hidden />
            {years.map((y) => (
              <Reveal key={y} className="relative pb-12 ps-9 last:pb-0 md:ps-14">
                <span className={`absolute start-0 top-2 h-[15px] w-[15px] rounded-full ring-4 ring-white md:h-6 md:w-6 ${y === "dev" ? "bg-ink/25" : "bg-sun"}`} aria-hidden />
                <div className={`font-display font-bold ${y === "dev" ? "text-xl text-ink/60 md:text-2xl" : "text-4xl text-brand md:text-5xl"}`}>{y === "dev" ? T.dev[lang] : y}</div>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groups.get(y)!.map((p) => (
                    <li key={p.slug}>
                      <Link href={`${href(lang, "projets")}/${p.slug}`} className="group block overflow-hidden rounded-[var(--radius-sm)] bg-white ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(20,36,84,0.5)]">
                        <div className="aspect-[16/10] overflow-hidden bg-navy">
                          <img {...rimg(p.cover.src, "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw")} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-ink/50">{p.meta[lang]}</div>
                          <div className="font-display mt-1 font-bold leading-snug transition-colors group-hover:text-brand">{p.title[lang]}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST — the clients and partners we work with */}
      <section className="border-y border-line py-10 md:py-14">
        <div className="wrap flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 md:text-start rtl:text-sm rtl:tracking-normal">{ui.trust[lang]}</p>
          <div className="min-w-0 flex-1">
            <LogoMarquee orgs={[...clients, ...partners].filter((o, i, all) => all.findIndex((x) => x.name === o.name) === i)} speed={34} size={{ area: 3600, maxW: 130, maxH: 46 }} itemClass="px-8 md:px-12" />
          </div>
        </div>
      </section>

      {/* WHERE */}
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

      <CTA lang={lang} />
    </Page>
  );
}

type Item = { src: string; p: { slug: string; title: Record<Locale, string> } };
const small = (src: string) => (rimg(src).srcSet ? `${src.slice(0, -5)}-480.webp` : src);

/** A slowly moving row of real project photos; each opens its project. */
function Ribbon({ items, reverse, lang }: { items: Item[]; reverse?: boolean; lang: Locale }) {
  return (
    <div className="marquee overflow-hidden" dir="ltr">
      <div className={`marquee-track gap-3 md:gap-4 ${reverse ? "reverse" : ""}`} style={{ "--speed": "70s" } as React.CSSProperties}>
        {[...items, ...items].map((x, i) => (
          <Link key={i} href={`${href(lang, "projets")}/${x.p.slug}`} tabIndex={i >= items.length ? -1 : 0} aria-hidden={i >= items.length} className="group relative block h-40 w-60 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-navy md:h-56 md:w-80">
            <img src={small(x.src)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 to-transparent p-3 pt-10 text-start text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100" dir={lang === "ar" ? "rtl" : "ltr"}>
              {x.p.title[lang]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
