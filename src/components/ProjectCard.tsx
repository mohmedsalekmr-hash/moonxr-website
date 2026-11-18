import { useShared } from "@/components/ContentProvider";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/data/projects";
import { projectTag } from "@/data/projects";
import { type Locale } from "@/data/i18n";

/** Project card — photo under the navy veil, text on the photo (same look as the home strip and the deck). */
export default function ProjectCard({ p, lang, featured = false }: { p: Project; lang: Locale; index?: number; featured?: boolean }) {
  const { ui } = useShared();
  return (
    <Link href={`/${lang}/projets/${p.slug}`} className={`group relative block ${featured ? "sm:col-span-2 lg:col-span-3" : ""}`} aria-label={`${p.title[lang]} — ${ui.work.view[lang]}`}>
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className={`veil relative overflow-hidden rounded-[var(--radius-lg)] bg-navy ${featured ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" : "aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"}`}>
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
      <span className="absolute end-5 top-5 z-[2] tag tag-dark ring-1 ring-white/20">{projectTag[p.category][lang]}</span>
      <div className={`pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end text-white ${featured ? "p-6 sm:p-10 lg:p-14" : "p-6"}`}>
        <div className={featured ? "max-w-xl" : ""}>
          <div className="text-xs font-medium text-white/60">{p.meta[lang]}</div>
          <h3 className={`font-display mt-2 font-bold leading-tight ${featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl"}`}>{p.title[lang]}</h3>
          <p className={`mt-2 text-white/75 ${featured ? "text-base" : "text-sm"}`}>{p.short[lang]}</p>
          {featured ? (
            <span className="btn btn-sun mt-6">
              {ui.work.view[lang]} <span className="rtl:rotate-180">→</span>
            </span>
          ) : (
            <span className="mt-5 inline-grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-all group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
              <span className="rtl:rotate-180">→</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
