import type { ReactNode } from "react";

/** The one section heading used across the site: kicker line, title, optional lead text and action. */
export default function SectionHeader({
  kicker,
  title,
  lead,
  action,
  dark = false,
  center = false,
}: {
  kicker: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  const head = (
    <div className={center ? "mx-auto text-center" : ""}>
      <div className={`kicker ${center ? "justify-center" : ""} ${dark ? "!text-sun" : ""}`}>{kicker}</div>
      <h2 className={`section-title ${center ? "mx-auto" : ""}`}>{title}</h2>
      {lead && <p className={`section-lead ${center ? "mx-auto" : ""} ${dark ? "!text-white/60" : ""}`}>{lead}</p>}
    </div>
  );
  if (!action) return head;
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      {head}
      <div className="shrink-0">{action}</div>
    </div>
  );
}
