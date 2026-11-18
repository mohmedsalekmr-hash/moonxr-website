"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type SceneMedia = {
  type: "image" | "video";
  src: string;
  w: number;
  h: number;
  poster?: string;
};

/**
 * One media block, the same everywhere on the site:
 * a rounded panel of fixed shape, filled with a soft blurred copy of the media,
 * and the media itself in the middle — whole, in its own proportions, never blown up.
 * Clips play by themselves (muted) while on screen; a small button turns the sound on.
 */
export function MediaPanel({
  m,
  ratio = "aspect-[4/3]",
  soundLabel,
  muteLabel,
  eager = false,
}: {
  m: SceneMedia;
  ratio?: string;
  soundLabel: string;
  muteLabel: string;
  eager?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = box.current;
    const v = vid.current;
    if (!el || !v) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (vid.current) vid.current.muted = !sound;
  }, [sound]);

  const bg = m.type === "video" ? m.poster : m.src;
  return (
    <div
      ref={box}
      className={`media-panel relative overflow-hidden rounded-[var(--radius-lg)] bg-navy-deep ${ratio}`}
    >
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-3xl saturate-150"
      />
      <div className="absolute inset-0 bg-navy-deep/25" />
      <div
        className="absolute inset-5 grid place-items-center md:inset-8"
        style={{ containerType: "size" } as CSSProperties}
      >
        <div
          className="panel-media relative overflow-hidden rounded-[var(--radius-sm)] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
          style={{ "--ar": m.w / m.h, "--nw": `${m.w}px` } as CSSProperties}
        >
          {m.type === "video" ? (
            <video
              ref={vid}
              src={m.src}
              poster={m.poster}
              muted
              loop
              playsInline
              preload={eager ? "auto" : "none"}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={m.src}
              alt=""
              width={m.w}
              height={m.h}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
          {m.type === "video" && (
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              className="absolute bottom-3 end-3 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-sun hover:text-ink"
              aria-label={sound ? muteLabel : soundLabel}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                {sound ? (
                  <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                ) : (
                  <path d="m16 9 5 6M21 9l-5 6" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export type StoryScene = {
  media: SceneMedia;
  kicker?: string;
  title: string;
  text?: string;
};

/**
 * Scroll-told story — all photos and clips in one place.
 * The stage stays pinned while the visitor scrolls; every ~half screen of scrolling moves to the next scene.
 * Two fixed columns inside the stage (text | framed media), so text can never cover a photo.
 * Behind them, a soft blurred copy of the current media sets the mood.
 */
export function ScrollStory({
  scenes,
  opening,
  hint,
}: {
  scenes: StoryScene[];
  soundLabel: string;
  muteLabel: string;
  /** Replaces the text of the first scene: the project's title, intro and key facts */
  opening?: React.ReactNode;
  /** "Scroll to see the next one" — shown until the visitor moves, and again after a few idle seconds */
  hint: { desktop: string; touch: string };
}) {
  const root = useRef<HTMLElement>(null);
  const videos = useRef<Record<string, HTMLVideoElement | null>>({});
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const sound = false; // clips are silent highlights
  const [idle, setIdle] = useState(true);
  const n = scenes.length;
  const m = scenes[i].media;
  const layers = Array.from(
    new Map(scenes.map((s) => [s.media.src, s.media])).values(),
  );

  // Scroll position → current scene
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const run = el.offsetHeight - window.innerHeight;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      setI(Math.min(n - 1, Math.floor(p * n * 0.999)));
      setInView(
        r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4,
      );
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  // Gesture hint: visible at rest, hidden while scrolling, back after 3 s without moving
  useEffect(() => {
    let t = 0;
    const on = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), 3000);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.clearTimeout(t);
    };
  }, []);

  // The current clip plays (muted unless asked); others rest
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const next = scenes[i + 1]?.media.src;
    Object.entries(videos.current).forEach(([src, v]) => {
      if (!v) return;
      if (src === m.src || src === next) v.preload = "auto";
      if (src === m.src && inView && !reduce) {
        v.muted = !sound;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.muted = true;
      }
    });
  }, [i, m.src, inView, sound, scenes]);

  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + (run * (k + 0.5)) / n,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={root}
      className="relative bg-navy-deep text-white"
      style={{ height: `calc(100svh + ${(n - 1) * 60}svh)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Mood */}
        {layers.map((l) => (
          <img
            key={"bg" + l.src}
            src={l.type === "video" ? l.poster : l.src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-150 transition-opacity duration-1000"
            style={{ opacity: l.src === m.src ? 0.75 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-navy-deep/40" />

        {/* Two fixed columns: text | media */}
        <div className="wrap relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6 pb-10 pt-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:items-center md:gap-14 md:pb-0 md:pt-[72px]">
          {/* Media column */}
          <div
            className="relative min-h-0 md:order-2 md:h-[calc(100svh-180px)]"
            style={{ containerType: "size" } as CSSProperties}
          >
            {layers.map((l) => {
              const on = l.src === m.src;
              return (
                <div
                  key={l.src}
                  className="absolute inset-0 grid place-items-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "none" : "scale(0.97)",
                  }}
                >
                  <div
                    className="panel-media relative overflow-hidden rounded-[var(--radius-sm)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
                    style={
                      { "--ar": l.w / l.h, "--nw": `${l.w}px` } as CSSProperties
                    }
                  >
                    {l.type === "video" ? (
                      <video
                        ref={(el) => {
                          videos.current[l.src] = el;
                        }}
                        src={l.src}
                        poster={l.poster}
                        muted
                        loop
                        playsInline
                        preload={
                          l.src === scenes[0].media.src ? "auto" : "none"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={l.src}
                        alt=""
                        width={l.w}
                        height={l.h}
                        loading={
                          l.src === scenes[0].media.src ? "eager" : "lazy"
                        }
                        className="h-full w-full object-cover"
                      />
                    )}
                    {/* highlight clips are silent: no sound button */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text column */}
          <div className="relative md:order-1">
            <div key={i} className="caption-in" aria-live="polite">
              {i === 0 && opening ? (
                opening
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span className="font-display text-sun">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-10 bg-white/30" />
                    <span className="uppercase tracking-[0.16em] text-white/60 rtl:tracking-normal">
                      {scenes[i].kicker}
                    </span>
                  </div>
                  <h2 className="font-display mt-3 text-2xl font-bold leading-[1.15] md:mt-5 md:text-4xl lg:text-5xl">
                    {scenes[i].title}
                  </h2>
                  {scenes[i].text && (
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75 md:mt-5 md:text-lg">
                      {scenes[i].text}
                    </p>
                  )}
                </>
              )}
            </div>
            {/* Where am I */}
            <div className="mt-6 flex gap-1.5 md:mt-10">
              {scenes.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => go(k)}
                  className="group h-5 flex-1"
                  aria-label={`${k + 1} / ${n}`}
                >
                  <span
                    className={`block h-[3px] rounded-full transition-colors duration-500 ${k <= i ? "bg-sun" : "bg-white/25 group-hover:bg-white/45"}`}
                  />
                </button>
              ))}
            </div>
            {/* Gesture hint — sits under the text, never over a photo */}
            <div
              className={`mt-4 flex items-center gap-2.5 text-sm text-white/75 transition-all duration-500 md:mt-6 ${idle && i < n - 1 && inView ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
              aria-hidden
            >
              <span className="relative grid h-8 w-8 place-items-center">
                <svg
                  viewBox="0 0 36 36"
                  className="absolute inset-0 -rotate-90"
                  aria-hidden
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#fab62d"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="100.5"
                    className="hint-arc"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="hint-hand h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
                </svg>
              </span>
              <span className="hidden md:inline">{hint.desktop}</span>
              <span className="md:hidden">{hint.touch}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
