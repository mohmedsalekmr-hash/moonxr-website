"use client";

import { tr } from "./i18n";
import { useEffect, useState } from "react";
import { services as defServices, steps as defSteps, type Service } from "@/data/i18n";
import { sb } from "./sb";
import { Section } from "./Projects";
import { countMissingEn, FocusPicker, MediaBox, MissingEn, moveItem, RowTools, SaveBar, TField } from "./ui";
import { SERVICE_IMG } from "@/components/ServiceBento";
import { useContentKey } from "./useContent";

export default function HomeTab() {
  const services = useContentKey<Service[]>("services", defServices);
  const [projects, setProjects] = useState<{ slug: string; title: { ar: string; fr: string } }[]>([]);
  useEffect(() => {
    sb.from("projects").select("slug,title").order("position").then(({ data }) => setProjects(data ?? []));
  }, []);
  const steps = useContentKey("steps", defSteps);
  const all = [services, steps];
  const dirty = all.some((x) => x.dirty);
  const saving = all.some((x) => x.saving);
  const err = all.map((x) => x.err).find(Boolean);

  if (!services.value || !steps.value) return <p className="text-black/40">…</p>;
  const sv = services.value;
  const st = steps.value;

  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("الخدمات والخطوات")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("صور الخدمات والخطوات وترتيبها، والمشاريع المرتبطة بكل خدمة. لتعديل نصوصها يكفي الضغط عليها في الموقع.")}</p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn([sv, st])} />

      <Section title={tr("الخدمات")} sub={tr("البطاقات الأربع في قسم «من نحن» وصفحة «من نحن».")}>
        {sv.map((s, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-4">
            <div className="grid flex-1 gap-3">
              <div className="grid gap-3 md:grid-cols-[14rem_1fr]">
                <div>
                  <div className="mb-1.5 text-sm font-semibold">{tr("الصورة")}</div>
                  <MediaBox folder="services" height="h-32" value={{ src: s.image ?? SERVICE_IMG[i % 4].src }} onChange={(m) => services.setValue(sv.map((x, j) => (j === i ? { ...x, image: m.src } : x)))} />
                </div>
                <FocusPicker src={s.image ?? SERVICE_IMG[i % 4].src} value={s.pos ?? SERVICE_IMG[i % 4].pos} onChange={(v) => services.setValue(sv.map((x, j) => (j === i ? { ...x, pos: v } : x)))} />
              </div>
              <TField label={tr("الخدمة {0}", i + 1)} value={s.title} onChange={(v) => services.setValue(sv.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <TField label={tr("الوصف")} multi value={s.text} onChange={(v) => services.setValue(sv.map((x, j) => (j === i ? { ...x, text: v } : x)))} />
              <div>
                <div className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">{tr("المشاريع تحت هذه الخدمة")}<span className="text-xs font-normal text-black/45">{tr("في صفحة الخدمات. بدون اختيار = حسب نوع المشروع تلقائياً")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projects.map((p) => {
                    const on = (s.projects ?? []).includes(p.slug);
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        aria-pressed={on}
                        onClick={() => services.setValue(sv.map((x, j) => (j === i ? { ...x, projects: on ? (x.projects ?? []).filter((y) => y !== p.slug) : [...(x.projects ?? []), p.slug] } : x)))}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${on ? "bg-navy text-white ring-navy" : "bg-white text-black/60 ring-black/10 hover:text-black"}`}
                      >
                        {on ? "✓ " : ""}
                        {p.title?.ar || p.title?.fr || p.slug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <RowTools
              i={i}
              n={sv.length}
              move={(a, b) => services.setValue(moveItem(sv, a, b).map((x, j) => ({ ...x, n: String(j + 1).padStart(2, "0") })))}
            />
          </div>
        ))}
      </Section>

      <Section title={tr("خطوات العمل")} sub={tr("الخطوات الأربع في قسم «طريقة العمل».")}>
        {st.map((s, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-4">
            <div className="grid flex-1 gap-3">
              <div className="grid gap-3 md:grid-cols-[14rem_1fr]">
                <div>
                  <div className="mb-1.5 text-sm font-semibold">{tr("الصورة")}</div>
                  <MediaBox folder="steps" height="h-32" value={s.image ? { src: s.image } : null} onChange={(m) => steps.setValue(st.map((x, j) => (j === i ? { ...x, image: m.src } : x)))} />
                </div>
                <div className="grid gap-3">
                  <FocusPicker src={s.image} value={(s as { pos?: string }).pos} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, pos: v } : x)))} />
                </div>
                <TField label={tr("التعليق تحت الصورة")} value={s.caption} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, caption: v } : x)))} />
              </div>
              <TField label={tr("الخطوة {0}", i + 1)} value={s.title} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <TField label={tr("النص")} multi value={s.text} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, text: v } : x)))} />
            </div>
            <RowTools i={i} n={st.length} move={(a, b) => steps.setValue(moveItem(st, a, b))} />
          </div>
        ))}
      </Section>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={() => all.filter((x) => x.dirty).forEach((x) => x.save())}
        onCancel={() => all.filter((x) => x.dirty).forEach((x) => x.reset())}
      />
    </div>
  );
}
