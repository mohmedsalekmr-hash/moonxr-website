import type { ReactNode } from "react";

export default function PageHead({ kicker, title, sub, children }: { kicker: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <section className="grain relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40">
      <div className="wrap relative">
        <div className="kicker">{kicker}</div>
        <h1 className="font-display mt-5 max-w-4xl text-[2rem] font-bold leading-[1.1] md:text-6xl md:leading-[1.08]">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
