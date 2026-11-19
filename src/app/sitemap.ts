import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { href, locales, type PageKey } from "@/data/i18n";

const PAGES: (PageKey | undefined)[] = [undefined, "projets", "services", "partenaires", "a-propos", "contact"];

/** Every page in every language, with its two other versions, for search engines. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "localhost:3000";
  const base = `https://${host}`;
  const { projects } = await getContent();
  const entries: [PageKey | undefined, string | undefined][] = [...PAGES.map((p) => [p, undefined] as [PageKey | undefined, undefined]), ...projects.map((p) => ["projets", p.slug] as [PageKey, string])];
  return entries.flatMap(([page, rest]) =>
    locales.map((l) => ({
      url: base + href(l, page, rest),
      changeFrequency: "monthly" as const,
      priority: page ? 0.7 : 1,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, base + href(x, page, rest)])) },
    })),
  );
}
