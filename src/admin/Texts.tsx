"use client";

import { useState } from "react";
import { ui as defUi } from "@/data/i18n";
import { aboutPage, partnersPage } from "@/data/pages";
import { Section } from "./Projects";
import { ADMIN_LANGS, countMissingEn, MissingEn, SaveBar, TField, type T } from "./ui";
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

type About = typeof aboutPage;
type PP = typeof partnersPage;

export default function TextsTab() {
  const c = useContentKey<UI>("ui", defUi, true);
  const about = useContentKey<About>("about", aboutPage, true);
  const pp = useContentKey<PP>("partners_page", partnersPage, true);
  const [open, setOpen] = useState<string>("hero");
  const all = [c, about, pp];
  if (!c.value || !about.value || !pp.value) return <p className="text-black/40">…</p>;
  const a = about.value;
  const setA = (v: Partial<About>) => about.setValue({ ...a, ...v } as About);
  const ui = c.value as unknown as Record<string, Record<string, T>>;
  const setField = (g: string, k: string, v: T) => c.setValue({ ...c.value!, [g]: { ...ui[g], [k]: v } } as unknown as UI);

  return (
    <div>
      <h1 className="text-2xl font-bold">نصوص الموقع</h1>
      <p className="mt-1 text-sm text-black/55">كل النصوص بالعربية والفرنسية والإنجليزية. الخانة الإنجليزية الفارغة تظهر بالبرتقالي، ويعرض الموقع مكانها النص الفرنسي. التصميم ثابت، فالنص الطويل جداً قد يبدو مزدحماً.</p>
      <MissingEn n={countMissingEn([c.value, about.value, pp.value])} />
      {all.map((x) => x.err).find(Boolean) && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{all.map((x) => x.err).find(Boolean)}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button key={g.id} onClick={() => setOpen(g.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${open === g.id ? "bg-navy text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:text-black"}`}>
            {g.name}
          </button>
        ))}
        {[
          { id: "about", name: "صفحة «من نحن»" },
          { id: "pp", name: "صفحة «الشركاء»" },
        ].map((g) => (
          <button key={g.id} onClick={() => setOpen(g.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${open === g.id ? "bg-navy text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:text-black"}`}>
            {g.name}
          </button>
        ))}
      </div>

      {open === "about" && (
        <Section title="صفحة «من نحن»">
          <TField label="العنوان" value={a.title} onChange={(v) => setA({ title: v })} />
          <TField label="الفقرة تحت العنوان" multi value={a.sub} onChange={(v) => setA({ sub: v })} />
          <TField label="عنوان القطاعات" value={a.sectors} onChange={(v) => setA({ sectors: v })} />
          <TypesField label="القطاعات" value={a.sectorList} onChange={(v) => setA({ sectorList: v } as Partial<About>)} />
          <TField label="«أين نعمل» – العنوان" value={a.where} onChange={(v) => setA({ where: v })} />
          <TField label="«أين نعمل» – النص" multi value={a.whereText} onChange={(v) => setA({ whereText: v })} />
          <TField label="«التزامنا» – العنوان الصغير" value={a.pillars.kicker} onChange={(v) => setA({ pillars: { ...a.pillars, kicker: v } })} />
          <TField label="«التزامنا» – العنوان" value={a.pillars.title} onChange={(v) => setA({ pillars: { ...a.pillars, title: v } })} />
          {a.pillars.items.map((it, i) => (
            <div key={i} className="grid gap-3 rounded-xl bg-black/[0.025] p-4">
              <TField label={`الالتزام ${i + 1}`} value={it.t} onChange={(v) => setA({ pillars: { ...a.pillars, items: a.pillars.items.map((x, j) => (j === i ? { ...x, t: v } : x)) } })} />
              <TField label="الشرح" multi value={it.d} onChange={(v) => setA({ pillars: { ...a.pillars, items: a.pillars.items.map((x, j) => (j === i ? { ...x, d: v } : x)) } })} />
            </div>
          ))}
        </Section>
      )}

      {open === "pp" && (
        <Section title="صفحة «الشركاء»" sub="الشعارات ووصف كل شريك في تبويب «العملاء والشركاء».">
          {(
            [
              ["kicker", "العنوان الصغير"],
              ["title", "العنوان"],
              ["sub", "الفقرة"],
              ["clientsTitle", "عنوان قسم العملاء"],
              ["partnersTitle", "عنوان قسم الشركاء"],
              ["techTitle", "عنوان قسم التقنيات"],
              ["techSub", "فقرة قسم التقنيات"],
              ["view", "«عرض المشروع»"],
            ] as [keyof PP, string][]
          ).map(([k, label]) => (
            <TField key={k} label={label} multi={k === "sub"} value={pp.value![k]} onChange={(v) => pp.setValue({ ...pp.value!, [k]: v } as PP)} />
          ))}
        </Section>
      )}

      {GROUPS.filter((g) => g.id === open).map((g) => (
        <Section key={g.id} title={g.name}>
          {Object.entries(g.fields).map(([k, label]) =>
            ui[g.id]?.[k] ? <TField key={k} label={label} multi={(ui[g.id][k].fr ?? "").length > 70} value={ui[g.id][k]} onChange={(v) => setField(g.id, k, v)} /> : null,
          )}
          {g.id === "contact" && <TypesField value={ui.contact.types as unknown as Lines} onChange={(v) => c.setValue({ ...c.value!, contact: { ...c.value!.contact, types: v } } as unknown as UI)} />}
        </Section>
      ))}

      <SaveBar
        dirty={all.some((x) => x.dirty)}
        saving={all.some((x) => x.saving)}
        onSave={() => all.filter((x) => x.dirty).forEach((x) => x.save())}
        onCancel={() => all.filter((x) => x.dirty).forEach((x) => x.reset())}
      />
    </div>
  );
}

/** The project types offered in the contact form, one per line. */
type Lines = { fr: string[]; ar: string[]; en: string[] };
function TypesField({ value, onChange, label = "أنواع المشاريع في النموذج" }: { value: { readonly fr: readonly string[]; readonly ar: readonly string[]; readonly en?: readonly string[] }; onChange: (v: Lines) => void; label?: string }) {
  const lines = (s: string) => s.split("\n");
  const cur: Lines = { fr: [...value.fr], ar: [...value.ar], en: [...(value.en ?? [])] };
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">
        {label} <span className="text-xs font-normal text-black/45">نوع في كل سطر</span>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {ADMIN_LANGS.map((l) => {
          const empty = l.k === "en" && cur.en.join("").trim() === "";
          return (
            <label key={l.k} className="block">
              <span className={`mb-1 block text-[0.7rem] font-semibold ${empty ? "text-amber-700" : "text-black/40"}`}>{l.name}{empty && " — ناقص"}</span>
              <textarea dir={l.dir} rows={4} className={`inp ${empty ? "!border-amber-400 !bg-amber-50/60" : ""}`} value={cur[l.k].join("\n")} onChange={(e) => onChange({ ...cur, [l.k]: lines(e.target.value) })} />
            </label>
          );
        })}
      </div>
    </div>
  );
}
