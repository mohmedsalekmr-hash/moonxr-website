"use client";

import { tr } from "./i18n";
import { useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";
import { countMissingEn, Drawer, emptyT, Field, FocusPicker, MissingEn, MediaBox, moveItem, PageHead, Panel, RowTools, SaveBar, SortList, Status, TField, Toggle, type T } from "./ui";

type Kind = "client" | "partner" | "supplier";
type Org = { id?: string; kind: Kind; name: string; logo: string; ratio: number; url: string | null; role: T | null; body: T | null; points: unknown; position: number; visible: boolean; category?: string | null; image?: string | null; image_pos?: string | null };

const KINDS: { id: Kind; name: string; sub: string }[] = [
  { id: "client", name: tr("العملاء"), sub: tr("الشعارات في شريط «وثقوا بنا» وصفحة الشركاء.") },
  { id: "partner", name: tr("الشركاء"), sub: tr("الشريكان الكبيران مع وصف لكل منهما.") },
  { id: "supplier", name: tr("الموردون التقنيون"), sub: tr("شعارات التقنيات في الشريط المتحرك.") },
];

export default function OrgsTab() {
  const [list, setList] = useState<Org[] | null>(null);
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState<{ kind: Kind; i: number } | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    sb.from("orgs")
      .select("*")
      .order("position")
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        setList((data as Org[]) ?? []);
        setSaved(JSON.stringify(data ?? []));
      });
  }, [tick]);

  if (!list) return <p className="text-black/40">…</p>;
  const dirty = JSON.stringify(list) !== saved;

  const ofKind = (k: Kind) => list.filter((o) => o.kind === k);
  const setKind = (k: Kind, items: Org[]) => setList([...list.filter((o) => o.kind !== k), ...items.map((o, i) => ({ ...o, position: i }))]);
  const update = (k: Kind, i: number, o: Partial<Org>) => setKind(k, ofKind(k).map((x, j) => (j === i ? { ...x, ...o } : x)));

  const save = async () => {
    const bad = list.find((o) => !o.name.trim() || !o.logo);
    if (bad) return setErr(tr("كل شعار يحتاج إلى اسم وصورة"));
    setSaving(true);
    setErr("");
    try {
      const before = (JSON.parse(saved) as Org[]).map((o) => o.id);
      const removed = before.filter((id) => !list.some((o) => o.id === id));
      await saveAndPublish(async () => {
        const ops = [
          ...list.filter((o) => o.id).map(({ id, ...o }) => sb.from("orgs").update(o).eq("id", id!)),
          ...list.filter((o) => !o.id).map((o) => sb.from("orgs").insert(o)),
          ...removed.map((id) => sb.from("orgs").delete().eq("id", id!)),
        ];
        const res = await Promise.all(ops);
        return { error: res.find((r) => r.error)?.error ?? null };
      });
      setTick((t) => t + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("خطأ"));
    }
    setSaving(false);
  };

  const cur = open ? ofKind(open.kind)[open.i] : null;
  const add = (k: Kind) => {
    const items = ofKind(k);
    setKind(k, [...items, { kind: k, name: "", logo: "", ratio: 1, url: null, role: null, body: null, points: null, position: items.length, visible: true, category: k === "supplier" ? "platform" : null }]);
    setOpen({ kind: k, i: items.length });
  };

  return (
    <div>
      <PageHead title={tr("العملاء والشركاء")} sub={tr("الشعارات بخلفية شفافة (PNG أو SVG) تعطي أفضل نتيجة. يُحسب حجم الشعار تلقائياً.")} />
      {err && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn(list)} />

      <div className="mt-4 grid gap-5">
        {KINDS.map((k) => {
          const items = ofKind(k.id);
          return (
            <Panel
              key={k.id}
              flush
              title={`${k.name} · ${items.length}`}
              sub={k.sub}
              actions={
                <button className="btn btn-secondary btn-sm shrink-0" onClick={() => add(k.id)}>
                  {tr("+ إضافة")}
                </button>
              }
            >
              <SortList
                items={items}
                keyOf={(o, i) => o.id ?? `new-${i}`}
                onMove={(a, b) => setKind(k.id, moveItem(items, a, b))}
                onOpen={(_, i) => setOpen({ kind: k.id, i })}
                render={(o) => (
                  <>
                    <div className="relative grid h-11 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-white ring-1 ring-line">
                      {o.logo ? <img src={o.logo} alt="" className="absolute inset-1.5 block h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] object-contain" /> : <span className="text-[0.65rem] text-black/30">{tr("بدون شعار")}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{o.name || <span className="text-black/35">{tr("بدون اسم")}</span>}</div>
                      {o.url && (
                        <div className="truncate text-xs text-black/45">
                          <span dir="ltr">{o.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        </div>
                      )}
                    </div>
                    <Status on={o.visible} onLabel={tr("ظاهر")} />
                  </>
                )}
              />
            </Panel>
          );
        })}
      </div>

      <Drawer
        open={!!cur}
        title={cur?.name || tr("شعار جديد")}
        onClose={() => setOpen(null)}
        footer={
          open && (
            <>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (!confirm(tr("حذف {0}؟", cur?.name || tr("هذا الشعار")))) return;
                  setKind(open.kind, ofKind(open.kind).filter((_, j) => j !== open.i));
                  setOpen(null);
                }}
              >
                {tr("حذف")}
              </button>
              <button className="btn btn-primary ms-auto" onClick={() => setOpen(null)}>
                {tr("تم")}
              </button>
            </>
          )
        }
      >
        {cur && open && (
          <>
            <div>
              <span className="lbl">{tr("الشعار")}</span>
              <MediaBox height="h-32" contain keepPng accept="image/png,image/svg+xml,image/webp,image/jpeg" folder="logos" value={cur.logo ? { src: cur.logo } : null} onChange={(m) => update(open.kind, open.i, { logo: m.src, ratio: Math.round((m.w / m.h) * 100) / 100 })} />
            </div>
            <Field label={tr("الاسم")} value={cur.name} onChange={(v) => update(open.kind, open.i, { name: v })} />
            <Field label={tr("الموقع الإلكتروني")} hint={tr("اختياري")} value={cur.url} placeholder="https://" onChange={(v) => update(open.kind, open.i, { url: v || null })} />
            <Toggle on={cur.visible} label={cur.visible ? tr("ظاهر في الموقع") : tr("مخفي")} onChange={(v) => update(open.kind, open.i, { visible: v })} />
            {open.kind === "supplier" && (
              <>
                <TField label={tr("التخصص (سطر قصير)")} value={cur.role} onChange={(v) => update(open.kind, open.i, { role: v })} />
                <label className="block">
                  <span className="lbl">{tr("المجموعة في صفحة الشركاء")}</span>
                  <select className="inp" value={cur.category ?? "platform"} onChange={(e) => update(open.kind, open.i, { category: e.target.value })}>
                    <option value="industry">{tr("اللحام والصناعة")}</option>
                    <option value="education">{tr("التعليم والصحة")}</option>
                    <option value="safety">{tr("السلامة")}</option>
                    <option value="platform">{tr("المنصّات")}</option>
                  </select>
                </label>
              </>
            )}
            {open.kind === "partner" && (
              <>
                <TField label={tr("الدور")} value={cur.role} onChange={(v) => update(open.kind, open.i, { role: v })} />
                <TField label={tr("الوصف")} multi value={cur.body} onChange={(v) => update(open.kind, open.i, { body: v })} />
                <Points value={(cur.points as T[] | null) ?? []} onChange={(v) => update(open.kind, open.i, { points: v })} />
                <div>
                  <span className="lbl">{tr("صورة القسم في صفحة الشركاء")}</span>
                  <MediaBox folder="partners" height="h-36" value={cur.image ? { src: cur.image } : null} onChange={(m) => update(open.kind, open.i, { image: m.src })} />
                  <p className="hint mt-1.5">{tr("بدون صورة: يستعمل الموقع صورة من المشروع المرتبط بهذا الشريك تلقائياً.")}</p>
                  {cur.image && (
                    <button type="button" className="mt-1 text-xs font-semibold text-red-700 hover:underline" onClick={() => update(open.kind, open.i, { image: null })}>
                      {tr("إزالة الصورة")}
                    </button>
                  )}
                </div>
                <FocusPicker src={cur.image ?? undefined} value={cur.image_pos} onChange={(v) => update(open.kind, open.i, { image_pos: v })} />
              </>
            )}
          </>
        )}
      </Drawer>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onCancel={() => setList(JSON.parse(saved))} />
    </div>
  );
}

/** The short bullet points shown under a partner. */
function Points({ value, onChange }: { value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div className="grid gap-3 rounded-xl border border-line p-4">
      <div className="text-[0.82rem] font-semibold">{tr("نقاط مختصرة")}</div>
      {value.map((p, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1">
            <TField label={tr("النقطة {0}", i + 1)} value={p} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          </div>
          <RowTools i={i} n={value.length} move={(a, b) => onChange(moveItem(value, a, b))} remove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm self-start" onClick={() => onChange([...value, emptyT()])}>{tr("+ نقطة")}</button>
    </div>
  );
}
