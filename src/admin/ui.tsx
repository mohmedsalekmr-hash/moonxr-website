"use client";

import { useRef, useState } from "react";
import { uploadMedia, type Uploaded } from "./media";

export type T = { fr: string; ar: string };
export const emptyT = (): T => ({ fr: "", ar: "" });

/** A French + Arabic text pair, side by side. */
export function TField({ label, value, onChange, multi, hint }: { label: string; value?: T | null; onChange: (v: T) => void; multi?: boolean; hint?: string }) {
  const v = value ?? emptyT();
  const Tag = multi ? "textarea" : "input";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-black/45">{hint}</span>}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[0.7rem] font-semibold text-black/40">العربية</span>
          <Tag dir="rtl" rows={multi ? 3 : undefined} className="inp" value={v.ar} onChange={(e) => onChange({ ...v, ar: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[0.7rem] font-semibold text-black/40">Français</span>
          <Tag dir="ltr" rows={multi ? 3 : undefined} className="inp" value={v.fr} onChange={(e) => onChange({ ...v, fr: e.target.value })} />
        </label>
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
