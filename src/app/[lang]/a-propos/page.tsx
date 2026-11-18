import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, ui, services, pillars } from "@/data/i18n";
import PageHead from "@/components/PageHead";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "من نحن" : "À propos" };
}

const copy = {
  title: {
    fr: "La division technologie immersive de Moon Technology.",
    ar: "قسم التقنيات التفاعلية في Moon Technology.",
  },
  sub: {
    fr: "Moon XR apporte la réalité virtuelle et augmentée aux entreprises, aux écoles et aux événements en Mauritanie. Nous choisissons la bonne technologie, nous l'installons et nous restons à vos côtés.",
    ar: "يقدّم Moon XR الواقع الافتراضي والمعزّز للشركات والمدارس والفعاليات في موريتانيا. نختار التقنية المناسبة، ونركّبها، ونبقى إلى جانبكم.",
  },
  sectors: { fr: "Secteurs", ar: "القطاعات" },
  sectorList: {
    fr: ["Télécoms & marques", "Industrie & sécurité", "Formation professionnelle", "Éducation"],
    ar: ["الاتصالات والعلامات التجارية", "الصناعة والسلامة", "التكوين المهني", "التعليم"],
  },
  where: { fr: "Basés à Nouakchott, présents dans tout le pays", ar: "مقرّنا نواكشوط، ونعمل في كل البلاد" },
  whereText: {
    fr: "Notre équipe se déplace pour installer, former et accompagner sur site, partout en Mauritanie.",
    ar: "ينتقل فريقنا للتركيب والتدريب والمرافقة في الموقع، في كل أنحاء موريتانيا.",
  },
};

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <Page>
      <PageHead kicker={ui.nav.about[lang]} title={copy.title[lang]} sub={copy.sub[lang]} />

      <section className="pb-20">
        <div className="wrap">
          <img src="/media/photos/moov-wide.webp" alt="" width={1080} height={608} className="aspect-[16/8] w-full rounded-3xl border border-line object-cover" />
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{ui.services.kicker[lang]}</div>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold md:text-4xl">{ui.services.title[lang]}</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 90}>
                <div className="card flex h-full gap-5 p-7">
                  <div className="font-display text-sm font-semibold text-sky">{s.n}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{s.title[lang]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text[lang]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <Reveal>
            <div className="kicker">{copy.sectors[lang]}</div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {copy.sectorList[lang].map((s) => (
                <li key={s} className="font-display py-4 text-xl font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="kicker">{ui.contact.city[lang]}</div>
            <h3 className="font-display mt-6 text-2xl font-semibold">{copy.where[lang]}</h3>
            <p className="mt-3 leading-relaxed text-ink/65">{copy.whereText[lang]}</p>
          </Reveal>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="bg-soft py-24 md:py-28">
        <div className="wrap">
          <Reveal>
            <div className="kicker">{pillars.kicker[lang]}</div>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">{pillars.title[lang]}</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pillars.items.map((it, i) => (
              <Reveal key={i} delay={i * 90} className="border-t-2 border-ink/10 pt-6">
                <div className="font-display text-sm font-semibold text-sky">0{i + 1}</div>
                <h3 className="font-display mt-3 text-lg font-semibold">{it.t[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{it.d[lang]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
