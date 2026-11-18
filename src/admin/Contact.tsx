"use client";

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
      <h1 className="text-2xl font-bold">التواصل</h1>
      <p className="mt-1 text-sm text-black/55">يظهر البريد والهاتف في التذييل، وقسم التواصل، وصفحة التواصل. رسائل النموذج تصل إلى هذا البريد.</p>
      {c.err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{c.err}</p>}
      <Section title="بيانات التواصل">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="البريد الإلكتروني" value={v.email} onChange={(email) => c.setValue({ ...v, email: email.trim() })} />
          <Field
            label="الهاتف"
            hint="كما يظهر في الموقع"
            value={v.phone}
            onChange={(phone) => c.setValue({ ...v, phone, phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}` })}
          />
        </div>
      </Section>
      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onCancel={c.reset} />
    </div>
  );
}
