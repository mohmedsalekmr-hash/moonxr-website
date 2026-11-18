"use client";

import { useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";

type Entry = {
  id: number;
  table_name: "projects" | "orgs" | "site_content";
  row_key: string;
  op: "UPDATE" | "DELETE";
  old: Record<string, unknown>;
  label: string | null;
  changed_at: string;
};

const KIND: Record<Entry["table_name"], string> = { projects: "مشروع", orgs: "شعار", site_content: "محتوى" };
const KEYS: Record<string, string> = {
  ui: "نصوص الموقع",
  about: "صفحة «من نحن»",
  partners_page: "صفحة «الشركاء»",
  contact: "بيانات التواصل",
  home_sections: "ترتيب أقسام الرئيسية",
  services: "الخدمات",
  steps: "خطوات العمل",
};

const when = (d: string) =>
  new Date(d).toLocaleString("ar", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default function HistoryTab() {
  const [list, setList] = useState<Entry[] | null>(null);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    sb.from("content_history")
      .select("id,table_name,row_key,op,old,label,changed_at")
      .order("changed_at", { ascending: false })
      .limit(150)
      .then(({ data, error }) => {
        if (error) setMsg({ ok: false, text: error.message });
        setList((data as Entry[]) ?? []);
      });
  }, [tick]);

  const restore = async (e: Entry) => {
    if (!confirm("استرجاع هذه النسخة؟ الوضع الحالي سيُحفظ في السجل أيضاً، فتستطيع التراجع.")) return;
    setBusy(e.id);
    setMsg(null);
    try {
      const row = { ...e.old };
      delete row.updated_at;
      await saveAndPublish(() =>
        e.table_name === "site_content"
          ? sb.from("site_content").upsert(row, { onConflict: "key" })
          : sb.from(e.table_name).upsert(row, { onConflict: "id" }),
      );
      setMsg({ ok: true, text: "تم الاسترجاع ونشره على الموقع" });
      setTick((t) => t + 1);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "خطأ" });
    }
    setBusy(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">السجل</h1>
      <p className="mt-1 text-sm text-black/55">
        كل تعديل أو حذف يحفظ النسخة التي كانت قبله لمدة 90 يوماً. إذا أخطأت في شيء، استرجع النسخة السابقة من هنا.
      </p>
      {msg && <p className={`mt-4 rounded-lg p-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <div className="card mt-6 divide-y divide-black/[0.06]">
        {list === null && <p className="p-5 text-black/40">…</p>}
        {list?.length === 0 && <p className="p-5 text-sm text-black/45">لا توجد تعديلات بعد.</p>}
        {list?.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.op === "DELETE" ? "bg-red-50 text-red-700" : "bg-navy/10 text-navy"}`}>
              {e.op === "DELETE" ? "حذف" : "تعديل"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {KIND[e.table_name]}: {e.table_name === "site_content" ? (KEYS[e.row_key] ?? e.row_key) : e.label}
              </div>
              <div className="text-xs text-black/45">{when(e.changed_at)}</div>
            </div>
            <button className="btn btn-light" disabled={busy !== null} onClick={() => restore(e)}>
              {busy === e.id ? "…" : "استرجاع هذه النسخة"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
