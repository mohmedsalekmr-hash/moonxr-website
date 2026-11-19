"use client";

import { useEffect, useState } from "react";
import { sb } from "./sb";
import { countMissingEn } from "./ui";
import { Icon, ICON, type Go } from "./Shell";
import { adminLang, adminLocale, tr } from "./i18n";
import { KEYS } from "./History";

type Req = { id: string; created_at: string; name: string; org: string | null; kind: string | null; status: "new" | "done" };
type Hist = { id: number; table_name: string; row_key: string; op: string; label: string | null; changed_at: string };

const ago = (d: string) => {
  const m = Math.round((Date.now() - new Date(d).getTime()) / 60000);
  const rtf = new Intl.RelativeTimeFormat(adminLocale(), { numeric: "auto" });
  if (m < 60) return rtf.format(-m, "minute");
  if (m < 60 * 24) return rtf.format(-Math.round(m / 60), "hour");
  return rtf.format(-Math.round(m / 1440), "day");
};

/** First screen after login: what needs attention, and shortcuts. */
export default function Overview({ go, email }: { go: Go; email: string }) {
  const [req, setReq] = useState<Req[] | null>(null);
  const [hist, setHist] = useState<Hist[] | null>(null);
  const [stats, setStats] = useState<{ published: number; hidden: number; logos: number; missing: number } | null>(null);

  useEffect(() => {
    sb.from("contact_requests").select("id,created_at,name,org,kind,status").order("created_at", { ascending: false }).limit(50).then(({ data }) => setReq((data as Req[]) ?? []));
    sb.from("content_history").select("id,table_name,row_key,op,label,changed_at").order("changed_at", { ascending: false }).limit(6).then(({ data }) => setHist((data as Hist[]) ?? []));
    Promise.all([sb.from("projects").select("*"), sb.from("orgs").select("*"), sb.from("site_content").select("value")]).then(([p, o, s]) => {
      const projects = (p.data ?? []) as { published: boolean }[];
      setStats({
        published: projects.filter((x) => x.published).length,
        hidden: projects.filter((x) => !x.published).length,
        logos: (o.data ?? []).length,
        missing: countMissingEn([p.data, o.data, s.data]),
      });
    });
  }, []);

  const fresh = (req ?? []).filter((r) => r.status === "new");
  const hour = new Date().getHours();
  const hello = hour < 12 ? tr("صباح الخير") : hour < 18 ? tr("مساء الخير") : tr("مساء الخير");
  const name = email.split("@")[0];
  const site = `/${adminLang()}`;

  return (
    <div>
      <p className="text-sm font-semibold text-black/45">{new Date().toLocaleDateString(adminLocale(), { weekday: "long", day: "numeric", month: "long" })}</p>
      <h1 className="mt-1 text-[1.75rem] font-bold leading-tight">
        {hello}{tr("،")}{" "}<span className="text-navy">{name}</span>
      </h1>

      {/* what needs attention */}
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card
          tone={fresh.length ? "sun" : "plain"}
          icon={ICON.requests}
          value={req ? fresh.length : "…"}
          label={fresh.length === 1 ? tr("طلب جديد") : tr("طلبات جديدة")}
          action={tr("فتح الطلبات")}
          onClick={() => go("requests")}
        />
        <Card
          tone={stats?.missing ? "amber" : "plain"}
          icon={ICON.globe}
          value={stats ? stats.missing : "…"}
          label={tr("نصوص بدون إنجليزية")}
          action={stats?.missing ? tr("إكمال الترجمة") : tr("كل شيء مترجم ✓")}
          onClick={() => go("texts")}
        />
        <Card icon={ICON.projects} value={stats ? stats.published : "…"} label={stats?.hidden ? tr("مشاريع منشورة · {0} مخفي", stats.hidden) : tr("مشاريع منشورة")} action={tr("إدارة المشاريع")} onClick={() => go("projects")} />
        <Card icon={ICON.orgs} value={stats ? stats.logos : "…"} label={tr("شعارات العملاء والشركاء")} action={tr("إدارة الشعارات")} onClick={() => go("orgs")} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* latest requests */}
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{tr("آخر الطلبات")}</h2>
            <button className="text-sm font-semibold text-navy hover:underline" onClick={() => go("requests")}>{tr("الكل ←")}</button>
          </div>
          <ul className="mt-3 divide-y divide-black/[0.06]">
            {req === null && <li className="py-6 text-center text-sm text-black/40">…</li>}
            {req?.length === 0 && <li className="py-6 text-center text-sm text-black/40">{tr("لا توجد طلبات بعد.")}</li>}
            {req?.slice(0, 5).map((r) => (
              <li key={r.id}>
                <button className="flex w-full items-center gap-3 py-3 text-start" onClick={() => go("requests")}>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${r.status === "new" ? "bg-sun" : "bg-black/15"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {r.name}
                      {r.org && <span className="font-normal text-black/45"> · {r.org}</span>}
                    </span>
                    <span className="block truncate text-xs text-black/45">{r.kind ?? "—"}</span>
                  </span>
                  <span className="shrink-0 text-xs text-black/40">{ago(r.created_at)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* shortcuts + recent edits */}
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="font-bold">{tr("اختصارات")}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Quick icon={ICON.plus} label={tr("مشروع جديد")} onClick={() => go("projects", "new")} />
              <Quick icon={ICON.texts} label={tr("تعديل النصوص")} onClick={() => go("texts")} />
              <Quick icon={ICON.seo} label={tr("صورة المشاركة")} onClick={() => go("seo")} />
              <a href={site} target="_blank" className="flex items-center gap-2 rounded-xl bg-black/[0.035] px-3 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/[0.07] hover:text-black">
                <Icon d={ICON.external} className="h-4 w-4 text-navy" />{tr("عرض الموقع")}</a>
            </div>
          </section>
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{tr("آخر التعديلات")}</h2>
              <button className="text-sm font-semibold text-navy hover:underline" onClick={() => go("history")}>{tr("السجل ←")}</button>
            </div>
            <ul className="mt-2 space-y-2.5">
              {hist?.length === 0 && <li className="py-3 text-sm text-black/40">{tr("لا توجد تعديلات بعد.")}</li>}
              {hist?.map((h) => (
                <li key={h.id} className="flex items-center gap-3 text-sm">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${h.op === "DELETE" ? "bg-red-50 text-red-700" : "bg-navy/[0.07] text-navy"}`}>
                    <Icon d={h.op === "DELETE" ? ICON.logout : ICON.check} className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{h.table_name === "site_content" ? (KEYS[h.row_key] ?? h.row_key) : h.label || h.row_key}</span>
                  <span className="shrink-0 text-xs text-black/40">{ago(h.changed_at)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, value, label, action, onClick, tone = "plain" }: { icon: string; value: number | string; label: string; action: string; onClick: () => void; tone?: "plain" | "sun" | "amber" }) {
  const t = { plain: "bg-white", sun: "bg-sun/15 ring-sun/40", amber: "bg-amber-50 ring-amber-200" }[tone];
  return (
    <button onClick={onClick} className={`group flex flex-col rounded-2xl p-4 text-start sm:p-5 ring-1 ring-black/[0.07] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(20,36,84,0.6)] ${t}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy/[0.07] text-navy">
        <Icon d={icon} className="h-[1.1rem] w-[1.1rem]" />
      </span>
      <span className="mt-3 text-2xl font-bold tabular-nums sm:mt-4 sm:text-3xl">{value}</span>
      <span className="mt-0.5 text-[0.8rem] leading-snug text-black/55 sm:text-sm">{label}</span>
      <span className="mt-3 text-xs font-semibold text-navy opacity-70 transition group-hover:opacity-100">{action} {adminLang() === "ar" ? "←" : "→"}</span>
    </button>
  );
}

function Quick({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-xl bg-black/[0.035] px-3 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/[0.07] hover:text-black">
      <Icon d={icon} className="h-4 w-4 text-navy" />
      {label}
    </button>
  );
}
