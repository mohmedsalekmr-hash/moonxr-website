import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { DEFAULT_SHARE_IMAGE, type SeoPage } from "@/data/seo";
import { href, locales, defaultLocale, type Locale, type PageKey } from "@/data/i18n";

/** The page's address in every language, so search engines link the three versions together. */
export function alternates(lang: Locale, page?: PageKey, rest?: string) {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, href(l, page, rest)]));
  languages["x-default"] = href(defaultLocale, page, rest);
  return { canonical: href(lang, page, rest), languages };
}


/** Title, Google description and share picture of a page, as set in the admin. */
export async function pageMeta(lang: Locale, page: PageKey): Promise<Metadata> {
  const { seo } = await getContent();
  const e = seo[page as SeoPage];
  const image = e.image || seo.home.image || DEFAULT_SHARE_IMAGE;
  return {
    title: e.title[lang],
    description: e.desc[lang],
    alternates: alternates(lang, page),
    openGraph: { title: `${e.title[lang]} · Moon XR`, description: e.desc[lang], images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [image] },
  };
}
