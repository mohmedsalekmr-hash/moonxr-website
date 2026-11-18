"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { rimg } from "@/lib/img";

/** Fades content in when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Portrait 9:16 clip: muted, looping, plays only while visible. Never upscaled beyond its 480px source. */
export function Reel({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="media-frame relative w-[min(41vw,300px)] shrink-0">
      <div className="relative aspect-[3/4]">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
        />
      </div>
    </figure>
  );
}

type GPhoto = { src: string; alt: string; w: number; h: number };

/** Photo grid with a keyboard-friendly lightbox. */
export function Gallery({ photos, closeLabel }: { photos: GPhoto[]; closeLabel: string }) {
  const portrait = photos.length > 0 && photos[0].h > photos[0].w;
  const grid =
    photos.length === 1
      ? "max-w-3xl"
      : portrait
        ? "grid-cols-2 lg:grid-cols-4"
        : photos.length === 3
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2";
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") setI((x) => (x === null ? x : (x + 1) % photos.length));
      if (e.key === "ArrowLeft") setI((x) => (x === null ? x : (x - 1 + photos.length) % photos.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [i, photos.length]);

  return (
    <>
      <div className={`grid gap-4 md:gap-5 ${grid}`}>
        {photos.map((p, k) => (
          <Reveal key={p.src + k} delay={k * 80}>
            <figure>
              <button
                type="button"
                onClick={() => setI(k)}
                className="media-frame group block w-full"
                aria-label={p.alt}
              >
                <img
                  {...rimg(p.src, "(min-width: 768px) 50vw, 100vw")}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  decoding="async"
                  className={`${portrait ? "aspect-[3/4]" : "aspect-[4/3]"} w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]`}
                />
              </button>
              
            </figure>
          </Reveal>
        ))}
      </div>
      {i !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur"
          onClick={() => setI(null)}
        >
          <figure className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[i].src}
              alt={photos[i].alt}
              className="max-h-[80vh] w-auto rounded-[var(--radius-sm)] object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-end gap-4 text-sm text-white/75">
              <span className="text-mute" dir="ltr">
                {i + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="←"
                onClick={(e) => {
                  e.stopPropagation();
                  setI((i - 1 + photos.length) % photos.length);
                }}
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="→"
                onClick={(e) => {
                  e.stopPropagation();
                  setI((i + 1) % photos.length);
                }}
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setI(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            {closeLabel} ✕
          </button>
        </div>
      )}
    </>
  );
}
