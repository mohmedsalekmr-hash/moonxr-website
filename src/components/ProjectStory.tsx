"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { rimg } from "@/lib/img";
import type { SceneMedia, StoryScene } from "./Story";

type Labels = { open: string; prev: string; next: string; close: string; all: string; swipe: string; sound: string; mute: string };

/** Plays a muted clip while it is on screen, pauses it otherwise. */
function useAutoplay(ref: React.RefObject<HTMLVideoElement | null>, threshold = 0.4) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ref, threshold]);
}

/** Fades and lifts an element in when it first comes on screen. */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const n = el.current;
    if (!n) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(n);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={el}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const still = (m: SceneMedia) => (m.type === "video" ? m.poster ?? "" : m.src);

/** A photo or clip as a clickable tile; clips loop silently while visible. */
function Tile({ m, sizes, eager, className = "", style, onOpen, label }: { m: SceneMedia; sizes: string; eager?: boolean; className?: string; style?: CSSProperties; onOpen: () => void; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useAutoplay(v);
  return (
    <button type="button" onClick={onOpen} aria-label={label} className={`group relative block w-full overflow-hidden bg-navy-deep text-start focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60 ${className}`} style={style}>
      {m.type === "video" ? (
        <video ref={v} src={m.src} poster={m.poster} muted loop playsInline preload={eager ? "auto" : "none"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <img {...rimg(m.src, sizes)} alt="" width={m.w} height={m.h} loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      )}
      <span className="pointer-events-none absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-90">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>
    </button>
  );
}

/**
 * Full-screen viewer: swipe (phone), arrows or keys (computer), thumbnails, counter.
 * Swiping down or pressing Esc closes it. Clips play with their own controls.
 */
function Lightbox({ items, start, onClose, L, rtl }: { items: SceneMedia[]; start: number; onClose: () => void; L: Labels; rtl: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(start);
  const n = items.length;
  const goTo = useCallback((k: number, smooth = true) => {
    const t = track.current;
    if (!t) return;
    const j = Math.max(0, Math.min(n - 1, k));
    t.children[j]?.scrollIntoView({ behavior: smooth ? "smooth" : "instant", inline: "center", block: "nearest" });
  }, [n]);

  useEffect(() => {
    goTo(start, false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [start, goTo]);

  // which slide is in view
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setI(Number((e.target as HTMLElement).dataset.i))),
      { root: t, threshold: 0.6 },
    );
    Array.from(t.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // only the visible clip plays
  useEffect(() => {
    track.current?.querySelectorAll("video").forEach((v) => {
      if (Number(v.dataset.i) === i) v.play().catch(() => {});
      else v.pause();
    });
  }, [i]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(rtl ? i - 1 : i + 1);
      if (e.key === "ArrowLeft") goTo(rtl ? i + 1 : i - 1);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [i, goTo, onClose, rtl]);

  // swipe down to close (phone)
  const y0 = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);

  const arrow = (dir: -1 | 1) => (
    <button
      type="button"
      onClick={() => goTo(i + dir)}
      disabled={dir < 0 ? i === 0 : i === n - 1}
      aria-label={dir < 0 ? L.prev : L.next}
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-sun hover:text-ink disabled:pointer-events-none disabled:opacity-0 md:grid ${dir < 0 ? "start-5" : "end-5"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d={dir < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex flex-col bg-navy-deep text-white"
      style={{ animation: "fadein .25s ease-out", opacity: 1 - Math.min(drag, 240) / 400 }}
      onTouchStart={(e) => (y0.current = e.touches.length === 1 ? e.touches[0].clientY : null)}
      onTouchMove={(e) => y0.current !== null && setDrag(Math.max(0, e.touches[0].clientY - y0.current))}
      onTouchEnd={() => {
        if (drag > 110) onClose();
        y0.current = null;
        setDrag(0);
      }}
    >
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <span className="font-display text-sm tabular-nums text-white/70" dir="ltr">
          {i + 1} / {n}
        </span>
        <button type="button" onClick={onClose} aria-label={L.close} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1" style={{ transform: `translateY(${drag}px)` }}>
        {arrow(-1)}
        <div ref={track} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain">
          {items.map((m, k) => (
            <div key={k} data-i={k} className="grid h-full w-full shrink-0 snap-center place-items-center px-3 md:px-24">
              {m.type === "video" ? (
                <video data-i={k} src={m.src} poster={m.poster} controls playsInline loop className="max-h-full max-w-full rounded-[var(--radius-sm)]" />
              ) : (
                <img {...rimg(m.src, "100vw")} alt="" width={m.w} height={m.h} loading={Math.abs(k - start) < 2 ? "eager" : "lazy"} className="max-h-full max-w-full rounded-[var(--radius-sm)] object-contain" />
              )}
            </div>
          ))}
        </div>
        {arrow(1)}
      </div>

      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        {items.map((m, k) => (
          <button
            key={k}
            type="button"
            onClick={() => goTo(k)}
            aria-label={`${k + 1} / ${n}`}
            aria-current={k === i ? "true" : undefined}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl transition md:h-16 md:w-16 ${k === i ? "opacity-100 ring-2 ring-sun ring-offset-2 ring-offset-navy-deep" : "opacity-45 hover:opacity-80"}`}
          >
            <img src={rimg(still(m)).srcSet ? `${still(m).slice(0, -5)}-480.webp` : still(m)} alt="" className="h-full w-full object-cover" />
            {m.type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/25 text-xs">▶</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The project page as a case study a visitor already knows how to read:
 * a full-screen opening picture, then the story in big pictures with normal scrolling,
 * then all the media in a swipeable strip. Any picture opens the full-screen viewer.
 */
export default function ProjectStory({
  scenes,
  heroTop,
  title,
  intro,
  facts,
  galleryKicker,
  L,
  rtl,
  heroFocus,
  cover,
  fit = "whole",
}: {
  fit?: "whole" | "fill";
  heroFocus?: string;
  /** the project's cover photo (chosen in the admin) opens the page */
  cover: SceneMedia;
  scenes: StoryScene[];
  heroTop: ReactNode;
  title: string;
  intro: string;
  facts: { k: string; v: string }[];
  galleryKicker: string;
  L: Labels;
  rtl: boolean;
}) {
  const hero = cover;
  const heroPos = heroFocus ?? (hero.h > hero.w ? "50% 22%" : "50% 40%");
  // the story: every scene whose picture is not already the opening one (a picture is never shown twice)
  const story = scenes.filter((s, k) => s.media.src !== hero.src && scenes.findIndex((x) => x.media.src === s.media.src) === k);
  // all media once each, the opening picture first
  const media = [hero, ...story.map((s) => s.media)];
  const at = (m: SceneMedia) => Math.max(0, media.findIndex((x) => x.src === m.src));
  const [box, setBox] = useState<number | null>(null);
  const heroVid = useRef<HTMLVideoElement>(null);
  useAutoplay(heroVid, 0.2);
  const whole = fit === "whole";
  const art = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  // thin reading bar under the header
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = art.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setProgress(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // gallery strip: which card is first in view, and arrows on computer
  const strip = useRef<HTMLDivElement>(null);
  const [g, setG] = useState(0);
  useEffect(() => {
    const t = strip.current;
    if (!t) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setG(Number((e.target as HTMLElement).dataset.i))), { root: t, threshold: 0.7 });
    Array.from(t.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  const slide = (dir: 1 | -1) => {
    const t = strip.current;
    const card = t?.children[0] as HTMLElement | undefined;
    if (!t || !card) return;
    t.scrollBy({ left: (rtl ? -1 : 1) * dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const rest = story;
  const clamp = (m: SceneMedia) => Math.min(1.78, Math.max(0.8, m.w / m.h));

  return (
    <article ref={art} className="relative bg-white text-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-sun rtl:origin-right" style={{ transform: `scaleX(${progress})` }} aria-hidden />

      {/* OPENING — the first picture, full screen, with the title on it */}
      <header className="relative px-0 pt-16 md:px-6 md:pt-[88px]">
        <div className="relative mx-auto h-[calc(82svh-64px)] min-h-[420px] max-w-[1400px] overflow-hidden bg-navy-deep md:h-[calc(90vh-88px)] md:rounded-[var(--radius-lg)]">
          <button type="button" onClick={() => setBox(0)} aria-label={L.open} className="absolute inset-0 block overflow-hidden">
            {/* soft blurred copy filling the frame (seen around the picture on computers) */}
            {whole && <img src={rimg(still(hero)).srcSet ? `${still(hero).slice(0, -5)}-480.webp` : still(hero)} alt="" aria-hidden className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-80 blur-2xl saturate-[1.15] md:block" />}
            {hero.type === "video" ? (
              <video
                ref={heroVid}
                src={hero.src}
                poster={hero.poster}
                muted
                loop
                playsInline
                preload="auto"
                className={`relative mx-auto h-full w-full object-cover ${whole ? "md:w-auto md:max-w-full md:object-contain" : ""}`}
                style={{ objectPosition: heroPos }}
              />
            ) : (
              <img
                {...rimg(hero.src, "100vw")}
                alt=""
                width={hero.w}
                height={hero.h}
                loading="eager"
                fetchPriority="high"
                className={`relative mx-auto h-full w-full object-cover ${whole ? "md:w-auto md:max-w-full md:object-contain md:shadow-[0_0_80px_rgba(10,20,49,0.45)]" : ""}`}
                style={{ objectPosition: heroPos, animation: "hero-zoom 14s ease-out both" }}
              />
            )}
          </button>
          {/* light dark layer: calmer picture, readable title */}
          {whole && <div className="pointer-events-none absolute inset-0 bg-navy-deep/20" />}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,49,0.15)_0%,rgba(10,20,49,0)_35%,rgba(10,20,49,0.55)_65%,rgba(10,20,49,0.92)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-9 md:px-14 md:pb-14">
            <div className="pointer-events-auto max-w-3xl" style={{ animation: "rise .9s .15s cubic-bezier(.2,.7,.2,1) both" }}>
              {heroTop}
              <h1 className="font-display mt-3 text-[2.1rem] font-bold leading-[1.05] tracking-tight text-white md:mt-4 md:text-6xl lg:text-7xl">{title}</h1>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center text-white/70 md:bottom-5" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </header>

      {/* INTRO + KEY FACTS */}
      <section className="wrap grid gap-7 pb-12 pt-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:py-20">
        <p className="font-display text-[1.25rem] font-semibold leading-[1.5] text-ink md:text-[1.9rem] md:leading-[1.35]" style={{ animation: "rise .9s .3s cubic-bezier(.2,.7,.2,1) both" }}>
          {intro}
        </p>
        <Reveal delay={120}>
          <dl className="grid grid-cols-2 gap-3">
            {facts.map((f, k) => (
              <div key={k} className="rounded-[var(--radius-sm)] bg-brand-soft px-4 py-3.5">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand/70 rtl:text-xs rtl:tracking-normal">{f.k}</dt>
                <dd className="mt-1 text-sm font-semibold leading-snug text-ink md:text-[0.95rem]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* THE STORY — one big picture per scene, normal scrolling */}
      <div className="space-y-14 pb-6 md:space-y-28 md:pb-16">
        {rest.map((s, k) => {
          const flip = k % 2 === 1;
          return (
            <section key={k} className="wrap grid items-center gap-6 md:grid-cols-12 md:gap-14">
              <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                <Tile
                  m={s.media}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  onOpen={() => setBox(at(s.media))}
                  label={L.open}
                  className="max-h-[78svh] rounded-[var(--radius-lg)] shadow-[0_40px_80px_-45px_rgba(20,36,84,0.55)]"
                  style={{ aspectRatio: clamp(s.media) }}
                />
              </Reveal>
              <Reveal delay={100} className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="font-display text-brand">{String(k + 1).padStart(2, "0")}</span>
                  <span className="h-px w-10 bg-ink/20" />
                  {s.kicker && <span className="uppercase tracking-[0.16em] text-ink/55 rtl:tracking-normal">{s.kicker}</span>}
                </div>
                <h2 className="font-display mt-3 text-[1.6rem] font-bold leading-[1.15] md:mt-5 md:text-4xl lg:text-[2.75rem]">{s.title}</h2>
                {s.text && <p className="mt-3 text-[1rem] leading-relaxed text-ink/70 md:mt-5 md:text-lg">{s.text}</p>}
              </Reveal>
            </section>
          );
        })}
      </div>

      {/* ALL MEDIA — a strip that shows the next card, so swiping is obvious */}
      {media.length > 1 && (
        <section className="py-14 md:py-20">
          <div className="wrap flex items-end justify-between gap-4">
            <div>
              <p className="kicker">{galleryKicker}</p>
              <h2 className="font-display mt-2 text-2xl font-bold md:text-3xl">{L.all}</h2>
            </div>
            <div className="hidden gap-2 md:flex">
              {([-1, 1] as const).map((d) => (
                <button key={d} type="button" onClick={() => slide(d)} aria-label={d < 0 ? L.prev : L.next} className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink/70 transition hover:border-ink hover:bg-ink hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div ref={strip} className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:scroll-px-[max(2.5rem,calc((100vw-1240px)/2))] md:px-[max(2.5rem,calc((100vw-1240px)/2))]">
            {media.map((m, k) => (
              <div key={k} data-i={k} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
                <Tile m={m} sizes="(min-width: 1024px) 31vw, 78vw" onOpen={() => setBox(k)} label={L.open} className="aspect-[4/5] rounded-[var(--radius-sm)]" />
              </div>
            ))}
          </div>
          <div className="wrap mt-5 flex items-center gap-3">
            <div className="flex gap-1.5">
              {media.map((_, k) => (
                <span key={k} className={`h-[5px] rounded-full transition-all duration-300 ${k === g ? "w-6 bg-sun" : "w-[5px] bg-ink/15"}`} />
              ))}
            </div>
            <span className="text-xs text-ink/45 md:hidden">{L.swipe}</span>
          </div>
        </section>
      )}

      {box !== null && <Lightbox items={media} start={box} onClose={() => setBox(null)} L={L} rtl={rtl} />}
    </article>
  );
}
