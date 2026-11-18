import Link from "next/link";
import type { Org } from "@/data/projects";
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
      <div className="grid items-center sm:grid-cols-[1fr_1px_1fr]">
        {partners.map((o, i) => (
          <Fragment key={o.name}>
            {i > 0 && <span className="mx-auto my-8 h-px w-24 bg-ink/10 sm:my-0 sm:h-28 sm:w-px" />}
            <div className="group flex flex-col items-center gap-5 py-4 text-center">
              <div className="grid h-[120px] place-items-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04]">
                <Logo org={o} area={10500} maxW={240} maxH={120} />
              </div>
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sun-deep rtl:text-xs rtl:tracking-normal">{labels.partner}</div>
                <div className="mt-1 text-sm text-ink/55">{o.role?.[lang]}</div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Technologies: a quiet label, then two rows gliding in opposite directions */}
      <div className="mt-16 flex items-center gap-5 md:mt-20">
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
        <Link key={it.org.name} href={it.href} className={`group relative block overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
          <div className={`relative ${i === 0 ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/10]"}`}>
            <img src={it.image} alt="" loading="lazy" style={{ objectPosition: it.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/85 via-[#05070d]/20 to-transparent" />
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

/** Partner feature rows: a floating logo stage beside the story. */
export function PartnerFeatures({ orgs, lang, extra }: { orgs: Org[]; lang: Locale; extra: Record<string, { points: T[]; image?: string }> }) {
  return (
    <div className="space-y-6">
      {orgs.map((o, i) => (
        <article key={o.name} className="grid overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-2">
          <div className={`relative grid min-h-[260px] place-items-center overflow-hidden bg-[radial-gradient(70%_70%_at_50%_40%,#ffffff,#eef2f9)] ${i % 2 ? "md:order-2" : ""}`}>
            {extra[o.name]?.image && <img src={extra[o.name].image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />}
            <div className="float relative">
              <Logo org={o} area={22000} maxW={270} maxH={160} />
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="text-xs font-semibold text-sun-deep">{o.role?.[lang]}</div>
            <h3 className="font-display mt-2 text-2xl font-bold md:text-3xl">{o.name}</h3>
            <p className="mt-3 leading-relaxed text-ink/65">{o.text?.[lang]}</p>
            <ul className="mt-6 space-y-2.5">
              {extra[o.name]?.points.map((pt, k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-ink/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                  {pt[lang]}
                </li>
              ))}
            </ul>
            {o.url && (
              <a href={o.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-sky hover:underline">
                {o.url.replace("https://", "")} <span className="rtl:rotate-180">↗</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

/** Technology wall: logo tiles that reveal what each supplier brings on hover / focus. */
export function TechWall({ orgs, lang }: { orgs: Org[]; lang: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {orgs.map((o) => (
        <li key={o.name}>
          <div tabIndex={0} className="tech-tile group relative grid h-36 place-items-center overflow-hidden rounded-2xl border border-line bg-white px-6 outline-none transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,27,63,0.45)] focus-visible:ring-2 focus-visible:ring-sky md:h-44">
            <div className="transition-all duration-500 group-hover:-translate-y-6 group-hover:scale-90 group-focus:-translate-y-6 group-focus:scale-90">
              <Logo org={o} area={4200} maxW={150} maxH={56} />
            </div>
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
              <div className="text-sm font-semibold">{o.name}</div>
              {o.role && <div className="text-xs text-ink/55">{o.role[lang]}</div>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
