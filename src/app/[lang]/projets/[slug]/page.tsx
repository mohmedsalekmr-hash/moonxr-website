import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { hasLocale, locales } from "@/data/i18n";
import { EndTakeover } from "@/components/ProjectEnd";

import { ScrollStory } from "@/components/Story";
import Page from "@/components/Page";

// new projects added in /admin are rendered on first visit
export const dynamicParams = true;

export async function generateStaticParams() {
  const { projects } = await getContent();
  return locales.flatMap((lang) =>
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
    openGraph: { images: [p.cover.src] },
  };
}

const L = {
  sound: { fr: "Activer le son", ar: "تشغيل الصوت" },
  mute: { fr: "Couper le son", ar: "كتم الصوت" },
  hintDesk: { fr: "Faites défiler pour la suite", ar: "انزل لمشاهدة البقية" },
  hintTouch: { fr: "Glissez vers le haut", ar: "اسحب للأعلى" },
};

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
  if (!hasLocale(lang)) notFound();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];

  return (
    <Page>
      {/* STORY — the whole project in one dark, pinned stage; scroll to move through it */}
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div>
          <ScrollStory
            scenes={p.scenes.map((sc) => ({ media: sc.media, kicker: sc.kicker?.[lang], title: sc.title[lang], text: sc.text?.[lang] }))}
            soundLabel={L.sound[lang]}
            muteLabel={L.mute[lang]}
            hint={{ desktop: L.hintDesk[lang], touch: L.hintTouch[lang] }}
            opening={
              <>
                <nav className="flex flex-wrap items-center gap-2 text-xs text-white/55" aria-label="Breadcrumb">
                  <Link href={`/${lang}/projets`} className="hover:text-white">{ui.nav.projects[lang]}</Link>
                  <span>/</span>
                  <span className="text-sun">{p.meta[lang]}</span>
                </nav>
                <h1 className="font-display mt-4 text-[1.75rem] font-bold leading-[1.08] md:mt-5 md:text-5xl">{p.title[lang]}</h1>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75 md:mt-5 md:text-lg">{p.intro[lang]}</p>
                <dl className="mt-5 hidden grid-cols-2 gap-x-6 gap-y-3 border-t border-white/15 pt-4 sm:grid md:mt-7">
                  {p.facts.slice(0, 4).map((f, k) => (
                    <div key={k}>
                      <dt className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/45 rtl:text-xs rtl:tracking-normal">{f.k[lang]}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-white/90">{f.v[lang]}</dd>
                    </div>
                  ))}
                </dl>
              </>
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
                  <div className="mt-3 text-sm text-ink/50">
                    {ph.label[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEXT PROJECT — takes over the screen */}
      <EndTakeover next={next} lang={lang} />
    </Page>
  );
}
