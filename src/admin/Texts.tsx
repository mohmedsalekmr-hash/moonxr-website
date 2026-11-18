"use client";

import { useState } from "react";
import { ui as defUi } from "@/data/i18n";
import { Section } from "./Projects";
import { SaveBar, TField, type T } from "./ui";
import { useContentKey } from "./useContent";

type UI = typeof defUi;

/** Only the texts the site really shows, with names the admin understands. */
const GROUPS: { id: keyof UI; name: string; fields: Record<string, string> }[] = [
  {
    id: "hero",
    name: "الواجهة الأولى",
    fields: { kicker: "السطر الصغير فوق العنوان", l1: "العنوان – السطر الأول", l2a: "العنوان – الكلمة الملوّنة", l2b: "العنوان – بقية السطر الثاني", sub: "الفقرة تحت العنوان", cta1: "الزر الأول", cta2: "الزر الثاني", scroll: "إشارة التمرير" },
  },
  {
    id: "home",
    name: "أقسام الصفحة الرئيسية",
    fields: {
      aboutKicker: "«من نحن» – العنوان الصغير",
      statementA: "الجملة التعريفية – الجزء الأول",
      statementB: "الجملة التعريفية – الجزء الملوّن",
      statementC: "الجملة التعريفية – الجزء الأخير",
      workTitle: "عنوان قسم المشاريع",
      processKicker: "«طريقة العمل» – العنوان الصغير",
      processTitle: "«طريقة العمل» – العنوان",
      explore: "زر استكشاف النظارة",
      ecoKicker: "«الشركاء» – العنوان الصغير",
      ecoTitle: "«الشركاء» – العنوان",
      ecoSub: "«الشركاء» – الفقرة",
      ecoCta: "«الشركاء» – الزر",
    },
  },
  { id: "services", name: "الخدمات", fields: { kicker: "العنوان الصغير", title: "العنوان" } },
  { id: "work", name: "المشاريع", fields: { kicker: "العنوان الصغير", title: "العنوان", all: "زر «الكل»", seeAll: "زر «كل المشاريع»", view: "«عرض المشروع»" } },
  { id: "partners", name: "صفحة الشركاء", fields: { kicker: "الشركاء", title: "العنوان", clients: "العملاء", suppliers: "الموردون", suppliersSub: "فقرة الموردين" } },
  { id: "cta", name: "الدعوة إلى التواصل", fields: { title: "العنوان", sub: "الفقرة", btn: "الزر" } },
  {
    id: "contact",
    name: "صفحة التواصل",
    fields: { title: "العنوان", sub: "الفقرة", name: "حقل الاسم", org: "حقل المؤسسة", email: "حقل البريد", phone: "حقل الهاتف", type: "حقل نوع المشروع", msg: "حقل الرسالة", send: "زر الإرسال", note: "الملاحظة تحت الزر", direct: "«أو مباشرة»", city: "المدينة" },
  },
  { id: "nav", name: "القائمة", fields: { home: "الرئيسية", projects: "المشاريع", partners: "الشركاء", about: "من نحن", contact: "زر التواصل", menu: "القائمة (الهاتف)", close: "إغلاق" } },
  { id: "project", name: "صفحة المشروع", fields: { next: "«المشروع التالي»", back: "«كل المشاريع»" } },
  { id: "footer", name: "التذييل", fields: { tag: "السطر التعريفي" } },
];

export default function TextsTab() {
  const c = useContentKey<UI>("ui", defUi, true);
  const [open, setOpen] = useState<string>("hero");
  if (!c.value) return <p className="text-black/40">…</p>;
  const ui = c.value as unknown as Record<string, Record<string, T>>;
  const setField = (g: string, k: string, v: T) => c.setValue({ ...c.value!, [g]: { ...ui[g], [k]: v } } as unknown as UI);

  return (
    <div>
      <h1 className="text-2xl font-bold">نصوص الموقع</h1>
      <p className="mt-1 text-sm text-black/55">كل النصوص بالعربية والفرنسية. التصميم ثابت، فالنص الطويل جداً قد يبدو مزدحماً.</p>
      {c.err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{c.err}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button key={g.id} onClick={() => setOpen(g.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${open === g.id ? "bg-navy text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:text-black"}`}>
            {g.name}
          </button>
        ))}
      </div>

      {GROUPS.filter((g) => g.id === open).map((g) => (
        <Section key={g.id} title={g.name}>
          {Object.entries(g.fields).map(([k, label]) =>
            ui[g.id]?.[k] ? <TField key={k} label={label} multi={(ui[g.id][k].fr ?? "").length > 70} value={ui[g.id][k]} onChange={(v) => setField(g.id, k, v)} /> : null,
          )}
          {g.id === "contact" && <TypesField value={ui.contact.types as unknown as { fr: string[]; ar: string[] }} onChange={(v) => c.setValue({ ...c.value!, contact: { ...c.value!.contact, types: v } } as unknown as UI)} />}
        </Section>
      ))}

      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onCancel={c.reset} />
    </div>
  );
}

/** The project types offered in the contact form, one per line. */
function TypesField({ value, onChange }: { value: { fr: string[]; ar: string[] }; onChange: (v: { fr: string[]; ar: string[] }) => void }) {
  const lines = (s: string) => s.split("\n");
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">
        أنواع المشاريع في النموذج <span className="text-xs font-normal text-black/45">نوع في كل سطر</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <textarea dir="rtl" rows={4} className="inp" value={value.ar.join("\n")} onChange={(e) => onChange({ ...value, ar: lines(e.target.value) })} />
        <textarea dir="ltr" rows={4} className="inp" value={value.fr.join("\n")} onChange={(e) => onChange({ ...value, fr: lines(e.target.value) })} />
      </div>
    </div>
  );
}
