"use client";

import { tr } from "./i18n";
import { useEffect, useRef, useState } from "react";
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
      {n === 1 ? tr("نص واحد") : tr("{0} نصوص", n)} {tr("بدون ترجمة إنجليزية (الخانات البرتقالية). يظهر مكانها النص الفرنسي في النسخة الإنجليزية من الموقع إلى أن تكتبها.")}</p>
  );
}

/**
 * One text in Arabic, French and English. One language is shown at a time (tabs, like Shopify's translations);
 * a dot on a tab marks a language still empty, and an empty English shows the French meanwhile.
 */
export function TField({ label, value, onChange, multi, hint }: { label: string; value?: T | null; onChange: (v: T) => void; multi?: boolean; hint?: string }) {
  const v = value ?? emptyT();
  const [k, setK] = useState<"ar" | "fr" | "en">("ar");
  const l = ADMIN_LANGS.find((x) => x.k === k)!;
  const enMissing = missingEn(v);
  const Tag = multi ? "textarea" : "input";
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <span className="text-[0.82rem] font-semibold text-black/80">
          {label}
          {hint && <span className="hint ms-2">{hint}</span>}
        </span>
        <div className="seg" role="group" aria-label={tr("اللغة")}>
          {ADMIN_LANGS.map((x) => {
            const empty = !(v[x.k] ?? "").trim();
            return (
              <button key={x.k} type="button" aria-pressed={k === x.k} onClick={() => setK(x.k)} title={x.name}>
                {x.k === "ar" ? "ع" : x.k.toUpperCase()}
                {empty && <span className={`absolute end-1 top-1 h-1.5 w-1.5 rounded-full ${x.k === "en" && enMissing ? "bg-amber-500" : "bg-black/25"}`} />}
              </button>
            );
          })}
        </div>
      </div>
      <Tag
        key={k}
        dir={l.dir}
        rows={multi ? 4 : undefined}
        className={`inp ${k === "en" && enMissing ? "!border-amber-300 !bg-amber-50/50" : ""}`}
        value={v[k] ?? ""}
        placeholder={k === "en" && enMissing ? v.fr : undefined}
        onChange={(e) => onChange({ ...emptyT(), ...v, [k]: e.target.value })}
      />
      {k === "en" && enMissing && <p className="mt-1 text-xs text-amber-700">{tr("ناقص — يظهر بالفرنسية")}</p>}
    </div>
  );
}

export function Field({ label, value, onChange, dir = "ltr", placeholder, hint }: { label: string; value?: string | null; onChange: (v: string) => void; dir?: "ltr" | "rtl"; placeholder?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="lbl">
        {label}
        {hint && <span className="hint ms-2">{hint}</span>}
      </span>
      <input dir={dir} className="inp" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="inline-flex items-center gap-2 text-sm" aria-pressed={on}>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-navy" : "bg-black/20"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "start-[1.1rem]" : "start-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

const Ico = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

/** Up / down / delete buttons for an item in a list. */
export function RowTools({ i, n, move, remove }: { i: number; n: number; move: (from: number, to: number) => void; remove?: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, i - 1)} title={tr("إلى الأعلى")} aria-label={tr("إلى الأعلى")}>
        <Ico d="M12 19V5M6 11l6-6 6 6" />
      </button>
      <button type="button" className="icon-btn" disabled={i === n - 1} onClick={() => move(i, i + 1)} title={tr("إلى الأسفل")} aria-label={tr("إلى الأسفل")}>
        <Ico d="M12 5v14M6 13l6 6 6-6" />
      </button>
      {remove && (
        <button type="button" className="icon-btn danger" onClick={remove} title={tr("حذف")} aria-label={tr("حذف")}>
          <Ico d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
        </button>
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
      setErr(e instanceof Error ? e.message : tr("فشل الرفع"));
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
        className={`group relative block w-full overflow-hidden rounded-xl border border-dashed border-black/20 bg-canvas transition hover:border-brand/50 ${height}`}
      >
        {value?.src ? (
          isVideo ? (
            <video src={value.src} poster={value.poster} muted loop autoPlay playsInline className="h-full w-full object-contain" />
          ) : (
             
            <img src={value.src} alt="" className={`h-full w-full ${contain ? "object-contain p-4" : "object-cover"}`} />
          )
        ) : (
          <span className="grid h-full place-items-center text-sm text-black/45">{tr("اسحب ملفاً هنا أو اضغط للاختيار")}</span>
        )}
        <span className={`absolute inset-0 grid place-items-center bg-navy/70 text-sm font-semibold text-white transition ${busy ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {busy ? tr("جارٍ الضغط والرفع…") : value?.src ? tr("استبدال") : tr("رفع ملف")}
        </span>
      </button>
      <input ref={input} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
    </div>
  );
}

/** True while any editor on screen has changes that are not saved yet (read by the admin shell). */
const pending = new Set<symbol>();
export const hasUnsaved = () => pending.size > 0;

export function SaveBar({ dirty, saving, onSave, onCancel }: { dirty: boolean; saving: boolean; onSave: () => void; onCancel?: () => void }) {
  const [id] = useState(() => Symbol("savebar"));
  useEffect(() => {
    if (dirty) pending.add(id);
    else pending.delete(id);
    return () => {
      pending.delete(id);
    };
  }, [dirty, id]);
  // Ctrl/⌘ + S saves
  useEffect(() => {
    if (!dirty) return;
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!saving) onSave();
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [dirty, saving, onSave]);
  if (!dirty && !saving) return null;
  // Like Shopify: while there are changes, a dark bar covers the top of the page with «discard» and «save».
  return (
    <div className="fixed inset-x-0 top-0 z-40 lg:start-60" style={{ animation: "mx-down .2s ease-out" }}>
      <div className="flex h-14 items-center gap-3 bg-ink px-4 text-white shadow-lg md:px-8 lg:h-16">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-sun" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M12 8v5M12 16h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
        </svg>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{saving ? tr("جارٍ الحفظ والنشر…") : tr("لديك تعديلات غير محفوظة")}</span>
        {onCancel && (
          <button type="button" className="btn btn-sm border-white/20 bg-transparent text-white hover:bg-white/10" onClick={onCancel} disabled={saving}>
            {tr("تراجع")}
          </button>
        )}
        <button type="button" className="btn btn-sm btn-accent" onClick={onSave} disabled={saving}>
          {tr("حفظ ونشر")}
        </button>
      </div>
    </div>
  );
}

/** Click the point of the photo that must always stay visible when it is cropped. */
export function FocusPicker({ src, value, onChange }: { src?: string; value?: string | null; onChange: (v: string) => void }) {
  const [x, y] = (value ?? "50% 50%").split(" ").map((v) => parseFloat(v) || 50);
  if (!src) return null;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
        {tr("مركز الصورة")}
        <span className="text-xs font-normal text-black/45">{tr("اضغط على الجزء الذي يجب أن يبقى ظاهراً دائماً")}</span>
      </div>
      <div className="grid h-28 w-full place-items-center overflow-hidden rounded-xl bg-black/[0.05]">
        <button
          type="button"
          className="relative block cursor-crosshair"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = Math.round(((e.clientX - r.left) / r.width) * 100);
            const py = Math.round(((e.clientY - r.top) / r.height) * 100);
            onChange(`${px}% ${py}%`);
          }}
        >
          <img src={src} alt="" className="block h-auto max-h-28 w-auto max-w-full" />
          <span className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sun shadow" style={{ left: `${x}%`, top: `${y}%` }} />
        </button>
      </div>
    </div>
  );
}
