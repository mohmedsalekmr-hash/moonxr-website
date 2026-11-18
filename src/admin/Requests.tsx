"use client";

import { useEffect, useState } from "react";
import { sb } from "./sb";

type Req = {
  id: string;
  created_at: string;
  name: string;
  org: string | null;
  email: string;
  phone: string | null;
  kind: string | null;
  message: string;
  lang: "fr" | "ar";
  status: "new" | "done";
  note: string | null;
};

const when = (d: string) =>
  new Date(d).toLocaleString("ar", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Requests sent from the website contact form. */
export default function RequestsTab({ onCount }: { onCount?: (n: number) => void }) {
  const [list, setList] = useState<Req[] | null>(null);
  const [filter, setFilter] = useState<"new" | "done" | "all">("new");
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    sb.from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        const rows = (data as Req[]) ?? [];
        setList(rows);
        onCount?.(rows.filter((r) => r.status === "new").length);
      });
  }, [tick, onCount]);

  const update = async (id: string, patch: Partial<Req>) => {
    const { error } = await sb.from("contact_requests").update(patch).eq("id", id);
    if (error) setErr(error.message);
    setTick((t) => t + 1);
  };
  const remove = async (r: Req) => {
    if (!confirm(`حذف طلب «${r.name}» نهائياً؟ لا يمكن التراجع.`)) return;
    const { error } = await sb.from("contact_requests").delete().eq("id", r.id);
    if (error) setErr(error.message);
    setTick((t) => t + 1);
  };

  const shown = (list ?? []).filter((r) => filter === "all" || r.status === filter);
  const count = (s: Req["status"]) => (list ?? []).filter((r) => r.status === s).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">الطلبات</h1>
      <p className="mt-1 text-sm text-black/55">
        كل رسالة يرسلها زائر من صفحة «تواصل معنا» تصل هنا. بعد الرد عليها اضغط «تم الرد» لتنتقل إلى الأرشيف.
      </p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}

      <div className="mt-5 flex gap-2">
        {(
          [
            ["new", `جديدة (${count("new")})`],
            ["done", `تم الرد (${count("done")})`],
            ["all", "الكل"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={`btn ${filter === id ? "btn-dark" : "btn-light"}`} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
        <button className="btn btn-light ms-auto" onClick={() => setTick((t) => t + 1)}>
          تحديث ↻
        </button>
      </div>

      <div className="card mt-4 divide-y divide-black/[0.06]">
        {list === null && <p className="p-5 text-black/40">…</p>}
        {list && shown.length === 0 && (
          <p className="p-5 text-sm text-black/45">{filter === "new" ? "لا توجد طلبات جديدة." : "لا شيء هنا."}</p>
        )}
        {shown.map((r) => {
          const isOpen = open === r.id;
          const reply = `mailto:${r.email}?subject=${encodeURIComponent(r.lang === "ar" ? "ردّ Moon XR على طلبكم" : "Moon XR — réponse à votre demande")}`;
          return (
            <div key={r.id} className="p-4">
              <button className="flex w-full flex-wrap items-center gap-3 text-start" onClick={() => setOpen(isOpen ? null : r.id)}>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.status === "new" ? "bg-sun" : "bg-black/15"}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {r.name}
                    {r.org ? <span className="font-normal text-black/50"> · {r.org}</span> : null}
                  </div>
                  <div className="truncate text-xs text-black/45">
                    {when(r.created_at)} · {r.kind ?? "—"} · {r.lang === "ar" ? "عربي" : "فرنسي"}
                  </div>
                </div>
                <span className="text-black/35">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen && (
                <div className="mt-4 space-y-4 ps-5">
                  <p className="whitespace-pre-wrap rounded-lg bg-black/[0.03] p-4 text-sm leading-relaxed" dir="auto">
                    {r.message}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm" dir="ltr">
                    <a className="text-navy underline" href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && <a className="text-navy underline" href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a>}
                  </div>
                  <label className="block text-xs text-black/55">
                    ملاحظة داخلية (لا يراها الزائر)
                    <textarea
                      className="inp mt-1"
                      rows={2}
                      defaultValue={r.note ?? ""}
                      onBlur={(e) => e.target.value !== (r.note ?? "") && update(r.id, { note: e.target.value || null })}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <a className="btn btn-dark" href={reply}>الرد بالبريد</a>
                    {r.phone && (
                      <a className="btn btn-light" href={`https://wa.me/${r.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer">
                        واتساب
                      </a>
                    )}
                    {r.status === "new" ? (
                      <button className="btn btn-light" onClick={() => update(r.id, { status: "done" })}>تم الرد ✓</button>
                    ) : (
                      <button className="btn btn-light" onClick={() => update(r.id, { status: "new" })}>إرجاع إلى الجديدة</button>
                    )}
                    <button className="btn btn-danger ms-auto" onClick={() => remove(r)}>حذف</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
