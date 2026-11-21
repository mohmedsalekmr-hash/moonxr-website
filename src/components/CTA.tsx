import Link from "next/link";
import { getContent } from "@/lib/content";
import { type Locale, href as pageHref } from "@/data/i18n";
import { Reveal } from "@/components/Media";

/** Closing line of every page: one question and one button to the contact page (no box). */
export default async function CTA({ lang }: { lang: Locale; fade?: boolean }) {
  const { ui } = await getContent();
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-col items-start gap-6 border-t border-line pt-12 md:flex-row md:items-center md:justify-between md:gap-10 md:pt-16">
            <h2 className="font-display max-w-2xl text-[1.9rem] font-bold leading-[1.1] md:text-5xl">{ui.cta.title[lang]}</h2>
            <Link href={pageHref(lang, "contact")} className="btn btn-sun shrink-0 px-7 py-4 text-base">
              {ui.nav.contact[lang]}
              <span className="rtl:rotate-180">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
