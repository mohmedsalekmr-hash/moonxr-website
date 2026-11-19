"use client";

import { tr } from "./i18n";
import { useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";
import { Section } from "./Projects";
import { countMissingEn, emptyT, Field, MissingEn, MediaBox, moveItem, RowTools, SaveBar, TField, Toggle, type T } from "./ui";

type Kind = "client" | "partner" | "supplier";
type Org = { id?: string; kind: Kind; name: string; logo: string; ratio: number; url: string | null; role: T | null; body: T | null; points: unknown; position: number; visible: boolean; category?: string | null };

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

  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("العملاء والشركاء")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("الشعارات بخلفية شفافة (PNG أو SVG) تعطي أفضل نتيجة. يُحسب حجم الشعار تلقائياً.")}</p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn(list)} />

      {KINDS.map((k) => {
        const items = ofKind(k.id);
        return (
          <Section key={k.id} title={k.name} sub={k.sub}>
            {items.map((o, i) => (
              <div key={o.id ?? `new-${i}`} className={`grid gap-4 rounded-xl p-4 md:grid-cols-[11rem_1fr_auto] ${o.visible ? "bg-black/[0.025]" : "bg-black/[0.05] opacity-60"}`}>
                <MediaBox height="h-24" contain keepPng accept="image/png,image/svg+xml,image/webp,image/jpeg" folder="logos" value={o.logo ? { src: o.logo } : null} onChange={(m) => update(k.id, i, { logo: m.src, ratio: Math.round((m.w / m.h) * 100) / 100 })} />
                <div className="grid content-start gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label={tr("الاسم")} value={o.name} onChange={(v) => update(k.id, i, { name: v })} />
                    <Field label={tr("الموقع الإلكتروني")} hint={tr("اختياري")} value={o.url} placeholder="https://" onChange={(v) => update(k.id, i, { url: v || null })} />
                  </div>
                  {k.id === "supplier" && (
                    <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
                      <TField label={tr("التخصص (سطر قصير)")} value={o.role} onChange={(v) => update(k.id, i, { role: v })} />
                      <label className="block text-sm">
                        <span className="text-black/60">{tr("المجموعة في صفحة الشركاء")}</span>
                        <select className="inp mt-1" value={o.category ?? "platform"} onChange={(e) => update(k.id, i, { category: e.target.value })}>
                          <option value="industry">{tr("اللحام والصناعة")}</option>
                          <option value="education">{tr("التعليم والصحة")}</option>
                          <option value="safety">{tr("السلامة")}</option>
                          <option value="platform">{tr("المنصّات")}</option>
                        </select>
                      </label>
                    </div>
                  )}
                  {k.id === "partner" && (
                    <>
                      <TField label={tr("الدور")} value={o.role} onChange={(v) => update(k.id, i, { role: v })} />
                      <TField label={tr("الوصف")} multi value={o.body} onChange={(v) => update(k.id, i, { body: v })} />
                      <Points value={(o.points as T[] | null) ?? []} onChange={(v) => update(k.id, i, { points: v })} />
                    </>
                  )}
                  <Toggle on={o.visible} label={o.visible ? tr("ظاهر") : tr("مخفي")} onChange={(v) => update(k.id, i, { visible: v })} />
                </div>
                <RowTools i={i} n={items.length} move={(a, b) => setKind(k.id, moveItem(items, a, b))} remove={() => confirm(tr("حذف {0}؟", o.name || tr("هذا الشعار"))) && setKind(k.id, items.filter((_, j) => j !== i))} />
              </div>
            ))}
            <button
              className="btn btn-light self-start"
              onClick={() => setKind(k.id, [...items, { kind: k.id, name: "", logo: "", ratio: 1, url: null, role: null, body: null, points: null, position: items.length, visible: true, category: k.id === "supplier" ? "platform" : null }])}
            >{tr("+ إضافة")}</button>
          </Section>
        );
      })}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onCancel={() => setList(JSON.parse(saved))} />
    </div>
  );
}

/** The short bullet points shown under a partner. */
function Points({ value, onChange }: { value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div className="grid gap-3 rounded-lg border border-black/[0.07] bg-white p-3">
      <div className="text-sm font-semibold">{tr("نقاط مختصرة")}</div>
      {value.map((p, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1">
            <TField label={tr("النقطة {0}", i + 1)} value={p} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          </div>
          <RowTools i={i} n={value.length} move={(a, b) => onChange(moveItem(value, a, b))} remove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" className="btn btn-light self-start" onClick={() => onChange([...value, emptyT()])}>{tr("+ نقطة")}</button>
    </div>
  );
}
