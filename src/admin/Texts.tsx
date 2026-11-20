"use client";

import { tr } from "./i18n";
import { useState } from "react";
import { ui as defUi } from "@/data/i18n";
import { aboutPage, partnersPage } from "@/data/pages";
import { explorer as defExplorer, steps as defSteps, type Step } from "@/data/explorer";
import { Section } from "./Projects";
import { ADMIN_LANGS, countMissingEn, MissingEn, SaveBar, TField, type T } from "./ui";
import { merge, useContentKey } from "./useContent";

type UI = typeof defUi;
type About = typeof aboutPage;
type PP = typeof partnersPage;
type Ex = { explorer: typeof defExplorer; steps: Step[] };

/** A text of the `ui` content: its path ("hero.l1", or "trust" for a single text) and what the admin calls it. */
type F = [path: string, label: string];

/**
 * The site's texts, grouped page by page, in the order a visitor meets them.
 * Every text the site shows is here; long texts get a bigger box automatically.
 */
export const PAGES: { id: string; name: string; sub?: string; fields: F[] }[] = [
  {
    id: "home",
    name: tr("الصفحة الرئيسية"),
    fields: [
      ["hero.kicker", tr("الواجهة – السطر الصغير فوق العنوان")],
      ["hero.l1", tr("الواجهة – العنوان، السطر الأول")],
      ["hero.l2a", tr("الواجهة – العنوان، الكلمة الملوّنة")],
      ["hero.l2b", tr("الواجهة – العنوان، بقية السطر الثاني")],
      ["hero.sub", tr("الواجهة – الفقرة تحت العنوان")],
      ["hero.cta1", tr("الواجهة – الزر الأول")],
      ["hero.cta2", tr("الواجهة – الزر الثاني")],
      ["home.explore", tr("زر استكشاف النظارة")],
      ["home.aboutKicker", tr("«من نحن» – العنوان الصغير")],
      ["home.statementA", tr("الجملة التعريفية – الجزء الأول")],
      ["home.statementB", tr("الجملة التعريفية – الجزء الملوّن")],
      ["home.statementC", tr("الجملة التعريفية – الجزء الأخير")],
      ["trust", tr("عنوان شريط الشعارات «وثقوا بنا»")],
      ["home.workTitle", tr("عنوان قسم المشاريع")],
      ["home.swipeHint", tr("تلميح السحب تحت المشاريع (الهاتف)")],
      ["home.processKicker", tr("«طريقة العمل» – العنوان الصغير")],
      ["home.processTitle", tr("«طريقة العمل» – العنوان")],
      ["home.ecoKicker", tr("«الشركاء» – العنوان الصغير")],
      ["home.ecoTitle", tr("«الشركاء» – العنوان")],
      ["home.ecoSub", tr("«الشركاء» – الفقرة")],
      ["home.partnerLabel", tr("«الشركاء» – كلمة «شريك» على البطاقة")],
      ["home.allTech", tr("«الشركاء» – رابط «كل التقنيات»")],
      ["home.ecoCta", tr("«الشركاء» – الزر")],
      ["photos.kicker", tr("عنوان الصور الصغير «بالصور»")],
    ],
  },
  {
    id: "projects",
    name: tr("المشاريع"),
    sub: tr("قائمة المشاريع وصفحة كل مشروع. محتوى كل مشروع نفسه في تبويب «المشاريع»."),
    fields: [
      ["work.kicker", tr("قائمة المشاريع – العنوان الصغير")],
      ["work.title", tr("قائمة المشاريع – العنوان")],
      ["work.sub", tr("قائمة المشاريع – الفقرة")],
      ["work.all", tr("زر التصفية «الكل»")],
      ["work.seeAll", tr("زر «كل المشاريع»")],
      ["work.view", tr("رابط «عرض المشروع»")],
      ["work.featured", tr("«مشروع مميّز» فوق أول مشروع")],
      ["work.grid", tr("زر عرض «شبكة»")],
      ["work.list", tr("زر عرض «قائمة»")],
      ["project.client", tr("صفحة المشروع – «العميل»")],
      ["project.place", tr("صفحة المشروع – «المكان»")],
      ["project.gallery", tr("صفحة المشروع – «بالصور»")],
      ["project.next", tr("صفحة المشروع – «المشروع التالي»")],
      ["story.hintDesk", tr("صفحة المشروع – تلميح التمرير (الكمبيوتر)")],
      ["story.hintTouch", tr("صفحة المشروع – تلميح السحب (الهاتف)")],
      ["story.sound", tr("زر تشغيل الصوت")],
      ["story.mute", tr("زر كتم الصوت")],
    ],
  },
  {
    id: "services",
    name: tr("الخدمات"),
    sub: tr("بطاقات الخدمات نفسها، والمشاريع التي تظهر تحت كل خدمة، في تبويب «الصفحة الرئيسية»."),
    fields: [
      ["services.kicker", tr("الرئيسية – العنوان الصغير")],
      ["services.title", tr("الرئيسية – العنوان")],
      ["servicesPage.title", tr("صفحة الخدمات – العنوان")],
      ["servicesPage.sub", tr("صفحة الخدمات – الفقرة")],
      ["servicesPage.seen", tr("«في مشاريعنا» تحت كل خدمة")],
      ["process.kicker", tr("«كيف نعمل» – العنوان الصغير")],
    ],
  },
  {
    id: "partners",
    name: tr("الشركاء"),
    sub: tr("الشعارات ووصف كل شريك في تبويب «العملاء والشركاء»."),
    fields: [
      ["partners.kicker", tr("العنوان الصغير")],
      ["partners.clients", tr("«العملاء»")],
      ["partners.suppliers", tr("«الموردون التقنيون»")],
      ["partners.suppliersSub", tr("فقرة الموردين")],
    ],
  },
  { id: "about", name: tr("من نحن"), fields: [["aboutPage.pathK", tr("«مسيرتنا» – العنوان الصغير")], ["aboutPage.pathT", tr("«مسيرتنا» – العنوان")], ["aboutPage.dev", tr("«قيد التطوير»")], ["aboutPage.all", tr("زر «كل المشاريع»")]] },
  {
    id: "contact",
    name: tr("صفحة التواصل"),
    fields: [
      ["contact.title", tr("العنوان")],
      ["contact.sub", tr("الفقرة")],
      ["contactPage.call", tr("زر «اتصال»")],
      ["contactPage.mail", tr("زر «البريد»")],
      ["contactPage.next", tr("«كيف نعمل معكم»")],
      ["contactPage.form", tr("عنوان النموذج")],
      ["contactList.email", tr("قائمة التواصل – «البريد»")],
      ["contactList.phone", tr("قائمة التواصل – «الهاتف»")],
      ["contactList.place", tr("قائمة التواصل – «العنوان»")],
      ["contactList.placeV", tr("قائمة التواصل – العنوان نفسه")],
      ["contactList.time", tr("قائمة التواصل – «مدة الرد»")],
      ["contactList.timeV", tr("قائمة التواصل – مدة الرد نفسها")],
      ["contact.name", tr("حقل الاسم")],
      ["contact.org", tr("حقل المؤسسة")],
      ["contact.email", tr("حقل البريد")],
      ["contact.phone", tr("حقل الهاتف")],
      ["contact.type", tr("حقل نوع المشروع")],
      ["contact.msg", tr("حقل الرسالة")],
      ["contact.send", tr("زر الإرسال")],
      ["form.sending", tr("أثناء الإرسال")],
      ["contact.note", tr("الملاحظة تحت الزر")],
      ["form.done", tr("رسالة النجاح")],
      ["form.doneSub", tr("رسالة النجاح – السطر الثاني")],
      ["form.again", tr("زر «إرسال طلب آخر»")],
      ["form.invalid", tr("خطأ: حقول ناقصة")],
      ["form.flood", tr("خطأ: طلبات كثيرة")],
      ["form.server", tr("خطأ: فشل الإرسال")],
      ["contact.city", tr("المدينة")],
    ],
  },
  {
    id: "cta",
    name: tr("مربع التواصل الأزرق"),
    sub: tr("المربع الأزرق في أسفل كل صفحة."),
    fields: [
      ["cta.title", tr("العنوان")],
      ["cta.sub", tr("الفقرة")],
      ["ctaBox.local", tr("«بالتوقيت المحلي» بجانب الساعة")],
      ["ctaBox.ask", tr("السؤال فوق الخيارات")],
      ["ctaBox.write", tr("الزر الأصفر («اكتب لنا عن»)")],
      ["ctaBox.wa", tr("بطاقة واتساب – العنوان")],
      ["ctaBox.waSub", tr("بطاقة واتساب – السطر الثاني")],
      ["ctaBox.hello", tr("رسالة واتساب الجاهزة")],
      ["ctaBox.mailSub", tr("بطاقة البريد – السطر الثاني")],
      ["ctaBox.copy", tr("زر نسخ البريد")],
      ["ctaBox.copied", tr("«تم النسخ»")],
      ["ctaBox.call", tr("بطاقة الهاتف – السطر الثاني")],
    ],
  },
  {
    id: "menu",
    name: tr("القائمة والتذييل"),
    fields: [
      ["nav.home", tr("«الرئيسية»")],
      ["nav.projects", tr("«المشاريع»")],
      ["nav.services", tr("«الخدمات»")],
      ["nav.partners", tr("«الشركاء»")],
      ["nav.about", tr("«من نحن»")],
      ["nav.contact", tr("زر التواصل")],
      ["nav.menu", tr("«القائمة» (الهاتف)")],
      ["nav.close", tr("«إغلاق» (الهاتف)")],
      ["footer.tag", tr("التذييل – السطر التعريفي")],
    ],
  },
];

