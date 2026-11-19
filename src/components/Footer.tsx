import { getContent } from "@/lib/content";
import Link from "next/link";
import { type Locale } from "@/data/i18n";

export default async function Footer({ lang }: { lang: Locale }) {
  const { ui, contact: CONTACT } = await getContent();
  const links = [
    { href: `/${lang}/projets`, label: ui.nav.projects[lang] },
    { href: `/${lang}/services`, label: ui.nav.services[lang] },
    { href: `/${lang}/partenaires`, label: ui.nav.partners[lang] },
    { href: `/${lang}/a-propos`, label: ui.nav.about[lang] },
    { href: `/${lang}/contact`, label: ui.nav.contact[lang] },
  ];
  return (
    <footer className="bg-white text-ink">
      <div className="wrap">
        <div className="flex flex-col gap-8 border-t border-line py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href={`/${lang}`} aria-label="Moon XR">
              <img src="/media/logos/moonxr-l.svg" alt="Moon XR" width={1920} height={467} className="h-10 w-auto" loading="lazy" />
            </Link>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/60">
              <a href={`mailto:${CONTACT.email}`} dir="ltr" className="hover:text-ink">{CONTACT.email}</a>
              <a href={CONTACT.phoneHref} dir="ltr" className="hover:text-ink">{CONTACT.phone}</a>
            </div>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-ink/75 transition-colors hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={lang === "fr" ? "/ar" : "/fr"} hrefLang={lang === "fr" ? "ar" : "fr"} className="w-fit rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/75 hover:border-ink/40 hover:text-ink">
            {lang === "fr" ? "العربية" : "Français"}
          </Link>
        </div>
        <div className="flex flex-col gap-2 border-t border-line py-6 text-xs text-ink/45 md:flex-row md:justify-between">
          <span>© 2026 Moon Technology · {ui.footer.tag[lang]}</span>
          <span>
            3D : «{" "}
            <a className="underline hover:text-ink" href="https://sketchfab.com/3d-models/meta-quest-3-f9d76a024b45478fab40a2434867f8c9" target="_blank" rel="noopener noreferrer">
              Meta Quest 3
            </a>{" "}
            » — Roberto Domínguez,{" "}
            <a className="underline hover:text-ink" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY 4.0
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
