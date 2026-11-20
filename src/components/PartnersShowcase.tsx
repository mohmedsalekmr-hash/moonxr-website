import Link from "next/link";
import type React from "react";
import { rimg } from "@/lib/img";
import { Logo } from "@/components/Logos";
import type { Org, Project } from "@/data/projects";
import { href as pageHref, type Locale, type T } from "@/data/i18n";

const clientOf = (p: Project) => p.facts.find((f) => f.k.fr === "Client")?.v;

/** Clients as story cards: the real project photo, the client's logo, what we delivered. */
export function ClientStories({ projects, orgs, lang, cta }: { projects: Project[]; orgs: Org[]; lang: Locale; cta: string }) {
  const rows = projects.map((p) => ({ p, client: clientOf(p) })).filter((r): r is { p: Project; client: T } => !!r.client);
  const logoOf = (name: string) => orgs.find((o) => o.logo && name.toLowerCase().startsWith(o.name.toLowerCase().split(" ")[0]));
  return (
    <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
      {rows.map(({ p, client }) => {
        const org = logoOf(client.fr);
        return (
          <li key={p.slug}>
            <Link href={`${pageHref(lang, "projets")}/${p.slug}`} className="group block" aria-label={`${p.title[lang]} — ${cta}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-navy md:aspect-[16/11]">
                <img
                  {...rimg(p.cover.src, "(min-width: 768px) 50vw, 100vw")}
                  alt={p.cover.alt?.[lang] ?? ""}
                  loading="lazy"
                  style={{ objectPosition: p.cover.pos }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-deep/55 to-transparent" />
                <div className="absolute start-5 top-5 flex h-10 items-center md:start-7 md:top-6 md:h-12 [filter:brightness(0)_invert(1)_drop-shadow(0_2px_6px_rgba(0,0,0,.35))]">
                  {org ? (
                    <Logo org={org} area={1500} maxW={90} maxH={32} />
                  ) : (
                    <span className="font-display text-base font-bold tracking-tight md:text-lg">{client[lang].split(" — ")[0].split(" (")[0]}</span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-7">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70 rtl:text-sm rtl:tracking-normal">{p.meta[lang]}</div>
                    <div className="font-display mt-2 text-xl font-bold leading-snug md:text-2xl">{p.title[lang]}</div>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-sun group-hover:text-ink">
                    <span className="rtl:rotate-180">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** The project a partner took part in: named in a fact other than "Client" (e.g. Solution, Partner). */
function relatedProject(o: Org, projects: Project[]) {
  const n = o.name.toLowerCase();
  const p = projects.find((x) => x.facts.some((f) => f.k.fr !== "Client" && f.v.fr.toLowerCase().includes(n)));
  if (!p) return undefined;
  const imgs = p.scenes.filter((s) => s.media.type === "image");
  // a picture naming the partner, else one other than the cover (the cover already shows on the client card)
  const scene = imgs.find((s) => `${s.kicker?.fr ?? ""} ${s.title?.fr ?? ""}`.toLowerCase().includes(n)) ?? imgs.find((s) => s.media.src !== p.cover.src);
  const src = scene && scene.media.type === "image" ? scene.media.src : p.cover.src;
  return { p, src, pos: scene ? scene.media.pos : p.cover.pos };
}

/** Partners as full-width spotlights: a real photo of our work together, then the role and what we do. */
export function PartnerSpotlights({ orgs, projects, lang, labels }: { orgs: Org[]; projects: Project[]; lang: Locale; labels: { related: string; view: string } }) {
  return (
    <div className="space-y-14 md:space-y-24">
      {orgs.map((o, i) => {
        const rel = relatedProject(o, projects);
        return (
          <article key={o.name} className="grid items-center gap-7 lg:grid-cols-2 lg:gap-16">
            <div className={`relative ${i % 2 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-[radial-gradient(70%_80%_at_50%_30%,#ffffff,#eef1f9)]">
                {rel ? (
                  <img {...rimg(rel.src, "(min-width: 1024px) 50vw, 100vw")} alt="" loading="lazy" style={{ objectPosition: rel.pos }} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Logo org={o} area={14000} maxW={240} maxH={110} />
                  </div>
                )}
              </div>
              {rel && (
                <div className="absolute -bottom-5 start-5 grid h-20 place-items-center rounded-[var(--radius-sm)] border border-line bg-white px-5 shadow-[0_18px_40px_-20px_rgba(20,30,60,.45)] md:start-8 md:h-24 md:px-7">
                  <Logo org={o} area={4200} maxW={170} maxH={52} />
                </div>
              )}
            </div>
            <div className={rel ? "pt-4 lg:pt-0" : ""}>
              {o.role && <span className="tag">{o.role[lang]}</span>}
              <h3 className="font-display mt-4 text-3xl font-bold md:text-5xl">{o.name}</h3>
              {o.text && <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">{o.text[lang]}</p>}
              {!!o.points?.length && (
                <ul className="mt-6 grid gap-3">
                  {o.points.map((pt, k) => (
                    <li key={k} className="flex items-start gap-3 text-ink/80">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">✓</span>
                      {pt[lang]}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {rel && (
                  <Link href={`${pageHref(lang, "projets")}/${rel.p.slug}`} className="group inline-flex items-center gap-3 rounded-full border border-ink/12 bg-white py-1.5 pe-4 ps-1.5 transition-colors hover:border-ink/35">
                    <span className="relative h-9 w-9 overflow-hidden rounded-full bg-navy">
                      <img {...rimg(rel.p.cover.src, "40px")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </span>
                    <span className="text-sm">
                      <span className="block text-[0.7rem] text-ink/50">{labels.related}</span>
                      <span className="font-semibold">{rel.p.title[lang]}</span>
                    </span>
                    <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
                  </Link>
                )}
                {o.url && (
                  <a href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-brand hover:underline">
                    {o.url.replace(/^https?:\/\//, "")} <span className="rtl:-scale-x-100">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** Technologies on two gliding rows of cards (logo, name, specialty), in opposite directions. */
export function TechMarquee({ orgs, lang }: { orgs: Org[]; lang: Locale }) {
  // both rows carry every technology, the second one starting halfway: no logo repeats on screen
  const half = Math.ceil(orgs.length / 2);
  const row = (list: Org[], reverse: boolean, speed: number) => {
    const base = Array.from({ length: Math.max(1, Math.ceil(8 / list.length)) }, () => list).flat();
    return (
      <div className="marquee overflow-hidden py-3" dir="ltr">
        <ul className={`marquee-track ${reverse ? "reverse" : ""}`} style={{ "--speed": `${speed}s` } as React.CSSProperties}>
          {[...base, ...base].map((o, i) => (
            <li key={i} aria-hidden={i >= list.length} className="shrink-0 px-2 md:px-2.5">
              <div className="group flex h-[92px] w-[250px] items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-white px-4 transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(20,30,60,.35)] md:h-[104px] md:w-[300px] md:px-5" dir={lang === "ar" ? "rtl" : "ltr"}>
                <div className="grid h-14 w-[96px] shrink-0 place-items-center grayscale transition duration-500 group-hover:grayscale-0 md:w-[112px]">
                  <Logo org={o} area={2400} maxW={104} maxH={40} />
                </div>
                <div className="min-w-0 border-s border-line ps-4">
                  <div className="font-display text-[0.95rem] font-semibold leading-tight">{o.name}</div>
                  {o.role && <div className="mt-0.5 line-clamp-2 text-[0.8rem] leading-snug text-ink/60">{o.role[lang]}</div>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="space-y-1">
      {row(orgs, false, 52)}
      {row([...orgs.slice(half), ...orgs.slice(0, half)], true, 46)}
    </div>
  );
}
