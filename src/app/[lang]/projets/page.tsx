import { alternates } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";

import PageHead from "@/components/PageHead";
import ProjectFilter from "@/components/ProjectFilter";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/projets">): Promise<Metadata> {
  const { lang } = await params;
  return { title: ({ ar: "أعمالنا", fr: "Projets", en: "Projects" } as const)[lang as "fr"], alternates: alternates(lang as Locale, "projets") };
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
          ({
            ar: "فعاليات، ومحاكيات تدريب، وتطبيق من تطويرنا — مشاريع نفّذناها في موريتانيا.",
            fr: "Événements, simulateurs de formation et une application maison — des projets réalisés en Mauritanie.",
            en: "Events, training simulators and an in-house application — projects delivered in Mauritania.",
          } as const)[lang]
        }
      />
      <section className="pb-24">
        <div className="wrap">
          <ProjectFilter projects={projects} lang={lang} />
        </div>
      </section>
      <CTA lang={lang} />
    </Page>
  );
}
