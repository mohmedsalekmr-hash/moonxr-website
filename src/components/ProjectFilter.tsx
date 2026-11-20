"use client";
import { useShared } from "@/components/ContentProvider";
import Link from "next/link";
import { useEffect, useState, ViewTransition } from "react";
import { categories, projectTag, type Category, type Project } from "@/data/projects";
import { href, type Locale } from "@/data/i18n";
import { rimg } from "@/lib/img";

type View = "grid" | "list";
const KEY = "mx-work-view";

/** The project's client (first fact), for the card's small line. */
const clientOf = (p: Project, lang: Locale) => p.facts[0]?.v[lang];

/**
 * The work index, as agency sites do it: a calm filter, one featured project,
 * then cards with the photo shown clearly and the text under it — or a compact list.
 */
export default function ProjectFilter({ projects, lang }: { projects: Project[]; lang: Locale }) {
  const { ui } = useShared();
  const [cat, setCat] = useState<Category | "all">("all");
  const [view, setView] = useState<View>("grid");
  const [fade, setFade] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      // the visitor's last choice (read after the first paint, so server and browser agree)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v === "grid" || v === "list") setView(v);
    } catch {}
  }, []);
  const pick = (c: Category | "all") => {
    if (c === cat) return;
    setFade(true);
    setTimeout(() => {
      setCat(c);
      setFade(false);
    }, 180);
  };
  const switchView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  };

  const present = new Set(projects.map((p) => p.category));
  const tabs = (["all", "event", "training", "dev"] as const).filter((c) => c === "all" || present.has(c));
  const list = cat === "all" ? projects : projects.filter((p) => p.category === cat);
  const [first, ...rest] = list;

  return (
    <>
      {/* filter + view switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
          {tabs.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => pick(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                cat === c ? "bg-ink text-white shadow-[0_10px_24px_-14px_rgba(10,15,31,0.8)]" : "bg-ink/[0.04] text-ink/65 hover:bg-ink/[0.08] hover:text-ink"
              }`}
            >
              {c === "all" ? ui.work.all[lang] : categories[c][lang]}
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-ink/[0.04] p-1" role="group">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => switchView(v)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${view === v ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                {v === "grid" ? <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
              {ui.work[v][lang]}
            </button>
          ))}
        </div>
      </div>

      <div className={`transition-[opacity,transform] duration-300 ${fade ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}>
        {view === "grid" ? (
          <>
            {first && <Featured p={first} lang={lang} label={cat === "all" ? ui.work.featured[lang] : projectTag[first.category][lang]} view={ui.work.view[lang]} />}
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 md:gap-x-10 md:gap-y-16">
              {rest.map((p, i) => (
                <Card key={p.slug} p={p} lang={lang} offset={i % 2 === 1} />
              ))}
            </div>
          </>
        ) : (
          <WorkList list={list} lang={lang} view={ui.work.view[lang]} />
        )}
      </div>
    </>
  );
}

/** The first project, large: the picture on one side, its story on the other. */
function Featured({ p, lang, label, view }: { p: Project; lang: Locale; label: string; view: string }) {
  return (
    <Link href={`${href(lang, "projets")}/${p.slug}`} className="group mt-8 grid items-center gap-6 md:mt-12 md:grid-cols-12 md:gap-12">
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy md:col-span-8 md:aspect-[16/10]">
          <img
            {...rimg(p.cover.src, "(min-width: 768px) 66vw, 100vw")}
            alt={p.cover.alt[lang]}
            width={p.cover.w}
            height={p.cover.h}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            style={{ objectPosition: p.cover.pos }}
          />
        </div>
      </ViewTransition>
      <div className="md:col-span-4">
        <span className="tag">{label}</span>
        <h2 className="font-display mt-4 text-[1.9rem] font-bold leading-[1.1] md:text-[2.6rem]">{p.title[lang]}</h2>
        <p className="mt-3 leading-relaxed text-ink/70 md:text-lg">{p.short[lang]}</p>
        <div className="mt-4 text-sm text-ink/50">
          {clientOf(p, lang)}
          {clientOf(p, lang) && " · "}
          {p.meta[lang]}
        </div>
        <span className="btn btn-sun mt-6">
          {view} <span className="rtl:rotate-180">→</span>
        </span>
      </div>
    </Link>
  );
}

/** A project card: the photo clear (no veil), the text under it. */
function Card({ p, lang, offset }: { p: Project; lang: Locale; offset: boolean }) {
  return (
    <Link href={`${href(lang, "projets")}/${p.slug}`} className={`group block ${offset ? "sm:mt-20" : ""}`}>
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy">
          <img
            {...rimg(p.cover.src, "(min-width: 640px) 50vw, 100vw")}
            alt={p.cover.alt[lang]}
            width={p.cover.w}
            height={p.cover.h}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
            style={{ objectPosition: p.cover.pos }}
          />
          <span className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 max-md:opacity-100 md:translate-y-1 md:group-hover:translate-y-0">
            <span className="-rotate-45 rtl:rotate-[225deg]">→</span>
          </span>
        </div>
      </ViewTransition>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold">
        {/* the type tag only when the date line does not already say it */}
        {!p.meta[lang].startsWith(projectTag[p.category][lang]) && <span className="tag">{projectTag[p.category][lang]}</span>}
        <span className="text-ink/45">{p.meta[lang]}</span>
      </div>
      <h3 className="font-display mt-3 text-[1.45rem] font-bold leading-tight transition-colors group-hover:text-brand md:text-[1.7rem]">{p.title[lang]}</h3>
      <p className="mt-2 leading-relaxed text-ink/65">{p.short[lang]}</p>
    </Link>
  );
}

/** Compact index: one row per project, with a small photo on phones. */
function WorkList({ list, lang, view }: { list: Project[]; lang: Locale; view: string }) {
  return (
    <div className="relative mt-6">
      <ul>
        {list.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={`${href(lang, "projets")}/${p.slug}`}
              aria-label={`${p.title[lang]} — ${view}`}
              className="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-4 md:grid-cols-[3rem_minmax(0,1fr)_14rem_10rem_2rem] md:gap-6 md:py-6"
            >
              <span className="relative block aspect-square overflow-hidden rounded-xl bg-navy md:hidden">
                <img src={rimg(p.cover.src).srcSet ? `${p.cover.src.slice(0, -5)}-480.webp` : p.cover.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: p.cover.pos }} />
              </span>
              <span className="font-display hidden text-sm text-ink/35 md:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="font-display line-clamp-2 block text-[1.05rem] font-bold leading-snug transition-colors group-hover:text-brand md:line-clamp-1 md:text-[1.6rem]">{p.title[lang]}</span>
                <span className="mt-0.5 block truncate text-sm text-ink/50 md:hidden">
                  {projectTag[p.category][lang]} · {p.meta[lang]}
                </span>
              </span>
              <span className="hidden truncate text-sm text-ink/60 md:block">{clientOf(p, lang)}</span>
              <span className="hidden text-sm text-ink/45 md:block">{projectTag[p.category][lang]}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 transition group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
                <span className="rtl:rotate-180">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
