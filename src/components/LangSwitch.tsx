"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LANG, locales, switchPath, type Locale } from "@/data/i18n";

/** Language menu: the current language, and the page in the others. */
export default function LangSwitch({ lang, onPick }: { lang: Locale; onPick?: () => void }) {
  const path = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={LANG[lang].name}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink/75 transition-colors hover:border-ink/40 hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3z" />
        </svg>
        <span dir="auto">{LANG[lang].short}</span>
        <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute end-0 top-full z-50 mt-2 w-44 origin-top overflow-hidden rounded-[var(--radius-sm)] border border-line bg-white p-1.5 shadow-[0_24px_48px_-24px_rgba(10,20,49,0.45)] transition-all duration-150 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {locales.map((l) => (
          <Link
            key={l}
            role="menuitem"
            href={switchPath(path, l)}
            hrefLang={l}
            lang={l}
            dir={LANG[l].dir}
            aria-current={l === lang ? "true" : undefined}
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onPick?.();
            }}
            className={`flex items-center justify-between rounded-[0.7rem] px-3 py-2.5 text-[0.95rem] transition-colors ${
              l === lang ? "bg-brand-soft font-semibold text-brand" : "text-ink/80 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {LANG[l].name}
            {l === lang && (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M5 12l5 5 9-10" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
