"use client";

import { useRef, useState } from "react";
import { uploadMedia, type Uploaded } from "./media";

export type T = { fr: string; ar: string; en: string };
export const emptyT = (): T => ({ fr: "", ar: "", en: "" });

/** The admin edits every text in the site's three languages, in this order. */
export const ADMIN_LANGS = [
  { k: "ar", name: "العربية", dir: "rtl" },
  { k: "fr", name: "Français", dir: "ltr" },
  { k: "en", name: "English", dir: "ltr" },
] as const;

/** True when a text has Arabic or French but no English yet. */
export const missingEn = (v?: Partial<T> | null) => !!v && !!(v.fr || v.ar) && !(v.en ?? "").trim();

/** How many texts inside a project / list / page still have no English. */
export function countMissingEn(v: unknown): number {
  if (Array.isArray(v)) return v.reduce((n: number, x) => n + countMissingEn(x), 0);
  if (!v || typeof v !== "object") return 0;
  const o = v as Record<string, unknown>;
  const self = typeof o.fr === "string" && typeof o.ar === "string" && missingEn(o as Partial<T>) ? 1 : 0;
  return self + Object.values(o).reduce((n: number, x) => n + countMissingEn(x), 0);
}

/** Amber notice listing the texts still missing in English (they show in French meanwhile). */
export function MissingEn({ n }: { n: number }) {
  if (!n) return null;
  return (
    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
      {n === 1 ? "نص واحد" : `${n} نصوص`} بدون ترجمة إنجليزية (الخانات البرتقالية). يظهر مكانها النص الفرنسي في النسخة الإنجليزية من الموقع إلى أن تكتبها.
    </p>
  );
}

/** One text in Arabic, French and English, side by side. An empty English box is marked. */
export function TField({ label, value, onChange, multi, hint }: { label: string; value?: T | null; onChange: (v: T) => void; multi?: boolean; hint?: string }) {
  const v = value ?? emptyT();
  const Tag = multi ? "textarea" : "input";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-black/45">{hint}</span>}
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {ADMIN_LANGS.map((l) => {
          const empty = l.k === "en" && missingEn(v);
          return (
            <label key={l.k} className="block">
              <span className={`mb-1 flex items-center gap-1.5 text-[0.7rem] font-semibold ${empty ? "text-amber-700" : "text-black/40"}`}>
                {l.name}
                {empty && <span className="rounded-full bg-amber-100 px-1.5 py-px text-[0.65rem]">ناقص — يظهر بالفرنسية</span>}
              </span>
              <Tag
                dir={l.dir}
                rows={multi ? 4 : undefined}
                className={`inp ${empty ? "!border-amber-400 !bg-amber-50/60" : ""}`}
                value={v[l.k] ?? ""}
                onChange={(e) => onChange({ ...emptyT(), ...v, [l.k]: e.target.value })}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function Field({ label, value, onChange, dir = "ltr", placeholder, hint }: { label: string; value?: string | null; onChange: (v: string) => void; dir?: "ltr" | "rtl"; placeholder?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-black/45">{hint}</span>}
      </span>
      <input dir={dir} className="inp" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="inline-flex items-center gap-2 text-sm" aria-pressed={on}>
      <span className={`relative h-5 w-9 rounded-full transition ${on ? "bg-emerald-500" : "bg-black/20"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "start-[1.1rem]" : "start-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

/** Up / down / delete buttons for an item in a list. */
export function RowTools({ i, n, move, remove }: { i: number; n: number; move: (from: number, to: number) => void; remove?: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, i - 1)} title="إلى الأعلى">↑</button>
      <button type="button" className="icon-btn" disabled={i === n - 1} onClick={() => move(i, i + 1)} title="إلى الأسفل">↓</button>
      {remove && (
        <button type="button" className="icon-btn text-red-700" onClick={remove} title="حذف">✕</button>
      )}
    </div>
  );
}

export function moveItem<X>(list: X[], from: number, to: number) {
  const a = [...list];
  const [x] = a.splice(from, 1);
  a.splice(to, 0, x);
  return a;
}

/** Shows a photo or video and lets the admin replace it by uploading a new file. */
export function MediaBox({
  value,
  onChange,
  folder,
  accept = "image/*",
  keepPng,
  height = "h-40",
  contain,
}: {
  value?: { type?: string; src: string; poster?: string } | null;
  onChange: (m: Uploaded) => void;
  folder: string;
  accept?: string;
  keepPng?: boolean;
  height?: string;
  contain?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadMedia(f, folder, { keepPng }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const isVideo = value?.type === "video" || value?.src?.endsWith(".mp4");
  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files[0]);
        }}
        className={`group relative block w-full overflow-hidden rounded-xl border border-dashed border-black/20 bg-black/[0.03] ${height}`}
      >
        {value?.src ? (
          isVideo ? (
            <video src={value.src} poster={value.poster} muted loop autoPlay playsInline className="h-full w-full object-contain" />
          ) : (
             
            <img src={value.src} alt="" className={`h-full w-full ${contain ? "object-contain p-4" : "object-cover"}`} />
          )
        ) : (
          <span className="grid h-full place-items-center text-sm text-black/45">اسحب ملفاً هنا أو اضغط للاختيار</span>
        )}
        <span className={`absolute inset-0 grid place-items-center bg-navy/70 text-sm font-semibold text-white transition ${busy ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {busy ? "جارٍ الضغط والرفع…" : value?.src ? "استبدال" : "رفع ملف"}
        </span>
      </button>
      <input ref={input} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
    </div>
  );
}

export function SaveBar({ dirty, saving, onSave, onCancel }: { dirty: boolean; saving: boolean; onSave: () => void; onCancel?: () => void }) {
  return (
    <div className={`sticky bottom-4 z-20 mt-8 flex items-center justify-between gap-3 rounded-2xl bg-navy px-5 py-3 text-white shadow-xl transition ${dirty || saving ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <span className="text-sm">{saving ? "جارٍ الحفظ والنشر…" : "لديك تعديلات غير محفوظة"}</span>
      <div className="flex gap-2">
        {onCancel && (
          <button type="button" className="btn text-white/80 hover:text-white" onClick={onCancel} disabled={saving}>
            تراجع
          </button>
        )}
        <button type="button" className="btn bg-sun text-ink hover:brightness-105" onClick={onSave} disabled={saving}>
          حفظ ونشر
        </button>
      </div>
    </div>
  );
}
