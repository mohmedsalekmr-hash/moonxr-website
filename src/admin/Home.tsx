"use client";

import { tr } from "./i18n";
import { useEffect, useState } from "react";
import { services as defServices, steps as defSteps, type Service } from "@/data/i18n";
import { sb } from "./sb";
import { Section } from "./Projects";
import { countMissingEn, MissingEn, moveItem, RowTools, SaveBar, TField, Toggle } from "./ui";
import { useContentKey } from "./useContent";

const LABELS: Record<string, { name: string; sub: string }> = {
  hero: { name: tr("الواجهة"), sub: tr("النظارة ثلاثية الأبعاد والعنوان الكبير") },
  about: { name: tr("من نحن"), sub: tr("الجملة التعريفية والخدمات وشريط الشعارات") },
  work: { name: tr("المشاريع"), sub: tr("شريط المشاريع الأفقي") },
  process: { name: tr("طريقة العمل"), sub: tr("الخطوات الأربع") },
  ecosystem: { name: tr("الشركاء والتقنيات"), sub: tr("الشركاء والموردون") },
  contact: { name: tr("التواصل"), sub: tr("الدعوة إلى التواصل") },
};

type HomeSection = { id: string; visible: boolean };
const DEFAULT_HOME: HomeSection[] = Object.keys(LABELS).map((id) => ({ id, visible: true }));

export default function HomeTab() {
  const home = useContentKey<HomeSection[]>("home_sections", DEFAULT_HOME);
  const services = useContentKey<Service[]>("services", defServices);
  const [projects, setProjects] = useState<{ slug: string; title: { ar: string; fr: string } }[]>([]);
  useEffect(() => {
    sb.from("projects").select("slug,title").order("position").then(({ data }) => setProjects(data ?? []));
  }, []);
  const steps = useContentKey("steps", defSteps);
  const all = [home, services, steps];
  const dirty = all.some((x) => x.dirty);
  const saving = all.some((x) => x.saving);
  const err = all.map((x) => x.err).find(Boolean);

  if (!home.value || !services.value || !steps.value) return <p className="text-black/40">…</p>;
  const h = home.value;
  const sv = services.value;
  const st = steps.value;

  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("الصفحة الرئيسية")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("رتّب الأقسام، أو أخفِ ما لا تريده، وعدّل الخدمات والخطوات. نصوص العناوين في تبويب «نصوص الموقع».")}</p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn([sv, st])} />

      <Section title={tr("ترتيب الأقسام")}>
        <div className="space-y-2">
          {h.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-4 rounded-xl border border-black/[0.07] p-3 ${s.visible ? "bg-white" : "bg-black/[0.03] opacity-60"}`}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy/10 text-sm font-bold text-navy">{i + 1}</span>
              <div className="flex-1">
                <div className="font-semibold">{LABELS[s.id]?.name ?? s.id}</div>
                <div className="text-xs text-black/45">{LABELS[s.id]?.sub}</div>
              </div>
              <Toggle on={s.visible} label={s.visible ? tr("ظاهر") : tr("مخفي")} onChange={(v) => home.setValue(h.map((x) => (x.id === s.id ? { ...x, visible: v } : x)))} />
              <RowTools i={i} n={h.length} move={(a, b) => home.setValue(moveItem(h, a, b))} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={tr("الخدمات")} sub={tr("البطاقات الأربع في قسم «من نحن» وصفحة «من نحن».")}>
        {sv.map((s, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-4">
            <div className="grid flex-1 gap-3">
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
