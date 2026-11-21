import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";

import PageHead from "@/components/PageHead";
import ProjectStack from "@/components/ProjectStack";
import { projectTag } from "@/data/projects";
import { href as pageHref } from "@/data/i18n";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/projets">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "projets");
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projets">) {
  const { lang } = await params;
  const { ui, projects } = await getContent();
  if (!hasLocale(lang)) notFound();
  return (
    <Page>
      <PageHead
        kicker={ui.work.kicker[lang]}
        title={ui.work.title[lang]}
        sub={
ui.work.sub[lang]
        }
      />
      {/* every project as a card; scrolling, the next one slides over the previous */}
      <ProjectStack
        items={projects.map((p) => ({
          slug: p.slug,
          href: `${pageHref(lang, "projets")}/${p.slug}`,
          image: p.cover.src,
          pos: p.cover.pos,
          tag: projectTag[p.category][lang],
          title: p.title[lang],
          short: p.short[lang],
          meta: p.meta[lang],
        }))}
        view={ui.work.view[lang]}
      />
      <CTA lang={lang} />
    </Page>
  );
}
