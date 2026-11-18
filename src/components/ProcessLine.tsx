"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale, T } from "@/data/i18n";

/** "How we work" as one line with four stops: the yellow line fills as the steps play; tap a stop to read it. */
export default function ProcessLine({ steps, lang }: { steps: { title: T; text: T }[]; lang: Locale }) {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || !auto) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 4200);
    return () => clearInterval(t);
  }, [seen, auto, steps.length]);

  const n = steps.length;
  const fill = n > 1 ? (active / (n - 1)) * 100 : 100;

  return (
    <div ref={box} className="mt-12 md:mt-16">
      <div className="relative">
        {/* track */}
        <div className="absolute inset-x-[12.5%] top-[19px] h-[2px] rounded bg-white/12" />
        <div
          className="absolute start-[12.5%] top-[19px] h-[2px] rounded bg-sun transition-[width] duration-700 ease-out"
          style={{ width: seen ? `calc(${fill / 100} * 75%)` : 0 }}
        />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => {
            const on = i <= active;
            return (
              <li key={i} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  aria-current={i === active ? "step" : undefined}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 font-display text-sm font-bold transition-all duration-500 ${
                    i === active
                      ? "scale-110 border-sun bg-sun text-ink shadow-[0_0_0_8px_rgba(250,182,45,0.18)]"
                      : on
                        ? "border-sun bg-navy text-sun"
                        : "border-white/25 bg-navy text-white/60 hover:border-white/60"
                  }`}
                >
                  {i + 1}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  className={`font-display mt-4 px-1 text-sm font-semibold leading-snug transition-colors md:text-lg ${i === active ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {s.title[lang]}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mx-auto mt-8 max-w-xl text-center md:mt-10" aria-live="polite">
        <p key={active} className="rise text-base leading-relaxed text-white/75 md:text-lg">
          {steps[active]?.text[lang]}
        </p>
      </div>
    </div>
  );
}
