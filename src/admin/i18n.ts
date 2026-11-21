"use client";
import { DICT } from "./dict";

/**
 * Language of the admin itself (not of the site): Arabic, French or English.
 * Every admin text is written in Arabic in the code and looked up in DICT for the others.
 */
export type AdminLang = "ar" | "fr" | "en";
export const ADMIN_UI_LANGS: { k: AdminLang; short: string }[] = [
  { k: "ar", short: "عربي" },
  { k: "fr", short: "FR" },
  { k: "en", short: "EN" },
];
const KEY = "mx-admin-lang";

let current: AdminLang = "ar";
if (typeof window !== "undefined") {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "fr" || v === "en") current = v;
  } catch {}
  // only the admin itself takes the admin's language; the public site (edit mode) keeps its own
  if (location.pathname.startsWith("/admin")) {
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }
}

export const adminLang = () => current;
/** Locale for dates in the admin. */
export const adminLocale = () => ({ ar: "ar", fr: "fr-FR", en: "en-GB" })[current];

/** Switching reloads the admin, so every label (also those defined once at load) is in the new language. */
export function setAdminLang(l: AdminLang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  location.reload();
}

/** An admin text in the chosen language. `{0}`, `{1}`… are replaced by the extra values. */
export function tr(ar: string, ...args: (string | number)[]): string {
  const d = DICT[ar];
  let s = current === "ar" || !d ? ar : d[current === "fr" ? 0 : 1];
  args.forEach((a, i) => (s = s.replace(`{${i}}`, String(a))));
  return s;
}
