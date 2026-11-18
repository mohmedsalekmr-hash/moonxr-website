"use client";

import { useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";
import { Section } from "./Projects";
import { Field, MediaBox, moveItem, RowTools, SaveBar, TField, Toggle, type T } from "./ui";

type Kind = "client" | "partner" | "supplier";
type Org = { id?: string; kind: Kind; name: string; logo: string; ratio: number; url: string | null; role: T | null; body: T | null; points: unknown; position: number; visible: boolean };

const KINDS: { id: Kind; name: string; sub: string }[] = [
  { id: "client", name: "العملاء", sub: "الشعارات في شريط «وثقوا بنا» وصفحة الشركاء." },
  { id: "partner", name: "الشركاء", sub: "الشريكان الكبيران مع وصف لكل منهما." },
  { id: "supplier", name: "الموردون التقنيون", sub: "شعارات التقنيات في الشريط المتحرك." },
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
    if (bad) return setErr("كل شعار يحتاج إلى اسم وصورة");
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
      setErr(e instanceof Error ? e.message : "خطأ");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">العملاء والشركاء</h1>
      <p className="mt-1 text-sm text-black/55">الشعارات بخلفية شفافة (PNG أو SVG) تعطي أفضل نتيجة. يُحسب حجم الشعار تلقائياً.</p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}

      {KINDS.map((k) => {
        const items = ofKind(k.id);
        return (
          <Section key={k.id} title={k.name} sub={k.sub}>
            {items.map((o, i) => (
              <div key={o.id ?? `new-${i}`} className={`grid gap-4 rounded-xl p-4 md:grid-cols-[11rem_1fr_auto] ${o.visible ? "bg-black/[0.025]" : "bg-black/[0.05] opacity-60"}`}>
                <MediaBox height="h-24" contain keepPng accept="image/png,image/svg+xml,image/webp,image/jpeg" folder="logos" value={o.logo ? { src: o.logo } : null} onChange={(m) => update(k.id, i, { logo: m.src, ratio: Math.round((m.w / m.h) * 100) / 100 })} />
                <div className="grid content-start gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="الاسم" value={o.name} onChange={(v) => update(k.id, i, { name: v })} />
                    <Field label="الموقع الإلكتروني" hint="اختياري" value={o.url} placeholder="https://" onChange={(v) => update(k.id, i, { url: v || null })} />
                  </div>
                  {k.id === "partner" && (
                    <>
                      <TField label="الدور" value={o.role} onChange={(v) => update(k.id, i, { role: v })} />
                      <TField label="الوصف" multi value={o.body} onChange={(v) => update(k.id, i, { body: v })} />
                    </>
                  )}
                  <Toggle on={o.visible} label={o.visible ? "ظاهر" : "مخفي"} onChange={(v) => update(k.id, i, { visible: v })} />
                </div>
                <RowTools i={i} n={items.length} move={(a, b) => setKind(k.id, moveItem(items, a, b))} remove={() => confirm(`حذف ${o.name || "هذا الشعار"}؟`) && setKind(k.id, items.filter((_, j) => j !== i))} />
              </div>
            ))}
            <button
              className="btn btn-light self-start"
              onClick={() => setKind(k.id, [...items, { kind: k.id, name: "", logo: "", ratio: 1, url: null, role: null, body: null, points: null, position: items.length, visible: true }])}
            >
              + إضافة
            </button>
          </Section>
        );
      })}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onCancel={() => setList(JSON.parse(saved))} />
    </div>
  );
}
