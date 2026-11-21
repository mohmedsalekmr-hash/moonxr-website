"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useShared } from "@/components/ContentProvider";
import { type Locale } from "@/data/i18n";
import { sendRequest } from "@/app/[lang]/contact/actions";

export type ContactBg = "moon" | "aurora";

/**
 * The contact page: one dark stage in the brand colours (no photo, so it speaks for every service).
 * Left: a big promise and the direct channels. Right: one clean card with the form.
 * Background: "moon" = a soft moon rising once from the horizon · "aurora" = brand colours drifting slowly.
 */
export default function ContactStage({ lang, bg }: { lang: Locale; bg: ContactBg }) {
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
    "mt-1.5 w-full rounded-xl border border-ink/10 bg-soft/60 px-4 py-3 text-[0.95rem] text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,60,128,0.1)]";
  const label = "block text-sm font-medium text-ink/65";

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-deep text-white">
      {/* background */}
      {bg === "moon" ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,#142454,transparent_70%)]" />
          <div className="moon-rise absolute left-1/2 top-full aspect-square w-[160vw] rounded-full md:w-[78vw] md:max-w-[1100px]">
            {/* a soft halo, the lit surface, a thin golden rim */}
            <div className="absolute -inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(111,138,214,0.35),transparent)]" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(120%_80%_at_50%_0%,rgba(201,213,245,0.55)_0%,rgba(111,138,214,0.35)_18%,rgba(37,60,128,0.35)_42%,rgba(20,36,84,0)_70%)]" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_0_0_rgba(250,182,45,0.8),0_-20px_90px_-10px_rgba(250,182,45,0.35)]" />
          </div>
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="aurora aurora-a absolute -left-[10%] -top-[25%] h-[85vh] w-[85vh] rounded-full bg-[#2f55c9] opacity-90 blur-[110px]" />
          <div className="aurora aurora-b absolute -right-[15%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-[#6f8ad6] opacity-70 blur-[120px]" />
          <div className="aurora aurora-c absolute bottom-[-30%] left-[35%] h-[55vh] w-[55vh] rounded-full bg-sun opacity-55 blur-[120px]" />
          <div className="absolute inset-0 bg-navy-deep/20" />
        </div>
      )}

      <div className="wrap grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:pb-20 lg:pt-32">
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
        <div className="cs-in cs-in-2 rounded-[1.75rem] bg-white p-6 text-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.6)] md:p-8">
          {state === "done" ? (
            <div className="grid min-h-[440px] place-items-center content-center text-center" role="status">
              <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
                <circle cx="32" cy="32" r="30" className="flow-ring" />
                <path d="M19 33l9 9 17-19" className="flow-tick" />
              </svg>
              <p className="font-display mt-5 text-2xl font-bold" style={{ animation: "rise .6s .4s both" }}>
                {ui.flow.done[lang].replace("{name}", name)}
              </p>
              <p className="mt-2 max-w-xs text-ink/60" style={{ animation: "rise .6s .55s both" }}>
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
                        type === t ? "border-brand bg-brand text-white" : "border-ink/12 text-ink/75 hover:border-brand/50 hover:text-brand"
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
                  {c.phone[lang]} <span className="font-normal text-ink/40">({ui.flow.optional[lang]})</span>
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
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
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
