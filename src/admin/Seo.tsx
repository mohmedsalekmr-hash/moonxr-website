"use client";

import { tr } from "./i18n";
import { useRef, useState } from "react";
import { seo as defSeo, DEFAULT_SHARE_IMAGE, type Seo, type SeoPage } from "@/data/seo";
import { Section } from "./Projects";
import { uploadShareImage } from "./media";
import { countMissingEn, MissingEn, SaveBar, TField, PageHead } from "./ui";
import { useContentKey } from "./useContent";

const PAGES: { id: SeoPage; name: string; path: { fr: string; ar: string; en: string } }[] = [
  { id: "home", name: tr("الصفحة الرئيسية"), path: { fr: "/fr", ar: "/ar", en: "/en" } },
  { id: "projets", name: tr("المشاريع"), path: { fr: "/fr/projets", ar: "/ar/projets", en: "/en/projects" } },
  { id: "services", name: tr("الخدمات"), path: { fr: "/fr/services", ar: "/ar/services", en: "/en/services" } },
  { id: "partenaires", name: tr("الشركاء"), path: { fr: "/fr/partenaires", ar: "/ar/partenaires", en: "/en/partners" } },
  { id: "a-propos", name: tr("من نحن"), path: { fr: "/fr/a-propos", ar: "/ar/a-propos", en: "/en/about" } },
  { id: "contact", name: tr("التواصل"), path: { fr: "/fr/contact", ar: "/ar/contact", en: "/en/contact" } },
];
const LANGS = [
  { k: "ar", name: "العربية" },
  { k: "fr", name: "Français" },
  { k: "en", name: "English" },
] as const;

