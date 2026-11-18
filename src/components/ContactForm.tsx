"use client";

import { useState, type FormEvent } from "react";
import { CONTACT, ui, type Locale } from "@/data/i18n";

/**
 * Until the back end exists, the form opens the visitor's e-mail app
 * with a pre-filled message to the Moon XR address.
 */
export default function ContactForm({ lang }: { lang: Locale }) {
  const c = ui.contact;
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) || "").trim();
    const subject = `[Moon XR] ${get("type")} — ${get("name")}${get("org") ? " · " + get("org") : ""}`;
    const body = [
      `${c.name[lang]}: ${get("name")}`,
      `${c.org[lang]}: ${get("org")}`,
      `${c.email[lang]}: ${get("email")}`,
      `${c.phone[lang]}: ${get("phone")}`,
      `${c.type[lang]}: ${get("type")}`,
      "",
      get("message"),
    ].join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = "mt-2 w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-sun";

  return (
    <form onSubmit={onSubmit} className="card grid gap-5 p-6 md:grid-cols-2 md:p-8">
      <label className="text-sm text-ink/80">
        {c.name[lang]} *
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-ink/80">
        {c.org[lang]}
        <input name="org" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm text-ink/80">
        {c.email[lang]} *
        <input name="email" type="email" required autoComplete="email" className={field} dir="ltr" />
      </label>
      <label className="text-sm text-ink/80">
        {c.phone[lang]}
        <input name="phone" type="tel" autoComplete="tel" className={field} dir="ltr" />
      </label>
      <label className="text-sm text-ink/80 md:col-span-2">
        {c.type[lang]}
        <select name="type" className={field} defaultValue={c.types[lang][0]}>
          {c.types[lang].map((o) => (
            <option key={o} value={o} className="bg-white">
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-ink/80 md:col-span-2">
        {c.msg[lang]} *
        <textarea name="message" required rows={5} className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button type="submit" className="btn btn-sun">
          {c.send[lang]}
        </button>
        <span className="text-xs text-mute">{sent ? "✓ " : ""}{c.note[lang]}</span>
      </div>
    </form>
  );
}
