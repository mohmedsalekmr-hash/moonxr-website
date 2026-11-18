"use client";
import { useShared } from "@/components/ContentProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Locale } from "@/data/i18n";

export default function Header({ lang }: { lang: Locale }) {
  const { ui } = useShared();
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // the home hero turns into a dark studio while the 3D headset is explored
  const [studio, setStudio] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setStudio(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("mx-studio", on);
    return () => window.removeEventListener("mx-studio", on);
  }, []);

  const other: Locale = lang === "fr" ? "ar" : "fr";
  const switchHref = pathname.replace(/^\/(fr|ar)(?=\/|$)/, `/${other}`);

  const links = [
    { href: `/${lang}/projets`, label: ui.nav.projects[lang] },
    { href: `/${lang}/partenaires`, label: ui.nav.partners[lang] },
    { href: `/${lang}/a-propos`, label: ui.nav.about[lang] },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Project pages are one dark experience: the bar is dark glass there
  const dark = (/\/projets\/[^/]+$/.test(pathname) || studio) && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        dark
          ? "hdr-dark border-b border-white/10 bg-[#0b1220]/70 backdrop-blur-xl"
          : scrolled || open
            ? "bg-white/85 backdrop-blur-xl border-b border-line"
            : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link href={`/${lang}`} className="shrink-0" aria-label="Moon XR">
          <img src={dark ? "/media/logos/moonxr-d.svg" : "/media/logos/moonxr-l.svg"} alt="Moon XR" width={1920} height={315} className="h-6 w-auto md:h-7" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors ${
                isActive(l.href) ? "text-ink bg-ink/5" : "text-ink/70 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchHref}
            hrefLang={other}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink/80 hover:border-ink/40 hover:text-ink"
            aria-label={other === "ar" ? "العربية" : "Français"}
          >
            {other === "ar" ? "عربي" : "FR"}
          </Link>
          <Link href={`/${lang}/contact`} className="btn btn-sun hidden !py-2.5 md:inline-flex">
            {ui.nav.contact[lang]}
          </Link>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/15 md:hidden"
            aria-label={open ? ui.nav.close[lang] : ui.nav.menu[lang]}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-0.5 w-4 bg-ink transition-transform ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-0.5 w-4 bg-ink transition-transform ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="wrap flex flex-col gap-1 pb-6 pt-2" aria-label="Menu">
          {[{ href: `/${lang}`, label: ui.nav.home[lang] }, ...links].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display rounded-xl px-3 py-3 text-2xl font-semibold text-ink/90 hover:bg-ink/5"
            >
              {l.label}
            </Link>
          ))}
          <Link href={`/${lang}/contact`} onClick={() => setOpen(false)} className="btn btn-sun mt-3 justify-center">
            {ui.nav.contact[lang]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
