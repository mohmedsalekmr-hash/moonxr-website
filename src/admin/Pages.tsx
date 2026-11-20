"use client";

import { tr, adminLang } from "./i18n";
import { Section } from "./Projects";
import { moveItem, RowTools, SaveBar, Toggle } from "./ui";
import { useContentKey } from "./useContent";
import { EDIT_URL, Icon, ICON } from "./Shell";

type HomeSection = { id: string; visible: boolean };
type Sections = Record<string, Record<string, boolean>>;

const HOME: Record<string, { name: string; sub: string }> = {
  hero: { name: tr("الواجهة"), sub: tr("النظارة ثلاثية الأبعاد والعنوان الكبير") },
  about: { name: tr("من نحن"), sub: tr("الجملة التعريفية والخدمات وشريط الشعارات") },
  work: { name: tr("المشاريع"), sub: tr("بطاقات المشاريع المتراكبة") },
  process: { name: tr("طريقة العمل"), sub: tr("الخطوات الأربع") },
  ecosystem: { name: tr("الشركاء والتقنيات"), sub: tr("الشركاء والموردون") },
  contact: { name: tr("التواصل"), sub: tr("الدعوة إلى التواصل") },
};
const DEFAULT_HOME: HomeSection[] = Object.keys(HOME).map((id) => ({ id, visible: true }));

/** The other pages: which of their sections can be hidden, in the order a visitor meets them. */
const OTHER: { page: string; name: string; path: { fr: string; ar: string; en: string }; items: [id: string, label: string][] }[] = [
  {
    page: "services",
    name: tr("الخدمات"),
    path: { fr: "/fr/services", ar: "/ar/services", en: "/en/services" },
    items: [["list", tr("قائمة الخدمات")], ["process", tr("«كيف نعمل»")]],
  },
  {
    page: "partners",
    name: tr("الشركاء"),
    path: { fr: "/fr/partenaires", ar: "/ar/partenaires", en: "/en/partners" },
    items: [["clients", tr("العملاء")], ["partners", tr("الشركاء")]],
  },
  {
    page: "about",
    name: tr("من نحن"),
    path: { fr: "/fr/a-propos", ar: "/ar/a-propos", en: "/en/about" },
    items: [["xr", tr("«الاسم» (VR · AR · MR)")], ["commitments", tr("«التزامنا»")], ["journey", tr("«مسيرتنا»")], ["trust", tr("شريط الشعارات")], ["where", tr("«أين نعمل»")]],
  },
];

function Row({ name, sub, on, onChange, tools }: { name: string; sub?: string; on: boolean; onChange: (v: boolean) => void; tools?: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-black/[0.07] p-3 ${on ? "bg-white" : "bg-black/[0.03] opacity-60"}`}>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        {sub && <div className="text-xs text-black/45">{sub}</div>}
      </div>
      <Toggle on={on} label={on ? tr("ظاهر") : tr("مخفي")} onChange={onChange} />
      {tools}
    </div>
  );
}

/** «الصفحات»: show or hide the sections of every page, and order the home page. */
export default function PagesTab() {
  const home = useContentKey<HomeSection[]>("home_sections", DEFAULT_HOME);
  const ps = useContentKey<Sections>("page_sections", {});
  const all = [home, ps];
  if (!home.value || !ps.value) return <p className="text-black/40">…</p>;
  const h = home.value;
  const s = ps.value;
  const lang = adminLang();
  const view = (href: string) => (
    <a href={href} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline">
      {tr("عرض الصفحة")}
      <Icon d={ICON.external} className="h-3.5 w-3.5" />
    </a>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("الصفحات")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("أظهر أو أخفِ أقسام كل صفحة، ورتّب أقسام الصفحة الرئيسية. لتعديل النصوص والصور:")}{" "}
        <a href={EDIT_URL()} target="_blank" className="font-semibold text-navy underline">{tr("عدّل الموقع مباشرة")}</a>
      </p>
      {all.map((x) => x.err).find(Boolean) && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{all.map((x) => x.err).find(Boolean)}</p>}

      <Section title={tr("الصفحة الرئيسية")} sub={tr("الأسهم تغيّر ترتيب الأقسام من الأعلى إلى الأسفل.")}>
        <div className="-mt-2 mb-1">{view(`/${lang}`)}</div>
        <div className="space-y-2">
          {h.map((x, i) => (
            <Row
              key={x.id}
              name={`${i + 1}. ${HOME[x.id]?.name ?? x.id}`}
              sub={HOME[x.id]?.sub}
              on={x.visible}
              onChange={(v) => home.setValue(h.map((y) => (y.id === x.id ? { ...y, visible: v } : y)))}
              tools={<RowTools i={i} n={h.length} move={(a, b) => home.setValue(moveItem(h, a, b))} />}
            />
          ))}
        </div>
      </Section>

      {OTHER.map((g) => {
        const cur = s[g.page] ?? {};
        return (
          <Section key={g.page} title={g.name}>
            <div className="-mt-2 mb-1">{view(g.path[lang as "fr" | "ar" | "en"] ?? g.path.fr)}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.items.map(([id, label]) => (
                <Row key={id} name={label} on={cur[id] !== false} onChange={(v) => ps.setValue({ ...s, [g.page]: { ...cur, [id]: v } })} />
              ))}
            </div>
          </Section>
        );
      })}

      <SaveBar dirty={all.some((x) => x.dirty)} saving={all.some((x) => x.saving)} onSave={() => all.filter((x) => x.dirty).forEach((x) => x.save())} onCancel={() => all.filter((x) => x.dirty).forEach((x) => x.reset())} />
    </div>
  );
}
