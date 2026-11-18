import { getContent } from "@/lib/content";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { type Locale } from "@/data/i18n";
import { Reveal } from "@/components/Media";

const ICON = {
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
};

/** Closing chapter of every page: one calm, centred invitation and a single quiet line of contacts. */
export default async function CTA({ lang }: { lang: Locale }) {
  const { ui, contact: CONTACT } = await getContent();
  const fr = lang === "fr";
  const items = [
    { icon: ICON.mail, value: CONTACT.email, href: `mailto:${CONTACT.email}`, ltr: true },
    { icon: ICON.phone, value: CONTACT.phone, href: CONTACT.phoneHref, ltr: true },
    { icon: ICON.pin, value: ui.contact.city[lang] },
  ];
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(45%_100%_at_50%_0%,rgba(111,138,214,0.24),transparent_70%)]" />
      <div className="wrap relative py-20 text-center md:py-24">
        <Reveal>
          <SectionHeader dark center kicker={ui.nav.contact[lang]} title={ui.cta.title[lang]} lead={ui.cta.sub[lang]} />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${lang}/contact`} className="btn btn-sun">
              {ui.cta.btn[lang]}
            </Link>
            <a href={CONTACT.phoneHref} className="btn btn-line">
              {fr ? "Appeler" : "اتصل بنا"}
            </a>
          </div>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            {items.map((c, i) => {
              const body = (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-sun" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={c.icon} />
                  </svg>
                  <span dir={c.ltr ? "ltr" : undefined}>{c.value}</span>
                </>
              );
              return (
                <li key={i}>
                  {c.href ? (
                    <a href={c.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                      {body}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2">{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
