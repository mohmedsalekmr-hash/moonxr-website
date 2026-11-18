"use client";

import { services as defServices, steps as defSteps } from "@/data/i18n";
import { Section } from "./Projects";
import { moveItem, RowTools, SaveBar, TField, Toggle } from "./ui";
import { useContentKey } from "./useContent";

const LABELS: Record<string, { name: string; sub: string }> = {
  hero: { name: "الواجهة", sub: "النظارة ثلاثية الأبعاد والعنوان الكبير" },
  about: { name: "من نحن", sub: "الجملة التعريفية والخدمات وشريط الشعارات" },
  work: { name: "المشاريع", sub: "شريط المشاريع الأفقي" },
  process: { name: "طريقة العمل", sub: "الخطوات الأربع" },
  ecosystem: { name: "الشركاء والتقنيات", sub: "الشركاء والموردون" },
  contact: { name: "التواصل", sub: "الدعوة إلى التواصل" },
};

type HomeSection = { id: string; visible: boolean };
const DEFAULT_HOME: HomeSection[] = Object.keys(LABELS).map((id) => ({ id, visible: true }));

export default function HomeTab() {
  const home = useContentKey<HomeSection[]>("home_sections", DEFAULT_HOME);
  const services = useContentKey("services", defServices);
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
      <h1 className="text-2xl font-bold">الصفحة الرئيسية</h1>
      <p className="mt-1 text-sm text-black/55">رتّب الأقسام، أو أخفِ ما لا تريده، وعدّل الخدمات والخطوات. نصوص العناوين في تبويب «نصوص الموقع».</p>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}

      <Section title="ترتيب الأقسام">
        <div className="space-y-2">
          {h.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-4 rounded-xl border border-black/[0.07] p-3 ${s.visible ? "bg-white" : "bg-black/[0.03] opacity-60"}`}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy/10 text-sm font-bold text-navy">{i + 1}</span>
              <div className="flex-1">
                <div className="font-semibold">{LABELS[s.id]?.name ?? s.id}</div>
                <div className="text-xs text-black/45">{LABELS[s.id]?.sub}</div>
              </div>
              <Toggle on={s.visible} label={s.visible ? "ظاهر" : "مخفي"} onChange={(v) => home.setValue(h.map((x) => (x.id === s.id ? { ...x, visible: v } : x)))} />
              <RowTools i={i} n={h.length} move={(a, b) => home.setValue(moveItem(h, a, b))} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="الخدمات" sub="البطاقات الأربع في قسم «من نحن» وصفحة «من نحن».">
        {sv.map((s, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-4">
            <div className="grid flex-1 gap-3">
              <TField label={`الخدمة ${i + 1}`} value={s.title} onChange={(v) => services.setValue(sv.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <TField label="الوصف" multi value={s.text} onChange={(v) => services.setValue(sv.map((x, j) => (j === i ? { ...x, text: v } : x)))} />
            </div>
            <RowTools
              i={i}
              n={sv.length}
              move={(a, b) => services.setValue(moveItem(sv, a, b).map((x, j) => ({ ...x, n: String(j + 1).padStart(2, "0") })))}
            />
          </div>
        ))}
      </Section>

      <Section title="خطوات العمل" sub="الخطوات الأربع في قسم «طريقة العمل».">
        {st.map((s, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-4">
            <div className="grid flex-1 gap-3">
              <TField label={`الخطوة ${i + 1}`} value={s.title} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <TField label="النص" multi value={s.text} onChange={(v) => steps.setValue(st.map((x, j) => (j === i ? { ...x, text: v } : x)))} />
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
