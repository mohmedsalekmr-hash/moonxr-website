import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/data/i18n";
import { getContent } from "@/lib/content";
import { rimg } from "@/lib/img";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, href } from "@/data/i18n";
import type { Category } from "@/data/projects";
import PageHead from "@/components/PageHead";
import SectionHeader from "@/components/SectionHeader";
import ProcessJourney from "@/components/ProcessJourney";
import { SERVICE_IMG } from "@/components/ServiceBento";
import { Reveal } from "@/components/Media";
import CTA from "@/components/CTA";
import Page from "@/components/Page";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang as Locale, "services");
}


/** Which projects show each service (by order of the four services). */
const SHOWN_IN: Category[][] = [["event"], ["training"], ["training"], ["dev"]];

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  const { ui, services, steps, projects } = await getContent();
  const T = ui.servicesPage;
  if (!hasLocale(lang)) notFound();
  const h = ui.home;

  return (
    <Page>
      <PageHead kicker={ui.nav.services[lang]} title={T.title[lang]} sub={T.sub[lang]}>
        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          {services.map((s, i) => (
            <a key={i} href={`#s${i + 1}`} className="rounded-full border border-ink/12 bg-white px-4 py-2 hover:border-ink/35">
              {s.title[lang]}
            </a>
          ))}
        </div>
      </PageHead>

      {/* one row per service: photo | words, alternating */}
      <section className="pb-8 md:pb-16">
        <div className="wrap space-y-14 md:space-y-24">
          {services.map((s, i) => {
            const img = SERVICE_IMG[i % SERVICE_IMG.length];
            const picked = s.projects?.length ? projects.filter((p) => s.projects!.includes(p.slug)) : null;
            const related = picked ?? projects.filter((p) => (SHOWN_IN[i] ?? []).includes(p.category));
            return (
              <Reveal key={i} className={i === 0 ? "!opacity-100 !transform-none" : ""}>
                <article id={`s${i + 1}`} className="grid scroll-mt-24 items-center gap-6 md:grid-cols-2 md:gap-14">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy ${i % 2 ? "md:order-2" : ""}`}>
                    <img {...rimg(img.src, "(min-width: 768px) 50vw, 100vw")} alt="" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} style={{ objectPosition: img.pos }} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-brand">{String(i + 1).padStart(2, "0")}</div>
                    <h2 className="section-title !mt-2">{s.title[lang]}</h2>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/75">{s.text[lang]}</p>
                    {related.length > 0 && (
                      <div className="mt-7">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45 rtl:text-sm rtl:tracking-normal">{T.seen[lang]}</div>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {related.map((p) => (
                            <li key={p.slug}>
                              <Link href={`${href(lang, "projets")}/${p.slug}`} className="group inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pe-3 ps-1.5 text-sm transition-colors hover:border-brand/30 hover:bg-brand-soft">
                                <img {...rimg(p.cover.src, "60px")} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="h-7 w-7 rounded-full object-cover" />
                                {p.title[lang]}
                                <span className="text-ink/40 transition-transform group-hover:translate-x-0.5 rtl:rotate-180">→</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* how we work */}
      <section className="pb-8 pt-10 md:pb-16 md:pt-16">
        <div className="wrap">
          <div className="border-t border-line pt-14 md:pt-20">
            <Reveal>
              <SectionHeader kicker={h.processKicker[lang]} title={h.processTitle[lang]} />
            </Reveal>
            <ProcessJourney steps={steps} lang={lang} />
          </div>
        </div>
      </section>

      <CTA lang={lang} />
    </Page>
  );
}
