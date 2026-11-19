import { getContent } from "@/lib/content";
import { type Locale } from "@/data/i18n";
import { Reveal } from "@/components/Media";
import CTAPanel from "@/components/CTAPanel";

/** Closing chapter of every page: the one blue card of the site — pick your need, then reach us your way. */
export default async function CTA({ lang }: { lang: Locale; fade?: boolean }) {
  const { ui, contact: CONTACT } = await getContent();
  return (
    <section className="relative bg-white pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="wrap relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-brand shadow-[0_40px_80px_-40px_rgba(10,20,49,0.6)] ring-1 ring-white/10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_0%_0%,rgba(111,138,214,0.35),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-24 -end-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-40 -end-40 h-[26rem] w-[26rem] rounded-full border border-white/[0.06]" />
            <CTAPanel
              lang={lang}
              kicker={ui.nav.contact[lang]}
              title={ui.cta.title[lang]}
              lead={ui.cta.sub[lang]}
              ask={lang === "fr" ? "Que préparez-vous ?" : "ماذا تحضّرون؟"}
              types={[...ui.contact.types[lang]]}
              email={CONTACT.email}
              phone={CONTACT.phone}
              phoneHref={CONTACT.phoneHref}
              whatsapp={CONTACT.phoneHref.replace(/[^\d]/g, "")}
              city={ui.contact.city[lang]}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
