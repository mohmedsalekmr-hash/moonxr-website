import { getContent } from "@/lib/content";
import { rimg } from "@/lib/img";
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "من نحن" : "À propos" };
}

const T = {
  numbers: { fr: "Moon XR en bref", ar: "Moon XR باختصار" },
  projects: { fr: "projets livrés", ar: "مشاريع منفّذة" },
  suppliers: { fr: "fournisseurs technologiques", ar: "مزوّدي تقنيات" },
  partners: { fr: "partenaires", ar: "شركاء" },
  since: { fr: "premiers projets", ar: "أولى المشاريع" },
  pathK: { fr: "Notre parcours", ar: "مسيرتنا" },
  pathT: { fr: "Chaque projet, une étape.", ar: "كل مشروع خطوة." },
  dev: { fr: "En développement", ar: "قيد التطوير" },
  all: { fr: "Tous les projets", ar: "كل المشاريع" },
};

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  const { ui, about: copy, projects, partners, suppliers } = await getContent();
  const pillars = copy.pillars;
  if (!hasLocale(lang)) notFound();

  // timeline from the projects themselves: the year is read from each project's meta line
  const yearOf = (m: string) => m.match(/20\d\d/)?.[0] ?? null;
  const groups = new Map<string, typeof projects>();
  for (const p of projects) {
    const y = yearOf(p.meta.fr) ?? "dev";
    groups.set(y, [...(groups.get(y) ?? []), p]);
  }
  const years = [...groups.keys()].sort((a, b) => (a === "dev" ? 1 : b === "dev" ? -1 : Number(a) - Number(b)));
  const mosaic = projects.filter((p) => p.cover?.src).slice(0, 3);

  return (
    <Page>
      {/* HERO: words + real project photos */}
      <section className="relative overflow-hidden pb-14 pt-28 md:pb-24 md:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(50%_70%_at_85%_10%,rgba(37,60,128,0.10),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)]" />
        <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <div className="kicker">{ui.nav.about[lang]}</div>
            <h1 className="font-display mt-5 text-[2rem] font-bold leading-[1.1] md:text-6xl md:leading-[1.08]">{copy.title[lang]}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">{copy.sub[lang]}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {copy.sectorList[lang].map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="grid h-[360px] grid-cols-2 grid-rows-2 gap-3 md:h-[520px] md:gap-4">
            {mosaic.map((p, i) => (
              <Link
                key={p.slug}
                href={`/${lang}/projets/${p.slug}`}
                className={`group relative overflow-hidden rounded-[var(--radius-lg)] bg-navy ${i === 0 ? "row-span-2" : ""}`}
              >
                <img {...rimg(p.cover.src, i === 0 ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 25vw, 50vw")} alt={p.cover.alt[lang]} loading={i === 0 ? "eager" : "lazy"} style={{ objectPosition: p.cover.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 start-3 end-3 text-xs font-semibold text-white md:bottom-4 md:start-4 md:text-sm">{p.title[lang]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE built from the projects */}
      <section className="py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={T.pathK[lang]} title={T.pathT[lang]} action={<Link href={`/${lang}/projets`} className="btn btn-ghost">{T.all[lang]}</Link>} />
          </Reveal>
          <div className="mt-12 space-y-10 md:mt-16">
            {years.map((y) => (
              <Reveal key={y} className="grid gap-4 border-t border-line pt-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
                <div className={`font-display font-bold ${y === "dev" ? "text-xl text-ink/60" : "text-4xl text-brand"}`}>{y === "dev" ? T.dev[lang] : y}</div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {groups.get(y)!.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/${lang}/projets/${p.slug}`} className="group flex items-center gap-4 rounded-[var(--radius-sm)] bg-white p-3 ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-26px_rgba(20,36,84,0.45)]">
                        <img {...rimg(p.cover.src, "120px")} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="h-16 w-20 shrink-0 rounded-[0.6rem] object-cover" />
                        <span className="min-w-0">
                          <span className="block font-semibold leading-snug">{p.title[lang]}</span>
                          <span className="mt-0.5 block truncate text-xs text-ink/60">{p.meta[lang]}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeader kicker={pillars.kicker[lang]} title={pillars.title[lang]} />
          </Reveal>
          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-10 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.items.map((it, i) => (
              <Reveal key={i} delay={i * 90} className="card w-[78%] shrink-0 snap-start p-6 sm:w-auto">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft font-display text-sm font-bold text-brand">0{i + 1}</div>
                <h3 className="font-display mt-5 text-lg font-semibold">{it.t[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{it.d[lang]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE */}
      <section className="pb-16 md:pb-28">
        <div className="wrap">
          <Reveal className="rounded-[var(--radius-lg)] bg-brand-soft p-7 md:p-12">
            <div>
              <div className="kicker">{ui.contact.city[lang]}</div>
              <h3 className="font-display mt-4 text-2xl font-bold md:text-3xl">{copy.where[lang]}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-ink/75">{copy.whereText[lang]}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
