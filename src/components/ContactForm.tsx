"use client";
import { useShared } from "@/components/ContentProvider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { type Locale } from "@/data/i18n";
import { sendRequest } from "@/app/[lang]/contact/actions";

const T = {
  sending: { fr: "Envoi…", ar: "جارٍ الإرسال…" },
  done: { fr: "Merci, votre demande est bien reçue.", ar: "شكراً، وصلنا طلبكم." },
  doneSub: { fr: "Nous vous répondons sous 48 h.", ar: "سنرد عليكم خلال 48 ساعة." },
  again: { fr: "Envoyer une autre demande", ar: "إرسال طلب آخر" },
  invalid: { fr: "Vérifiez le nom, l'e-mail et le message.", ar: "تأكدوا من الاسم والبريد والرسالة." },
  flood: { fr: "Trop d'envois en peu de temps. Réessayez plus tard ou écrivez-nous directement.", ar: "طلبات كثيرة في وقت قصير. حاولوا لاحقاً أو راسلونا مباشرة." },
  server: { fr: "L'envoi n'a pas abouti. Écrivez-nous directement :", ar: "لم يكتمل الإرسال. راسلونا مباشرة:" },
};

/** Contact form: the request is saved in the Moon XR back office (tab «الطلبات»). */
export default function ContactForm({ lang, bare = false }: { lang: Locale; bare?: boolean }) {
  const { ui, contact: CONTACT } = useShared();
  const c = ui.contact;
  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "flood" | "server">("idle");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, [state]);
  // the need picked in the blue contact card arrives as ?type=<index>
  const typeRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const i = Number(new URLSearchParams(window.location.search).get("type"));
    const opts = c.types[lang];
    if (typeRef.current && Number.isInteger(i) && i >= 0 && i < opts.length) typeRef.current.value = opts[i];
  }, [c.types, lang]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    f.set("t", String(started.current));
    f.set("lang", lang);
    setState("sending");
    const r = await sendRequest(f).catch(() => ({ ok: false as const, reason: "server" as const }));
    setState(r.ok ? "done" : r.reason);
  };

  if (state === "done") {
    return (
      <div className={`${bare ? "" : "card"} grid min-h-[420px] place-items-center content-center gap-3 p-10 text-center`} role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-2xl text-brand">✓</span>
        <p className="font-display text-xl font-bold">{T.done[lang]}</p>
        <p className="text-ink/60">{T.doneSub[lang]}</p>
        <button type="button" className="btn btn-ghost mt-2" onClick={() => setState("idle")}>
          {T.again[lang]}
        </button>
      </div>
    );
  }

  const field = "mt-2 w-full rounded-[var(--radius-sm)] border border-ink/12 bg-white px-4 py-3 text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-brand";
  const err = state === "invalid" || state === "flood" || state === "server";

  return (
    <form onSubmit={onSubmit} className={`${bare ? "px-6 pb-7 pt-5 md:px-10 md:pb-10 md:pt-6" : "card p-6 md:p-10"} relative grid gap-5 md:grid-cols-2`}>
      <label className="text-sm text-ink/75">
        {c.name[lang]} *
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-ink/75">
        {c.org[lang]}
        <input name="org" maxLength={160} autoComplete="organization" className={field} />
      </label>
      <label className="text-sm text-ink/75">
        {c.email[lang]} *
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} dir="ltr" />
      </label>
      <label className="text-sm text-ink/75">
        {c.phone[lang]}
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} dir="ltr" />
      </label>
      <label className="text-sm text-ink/75 md:col-span-2">
        {c.type[lang]}
        <select ref={typeRef} name="type" className={field} defaultValue={c.types[lang][0]}>
          {c.types[lang].map((o) => (
            <option key={o} value={o} className="bg-white">
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-ink/75 md:col-span-2">
        {c.msg[lang]} *
        <textarea name="message" required minLength={5} maxLength={5000} rows={5} className={field} />
      </label>
      {/* honeypot: invisible to people, robots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {err && (
        <p className="rounded-[var(--radius-sm)] bg-[#fdecea] px-4 py-3 text-sm text-[#b42318] md:col-span-2" role="alert">
          {T[state][lang]}{" "}
          {state !== "invalid" && (
            <a className="font-semibold underline" href={`mailto:${CONTACT.email}`} dir="ltr">
              {CONTACT.email}
            </a>
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button type="submit" className="btn btn-sun" disabled={state === "sending"}>
          {state === "sending" ? T.sending[lang] : c.send[lang]}
        </button>
        <span className="text-xs text-mute">{c.note[lang]}</span>
      </div>
    </form>
  );
}
