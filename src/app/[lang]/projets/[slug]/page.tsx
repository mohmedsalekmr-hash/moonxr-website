import { alternates } from "@/lib/seo";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { hasLocale, locales, href } from "@/data/i18n";
import { EndTakeover } from "@/components/ProjectEnd";

import ProjectStory from "@/components/ProjectStory";
import Page from "@/components/Page";

// new projects added in /admin are rendered on first visit
export const dynamicParams = true;

export async function generateStaticParams() {
  const { projects } = await getContent();
  // English project pages live at /en/projects/… (see ../../projects/[slug])
  return locales.filter((l) => l !== "en").flatMap((lang) =>
    projects.map((p) => ({ lang, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projets/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const { projects } = await getContent();
  const p = projects.find((x) => x.slug === slug);
  if (!p || !hasLocale(lang)) return {};
  return {
    title: p.title[lang],
    description: p.intro[lang],
    alternates: alternates(lang, "projets", slug),
    openGraph: { images: [p.cover.src] },
  };
}


/**
 * One template for every project, light like the rest of the site:
 * title + facts → opening media → one row per scene (media | text, alternating) → next project.
 * Every photo and clip sits in the same panel, so pages stay consistent whatever the source.
 */
export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/projets/[slug]">) {
  const { lang, slug } = await params;
  const { ui, projects } = await getContent();
  const L = ui.story;
  if (!hasLocale(lang)) notFound();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];

  return (
    <Page>
      {/* STORY — full-screen opening picture, then the scenes in big pictures; any picture opens the viewer */}
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div>
          <ProjectStory
            rtl={lang === "ar"}
            cover={p.cover.opening === "scene" && p.scenes[0] ? p.scenes[0].media : { type: "image", src: p.cover.src, w: p.cover.w, h: p.cover.h }}
            heroFocus={p.cover.opening === "scene" ? undefined : p.cover.pos}
            fit={p.cover.fit ?? "whole"}
            scenes={p.scenes.map((sc) => ({ media: sc.media, kicker: sc.kicker?.[lang], title: sc.title[lang], text: sc.text?.[lang] }))}
            title={p.title[lang]}
            intro={p.intro[lang]}
            facts={p.facts.slice(0, 4).map((f) => ({ k: f.k[lang], v: f.v[lang] }))}
            galleryKicker={ui.project.gallery[lang]}
            L={{ open: L.open[lang], prev: L.prev[lang], next: L.next[lang], close: L.close[lang], all: L.all[lang], swipe: L.swipe[lang], sound: L.sound[lang], mute: L.mute[lang] }}
            heroTop={
              <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/80" aria-label="Breadcrumb">
                <Link href={href(lang, "projets")} className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur transition hover:bg-white/25">
                  {ui.nav.projects[lang]}
                </Link>
                <span className="rounded-full bg-sun px-3 py-1.5 text-ink">{p.meta[lang]}</span>
              </nav>
            }
          />
        </div>
      </ViewTransition>

      {p.placeholders && (
        <section className="pb-20">
          <div className="wrap grid gap-5 sm:grid-cols-2">
            {p.placeholders.map((ph, i) => (
              <div
                key={i}
                className="media-frame grid aspect-[16/7] place-items-center border border-dashed border-ink/15 !bg-soft text-center"
              >
                <div>
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink/40">
                    {ph.kind === "video" ? "▶" : "◻"}
                  </div>
                  <div className="mt-3 text-sm text-ink/60">
                    {ph.label[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* talk about a similar project */}
      <CTA lang={lang} />

      {/* NEXT PROJECT */}
      <EndTakeover next={next} lang={lang} />
    </Page>
  );
}
