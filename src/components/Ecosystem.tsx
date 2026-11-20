import Link from "next/link";
import { rimg } from "@/lib/img";
import type { Org, Project } from "@/data/projects";
import { href as pageHref, type Locale, type T } from "@/data/i18n";
import { Fragment } from "react";
import type React from "react";
import { Logo, LogoMarquee } from "@/components/Logos";

/** Technology logos in two rows gliding in opposite directions: grey at rest, their own colours on hover or tap. */
export function TechLogoRows({ orgs }: { orgs: Org[] }) {
  const half = Math.ceil(orgs.length / 2);
  const fade = "grayscale opacity-55 transition duration-500 hover:grayscale-0 hover:opacity-100 focus:grayscale-0 focus:opacity-100 active:grayscale-0 active:opacity-100";
  return (
    <div className="space-y-2">
      <LogoMarquee orgs={orgs.slice(0, half)} speed={34} size={{ area: 4200, maxW: 150, maxH: 54 }} itemClass={`px-10 md:px-16 ${fade}`} />
      <LogoMarquee orgs={orgs.slice(half)} speed={30} reverse size={{ area: 4200, maxW: 150, maxH: 54 }} itemClass={`px-10 md:px-16 ${fade}`} />
    </div>
  );
}

/**
 * Ecosystem grid: partners as two wide tiles, then the technology suppliers.
 * Hairline-separated tiles, logos in their own colours, name revealed on hover.
 */
export function EcoGrid({ partners, suppliers, lang, labels, more }: { partners: Org[]; suppliers: Org[]; lang: Locale; labels: { partner: string; supplier: string }; more?: { href: string; label: string } }) {
  // Each logo appears once: partners are not repeated among the suppliers.
  const techs = suppliers.filter((o) => !partners.some((p) => p.name === o.name));
  return (
    <div>
      {/* Partners: two big logos floating gently, a fading hairline with a yellow dot between them */}
      <div className="grid grid-cols-[1fr_1px_1fr] items-center">
        {partners.map((o, i) => (
          <Fragment key={o.name}>
            {i > 0 && (
              <span className="relative mx-auto h-28 w-px bg-gradient-to-b from-transparent via-ink/15 to-transparent sm:h-40" aria-hidden>
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun" />
              </span>
            )}
            <Link href={more ? more.href.split("#")[0] + "#partenaires" : "#"} className="partner-logo group flex flex-col items-center gap-4 px-2 py-4 text-center sm:gap-6 sm:py-6">
              <div className="relative grid h-[84px] place-items-center sm:h-[150px]">
                <span className="float relative transition-transform duration-500 group-hover:scale-[1.07]" style={{ animationDelay: `${i * -3}s` }}>
                  <span className="sm:hidden">
                    <Logo org={o} area={5200} maxW={140} maxH={74} eager />
                  </span>
                  <span className="hidden sm:block">
                    <Logo org={o} area={15500} maxW={290} maxH={140} />
                  </span>
                </span>
                <span aria-hidden className="partner-shadow" style={{ animationDelay: `${i * -3}s` }} />
              </div>
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand rtl:text-xs rtl:tracking-normal">{labels.partner}</div>
                <div className="mt-1 text-[0.8rem] leading-snug text-ink/55 sm:text-sm">{o.role?.[lang]}</div>
              </div>
            </Link>
          </Fragment>
        ))}
      </div>

      {/* Technologies: a quiet label, then two rows gliding in opposite directions */}
      <div className="mt-10 flex items-center gap-5 md:mt-20">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ink/15 rtl:bg-gradient-to-l" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 rtl:text-sm rtl:tracking-normal">{labels.supplier}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ink/15 rtl:bg-gradient-to-r" />
      </div>
      <div className="mt-6">
        <TechLogoRows orgs={techs} />
      </div>
      {more && (
        <div className="mt-8 text-center">
          <Link href={more.href} className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition-colors hover:text-ink">
            {more.label}
            <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}

/** Client references: one row per client we delivered for, built from the projects' "Client" fact. */
export function ClientIndex({ projects, orgs, lang, cta }: { projects: Project[]; orgs: Org[]; lang: Locale; cta: string }) {
  const rows = projects
    .map((p) => ({ p, client: p.facts.find((f) => f.k.fr === "Client")?.v }))
    .filter((r): r is { p: Project; client: T } => !!r.client);
  const logoOf = (name: string) => orgs.find((o) => o.logo && name.toLowerCase().startsWith(o.name.toLowerCase().split(" ")[0]));
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-line lg:border-y lg:border-line">
      {rows.map(({ p, client }) => {
        const org = logoOf(client.fr);
        return (
          <li key={p.slug}>
            <Link
              href={`${pageHref(lang, "projets")}/${p.slug}`}
              className="group grid h-full items-center gap-4 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-white p-4 transition-colors lg:grid-cols-[220px_minmax(0,1fr)_200px_auto] lg:gap-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-2 lg:py-6 lg:hover:bg-soft"
            >
              <div className="flex h-14 items-center">
                {org ? (
                  <Logo org={org} area={6000} maxW={150} maxH={56} />
                ) : (
                  <span className="font-display text-2xl font-bold tracking-tight text-navy">{client[lang].split(" — ")[0].split(" (")[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold leading-snug md:text-xl">{p.title[lang]}</div>
                <div className="mt-1 text-sm text-ink/60">{p.meta[lang]}</div>
              </div>
              <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] bg-navy lg:block">
                <img {...rimg(p.cover.src, "200px")} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="hidden h-11 w-11 place-items-center rounded-full border border-ink/15 transition-colors group-hover:border-sun group-hover:bg-sun lg:grid" aria-label={cta}>
                <span className="rtl:rotate-180">→</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Partner cards side by side: logo, role, what we do together. */
export function PartnerFeatures({ orgs, lang, extra }: { orgs: Org[]; lang: Locale; extra: Record<string, { points: T[]; image?: string }> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {orgs.map((o) => (
        <article key={o.name} className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
          <div className="grid h-44 place-items-center border-b border-line bg-[radial-gradient(70%_80%_at_50%_30%,#ffffff,#eef1f9)] md:h-52">
            <Logo org={o} area={14000} maxW={230} maxH={110} />
          </div>
          <div className="flex flex-1 flex-col p-6 md:p-8">
            <span className="tag self-start">{o.role?.[lang]}</span>
            <h3 className="font-display mt-4 text-2xl font-bold">{o.name}</h3>
            <p className="mt-3 leading-relaxed text-ink/75">{o.text?.[lang]}</p>
            <ul className="mt-5 space-y-2.5">
              {extra[o.name]?.points.map((pt, k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-ink/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {pt[lang]}
                </li>
              ))}
            </ul>
            {o.url && (
              <a href={o.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-brand hover:underline">
                {o.url.replace("https://", "")} <span className="rtl:rotate-180">↗</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
