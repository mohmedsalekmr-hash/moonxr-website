import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, ui } from "@/data/i18n";
import { projects } from "@/data/projects";
import PageHead from "@/components/PageHead";
import ProjectFilter from "@/components/ProjectFilter";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/projets">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "أعمالنا" : "Projets" };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projets">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <Page>
      <PageHead
        kicker={ui.work.kicker[lang]}
        title={ui.work.title[lang]}
        sub={
          lang === "ar"
            ? "فعاليات، ومحاكيات تدريب، وتطبيق من تطويرنا — مشاريع نفّذناها في موريتانيا."
            : "Événements, simulateurs de formation et une application maison — des projets réalisés en Mauritanie."
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
