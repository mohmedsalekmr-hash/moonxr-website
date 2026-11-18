import { useShared } from "@/components/ContentProvider";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/data/projects";
import { projectTag } from "@/data/projects";
import { type Locale } from "@/data/i18n";

/** Project card — photo under the navy veil, text on the photo (same look as the home strip and the deck). */
export default function ProjectCard({ p, lang }: { p: Project; lang: Locale; index?: number }) {
  const { ui } = useShared();
  return (
    <Link href={`/${lang}/projets/${p.slug}`} className="group relative block" aria-label={`${p.title[lang]} — ${ui.work.view[lang]}`}>
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="veil relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-navy sm:aspect-[5/4] lg:aspect-[4/5]">
          <img
            src={p.cover.src}
            alt={p.cover.alt[lang]}
            width={p.cover.w}
            height={p.cover.h}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            style={{ objectPosition: p.cover.pos }}
          />
        </div>
      </ViewTransition>
      <span className="absolute end-5 top-5 z-[2] rounded-full bg-white/12 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur-md rtl:text-xs">{projectTag[p.category][lang]}</span>
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end p-6 text-white">
        <div>
          <div className="text-xs font-medium text-white/60">{p.meta[lang]}</div>
          <h3 className="font-display mt-2 text-2xl font-bold leading-tight">{p.title[lang]}</h3>
          <p className="mt-2 text-sm text-white/70">{p.short[lang]}</p>
          <span className="mt-5 inline-grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-all group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
            <span className="rtl:rotate-180">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
