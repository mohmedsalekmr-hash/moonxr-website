"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShared } from "@/components/ContentProvider";
import { type Locale, isRtl, href as pageHref } from "@/data/i18n";
import { sendRequest } from "@/app/[lang]/contact/actions";

type Data = {
  type: string;
  message: string;
  name: string;
  email: string;
  phone: string;
};
const EMPTY: Data = { type: "", message: "", name: "", email: "", phone: "" };

/**
 * «Contact us» opens over the page the visitor is on (the page stays visible, softly blurred behind):
 * a clean three-step form — need, details, contact — with a light stepper, a review to edit, and a thank-you.
 * Every link to the contact page opens it; the contact page itself shows it over the home page.
 */
export default function ContactModal({ lang }: { lang: Locale }) {
  const { ui, contact: CONTACT } = useShared();
  const F = ui.flow;
  const c = ui.contact;
  const types = c.types[lang];
  const rtl = isRtl(lang);
  const router = useRouter();
  const path = usePathname();
  const contactPath = pageHref(lang, "contact");

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 need · 1 details · 2 you · 3 review · 4 done
  const [d, setD] = useState<Data>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<
    "idle" | "sending" | "invalid" | "flood" | "server"
  >("idle");
  const started = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((type?: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    started.current = Date.now();
    if (type) {
      setD((x) => ({ ...x, type }));
      setStep(1);
    }
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // after a sent request, the next opening starts afresh
    if (step === 4) {
      setStep(0);
      setD(EMPTY);
    }
    if (path === contactPath) router.replace(pageHref(lang), { scroll: false });
    setTimeout(() => lastFocus.current?.focus?.(), 50);
  }, [step, path, contactPath, router, lang]);

  // the contact address itself (shared link, bookmark): the home page with the window open
  useEffect(() => {
    if (path === contactPath) show();
  }, [path, contactPath, show]);

  // every link to the contact page opens the window instead (ctrl/cmd-click still opens the page)
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank") return;
      let u: URL;
      try {
        u = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (u.origin !== location.origin || u.pathname !== contactPath) return;
      e.preventDefault();
      const i = Number(u.searchParams.get("type"));
      show(u.searchParams.has("type") && types[i] ? types[i] : undefined);
    };
    document.addEventListener("click", on, true);
    return () => document.removeEventListener("click", on, true);
  }, [contactPath, show, types]);

  // while open: the page underneath does not scroll; Escape closes
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    setTimeout(
      () =>
        (
          panel.current?.querySelector<HTMLElement>("[data-autofocus]") ??
          panel.current?.querySelector<HTMLElement>("button")
        )?.focus(),
      80,
    );
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    setTimeout(
      () =>
        panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
      60,
    );
  }, [step, open]);

  if (!open) return null;

  const okMsg = d.message.trim().length >= 5;
  const okName = d.name.trim().length >= 2;
  const okMail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim());
  const next = () => {
    if ((step === 1 && !okMsg) || (step === 2 && (!okName || !okMail)))
      return setTouched(true);
    setTouched(false);
    setStep((s) => s + 1);
  };
  const send = async () => {
    const f = new FormData();
    Object.entries(d).forEach(([k, v]) => f.set(k, v));
    f.set("t", String(started.current));
    f.set("lang", lang);
    setState("sending");
    const r = await sendRequest(f).catch(() => ({
      ok: false as const,
      reason: "server" as const,
    }));
    if (r.ok) {
      setState("idle");
      setStep(4);
    } else setState(r.reason);
  };

  const steps = [F.need[lang], F.project[lang], F.you[lang]];
  const field =
    "mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,60,128,0.1)] focus-visible:outline-none";
  const label = "block text-sm font-medium text-ink/70";
  const first = d.name.trim().split(/\s+/)[0] ?? "";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6"
      dir={rtl ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mx-contact-title"
    >
      <div
        className="cm-veil absolute inset-0 bg-navy-deep/30 backdrop-blur-[3px]"
        onClick={close}
      />
      <div
        ref={panel}
        className="cm-panel relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_40px_100px_-30px_rgba(10,20,49,0.55)] md:max-h-[88vh] md:max-w-xl md:rounded-3xl"
      >
        {/* head */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-7">
          <div>
            <h2
              id="mx-contact-title"
              className="font-display text-xl font-bold md:text-2xl"
            >
              {step === 4
                ? F.done[lang].replace("{name}", first)
                : c.title[lang]}
            </h2>
            {step < 4 && (
              <p className="mt-1 text-sm text-ink/55">{c.sub[lang]}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={ui.story.close[lang]}
            className="-me-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/50 transition hover:bg-ink/5 hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* stepper: done ✓ · current · to come */}
        {step < 4 && (
          <ol
            className="mx-6 mt-6 flex items-center md:mx-8"
            aria-label={F.check[lang]}
          >
            {steps.map((s, i) => {
              const done = i < step;
              const cur = i === step;
              return (
                <li
                  key={s}
                  className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
                  aria-current={cur ? "step" : undefined}
                >
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => setStep(i)}
                    className="flex items-center gap-2 disabled:cursor-default"
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold transition-colors duration-300 ${
                        done
                          ? "bg-brand text-white"
                          : cur
                            ? "bg-brand text-white ring-4 ring-brand/15"
                            : "bg-ink/[0.06] text-ink/40"
                      }`}
                    >
                      {done ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={`whitespace-nowrap text-sm font-semibold ${cur ? "text-ink" : done ? "text-ink/70" : "text-ink/35"}`}
                    >
                      {s}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <span className="mx-3 h-[2px] flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
                      <span
                        className="block h-full rounded-full bg-brand transition-[width] duration-500"
                        style={{ width: step > i ? "100%" : "0%" }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {/* body */}
        <div
          key={step}
          className="cm-step min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-6 md:px-8 md:pb-8"
        >
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {types.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  data-autofocus={i === 0 ? "" : undefined}
                  onClick={() => {
                    setD((x) => ({ ...x, type: t }));
                    setStep(d.message || d.name ? 3 : 1);
                  }}
                  className={`rounded-xl border px-4 py-4 text-start text-[0.95rem] font-semibold transition ${
                    d.type === t
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-ink/10 hover:border-brand/50 hover:bg-brand-soft/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <label className={label}>
              {F.q2[lang].replace(/\.$/, "")}
              <textarea
                data-autofocus
                rows={5}
                maxLength={5000}
                value={d.message}
                onChange={(e) =>
                  setD((x) => ({ ...x, message: e.target.value }))
                }
                placeholder={F.ph2[lang]}
                className={`${field} resize-none`}
              />
              {touched && !okMsg && (
                <span className="mt-1.5 block text-sm text-red-600">
                  {F.needMsg[lang]}
                </span>
              )}
            </label>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <label className={label}>
                {c.name[lang]}
                <input
                  data-autofocus
                  autoComplete="name"
                  maxLength={120}
                  value={d.name}
                  onChange={(e) =>
                    setD((x) => ({ ...x, name: e.target.value }))
                  }
                  className={field}
                />
                {touched && !okName && (
                  <span className="mt-1.5 block text-sm text-red-600">
                    {F.needName[lang]}
                  </span>
                )}
              </label>
              <label className={label}>
                {c.email[lang]}
                <input
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  maxLength={200}
                  value={d.email}
                  onChange={(e) =>
                    setD((x) => ({ ...x, email: e.target.value }))
                  }
                  className={`${field} ${rtl ? "text-right" : ""}`}
                />
                {touched && !okMail && (
                  <span className="mt-1.5 block text-sm text-red-600">
                    {F.needMail[lang]}
                  </span>
                )}
              </label>
              <label className={label}>
                <span>
                  {c.phone[lang]}{" "}
                  <span className="font-normal text-ink/40">
                    ({F.optional[lang]})
                  </span>
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  maxLength={40}
                  value={d.phone}
                  onChange={(e) =>
                    setD((x) => ({ ...x, phone: e.target.value }))
                  }
                  className={`${field} ${rtl ? "text-right" : ""}`}
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm text-ink/55">{F.q4sub[lang]}</p>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {(
                  [
                    [0, F.need[lang], d.type],
                    [1, F.project[lang], d.message],
                    [
                      2,
                      F.you[lang],
                      [d.name, d.email, d.phone].filter(Boolean).join(" · "),
                    ],
                  ] as const
                ).map(([s, k, v]) => (
                  <div key={s} className="flex items-start gap-4 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs font-semibold text-ink/45">{k}</dt>
                      <dd className="mt-0.5 whitespace-pre-line break-words text-[0.95rem] text-ink">
                        {v}
                      </dd>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(s)}
                      className="shrink-0 text-sm font-semibold text-brand hover:underline"
                    >
                      {F.edit[lang]}
                    </button>
                  </div>
                ))}
              </dl>
              {state !== "idle" && state !== "sending" && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {state === "invalid"
                    ? ui.form.invalid[lang]
                    : state === "flood"
                      ? ui.form.flood[lang]
                      : ui.form.server[lang]}{" "}
                  {state === "server" && (
                    <a
                      className="font-semibold underline"
                      href={`mailto:${CONTACT.email}`}
                    >
                      {CONTACT.email}
                    </a>
                  )}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <svg
                viewBox="0 0 64 64"
                className="mx-auto h-16 w-16"
                aria-hidden
              >
                <circle cx="32" cy="32" r="30" className="flow-ring" />
                <path d="M19 33l9 9 17-19" className="flow-tick" />
              </svg>
              <p
                className="mx-auto mt-5 max-w-sm text-ink/65"
                style={{ animation: "rise .6s .5s both" }}
              >
                {F.doneSub[lang]}
              </p>
            </div>
          )}
        </div>

        {/* footer actions (the first step moves on by itself) */}
        {step > 0 && (
          <div className="flex items-center gap-3 border-t border-line px-6 py-4 md:px-8">
            {step === 4 ? (
              <button
                type="button"
                onClick={close}
                className="btn btn-sun ms-auto"
              >
                {ui.story.close[lang]}
              </button>
            ) : (
              <>
                {
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="text-sm font-semibold text-ink/55 transition hover:text-ink"
                  >
                    {F.back[lang]}
                  </button>
                }
                {step === 3 ? (
                  <button
                    type="button"
                    onClick={send}
                    disabled={state === "sending"}
                    className="btn btn-sun ms-auto disabled:opacity-60"
                  >
                    {state === "sending" ? ui.form.sending[lang] : c.send[lang]}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={next}
                    className="btn btn-sun ms-auto"
                  >
                    {F.next[lang]} <span className="rtl:rotate-180">→</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