/** How every page looks in Google and when its link is sent on WhatsApp or LinkedIn. */
export default function SeoTab() {
  const c = useContentKey<Seo>("seo", defSeo, true);
  const [open, setOpen] = useState<SeoPage>("home");
  const [lang, setLang] = useState<"ar" | "fr" | "en">("ar");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  if (!c.value) return <p className="text-black/40">…</p>;
  const s = c.value;
  const e = s[open];
  const page = PAGES.find((p) => p.id === open)!;
  const set = (v: Partial<typeof e>) => c.setValue({ ...s, [open]: { ...e, ...v } });
  const image = e.image || s.home.image || DEFAULT_SHARE_IMAGE;
  const host = typeof location !== "undefined" ? location.host : "moonxr-site.vercel.app";
  const title = open === "home" ? e.title[lang] : `${e.title[lang]} · Moon XR`;
  const rtl = lang === "ar";

  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      set({ image: await uploadShareImage(f) });
    } catch (x) {
      setErr(x instanceof Error ? x.message : tr("فشل الرفع"));
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  return (
    <div>
      <PageHead title={tr("الظهور والمشاركة")} sub={tr("عنوان كل صفحة ووصفها كما يظهران في Google، والصورة التي تظهر عند إرسال الرابط في واتساب أو LinkedIn. صفحات المشاريع تأخذ عنوانها ووصفها وصورتها من المشروع نفسه.")} />
      <MissingEn n={countMissingEn(s)} />
      {c.err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{c.err}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button key={p.id} onClick={() => setOpen(p.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${open === p.id ? "bg-navy text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:text-black"}`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.1fr_1fr]">
        <Section title={page.name}>
          <TField label={tr("العنوان")} hint={open === "home" ? tr("العنوان الكامل للموقع") : tr("يُضاف بعده «· Moon XR» تلقائياً")} value={e.title} onChange={(v) => set({ title: v })} />
          <TField label={tr("الوصف")} hint={tr("بين 70 و160 حرفاً هو الأفضل لـ Google")} multi value={e.desc} onChange={(v) => set({ desc: v })} />
          <div>
            <div className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">{tr("صورة المشاركة")}<span className="text-xs font-normal text-black/45">
                {open === "home" ? tr("تُستعمل لكل صفحة ليس لها صورة خاصة") : tr("اختياري: بدونها تُستعمل صورة الصفحة الرئيسية")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="btn btn-light" onClick={() => input.current?.click()} disabled={busy}>
                {busy ? tr("جارٍ الرفع…") : e.image ? tr("استبدال الصورة") : tr("رفع صورة")}
              </button>
              {e.image && (
                <button type="button" className="btn text-red-700" onClick={() => set({ image: undefined })}>
                  {open === "home" ? tr("الرجوع إلى صورة الشعار") : tr("إزالة")}
                </button>
              )}
              <span className="text-xs text-black/45">{tr("تُقصّ تلقائياً إلى 1200 × 630")}</span>
            </div>
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(x) => pick(x.target.files?.[0])} />
            {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
          </div>
        </Section>

        <div className="space-y-5 2xl:mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{tr("المعاينة")}</span>
            <div className="flex gap-1 rounded-full bg-black/[0.05] p-1">
              {LANGS.map((l) => (
                <button key={l.k} onClick={() => setLang(l.k)} className={`rounded-full px-3 py-1 text-xs font-semibold ${lang === l.k ? "bg-white shadow-sm" : "text-black/50"}`}>
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp-style link card */}
          <div className="rounded-2xl bg-[#e7ddd3] p-4">
            <div className="text-[0.7rem] font-semibold text-black/45">{tr("واتساب")}</div>
            <div className="mt-2 ms-auto max-w-sm overflow-hidden rounded-xl bg-[#d9fdd3] p-1 shadow-sm">
              <div className="overflow-hidden rounded-lg bg-black/[0.04]" dir={rtl ? "rtl" : "ltr"}>
                                <img src={image} alt="" className="aspect-[1200/630] w-full object-cover" />
                <div className="px-3 py-2">
                  <div className="line-clamp-2 text-sm font-semibold text-black/85">{title}</div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-black/55">{e.desc[lang]}</div>
                  <div className="mt-1 text-[0.7rem] text-black/40" dir="ltr">{host}</div>
                </div>
              </div>
              <div className="px-2 pb-1 pt-1.5 text-xs text-[#027eb5]" dir="ltr">
                https://{host}
                {page.path[lang]}
              </div>
            </div>
          </div>

          {/* Google-style result */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.07]" dir={rtl ? "rtl" : "ltr"}>
            <div className="text-[0.7rem] font-semibold text-black/45" dir="rtl">Google</div>
            <div className="mt-3 flex items-center gap-2">
                            <img src="/admin/icon.png" alt="" className="h-7 w-7 rounded-full bg-black/[0.04] p-1" onError={(x) => (x.currentTarget.style.visibility = "hidden")} />
              <div className="leading-tight">
                <div className="text-sm text-black/80">Moon XR</div>
                <div className="text-xs text-black/50" dir="ltr">
                  https://{host}
                  {page.path[lang]}
                </div>
              </div>
            </div>
            <div className="mt-2 line-clamp-1 text-lg text-[#1a0dab]">{title}</div>
            <div className="mt-1 line-clamp-2 text-sm text-black/65">{e.desc[lang]}</div>
            <div className={`mt-2 text-xs ${e.desc[lang].length > 160 || e.desc[lang].length < 50 ? "text-amber-700" : "text-emerald-700"}`}>
              {e.desc[lang].length} {tr("حرفاً")}{" "}{e.desc[lang].length > 160 ? tr("— طويل، Google سيقصّه") : e.desc[lang].length < 50 ? tr("— قصير، أضف تفصيلاً") : tr("— طول مناسب")}
            </div>
          </div>
          <p className="text-xs leading-5 text-black/45">{tr("ملاحظة: واتساب يحفظ معاينة الرابط لبعض الوقت. بعد تغيير الصورة قد تظهر الصورة الجديدة بعد ساعات في المحادثات القديمة.")}</p>
        </div>
      </div>

      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onCancel={c.reset} />
    </div>
  );
}
