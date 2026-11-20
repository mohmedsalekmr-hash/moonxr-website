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

/** Technologies as a clear grid, filterable by field. */
export function TechGrid({ orgs, cats, all }: { orgs: (Org & { roleText?: string; catText?: string })[]; cats: { id: string; label: string }[]; all: string }) {
  const [cat, setCat] = useState("all");
  const present = cats.filter((c) => orgs.some((o) => o.category === c.id));
  const shown = cat === "all" ? orgs : orgs.filter((o) => o.category === cat);
  return (
    <div>
      {present.length > 1 && (
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {[{ id: "all", label: all }, ...present].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                cat === c.id ? "border-navy bg-navy text-white" : "border-ink/12 bg-white text-ink/65 hover:border-ink/35 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
        {shown.map((o) => (
          <li
            key={o.name}
            style={{ animation: "rise .5s both" }}
            className="group flex flex-col rounded-[var(--radius-sm)] border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(20,30,60,.35)] md:p-6"
          >
            <div className="grid h-20 place-items-center md:h-24">
              <span className="md:hidden">
                <Logo org={o} area={3200} maxW={120} maxH={46} />
              </span>
              <span className="hidden md:block">
                <Logo org={o} area={5200} maxW={170} maxH={60} />
              </span>
            </div>
            <div className="mt-3 border-t border-line pt-3 md:mt-4 md:pt-4">
              <div className="font-display text-[0.95rem] font-semibold leading-tight md:text-base">{o.name}</div>
              {o.roleText && <div className="mt-1 text-[0.8rem] leading-snug text-ink/60 md:text-sm">{o.roleText}</div>}
              {o.catText && <div className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand rtl:text-xs rtl:tracking-normal">{o.catText}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
