"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Our commitments: the title holds on the side while the list scrolls;
 * the commitment being read lights up, the others step back, and a small bar counts them.
 */
export function Commitments({ kicker, title, items }: { kicker: string; title: string; items: { t: string; d: string }[] }) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const n = items.length;
  return (
    <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="kicker">{kicker}</div>
        <h2 className="font-display mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">{title}</h2>
        <div className="mt-10 hidden items-center gap-4 lg:flex" dir="ltr">
          <span className="font-display w-14 text-2xl font-bold text-brand">0{active + 1}</span>
          <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
            <span className="absolute inset-y-0 start-0 rounded-full bg-sun transition-[width] duration-500" style={{ width: `${((active + 1) / n) * 100}%` }} />
          </span>
          <span className="font-display w-14 text-end text-2xl font-bold text-ink/25">0{n}</span>
        </div>
      </div>
      <ol className="divide-y divide-line border-y border-line">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li
              key={i}
              data-i={i}
              ref={(el) => void (refs.current[i] = el)}
              className={`grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-7 transition-opacity duration-500 md:grid-cols-[5rem_minmax(0,1fr)] md:py-12 ${on ? "" : "lg:opacity-35"}`}
            >
              <span className={`font-display text-3xl font-bold transition-all duration-500 md:text-5xl ${on ? "text-brand lg:scale-110" : "text-brand/25"} origin-top-left rtl:origin-top-right`}>0{i + 1}</span>
              <div>
                <h3 className="font-display text-xl font-bold md:text-2xl">{it.t}</h3>
                <p className="mt-2 leading-relaxed text-ink/65 md:text-lg">{it.d}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export type YearCard = {
  label: string;
  dev: boolean;
  items: { href: string; title: string; meta: string; src: string; srcSet?: string; pos?: string }[];
};

/**
 * Our journey as a stack of year cards (like the projects on the home page):
 * each year holds, the next one slides over it, the one underneath shrinks and dims.
 */
export function YearStack({ years }: { years: YearCard[] }) {
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const els = cards.current;
        els.forEach((el, i) => {
          if (!el) return;
          const next = els[i + 1];
          if (!next) {
            el.style.transform = "";
            el.style.filter = "";
            return;
          }
          const a = el.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
          el.style.transform = `scale(${1 - p * 0.06})`;
          el.style.filter = `brightness(${1 - p * 0.3})`;
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
    <div>
      {years.map((y, i) => (
        <div key={y.label} className="sticky mb-6 md:mb-10" style={{ top: `calc(var(--stack-top) + ${i * 16}px)`, zIndex: i + 1 }}>
          <div ref={(el) => void (cards.current[i] = el)} className="origin-top will-change-transform">
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-white p-5 shadow-[0_-18px_50px_-28px_rgba(20,36,84,0.45),0_30px_70px_-45px_rgba(20,36,84,0.5)] ring-1 ring-line md:p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <span className={`h-3 w-3 shrink-0 rounded-full md:h-4 md:w-4 ${y.dev ? "bg-ink/25" : "bg-sun"}`} aria-hidden />
                <h3 className={`font-display font-bold leading-none ${y.dev ? "text-2xl text-ink/60 md:text-4xl" : "text-4xl text-brand md:text-6xl"}`}>{y.label}</h3>
                <span className="h-px flex-1 bg-line" aria-hidden />
              </div>
              <ul className="no-scrollbar -mx-5 mt-6 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:mt-8 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
                {y.items.map((p) => (
                  <li key={p.href} className="w-[72%] shrink-0 snap-start md:w-auto">
                    <Link href={p.href} className="group block overflow-hidden rounded-[var(--radius-sm)] bg-white ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(20,36,84,0.5)]">
                      <div className="aspect-[16/10] overflow-hidden bg-navy">
                        <img src={p.src} srcSet={p.srcSet} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 72vw" alt="" loading="lazy" style={{ objectPosition: p.pos }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-ink/50">{p.meta}</div>
                        <div className="font-display mt-1 font-bold leading-snug transition-colors group-hover:text-brand">{p.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
