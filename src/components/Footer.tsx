import { getContent } from "@/lib/content";
import Link from "next/link";
import { type Locale } from "@/data/i18n";

export default async function Footer({ lang }: { lang: Locale }) {
  const { ui, contact: CONTACT } = await getContent();
  const links = [
    { href: `/${lang}/projets`, label: ui.nav.projects[lang] },
    { href: `/${lang}/partenaires`, label: ui.nav.partners[lang] },
    { href: `/${lang}/a-propos`, label: ui.nav.about[lang] },
    { href: `/${lang}/contact`, label: ui.nav.contact[lang] },
  ];
  return (
    <footer className="bg-navy text-white">
      <div className="wrap">
        <div className="flex flex-col gap-8 border-t border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href={`/${lang}`} aria-label="Moon XR">
              <img src="/media/logos/moonxr-d.svg" alt="Moon XR" width={1920} height={315} className="h-7 w-auto" loading="lazy" />
            </Link>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
              <a href={`mailto:${CONTACT.email}`} dir="ltr" className="hover:text-white">{CONTACT.email}</a>
              <a href={CONTACT.phoneHref} dir="ltr" className="hover:text-white">{CONTACT.phone}</a>
            </div>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={lang === "fr" ? "/ar" : "/fr"} hrefLang={lang === "fr" ? "ar" : "fr"} className="w-fit rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/50 hover:text-white">
            {lang === "fr" ? "العربية" : "Français"}
          </Link>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 md:flex-row md:justify-between">
          <span>© 2026 Moon Technology · {ui.footer.tag[lang]}</span>
          <span>
            3D : «{" "}
            <a className="underline hover:text-white" href="https://sketchfab.com/3d-models/meta-quest-3-f9d76a024b45478fab40a2434867f8c9" target="_blank" rel="noopener noreferrer">
              Meta Quest 3
            </a>{" "}
            » — Roberto Domínguez,{" "}
            <a className="underline hover:text-white" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY 4.0
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
