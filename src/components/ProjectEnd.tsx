import { getContent } from "@/lib/content";
import Link from "next/link";
import { ViewTransition } from "react";
import { type Locale } from "@/data/i18n";
import type { Project } from "@/data/projects";

type Props = { next: Project; lang: Locale };

/** 1 — Takeover: the next project fills the screen, one huge title, nothing else. */
export async function EndTakeover({ next, lang }: Props) {
  const { ui } = await getContent();
  return (
    <Link href={`/${lang}/projets/${next.slug}`} className="group relative block h-[70svh] min-h-[460px] overflow-hidden bg-white text-ink">
      <ViewTransition name={`project-${next.slug}`} share="morph" default="none">
        <img src={next.cover.src} alt="" loading="lazy" style={{ objectPosition: next.cover.pos }} className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-[6px] transition-all duration-[1.6s] ease-out group-hover:scale-100 group-hover:opacity-45 group-hover:blur-0" />
      </ViewTransition>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white" />
      <div className="relative grid h-full place-items-center text-center">
        <div className="wrap">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand rtl:text-sm rtl:tracking-normal">{ui.project.next[lang]}</div>
          <div className="font-display mx-auto mt-6 max-w-5xl text-4xl font-bold leading-[1.02] md:text-7xl lg:text-8xl">{next.title[lang]}</div>
          <div className="mt-6 text-sm text-ink/60">{next.meta[lang]}</div>
          <span className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full border border-ink/20 bg-white transition-all duration-500 group-hover:scale-110 group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
            <span className="text-lg rtl:rotate-180">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
