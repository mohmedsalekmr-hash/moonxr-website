import { getContent } from "@/lib/content";
import Link from "next/link";
import { type Locale, href as pageHref, locales, LANG } from "@/data/i18n";
import { Reveal } from "@/components/Media";

type Social = { name: string; url: string };
type Look = "navy" | "brand" | "soft";

/** The three colours to choose from: dark navy, the logo blue, the light blue tint. */
const THEME: Record<Look, { bg: string; text: string; mute: string; line: string; ring: string; hi: string; logo: string; langOn: string; langOff: string; credit: string }> = {
  navy: { bg: "bg-navy-deep", text: "text-white", mute: "text-white/50", line: "border-white/15", ring: "border-white/[0.04]", hi: "text-sun", logo: "/media/logos/moonxr-d.svg?v=2", langOn: "bg-sun text-navy-deep", langOff: "text-white/70 hover:bg-white/10 hover:text-white", credit: "text-white/40" },
  brand: { bg: "bg-brand", text: "text-white", mute: "text-white/55", line: "border-white/20", ring: "border-white/[0.06]", hi: "text-sun", logo: "/media/logos/moonxr-d.svg?v=2", langOn: "bg-sun text-navy-deep", langOff: "text-white/75 hover:bg-white/10 hover:text-white", credit: "text-white/45" },
  soft: { bg: "bg-brand-soft", text: "text-navy-deep", mute: "text-navy-deep/50", line: "border-navy/15", ring: "border-navy/[0.05]", hi: "text-brand", logo: "/media/logos/moonxr-l.svg?v=2", langOn: "bg-navy-deep text-sun", langOff: "text-navy-deep/70 hover:bg-navy/10 hover:text-navy-deep", credit: "text-navy-deep/45" },
};
/** Which colour the site uses («compare» shows all three, one under the other). */
const LOOK: Look | "compare" = "compare";

/**
 * The site's closing block, in Moon's colours: a full-width yellow ground with a large statement,
 * every page one click away in columns, then the address, the languages and the social accounts.
 */
export default async function Footer({ lang }: { lang: Locale }) {
  if (LOOK === "compare")
    return (
      <>
        <FooterBlock lang={lang} look="navy" />
        <FooterBlock lang={lang} look="brand" />
        <FooterBlock lang={lang} look="soft" />
      </>
    );
  return <FooterBlock lang={lang} look={LOOK} />;
}

async function FooterBlock({ lang, look }: { lang: Locale; look: Look }) {
  const T = THEME[look];
  const { ui, contact: CONTACT, projects, services } = await getContent();
  const f = ui.footer;
  const wa = (CONTACT.whatsapp || CONTACT.phone).replace(/[^\d]/g, "");
  // social accounts are added in the admin (phase 2); none yet → the corner stays empty
  const socials = ((CONTACT as { socials?: Social[] }).socials ?? []).filter((s) => s.url);

  const cols: { title: string; links: { href: string; label: string; ext?: boolean; ltr?: boolean }[] }[] = [
    {
      title: ui.nav.projects[lang],
      links: projects.map((p) => ({ href: `${pageHref(lang, "projets")}/${p.slug}`, label: p.title[lang] })),
    },
    {
      title: ui.nav.services[lang],
      links: services.map((s, i) => ({ href: `${pageHref(lang, "services")}#s${i + 1}`, label: s.title[lang] })),
    },
    {
      title: "Moon XR",
      links: [
        { href: `/${lang}`, label: ui.nav.home[lang] },
        { href: pageHref(lang, "a-propos"), label: ui.nav.about[lang] },
        { href: pageHref(lang, "partenaires"), label: ui.nav.partners[lang] },
        { href: pageHref(lang, "contact"), label: ui.nav.contact[lang] },
      ],
    },
    {
      title: f.contact[lang],
      links: [
        { href: `mailto:${CONTACT.email}`, label: CONTACT.email, ltr: true },
        { href: CONTACT.phoneHref, label: CONTACT.phone, ltr: true },
        ...(wa ? [{ href: `https://wa.me/${wa}`, label: f.whatsapp[lang], ext: true }] : []),
      ],
    },
  ];

  return (
    <footer data-look={look} className={`relative isolate overflow-hidden ${T.bg} ${T.text}`}>
      {/* the «O» of Moon, very large and barely there */}
      <span aria-hidden className={`pointer-events-none absolute -bottom-[22rem] -end-[14rem] -z-10 h-[44rem] w-[44rem] rounded-full border-[5.5rem] ${T.ring} md:-bottom-[26rem] md:-end-[10rem] md:h-[56rem] md:w-[56rem] md:border-[7rem]`} />

      <div className="wrap pb-8 pt-16 md:pb-10 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          {/* statement */}
          <div>
            <Reveal>
              <p className="font-display text-[2.2rem] font-bold leading-[1.02] tracking-tight md:text-6xl">
                {ui.hero.l1[lang]}
                <br />
                <span className={T.hi}>{ui.hero.l2a[lang]}</span> {ui.hero.l2b[lang]}
              </p>
            </Reveal>
            <Link href={`/${lang}`} aria-label="Moon XR" className="mt-8 inline-block transition hover:opacity-80 md:mt-10">
              <img src={T.logo} alt="Moon XR" width={1920} height={467} className="h-10 w-auto md:h-12" loading="lazy" />
            </Link>
          </div>

          {/* every page, one click away */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1.15fr_1fr_0.75fr_1.3fr]">
            {cols.map((c) => (
              <div key={c.title}>
                <div className={`text-xs font-bold uppercase tracking-[0.14em] ${T.mute} rtl:text-sm rtl:tracking-normal`}>{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      {l.ext || l.href.startsWith("mailto:") || l.href.startsWith("tel:") ? (
                        <a href={l.href} target={l.ext ? "_blank" : undefined} rel={l.ext ? "noopener noreferrer" : undefined} dir={l.ltr ? "ltr" : undefined} className="foot-link text-[0.95rem] font-medium">
                          {/* an e-mail address may only break after its «@» */}
                          {l.label.includes("@") ? (
                            <>
                              {l.label.split("@")[0]}@<wbr />
                              {l.label.split("@")[1]}
                            </>
                          ) : (
                            l.label
                          )}
                        </a>
                      ) : (
                        <Link href={l.href} className="foot-link text-[0.95rem] font-medium">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* address · languages · social accounts */}
        <div className={`mt-14 flex flex-col gap-5 border-t ${T.line} pt-6 text-sm md:mt-20 md:flex-row md:items-center md:justify-between`}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-semibold">{f.city[lang]}</span>
            <span className={T.mute}>© 2026 Moon Technology</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex gap-1.5">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={pageHref(l)}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === lang ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${l === lang ? T.langOn : T.langOff}`}
                >
                  {LANG[l].short}
                </Link>
              ))}
            </div>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="foot-link font-semibold">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className={`mt-5 text-[0.7rem] ${T.credit}`}>
          3D : «{" "}
          <a className="underline hover:opacity-80" href="https://sketchfab.com/3d-models/meta-quest-3-f9d76a024b45478fab40a2434867f8c9" target="_blank" rel="noopener noreferrer">
            Meta Quest 3
          </a>{" "}
          » — Roberto Domínguez,{" "}
          <a className="underline hover:opacity-80" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
