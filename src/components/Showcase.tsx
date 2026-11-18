"use client";

import Link from "next/link";
import { ViewTransition, useRef } from "react";

export type ShowcaseItem = { slug: string; href: string; image: string; pos?: string; tag: string; title: string; short: string; meta: string };

/**
 * Home projects: a horizontal strip, browsed sideways — swipe on a phone or trackpad, drag with the mouse.
 * Scrolling up and down keeps moving the page, never the strip.
 */
export default function Showcase({ items, head, all, hint }: { items: ShowcaseItem[]; head: React.ReactNode; all: { href: string; label: string }; hint: string }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  // Mouse drag (touch and trackpads scroll natively)
  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const up = () => {
    if (track.current) track.current.style.scrollSnapType = "";
    setTimeout(() => (drag.current = null), 0);
  };

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_20%_45%,rgba(111,138,214,0.16),transparent_70%)]" />
      <div className="wrap relative flex items-end justify-between gap-6">
        <div>{head}</div>
        <Link href={all.href} className="hidden shrink-0 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-sun hover:bg-sun hover:text-ink md:inline-flex">
          {all.label}
        </Link>
      </div>

      <div
        ref={track}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-[max(1.25rem,calc((100vw-75rem)/2))] pb-2 [scroll-padding-inline:max(1.25rem,calc((100vw-75rem)/2))] [scrollbar-width:none] active:cursor-grabbing md:mt-12 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => (
          <Link key={it.slug} href={it.href} draggable={false} className="group relative block shrink-0 snap-start select-none">
            <ViewTransition name={`project-${it.slug}`} share="morph" default="none">
              <div className="veil relative h-[62svh] max-h-[620px] min-h-[380px] w-[80vw] overflow-hidden rounded-[var(--radius-lg)] bg-navy sm:w-[420px] lg:w-[min(30vw,440px)]">
                <img src={it.image} alt="" draggable={false} loading={i < 3 ? "eager" : "lazy"} style={{ objectPosition: it.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
              </div>
            </ViewTransition>
            <span className="absolute end-5 top-5 z-[2] tag tag-dark ring-1 ring-white/20">{it.tag}</span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-6 md:p-7">
              <div className="text-xs font-medium text-white/60">{it.meta}</div>
              <h3 className="font-display mt-2 text-2xl font-bold leading-tight md:text-[1.7rem]">{it.title}</h3>
              <p className="mt-2 text-sm text-white/75">{it.short}</p>
              <span className="mt-5 inline-grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-all group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
                <span className="rtl:rotate-180">→</span>
              </span>
            </div>
          </Link>
        ))}
        <span className="w-px shrink-0" aria-hidden />
      </div>

      <div className="wrap relative mt-6 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-sm text-white/60">
          <svg viewBox="0 0 24 24" className="hint-swipe h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
          </svg>
          {hint}
        </span>
        <Link href={all.href} className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold md:hidden">
          {all.label}
        </Link>
      </div>
    </section>
  );
}