/** The parts with their own editors (other content keys). */
const EXTRA = [
  { id: "aboutText", name: tr("من نحن – النص والالتزامات") },
  { id: "partnersText", name: tr("الشركاء – العناوين") },
  { id: "headset", name: tr("النظارة ثلاثية الأبعاد") },
];

const get = (o: unknown, path: string) => path.split(".").reduce<unknown>((x, k) => (x as Record<string, unknown> | undefined)?.[k], o) as T | undefined;
function set<V>(o: V, path: string, v: T): V {
  const [k, ...rest] = path.split(".");
  const cur = (o as Record<string, unknown>)[k];
  return { ...o, [k]: rest.length ? set(cur, rest.join("."), v) : v } as V;
}

export default function TextsTab({ focus }: { focus?: string }) {
  const c = useContentKey<UI>("ui", defUi, true);
  const about = useContentKey<About>("about", aboutPage, true);
  const pp = useContentKey<PP>("partners_page", partnersPage, true);
  const ex = useContentKey<Ex>("explorer", { explorer: defExplorer, steps: defSteps }, true);
  const [open, setOpen] = useState<string>(focus ?? "home");
  const all = [c, about, pp, ex];
  if (!c.value || !about.value || !pp.value || !ex.value) return <p className="text-black/40">…</p>;
  const a = about.value;
  const setA = (v: Partial<About>) => about.setValue({ ...a, ...v } as About);
  // the tour's steps are matched by id: texts from the database, everything else from the code
  const steps = defSteps.map((s) => merge(s, ex.value!.steps?.find((x) => x.id === s.id)));
  const setStep = (id: string, k: "title" | "text" | "spec", v: T) => ex.setValue({ ...ex.value!, steps: steps.map((s) => (s.id === id ? { ...s, [k]: v } : s)) });
  const e = ex.value.explorer;
  const setE = (k: keyof typeof defExplorer, v: unknown) => ex.setValue({ ...ex.value!, explorer: { ...e, [k]: v } });

  const tabs = [...PAGES.map((p) => ({ id: p.id, name: p.name })), ...EXTRA];
  const page = PAGES.find((p) => p.id === open);

  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("نصوص الموقع")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("كل نص يظهر في الموقع، مرتّباً حسب الصفحات، بالعربية والفرنسية والإنجليزية. الخانة الإنجليزية الفارغة تظهر بالبرتقالي، ويعرض الموقع مكانها النص الفرنسي.")}</p>
      <MissingEn n={countMissingEn([c.value, about.value, pp.value, ex.value])} />
      {all.map((x) => x.err).find(Boolean) && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{all.map((x) => x.err).find(Boolean)}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((g) => (
          <button
            key={g.id}
            onClick={() => setOpen(g.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${open === g.id ? "bg-navy text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:text-black"}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {page && (
        <Section title={page.name} sub={page.sub}>
          {page.fields.map(([path, label]) => {
            const v = get(c.value, path);
            return v ? <TField key={path} label={label} multi={(v.fr ?? "").length > 70} value={v} onChange={(nv) => c.setValue(set(c.value!, path, nv))} /> : null;
          })}
          {page.id === "contact" && (
            <TypesField value={c.value.contact.types as unknown as Lines} onChange={(v) => c.setValue({ ...c.value!, contact: { ...c.value!.contact, types: v } } as unknown as UI)} />
          )}
        </Section>
      )}

      {open === "aboutText" && (
        <Section title={tr("صفحة «من نحن»")}>
          <TField label={tr("العنوان")} value={a.title} onChange={(v) => setA({ title: v })} />
          <TField label={tr("الفقرة تحت العنوان")} multi value={a.sub} onChange={(v) => setA({ sub: v })} />
          <TField label={tr("عنوان القطاعات")} value={a.sectors} onChange={(v) => setA({ sectors: v })} />
          <TypesField label={tr("القطاعات")} value={a.sectorList} onChange={(v) => setA({ sectorList: v } as Partial<About>)} />
          <TField label={tr("«أين نعمل» – العنوان")} value={a.where} onChange={(v) => setA({ where: v })} />
          <TField label={tr("«أين نعمل» – النص")} multi value={a.whereText} onChange={(v) => setA({ whereText: v })} />
          <TField label={tr("«التزامنا» – العنوان الصغير")} value={a.pillars.kicker} onChange={(v) => setA({ pillars: { ...a.pillars, kicker: v } })} />
          <TField label={tr("«التزامنا» – العنوان")} value={a.pillars.title} onChange={(v) => setA({ pillars: { ...a.pillars, title: v } })} />
          {a.pillars.items.map((it, i) => (
            <div key={i} className="grid gap-3 rounded-xl bg-black/[0.025] p-4">
              <TField label={tr("الالتزام {0}", i + 1)} value={it.t} onChange={(v) => setA({ pillars: { ...a.pillars, items: a.pillars.items.map((x, j) => (j === i ? { ...x, t: v } : x)) } })} />
              <TField label={tr("الشرح")} multi value={it.d} onChange={(v) => setA({ pillars: { ...a.pillars, items: a.pillars.items.map((x, j) => (j === i ? { ...x, d: v } : x)) } })} />
            </div>
          ))}
          <TField label={tr("«الاسم» – العنوان الصغير")} value={a.xr.kicker} onChange={(v) => setA({ xr: { ...a.xr, kicker: v } })} />
          <TField label={tr("«الاسم» – العنوان")} value={a.xr.title} onChange={(v) => setA({ xr: { ...a.xr, title: v } })} />
          <TField label={tr("«الاسم» – الفقرة")} multi value={a.xr.text} onChange={(v) => setA({ xr: { ...a.xr, text: v } })} />
          {a.xr.items.map((it, i) => (
            <div key={it.k} className="grid gap-3 rounded-xl bg-black/[0.025] p-4">
              <div className="text-xs font-bold text-black/45" dir="ltr">{it.k}</div>
              <TField label={tr("الاسم")} value={it.t} onChange={(v) => setA({ xr: { ...a.xr, items: a.xr.items.map((x, j) => (j === i ? { ...x, t: v } : x)) } })} />
              <TField label={tr("الشرح")} value={it.d} onChange={(v) => setA({ xr: { ...a.xr, items: a.xr.items.map((x, j) => (j === i ? { ...x, d: v } : x)) } })} />
            </div>
          ))}
          <TField label={tr("كلمة «مثال»")} value={a.xr.example} onChange={(v) => setA({ xr: { ...a.xr, example: v } })} />
        </Section>
      )}

      {open === "partnersText" && (
        <Section title={tr("صفحة «الشركاء»")} sub={tr("الشعارات ووصف كل شريك في تبويب «العملاء والشركاء».")}>
          {(
            [
              ["kicker", tr("العنوان الصغير")],
              ["title", tr("العنوان")],
              ["sub", tr("الفقرة")],
              ["clientsTitle", tr("عنوان قسم العملاء")],
              ["partnersTitle", tr("عنوان قسم الشركاء")],
              ["techTitle", tr("عنوان قسم التقنيات")],
              ["techSub", tr("فقرة قسم التقنيات")],
              ["view", tr("«عرض المشروع»")],
            ] as [keyof PP, string][]
          ).map(([k, label]) => (
            <TField key={k} label={label} multi={k === "sub"} value={pp.value![k]} onChange={(v) => pp.setValue({ ...pp.value!, [k]: v } as PP)} />
          ))}
        </Section>
      )}

      {open === "headset" && (
        <>
          <Section title={tr("النظارة ثلاثية الأبعاد – الواجهة")} sub={tr("ما يظهر عند استكشاف النظارة في الصفحة الرئيسية. أماكن النقاط على النظارة ثابتة، والنصوص كلها هنا.")}>
            <TField label={tr("العنوان الصغير")} value={e.kicker} onChange={(v) => setE("kicker", v)} />
            <TField label={tr("شرح التحكم (الكمبيوتر)")} value={e.help} onChange={(v) => setE("help", v)} />
            <TField label={tr("البطاقة الأولى – العنوان")} value={e.intro.title} onChange={(v) => setE("intro", { ...e.intro, title: v })} />
            <TField label={tr("البطاقة الأولى – النص")} multi value={e.intro.text} onChange={(v) => setE("intro", { ...e.intro, text: v })} />
            <TField label={tr("البطاقة الأولى – المواصفات")} value={e.introSpec} onChange={(v) => setE("introSpec", v)} />
            <TField label={tr("تلميح قبل الاستكشاف (الكمبيوتر)")} value={e.hintDrag} onChange={(v) => setE("hintDrag", v)} />
            <TField label={tr("تلميح قبل الاستكشاف (الهاتف)")} value={e.hintTap} onChange={(v) => setE("hintTap", v)} />
            <TField label={tr("زر الجولة")} value={e.tour} onChange={(v) => setE("tour", v)} />
            <TField label={tr("أثناء الجولة")} value={e.touring} onChange={(v) => setE("touring", v)} />
            <TField label={tr("زر الإيقاف")} value={e.stop} onChange={(v) => setE("stop", v)} />
            <TField label={tr("«أو اضغط على نقطة»")} value={e.or} onChange={(v) => setE("or", v)} />
            <TField label={tr("زر «المنظر العام»")} value={e.reset} onChange={(v) => setE("reset", v)} />
            <TField label={tr("زر الإغلاق")} value={e.close} onChange={(v) => setE("close", v)} />
            <TField label={tr("«النظارة» (اسم المجموعة)")} value={e.groups.headset} onChange={(v) => setE("groups", { ...e.groups, headset: v })} />
            <TField label={tr("«يدا التحكم» (اسم المجموعة)")} value={e.groups.controller} onChange={(v) => setE("groups", { ...e.groups, controller: v })} />
          </Section>
          <Section title={tr("النظارة ثلاثية الأبعاد – النقاط")} sub={tr("نقطة لكل جزء، بنفس ترتيب الجولة.")}>
            {steps.map((s, i) => (
              <div key={s.id} className="grid gap-3 rounded-xl bg-black/[0.025] p-4">
                <div className="text-xs font-semibold text-black/45">
                  {i + 1} · {s.group === "headset" ? tr("النظارة") : tr("يد التحكم")}
                </div>
                <TField label={tr("العنوان")} value={s.title} onChange={(v) => setStep(s.id, "title", v)} />
                <TField label={tr("الشرح")} multi value={s.text} onChange={(v) => setStep(s.id, "text", v)} />
                {s.spec && <TField label={tr("المواصفات")} value={s.spec} onChange={(v) => setStep(s.id, "spec", v)} />}
              </div>
            ))}
          </Section>
        </>
      )}

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
function TypesField({ value, onChange, label = tr("أنواع المشاريع في النموذج") }: { value: { readonly fr: readonly string[]; readonly ar: readonly string[]; readonly en?: readonly string[] }; onChange: (v: Lines) => void; label?: string }) {
  const lines = (s: string) => s.split("\n");
  const cur: Lines = { fr: [...value.fr], ar: [...value.ar], en: [...(value.en ?? [])] };
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">
        {label} <span className="text-xs font-normal text-black/45">{tr("نوع في كل سطر")}</span>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {ADMIN_LANGS.map((l) => {
          const empty = l.k === "en" && cur.en.join("").trim() === "";
          return (
            <label key={l.k} className="block">
              <span className={`mb-1 block text-[0.7rem] font-semibold ${empty ? "text-amber-700" : "text-black/40"}`}>
                {l.name}
                {empty && tr(" — ناقص")}
              </span>
              <textarea dir={l.dir} rows={4} className={`inp ${empty ? "!border-amber-400 !bg-amber-50/60" : ""}`} value={cur[l.k].join("\n")} onChange={(e) => onChange({ ...cur, [l.k]: lines(e.target.value) })} />
            </label>
          );
        })}
      </div>
    </div>
  );
}
