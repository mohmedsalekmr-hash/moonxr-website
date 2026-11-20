"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logos";
import type { Org } from "@/data/projects";

/** Sticky sub-navigation under the header: highlights the section being read. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-16 z-30 border-y border-line bg-white/90 backdrop-blur-xl md:top-[72px]">
      <div className="wrap no-scrollbar flex gap-1.5 overflow-x-auto py-2.5">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            aria-current={active === i.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === i.id ? "bg-navy text-white" : "text-ink/60 hover:bg-soft hover:text-ink"
            }`}
          >
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/**
 * Every logo of the ecosystem in white tiles. The tiles light up group by group
 * (clients, partners, then the technologies in two halves) while a line says who they are.
 * Hovering a tile lights it alone and names it; clicking jumps to its section.
 */
export function LogoWall({ items, phases }: { items: { org: Org; to: string; label: string }[]; phases: { label: string; names: string[] }[] }) {
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setStep((s) => (s + 1) % phases.length), 2600);
    return () => clearInterval(t);
  }, [phases.length]);
  const phase = phases[step];
  const h = hover === null ? null : items[hover];
  const lit = (name: string, i: number) => (h ? hover === i : phase.names.includes(name));
  const caption = h ? `${h.org.name} · ${h.label}` : phase.label;
  return (
    <div>
      <div className="mb-4 flex h-8 items-center gap-3" aria-live="polite">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-sun" />
        <span key={caption} className="text-sm font-semibold text-ink/70" style={{ animation: "fadein .45s both" }}>
          {caption}
        </span>
        <span className="ms-auto flex gap-1.5" aria-hidden>
          {phases.map((_, k) => (
            <span key={k} className={`h-1 rounded-full transition-all duration-500 ${k === step && !h ? "w-6 bg-navy" : "w-2 bg-ink/15"}`} />
          ))}
        </span>
      </div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3" dir="ltr" onMouseLeave={() => setHover(null)}>
        {items.map(({ org, to, label }, i) => {
          const on = lit(org.name, i);
          return (
            <li key={org.name + to}>
              <a
                href={`#${to}`}
                title={`${org.name} · ${label}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={`grid aspect-[4/3] place-items-center rounded-[var(--radius-sm)] border bg-white px-3 transition duration-500 ${
                  on ? "-translate-y-0.5 border-ink/15 shadow-[0_14px_30px_-20px_rgba(20,30,60,.45)]" : "border-line"
                }`}
                style={{ animation: `rise .6s ${0.1 + i * 0.04}s both` }}
              >
                <span className={`block transition duration-700 ${on ? "opacity-100 grayscale-0" : "opacity-40 grayscale"}`}>
                  <Logo org={org} area={2600} maxW={110} maxH={44} eager />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
