"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type Locale, href as pageHref } from "@/data/i18n";

type Txt = { fr: string; ar: string; en: string };
type Props = {
  lang: Locale;
  /** the box's small texts, edited in the admin (site texts → contact box) */
  t: Record<"write" | "wa" | "waSub" | "mailSub" | "copy" | "copied" | "call" | "local" | "hello", Txt>;
  kicker: string;
  title: string;
  lead: string;
  ask: string;
  types: readonly string[];
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  city: string;
};


const I = {
  wa: "M3 21l1.65-4.8A8.5 8.5 0 1 1 7.9 19.5z M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2-1-1 .9c-1.2-.5-2.5-1.8-3-3l.9-1-1-2z",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  copy: "M9 9h11v11H9z M5 15H4V4h11v1",
  check: "M5 12l5 5 9-10",
  arrow: "M7 17L17 7 M8 7h9v9",
};

function Ico({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Live Nouakchott time — rendered after mount so server and browser never disagree. */
function Clock({ lang, label }: { lang: Locale; label: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(({ fr: "fr-FR", ar: "ar-MA", en: "en-GB" } as const)[lang], { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nouakchott", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [lang]);
  return (
    <span className="inline-flex items-center gap-2" suppressHydrationWarning>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun/70 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sun" />
      </span>
      <span dir="ltr" className="tabular-nums text-white">{now ?? "--:--"}</span>
      <span>{label}</span>
    </span>
  );
}

export default function CTAPanel(p: Props) {
  const { lang } = p;
  const T = p.t;
  const [pick, setPick] = useState(0);
  const [copied, setCopied] = useState(false);
  const need = p.types[pick] ?? "";
  const waText = encodeURIComponent(`${T.hello[lang]} ${need}`);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${p.email}`;
    }
  };

  const card =
    "group flex items-center gap-3 rounded-[var(--radius-sm)] border border-white/15 bg-white/[0.04] px-3.5 py-3.5 sm:gap-4 sm:px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sun/60 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun";
  const badge = "grid h-10 w-10 shrink-0 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/10 text-sun transition-colors group-hover:bg-sun group-hover:text-navy";

  return (
    <div className="relative grid grid-cols-[minmax(0,1fr)] gap-10 px-5 py-12 sm:px-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14 md:px-12 md:py-16 lg:px-16">
      {/* left: the question, and the visitor's need */}
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
          <span className="font-semibold uppercase tracking-[0.18em] text-sun">{p.kicker}</span>
          <Clock lang={lang} label={T.local[lang]} />
          <span>· {p.city}</span>
        </div>
        <h2 className="font-display text-[1.9rem] font-bold leading-[1.08] tracking-tight text-white md:text-[2.6rem]">{p.title}</h2>
        <p className="mt-3 max-w-md text-white/65">{p.lead}</p>

        <p className="mt-8 text-sm font-semibold text-white/85">{p.ask}</p>
        <div role="radiogroup" aria-label={p.ask} className="mt-3 flex flex-wrap gap-2">
          {p.types.map((t, i) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={pick === i}
              onClick={() => setPick(i)}
              className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun ${
                pick === i ? "border-sun bg-sun font-semibold text-navy" : "border-white/25 text-white/80 hover:border-white/60 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Link href={`${pageHref(lang, "contact")}?type=${pick}`} className="btn btn-sun mt-6 inline-flex items-center gap-2">
          <span>
            {T.write[lang]}{lang === "fr" ? " : " : ": "}<span className="font-bold">{need}</span>
          </span>
          <Ico d={I.arrow} className="h-4 w-4 rtl:-scale-x-100" />
        </Link>
      </div>

      {/* right: three direct ways to reach us */}
      <ul className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
        <li>
          <a href={`https://wa.me/${p.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className={card}>
            <span className={badge}>
              <Ico d={I.wa} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{T.wa[lang]}</span>
              <span className="block text-sm text-white/55">{T.waSub[lang]}</span>
            </span>
            <Ico d={I.arrow} className="h-4 w-4 text-white/40 transition-colors group-hover:text-sun rtl:-scale-x-100" />
          </a>
        </li>
        <li className="relative">
          <a href={`mailto:${p.email}`} className={`${card} pe-11 sm:pe-16`}>
            <span className={badge}>
              <Ico d={I.mail} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.86rem] font-semibold text-white sm:text-base rtl:text-right" dir="ltr">{p.email}</span>
              <span className="block text-sm text-white/55">{T.mailSub[lang]}</span>
            </span>
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={T.copy[lang]}
            title={T.copy[lang]}
            className="absolute end-2 top-1/2 grid h-9 w-9 sm:end-3 -translate-y-1/2 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-sun focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun"
          >
            <Ico d={copied ? I.check : I.copy} className="h-4 w-4" />
          </button>
          <span aria-live="polite" className={`pointer-events-none absolute -top-3 end-3 rounded-full bg-sun px-2.5 py-0.5 text-xs font-semibold text-navy transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}>
            {T.copied[lang]}
          </span>
        </li>
        <li>
          <a href={p.phoneHref} className={card}>
            <span className={badge}>
              <Ico d={I.phone} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white rtl:text-right" dir="ltr">{p.phone}</span>
              <span className="block text-sm text-white/55">{T.call[lang]}</span>
            </span>
            <Ico d={I.arrow} className="h-4 w-4 text-white/40 transition-colors group-hover:text-sun rtl:-scale-x-100" />
          </a>
        </li>
      </ul>
    </div>
  );
}
