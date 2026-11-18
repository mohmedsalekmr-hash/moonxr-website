import type { Org } from "@/data/projects";
import type { Locale } from "@/data/i18n";
import type React from "react";

/**
 * Optical sizing: every logo gets roughly the same visual weight,
 * so a tall crest and a long wordmark look balanced side by side.
 */
function logoSize(r: number, area: number, maxW: number, maxH: number) {
  let w = Math.sqrt(area * r);
  let h = w / r;
  if (h > maxH) {
    h = maxH;
    w = h * r;
  }
  if (w > maxW) {
    w = maxW;
    h = w / r;
  }
  return { width: Math.round(w), height: Math.round(h) };
}

export function Logo({ org, area = 3000, maxW = 150, maxH = 54 }: { org: Org; area?: number; maxW?: number; maxH?: number }) {
  const s = logoSize(org.r, area, maxW, maxH);
  return (
    <img
      src={org.logo}
      alt={org.name}
      title={org.name}
      width={s.width}
      height={s.height}
      style={{ width: s.width, height: s.height }}
      loading="lazy"
      decoding="async"
      className="object-contain"
    />
  );
}

/** Logos gliding in a continuous loop (pauses on hover). */
export function LogoMarquee({
  orgs,
  speed = 40,
  reverse = false,
  size = { area: 7000, maxW: 190, maxH: 80 },
  itemClass = "px-10 md:px-14",
}: {
  orgs: Org[];
  speed?: number;
  reverse?: boolean;
  size?: { area: number; maxW: number; maxH: number };
  itemClass?: string;
}) {
  // repeat enough times to fill wide screens, then double for a seamless loop
  const base = Array.from({ length: Math.max(1, Math.ceil(8 / orgs.length)) }, () => orgs).flat();
  const row = [...base, ...base];
  return (
    <div className="marquee overflow-hidden" dir="ltr">
      <ul className={`marquee-track items-center ${reverse ? "reverse" : ""}`} style={{ "--speed": `${speed}s` } as React.CSSProperties}>
        {row.map((o, i) => (
          <li key={i} aria-hidden={i >= orgs.length} className={`flex h-28 shrink-0 items-center justify-center ${itemClass}`}>
            <Logo org={o} {...size} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Client logos band on the home page. */
export function LogoBand({ title, orgs }: { title: string; orgs: Org[] }) {
  return (
    <section className="border-y border-line bg-white py-12 md:py-14">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 rtl:text-sm rtl:tracking-normal">{title}</p>
      <div className="mt-6">
        <LogoMarquee orgs={orgs} speed={36} />
      </div>
    </section>
  );
}

/** Partners page body: clients loop, partner cards with floating logos, supplier loops. */
export function PartnersBody({
  clients,
  partners,
  suppliers,
  lang,
  labels,
}: {
  clients: Org[];
  partners: Org[];
  suppliers: Org[];
  lang: Locale;
  labels: { clients: string; clientsSub: string; partners: string; suppliers: string; suppliersSub: string };
}) {
  const half = Math.ceil(suppliers.length / 2);
  return (
    <>
      {/* Clients — the companies we ran events for */}
      <section className="py-16 md:py-20">
        <div className="wrap text-center">
          <div className="kicker">{labels.clients}</div>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">{labels.clientsSub}</p>
        </div>
        <div className="mt-8">
          <LogoMarquee orgs={clients} speed={34} size={{ area: 9000, maxW: 220, maxH: 90 }} />
        </div>
      </section>

      {/* Partners */}
      <section className="bg-soft py-20 md:py-28">
        <div className="wrap">
          <div className="kicker">{labels.partners}</div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {partners.map((o, i) => (
              <article key={o.name} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-[0_20px_50px_-30px_rgba(11,27,63,0.35)] transition-transform duration-500 hover:-translate-y-1">
                <div className="relative grid h-56 place-items-center overflow-hidden bg-white md:h-64">
                  <div className="float" style={{ animationDelay: `${i * -3}s` }}>
                    <Logo org={o} area={15000} maxW={300} maxH={130} />
                  </div>
                </div>
                <div className="border-t border-line bg-white p-8">
                  <div className="text-xs font-semibold text-sun-deep">{o.role?.[lang]}</div>
                  <h3 className="font-display mt-1 text-xl font-semibold">{o.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{o.text?.[lang]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Suppliers — two rows moving in opposite directions */}
      <section className="py-20 md:py-28">
        <div className="wrap">
          <div className="kicker">{labels.suppliers}</div>
          <p className="mt-4 max-w-xl text-ink/60">{labels.suppliersSub}</p>
        </div>
        <div className="mt-10 space-y-2">
          <LogoMarquee orgs={suppliers.slice(0, half)} speed={45} size={{ area: 5200, maxW: 170, maxH: 62 }} />
          <LogoMarquee orgs={suppliers.slice(half)} speed={45} reverse size={{ area: 5200, maxW: 170, maxH: 62 }} />
        </div>
      </section>
    </>
  );
}
