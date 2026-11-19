import { href, locales, defaultLocale, type Locale, type PageKey } from "@/data/i18n";

/** The page's address in every language, so search engines link the three versions together. */
export function alternates(lang: Locale, page?: PageKey, rest?: string) {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, href(l, page, rest)]));
  languages["x-default"] = href(defaultLocale, page, rest);
  return { canonical: href(lang, page, rest), languages };
}
