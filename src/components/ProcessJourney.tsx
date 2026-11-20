"use client";

import { useEffect, useRef, useState } from "react";
import { rimg } from "@/lib/img";
import type { Locale, T } from "@/data/i18n";

type Step = { title: T; text: T; image?: string; caption?: T; pos?: string };

/**
 * "From your idea to an experience that works", told while scrolling (the page moves normally):
 * on computers a large photo stays on one side and changes as each step reaches the middle of
 * the screen; on phones each step is a card with its own photo. A yellow line fills as you go.
 */
export default function ProcessJourney({ steps, lang }: { steps: Step[]; lang: Locale }) {
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.innerHeight * 0.55;
        // the step whose top has passed the middle of the screen is the current one
        let a = 0;
        items.current.forEach((el, k) => {
          if (el && el.getBoundingClientRect().top < mid) a = k;
        });
        setActive(a);
        const l = list.current?.getBoundingClientRect();
        if (l) setFill(Math.min(1, Math.max(0, (mid - l.top) / l.height)));
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
    <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
      {/* the photo that stays (computers) */}
      <div className="hidden lg:block">
        <div className="sticky top-28 aspect-[4/5] max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-[var(--radius-lg)] bg-navy shadow-[0_40px_80px_-50px_rgba(20,36,84,0.6)]">
          {steps.map((s, k) =>
            s.image ? (
              <img
                key={k}
                {...rimg(s.image, "45vw")}
                alt=""
                loading="lazy"
                style={{ objectPosition: s.pos }}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${k === active ? "scale-100 opacity-100" : "scale-[1.07] opacity-0"}`}
              />
            ) : null,
          )}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,49,0)_60%,rgba(10,20,49,0.7)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-white">
            <div key={active} className="caption-in">
              <div className="font-display text-sm text-sun" dir="ltr">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </div>
              {steps[active]?.caption && <div className="mt-1 text-sm text-white/80">{steps[active].caption![lang]}</div>}
            </div>
            <div className="flex gap-1.5">
              {steps.map((_, k) => (
                <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === active ? "w-7 bg-sun" : "w-1.5 bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* the steps */}
      <ol ref={list} className="relative">
        {/* the line, and how much of it is done */}
        <span className="absolute inset-y-3 start-[19px] w-[2px] rounded-full bg-line md:start-[23px]" aria-hidden />
        <span className="absolute start-[19px] top-3 w-[2px] origin-top rounded-full bg-sun transition-transform duration-200 md:start-[23px]" style={{ height: "calc(100% - 1.5rem)", transform: `scaleY(${fill})` }} aria-hidden />
        {steps.map((s, k) => {
          const on = k <= active;
          const now = k === active;
          return (
            <li key={k} ref={(el) => void (items.current[k] = el)} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-5 pb-12 last:pb-0 md:grid-cols-[48px_minmax(0,1fr)] md:gap-7 lg:min-h-[52vh] lg:pb-0">
              <span
                className={`font-display relative z-[1] grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition-all duration-500 md:h-12 md:w-12 md:text-base ${
                  now ? "scale-110 bg-sun text-ink shadow-[0_0_0_8px_rgba(250,182,45,0.18)]" : on ? "bg-ink text-white" : "bg-white text-ink/40 ring-2 ring-line"
                }`}
              >
                {k + 1}
              </span>
              <div className={`transition-opacity duration-500 lg:pt-1 ${now ? "opacity-100" : "lg:opacity-40"}`}>
                {/* phones and tablets: each step brings its own photo */}
                {s.image && (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] bg-navy lg:hidden">
                    <img {...rimg(s.image, "90vw")} alt="" loading="lazy" style={{ objectPosition: s.pos }} className="h-full w-full object-cover" />
                    {s.caption && <span className="absolute bottom-3 start-3 rounded-full bg-navy-deep/70 px-3 py-1 text-xs text-white backdrop-blur">{s.caption[lang]}</span>}
                  </div>
                )}
                <h3 className="font-display text-[1.6rem] font-bold leading-tight md:text-[2.4rem]">{s.title[lang]}</h3>
                <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-ink/65 md:text-lg">{s.text[lang]}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
