"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroShot = { src: string; srcSet?: string; pos?: string; title: string; href: string };

function useCycle(n: number, ms: number) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms, paused]);
  return { i, setI, setPaused };
}

/** One large photo that crossfades to the next project every few seconds, with its name underneath. */
export function HeroSwap({ shots, rtl }: { shots: HeroShot[]; rtl: boolean }) {
  const { i, setI, setPaused } = useCycle(shots.length, 4200);
  const cur = shots[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Link href={cur.href} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy shadow-[0_40px_80px_-40px_rgba(20,36,84,.55)] lg:aspect-[5/6]">
        {shots.map((s, k) => (
          <img
            key={s.src}
            src={s.src}
            srcSet={s.srcSet}
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt=""
            loading={k === 0 ? "eager" : "lazy"}
            style={{ objectPosition: s.pos }}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${k === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/70 to-transparent" />
        <div key={cur.src} className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-6" dir={rtl ? "rtl" : "ltr"} style={{ animation: "fadein .7s both" }}>
          <span className="font-display text-lg font-semibold leading-snug">{cur.title}</span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-sun group-hover:text-ink">
            <span className="rtl:rotate-180">→</span>
          </span>
        </div>
      </Link>
      <div className="mt-4 flex gap-1.5" dir="ltr">
        {shots.map((s, k) => (
          <button key={s.src} type="button" aria-label={s.title} onClick={() => setI(k)} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
            <span className={`block h-full rounded-full bg-navy ${k === i ? "w-full transition-[width] duration-[4200ms] ease-linear" : k < i ? "w-full" : "w-0"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

const FAN = [
  { x: 0, y: 0, r: 0, s: 1 },
  { x: 16, y: -2, r: 7, s: 0.94 },
  { x: -17, y: -1, r: -8, s: 0.9 },
  { x: 4, y: -9, r: 3, s: 0.86 },
];

/** A fanned stack of photos: every few seconds the front one slides away and goes to the back. */
export function HeroStack({ shots, rtl }: { shots: HeroShot[]; rtl: boolean }) {
  const n = shots.length;
  const { i, setI, setPaused } = useCycle(n, 3600);
  const front = shots[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative mx-auto mt-4 aspect-[4/5] w-[64%] md:w-[62%]">
        {shots.map((s, k) => {
          const d = (k - i + n) % n; // 0 = front
          const leaving = d === n - 1; // the one that was just in front
          const f = FAN[Math.min(d, FAN.length - 1)];
          const style = leaving
            ? { transform: `translate(${rtl ? 60 : -60}%, 8%) rotate(${rtl ? 14 : -14}deg) scale(.9)`, opacity: 0, zIndex: n + 1 }
            : { transform: `translate(${f.x}%, ${f.y}%) rotate(${f.r}deg) scale(${f.s})`, opacity: d < FAN.length ? 1 : 0, zIndex: n - d };
          return (
            <Link
              key={s.src}
              href={s.href}
              tabIndex={d === 0 ? 0 : -1}
              aria-hidden={d !== 0}
              onClick={(e) => {
                if (d !== 0) {
                  e.preventDefault();
                  setI(k);
                }
              }}
              className="absolute inset-0 overflow-hidden rounded-[var(--radius-lg)] border-[6px] border-white bg-navy shadow-[0_30px_60px_-30px_rgba(20,36,84,.55)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]"
              style={style}
            >
              <img src={s.src} srcSet={s.srcSet} sizes="(min-width: 1024px) 32vw, 80vw" alt="" loading={d < 2 ? "eager" : "lazy"} style={{ objectPosition: s.pos }} className="h-full w-full object-cover" />
              <div className={`absolute inset-0 bg-white transition-opacity duration-700 ${d === 0 ? "opacity-0" : "opacity-25"}`} />
            </Link>
          );
        })}
      </div>
      <p key={front.src} className="mt-10 text-center text-sm font-semibold text-ink/70" dir={rtl ? "rtl" : "ltr"} style={{ animation: "fadein .6s both" }}>
        {front.title}
      </p>
    </div>
  );
}
