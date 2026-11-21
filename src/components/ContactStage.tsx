"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useShared } from "@/components/ContentProvider";
import { type Locale } from "@/data/i18n";
import { sendRequest } from "@/app/[lang]/contact/actions";

/**
 * The contact page: one dark stage in the brand colours (no photo, so it speaks for every service).
 * Left: a big promise and the direct channels. Right: the form, built into the page (no card).
 * Background: the real Moon rising once from the horizon.
 */
export default function ContactStage({ lang }: { lang: Locale }) {
  const { ui, contact: CONTACT } = useShared();
  const P = ui.contactPage;
  const c = ui.contact;
  const B = ui.ctaBox;
  const types = c.types[lang];

  // the header turns to dark glass over this stage
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mx-studio", { detail: true }));
    return () => {
      window.dispatchEvent(new CustomEvent("mx-studio", { detail: false }));
    };
  }, []);

  // Nouakchott local time (UTC, no daylight saving)
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(new Intl.DateTimeFormat(lang === "ar" ? "ar-u-nu-latn" : lang, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nouakchott" }).format(new Date()));
    fmt();
    const t = setInterval(fmt, 30_000);
    return () => clearInterval(t);
  }, [lang]);

  const [type, setType] = useState("");
  useEffect(() => {
    // a need chosen elsewhere on the site arrives as ?type=<index>
    const q = new URLSearchParams(location.search).get("type");
    const i = Number(q);
    if (q !== null && Number.isInteger(i) && types[i]) setType(types[i]);
  }, [types]);

  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "flood" | "server">("idle");
  const [name, setName] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${CONTACT.email}`;
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    f.set("type", type);
    f.set("t", String(started.current));
    f.set("lang", lang);
    setName(String(f.get("name") || "").trim().split(/\s+/)[0]);
    setState("sending");
    const r = await sendRequest(f).catch(() => ({ ok: false as const, reason: "server" as const }));
    if (r.ok) {
      setState("done");
    } else setState(r.reason);
  };

  const wa = `https://wa.me/${(CONTACT.whatsapp || CONTACT.phone).replace(/\D/g, "")}`;
  const field =
    "cs-field mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white outline-none backdrop-blur-sm transition placeholder:text-white/30 hover:border-white/25 focus:border-[#8fa6e6] focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(111,138,214,0.25)] focus-visible:outline-none";
  const label = "block text-sm font-medium text-white/70";

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-deep text-white">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,#142454,transparent_70%)]" />
          <div className="moon-rise absolute left-1/2 top-full aspect-square w-[130vw] md:w-[72vw] md:max-w-[1150px]">
            {/* the real Moon (NASA SVS render from LRO data), dimmed into the night, with a soft glow and no hard edge */}
            <div className="absolute -inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(190,205,245,0.22),rgba(111,138,214,0.08)_60%,transparent)]" />
            <img src="/media/moon.webp" alt="" width={1800} height={1800} className="absolute inset-0 h-full w-full select-none opacity-90 [filter:brightness(0.82)_contrast(1.05)]" draggable={false} />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(130%_100%_at_50%_0%,transparent_38%,rgba(10,20,49,0.45)_58%,#0a1431_78%)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-deep to-transparent" />
      </div>

      <div className="wrap grid min-h-[100svh] items-center gap-10 pb-48 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:pb-20 lg:pt-32">
        {/* the promise and the direct channels */}
        <div className="cs-in">
          <div className="kicker !text-sun">{ui.nav.contact[lang]}</div>
          <h1 className="font-display mt-5 max-w-xl text-[2.4rem] font-bold leading-[1.05] md:text-[4rem]">{P.hero[lang]}</h1>
          <p className="mt-5 max-w-md text-lg text-white/70">{P.heroSub[lang]}</p>

          <div className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-white/45 rtl:tracking-normal">{P.direct[lang]}</div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button type="button" onClick={copy} className="cs-chip" title={B.copy[lang]}>
              <span dir="ltr">{copied ? B.copied[lang] : CONTACT.email}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {copied ? <path d="M5 12l5 5 9-10" /> : <path d="M9 9h10v10H9z M5 15V5h10" />}
              </svg>
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="cs-chip">
              {B.wa[lang]}
            </a>
            <a href={CONTACT.phoneHref} className="cs-chip">
              <span dir="ltr">{CONTACT.phone}</span>
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {P.city[lang]} · <span dir="ltr">{time}</span> {B.local[lang]}
          </p>
        </div>

        {/* the form */}
        <div className="cs-in cs-in-2">
          {state === "done" ? (
            <div className="grid min-h-[440px] place-items-center content-center text-center" role="status" aria-live="polite">
              <svg viewBox="0 0 64 64" className="cs-done h-16 w-16" aria-hidden>
                <circle cx="32" cy="32" r="30" className="flow-ring" />
                <path d="M19 33l9 9 17-19" className="flow-tick" />
              </svg>
              <p className="font-display mt-5 text-2xl font-bold" style={{ animation: "rise .6s .4s both" }}>
                {ui.flow.done[lang].replace("{name}", name)}
              </p>
              <p className="mt-2 max-w-xs text-white/65" style={{ animation: "rise .6s .55s both" }}>
                {ui.flow.doneSub[lang]}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5">
              <fieldset>
                <legend className={label}>{P.need[lang]}</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={type === t}
                      onClick={() => setType(type === t ? "" : t)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        type === t ? "border-sun bg-sun text-ink" : "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/35 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={label}>
                  {c.name[lang]}
                  <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} />
                </label>
                <label className={label}>
                  {c.email[lang]}
                  <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" className={`${field} rtl:text-right`} />
                </label>
              </div>
              <label className={label}>
                <span>
                  {c.phone[lang]} <span className="font-normal text-white/40">({ui.flow.optional[lang]})</span>
                </span>
                <input name="phone" type="tel" maxLength={40} autoComplete="tel" dir="ltr" className={`${field} rtl:text-right`} />
              </label>
              <label className={label}>
                {c.msg[lang]}
                <textarea name="message" required minLength={5} maxLength={5000} rows={4} placeholder={ui.flow.ph2[lang]} className={`${field} resize-none`} />
              </label>
              {/* robots fill this, people never see it */}
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              {(state === "invalid" || state === "flood" || state === "server") && (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {state === "invalid" ? ui.form.invalid[lang] : state === "flood" ? ui.form.flood[lang] : ui.form.server[lang]}
                </p>
              )}
              <button type="submit" disabled={state === "sending"} className="btn btn-sun w-full justify-center py-3.5 text-base disabled:opacity-70">
                {state === "sending" ? ui.form.sending[lang] : c.send[lang]}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
