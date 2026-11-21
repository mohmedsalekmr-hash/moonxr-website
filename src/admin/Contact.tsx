"use client";

import { tr } from "./i18n";
import { CONTACT } from "@/data/i18n";
import { Section } from "./Projects";
import { Field, moveItem, RowTools, SaveBar, PageHead } from "./ui";
import { useContentKey } from "./useContent";

/** Common platforms: the name is filled in from the link; any other name can be typed. */
const PLATFORMS = [
  { name: "Instagram", host: "instagram.com" },
  { name: "Facebook", host: "facebook.com" },
  { name: "LinkedIn", host: "linkedin.com" },
  { name: "TikTok", host: "tiktok.com" },
  { name: "YouTube", host: "youtube.com" },
  { name: "X", host: "x.com" },
  { name: "Snapchat", host: "snapchat.com" },
  { name: "WhatsApp", host: "wa.me" },
  { name: "Site web", host: "" },
];

export default function ContactTab() {
  const c = useContentKey("contact", CONTACT, true);
  if (!c.value) return <p className="text-black/40">…</p>;
  const v = c.value;
  return (
    <div>
      <PageHead title={tr("التواصل")} sub={tr("البريد والهاتف وواتساب تظهر في أسفل الصفحات وفي صفحة التواصل، ومعها حسابات التواصل الاجتماعي.")} />
      {c.err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{c.err}</p>}
      <Section title={tr("بيانات التواصل")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={tr("البريد الإلكتروني")} value={v.email} onChange={(email) => c.setValue({ ...v, email: email.trim() })} />
          <Field
            label={tr("الهاتف")}
            hint={tr("كما يظهر في الموقع")}
            value={v.phone}
            onChange={(phone) => c.setValue({ ...v, phone, phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}` })}
          />
          <Field
            label={tr("رقم واتساب")}
            hint={tr("بالصيغة الدولية، مثل +222 30 45 47 77. فارغ = نفس الهاتف")}
            dir="ltr"
            value={v.whatsapp}
            onChange={(whatsapp) => c.setValue({ ...v, whatsapp })}
          />
        </div>
      </Section>
      <Section title={tr("حسابات التواصل الاجتماعي")} sub={tr("تظهر في أسفل كل صفحات الموقع، بنفس هذا الترتيب. اترك القائمة فارغة إذا لم تكن هناك حسابات.")}>
        <div className="grid gap-3">
          {(v.socials ?? []).map((so, i) => (
            <div key={i} className="flex items-end gap-3 rounded-xl border border-line p-3">
              <div className="grid flex-1 gap-3 md:grid-cols-[14rem_1fr]">
                <label className="block text-sm">
                  <span className="text-black/60">{tr("المنصة")}</span>
                  <input
                    className="inp mt-1"
                    list="mx-platforms"
                    value={so.name}
                    onChange={(e) => c.setValue({ ...v, socials: v.socials.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })}
                  />
                </label>
                <Field
                  label={tr("الرابط")}
                  dir="ltr"
                  value={so.url}
                  onChange={(url) => {
                    const u = url.trim();
                    const name = so.name || PLATFORMS.find((p) => u.includes(p.host))?.name || "";
                    c.setValue({ ...v, socials: v.socials.map((x, j) => (j === i ? { name, url: u } : x)) });
                  }}
                />
              </div>
              <RowTools
                i={i}
                n={v.socials.length}
                move={(a, b) => c.setValue({ ...v, socials: moveItem(v.socials, a, b) })}
                remove={() => c.setValue({ ...v, socials: v.socials.filter((_, j) => j !== i) })}
              />
            </div>
          ))}
          {(v.socials ?? []).some((so) => so.url && !/^https?:\/\//.test(so.url)) && (
            <p className="text-sm text-amber-700">{tr("كل رابط يجب أن يبدأ بـ https://")}</p>
          )}
          <datalist id="mx-platforms">
            {PLATFORMS.map((p) => (
              <option key={p.name} value={p.name} />
            ))}
          </datalist>
          <button type="button" className="btn btn-light self-start" onClick={() => c.setValue({ ...v, socials: [...(v.socials ?? []), { name: "", url: "" }] })}>
            {tr("+ حساب")}
          </button>
        </div>
      </Section>
      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onCancel={c.reset} />
    </div>
  );
}
