"use client";

import { tr } from "./i18n";
import { CONTACT } from "@/data/i18n";
import { Section } from "./Projects";
import { Field, SaveBar } from "./ui";
import { useContentKey } from "./useContent";

export default function ContactTab() {
  const c = useContentKey("contact", CONTACT, true);
  if (!c.value) return <p className="text-black/40">…</p>;
  const v = c.value;
  return (
    <div>
      <h1 className="text-2xl font-bold">{tr("التواصل")}</h1>
      <p className="mt-1 text-sm text-black/55">{tr("يظهر البريد والهاتف في التذييل، ومربع التواصل الأزرق، وصفحة التواصل. زر واتساب في المربع الأزرق يفتح محادثة مع رقم واتساب.")}</p>
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
      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onCancel={c.reset} />
    </div>
  );
}
