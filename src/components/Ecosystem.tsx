import Link from "next/link";
import type { Org, Project } from "@/data/projects";
import type { Locale, T } from "@/data/i18n";
import { Fragment } from "react";
import { Logo, LogoMarquee } from "@/components/Logos";

/**
 * Ecosystem grid: partners as two wide tiles, then the technology suppliers.
 * Hairline-separated tiles, logos in their own colours, name revealed on hover.
 */
export function EcoGrid({ partners, suppliers, lang, labels, more }: { partners: Org[]; suppliers: Org[]; lang: Locale; labels: { partner: string; supplier: string }; more?: { href: string; label: string } }) {
  // Each logo appears once: partners are not repeated among the suppliers.
  const techs = suppliers.filter((o) => !partners.some((p) => p.name === o.name));
  const half = Math.ceil(techs.length / 2);
  const fade = "grayscale opacity-55 transition duration-500 hover:grayscale-0 hover:opacity-100";
  return (
    <div>
      {/* Partners: two big logos, no boxes, a single hairline between them */}
      <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-[1fr_1px_1fr] sm:items-center sm:gap-0">
        {partners.map((o, i) => (
          <Fragment key={o.name}>
            {i > 0 && <span className="hidden h-28 w-px bg-ink/10 sm:mx-auto sm:block" />}
            <div className="group flex flex-col items-center gap-3 rounded-[var(--radius-sm)] bg-white p-4 text-center sm:gap-5 sm:bg-transparent sm:p-0 sm:py-4">
              <div className="grid h-[70px] place-items-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04] sm:h-[120px]">
                <span className="sm:hidden">
                  <Logo org={o} area={4200} maxW={130} maxH={64} eager />
                </span>
                <span className="hidden sm:block">
                  <Logo org={o} area={10500} maxW={240} maxH={120} />
                </span>
              </div>
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sun-deep rtl:text-xs rtl:tracking-normal">{labels.partner}</div>
                <div className="mt-1 text-[0.8rem] leading-snug text-ink/60 sm:text-sm sm:text-ink/60">{o.role?.[lang]}</div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Technologies: a quiet label, then two rows gliding in opposite directions */}
      <div className="mt-10 flex items-center gap-5 md:mt-20">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ink/15 rtl:bg-gradient-to-l" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 rtl:text-sm rtl:tracking-normal">{labels.supplier}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ink/15 rtl:bg-gradient-to-r" />
      </div>
      <div className="mt-6 space-y-2">
        <LogoMarquee orgs={techs.slice(0, half)} speed={34} size={{ area: 4200, maxW: 150, maxH: 54 }} itemClass={`px-10 md:px-16 ${fade}`} />
        <LogoMarquee orgs={techs.slice(half)} speed={30} reverse size={{ area: 4200, maxW: 150, maxH: 54 }} itemClass={`px-10 md:px-16 ${fade}`} />
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

/** Large cards for the clients we delivered for, each opening its project. */
export function ClientCards({ items, lang, cta }: { items: { org: Org; href: string; image: string; pos?: string; label: T }[]; lang: Locale; cta: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((it, i) => (
        <Link key={it.org.name} href={it.href} className={`group relative block overflow-hidden rounded-[var(--radius-lg)] ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
          <div className={`relative ${i === 0 ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/10]"}`}>
            <img src={it.image} alt="" loading="lazy" style={{ objectPosition: it.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60 rtl:text-sm rtl:tracking-normal">{it.org.name}</div>
                <div className="font-display mt-1 text-xl font-semibold text-white md:text-2xl">{it.label[lang]}</div>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-label={cta}>
                <span className="rtl:rotate-180">→</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
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
              href={`/${lang}/projets/${p.slug}`}
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
                <img src={p.cover.src} alt="" loading="lazy" style={{ objectPosition: p.cover.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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

/** Technology suppliers: logo, name and speciality always visible (phones have no hover). */
export function TechWall({ orgs, lang }: { orgs: Org[]; lang: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {orgs.map((o) => (
        <li key={o.name} className="flex flex-col rounded-[var(--radius-sm)] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(20,36,84,0.45)]">
          <div className="grid h-16 place-items-center md:h-20">
            <Logo org={o} area={4200} maxW={150} maxH={52} />
          </div>
          <div className="mt-4 border-t border-line pt-3 text-center">
            <div className="text-sm font-semibold">{o.name}</div>
            {o.role && <div className="mt-0.5 text-xs text-ink/60">{o.role[lang]}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

const GROUPS: { id: string; title: T; text: T }[] = [
  { id: "industry", title: { fr: "Soudage & industrie", ar: "اللحام والصناعة" }, text: { fr: "Des simulateurs pour former aux métiers techniques, sans risque.", ar: "محاكيات لتعليم المهن التقنية، بلا مخاطر." } },
  { id: "education", title: { fr: "Éducation & santé", ar: "التعليم والصحة" }, text: { fr: "Des cours en VR, de la salle de classe à l'anatomie.", ar: "دروس بالواقع الافتراضي، من الفصل إلى التشريح." } },
  { id: "safety", title: { fr: "Sécurité", ar: "السلامة" }, text: { fr: "Les bons réflexes, appris en situation simulée.", ar: "ردود الفعل الصحيحة، تُتعلَّم في مواقف محاكاة." } },
  { id: "platform", title: { fr: "Plateformes", ar: "المنصّات" }, text: { fr: "Pour diffuser et gérer les contenus XR.", ar: "لنشر محتوى XR وإدارته." } },
];

/** Technology suppliers grouped by need: a visitor knows the need before the brand. */
export function TechGroups({ orgs, partners, lang }: { orgs: Org[]; partners: Org[]; lang: Locale }) {
  const groups = GROUPS.map((g) => ({ ...g, items: orgs.filter((o) => (o.category ?? "platform") === g.id) })).filter((g) => g.items.length);
  const official = (name: string) => partners.find((p) => p.name === name)?.role?.[lang];
  return (
    <div className="divide-y divide-line border-y border-line">
      {groups.map((g) => (
        <section key={g.id} className="grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-12 md:py-14">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="font-display text-2xl font-bold md:text-3xl">{g.title[lang]}</h3>
              <span className="font-display text-sm font-semibold text-brand">{g.items.length}</span>
            </div>
            <p className="mt-2 max-w-xs text-ink/60">{g.text[lang]}</p>
          </div>
          <ul className={`grid grid-cols-2 gap-3 md:gap-4 ${g.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {g.items.map((o) => {
              const badge = official(o.name);
              return (
                <li key={o.name} className="group relative flex flex-col rounded-[var(--radius-sm)] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-[0_24px_50px_-28px_rgba(20,36,84,0.45)] md:p-6">
                  {badge && <span className="tag absolute start-3 top-3 !bg-sun/20 !text-sun-deep !text-[0.65rem]">{badge}</span>}
                  <div className={`grid h-20 place-items-center md:h-24 ${badge ? "mt-4" : ""}`}>
                    <Logo org={o} area={6200} maxW={170} maxH={64} />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-sm font-semibold">{o.name}</div>
                    {o.role && <div className="mt-1 text-xs leading-snug text-ink/60">{o.role[lang]}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
