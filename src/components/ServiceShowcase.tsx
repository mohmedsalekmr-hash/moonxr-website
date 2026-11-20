"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { rimg } from "@/lib/img";
import { href, type Locale, type T } from "@/data/i18n";
import { SERVICE_IMG } from "./ServiceBento";

const STEP = 6000;

/**
 * What we do, as an interactive showcase: a numbered list of the services and one large photo.
 * The services take turns by themselves (a yellow line shows the time left); pointing at or
 * tapping one shows it at once, and the turns stop while the visitor is interacting.
 */
export default function ServiceShowcase({ services, lang, more }: { services: { title: T; text: T; image?: string; pos?: string }[]; lang: Locale; more: string }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const n = services.length;
  const img = (k: number) => ({ src: services[k].image ?? SERVICE_IMG[k % 4].src, pos: services[k].pos ?? SERVICE_IMG[k % 4].pos });

  // only run while on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (hold || !seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((k) => (k + 1) % n), STEP);
    return () => clearTimeout(t);
  }, [i, hold, seen, n]);

  const pick = (k: number) => {
    setI(k);
    setHold(true);
  };

  return (
    <div ref={root} className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14" onMouseLeave={() => setHold(false)}>
      {/* the photo stage */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy shadow-[0_40px_80px_-50px_rgba(20,36,84,0.6)] lg:order-2 lg:aspect-auto lg:h-[600px]">
        {services.map((_, k) => {
          const m = img(k);
          return (
            <img
              key={k}
              {...rimg(m.src, "(min-width: 1024px) 58vw, 100vw")}
              alt=""
              loading={k === 0 ? "eager" : "lazy"}
              style={{ objectPosition: m.pos }}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${k === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,49,0)_55%,rgba(10,20,49,0.65)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-7">
          <div key={i} className="caption-in">
            <span className="font-display text-sm text-sun" dir="ltr">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <div className="font-display mt-1 text-xl font-bold md:text-3xl">{services[i].title[lang]}</div>
          </div>
          <Link href={`${href(lang, "services")}#s${i + 1}`} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition hover:bg-sun" aria-label={`${services[i].title[lang]} — ${more}`}>
            <span className="-rotate-45 rtl:rotate-[225deg]">→</span>
          </Link>
        </div>
      </div>

      {/* the list */}
      <ol className="lg:order-1 lg:flex lg:flex-col lg:justify-center">
        {services.map((s, k) => {
          const on = k === i;
          return (
            <li key={k} className="border-b border-line first:border-t">
              <button type="button" onClick={() => pick(k)} onMouseEnter={() => pick(k)} aria-expanded={on} className="group flex w-full items-baseline gap-4 py-5 text-start md:py-6">
                <span className={`font-display w-8 shrink-0 text-sm transition-colors ${on ? "text-brand" : "text-ink/35"}`}>{String(k + 1).padStart(2, "0")}</span>
                <span className={`font-display text-xl font-bold leading-tight transition-colors md:text-[1.7rem] ${on ? "text-ink" : "text-ink/45 group-hover:text-ink/75"}`}>{s.title[lang]}</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="pb-6 ps-12">
                    <p className="max-w-md leading-relaxed text-ink/65">{s.text[lang]}</p>
                    <Link href={`${href(lang, "services")}#s${k + 1}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                      {more} <span className="rtl:rotate-180">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              {/* time left before the next service */}
              <div className="h-[2px] overflow-hidden">
                {on && <div key={`${i}-${hold}-${seen}`} className="h-full origin-left bg-sun rtl:origin-right" style={{ animation: hold || !seen ? "none" : `svc-bar ${STEP}ms linear both`, transform: hold ? "scaleX(1)" : undefined }} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
