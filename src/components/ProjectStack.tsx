"use client";

import Link from "next/link";
import { useEffect, useRef, ViewTransition } from "react";
import { rimg } from "@/lib/img";
import type { ShowcaseItem } from "./Showcase";

/**
 * Home projects as a stack of cards: scrolling down (the normal way), each card holds
 * for a moment and the next one slides over it, while the one underneath shrinks and dims.
 * Every card: a large clear photo, then the project's name, line and link.
 */
export default function ProjectStack({ items, head, all, view }: { items: ShowcaseItem[]; head: React.ReactNode; all: { href: string; label: string }; view: string }) {
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  // the card underneath shrinks and dims as the next one covers it
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const els = cards.current;
        els.forEach((el, i) => {
          const next = els[i + 1];
          if (!el) return;
          if (!next) {
            el.style.transform = "";
            el.style.filter = "";
            return;
          }
          const a = el.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          // 0 when the next card is a full card-height below, 1 when it sits on top
          const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
          el.style.transform = `scale(${1 - p * 0.07})`;
          el.style.filter = `brightness(${1 - p * 0.35})`;
        });
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <section className="relative bg-white pb-16 pt-4 text-ink md:pb-28 md:pt-8">
      <div className="wrap flex items-end justify-between gap-6">
        <div>{head}</div>
        <Link href={all.href} className="hidden shrink-0 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-sun hover:bg-sun md:inline-flex">
          {all.label}
        </Link>
      </div>

      <div className="wrap mt-10 md:mt-14">
        {items.map((it, i) => (
          <div key={it.slug} className="sticky mb-6 md:mb-10" style={{ top: `calc(var(--stack-top) + ${i * 14}px)`, zIndex: i + 1 }}>
            <div ref={(el) => void (cards.current[i] = el)} className="origin-top will-change-transform">
              <Link
                href={it.href}
                className="group grid overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[0_-18px_50px_-28px_rgba(20,36,84,0.45),0_30px_70px_-45px_rgba(20,36,84,0.5)] ring-1 ring-line md:h-[min(72vh,620px)] md:grid-cols-12"
              >
                <ViewTransition name={`project-${it.slug}`} share="morph" default="none">
                  <div className="relative h-[40svh] min-h-[240px] overflow-hidden bg-navy md:col-span-7 md:h-full">
                    <img
                      {...rimg(it.image, "(min-width: 768px) 60vw, 100vw")}
                      alt=""
                      loading={i < 2 ? "eager" : "lazy"}
                      style={{ objectPosition: it.pos }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                    />
                    <span className="tag tag-dark absolute start-4 top-4 ring-1 ring-white/20 md:start-6 md:top-6">{it.tag}</span>
                  </div>
                </ViewTransition>
                <div className="flex flex-col justify-between gap-6 p-6 md:col-span-5 md:p-10 lg:p-12">
                  <div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-display font-bold text-brand" dir="ltr">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-8 bg-ink/20" />
                      <span className="text-ink/50">{it.meta}</span>
                    </div>
                    <h3 className="font-display mt-4 text-[1.6rem] font-bold leading-[1.12] md:mt-6 md:text-[2.5rem]">{it.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink/65 md:mt-4 md:text-lg">{it.short}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-3 font-semibold">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-sun text-ink transition-transform duration-300 group-hover:scale-110">
                      <span className="rtl:rotate-180">→</span>
                    </span>
                    {view}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* outside the stack, so the last card never sits on top of it */}
      <div className="wrap relative z-10 mt-6 flex justify-center md:mt-10">
        <Link href={all.href} className="btn btn-sun">
          {all.label} <span className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </section>
  );
}
