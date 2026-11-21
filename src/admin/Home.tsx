"use client";

import { tr } from "./i18n";
import { useEffect, useState } from "react";
import { services as defServices, steps as defSteps, type Service } from "@/data/i18n";
import { sb } from "./sb";
import { countMissingEn, Drawer, FocusPicker, MediaBox, MissingEn, moveItem, PageHead, Panel, SaveBar, SortList, TField } from "./ui";
import { SERVICE_IMG } from "@/components/ServiceBento";
import { useContentKey } from "./useContent";

export default function HomeTab() {
  const services = useContentKey<Service[]>("services", defServices);
  const [projects, setProjects] = useState<{ slug: string; title: { ar: string; fr: string } }[]>([]);
  useEffect(() => {
    sb.from("projects").select("slug,title").order("position").then(({ data }) => setProjects(data ?? []));
  }, []);
  const steps = useContentKey("steps", defSteps);
  const [open, setOpen] = useState<{ k: "s" | "t"; i: number } | null>(null);
  const all = [services, steps];
  const dirty = all.some((x) => x.dirty);
  const saving = all.some((x) => x.saving);
  const err = all.map((x) => x.err).find(Boolean);

  if (!services.value || !steps.value) return <p className="text-black/40">…</p>;
  const sv = services.value;
  const st = steps.value;

  const setS = (i: number, o: Partial<Service>) => services.setValue(sv.map((x, j) => (j === i ? { ...x, ...o } : x)));
  const setT = (i: number, o: Record<string, unknown>) => steps.setValue(st.map((x, j) => (j === i ? { ...x, ...o } : x)));
  const s = open?.k === "s" ? sv[open.i] : null;
  const t = open?.k === "t" ? st[open.i] : null;
  const thumb = (src?: string) => (
    <div className="h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-black/5 ring-1 ring-black/5">{src && <img src={src} alt="" className="h-full w-full object-cover" />}</div>
  );

  return (
    <div>
      <PageHead title={tr("الخدمات والخطوات")} sub={tr("صور الخدمات والخطوات وترتيبها، والمشاريع المرتبطة بكل خدمة. لتعديل نصوصها يكفي الضغط عليها في الموقع.")} />
      {err && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn([sv, st])} />

      <div className="mt-4 grid gap-5">
        <Panel flush title={tr("الخدمات")} sub={tr("البطاقات الأربع في قسم «من نحن» وصفحة «من نحن».")}>
          <SortList
            items={sv}
            keyOf={(_, i) => `s${i}`}
            onMove={(a, b) => services.setValue(moveItem(sv, a, b).map((x, j) => ({ ...x, n: String(j + 1).padStart(2, "0") })))}
            onOpen={(_, i) => setOpen({ k: "s", i })}
            render={(x, i) => (
              <>
                {thumb(x.image ?? SERVICE_IMG[i % 4].src)}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{x.title.ar || x.title.fr}</div>
                  <div className="truncate text-xs text-black/45">{x.text.ar || x.text.fr}</div>
                </div>
                <span className="badge badge-muted shrink-0">{(x.projects ?? []).length ? tr("{0} مشاريع", (x.projects ?? []).length) : tr("تلقائي")}</span>
              </>
            )}
          />
        </Panel>
        <Panel flush title={tr("خطوات العمل")} sub={tr("الخطوات الأربع في قسم «طريقة العمل».")}>
          <SortList
            items={st}
            keyOf={(_, i) => `t${i}`}
            onMove={(a, b) => steps.setValue(moveItem(st, a, b))}
            onOpen={(_, i) => setOpen({ k: "t", i })}
            render={(x) => (
              <>
                {thumb(x.image)}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{x.title.ar || x.title.fr}</div>
                  <div className="truncate text-xs text-black/45">{x.text.ar || x.text.fr}</div>
                </div>
              </>
            )}
          />
        </Panel>
      </div>

      <Drawer
        open={!!open}
        title={s ? s.title.ar || s.title.fr : t ? t.title.ar || t.title.fr : ""}
        onClose={() => setOpen(null)}
        footer={
          <button className="btn btn-primary ms-auto" onClick={() => setOpen(null)}>
            {tr("تم")}
          </button>
        }
      >
        {s && open && (
          <>
            <div>
              <span className="lbl">{tr("الصورة")}</span>
              <MediaBox folder="services" height="h-40" value={{ src: s.image ?? SERVICE_IMG[open.i % 4].src }} onChange={(m) => setS(open.i, { image: m.src })} />
            </div>
            <FocusPicker src={s.image ?? SERVICE_IMG[open.i % 4].src} value={s.pos ?? SERVICE_IMG[open.i % 4].pos} onChange={(v) => setS(open.i, { pos: v })} />
            <TField label={tr("العنوان")} value={s.title} onChange={(v) => setS(open.i, { title: v })} />
            <TField label={tr("الوصف")} multi value={s.text} onChange={(v) => setS(open.i, { text: v })} />
            <div>
              <span className="lbl">
                {tr("المشاريع تحت هذه الخدمة")}
                <span className="hint ms-2">{tr("في صفحة الخدمات. بدون اختيار = حسب نوع المشروع تلقائياً")}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {projects.map((p) => {
                  const on = (s.projects ?? []).includes(p.slug);
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setS(open.i, { projects: on ? (s.projects ?? []).filter((y) => y !== p.slug) : [...(s.projects ?? []), p.slug] })}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${on ? "border-navy bg-navy text-white" : "border-line bg-white text-black/60 hover:border-black/25 hover:text-black"}`}
                    >
                      {on ? "✓ " : ""}
                      {p.title?.ar || p.title?.fr || p.slug}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {t && open && (
          <>
            <div>
              <span className="lbl">{tr("الصورة")}</span>
              <MediaBox folder="steps" height="h-40" value={t.image ? { src: t.image } : null} onChange={(m) => setT(open.i, { image: m.src })} />
            </div>
            <FocusPicker src={t.image} value={(t as { pos?: string }).pos} onChange={(v) => setT(open.i, { pos: v })} />
            <TField label={tr("التعليق تحت الصورة")} value={t.caption} onChange={(v) => setT(open.i, { caption: v })} />
            <TField label={tr("العنوان")} value={t.title} onChange={(v) => setT(open.i, { title: v })} />
            <TField label={tr("النص")} multi value={t.text} onChange={(v) => setT(open.i, { text: v })} />
          </>
        )}
      </Drawer>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={() => all.filter((x) => x.dirty).forEach((x) => x.save())}
        onCancel={() => all.filter((x) => x.dirty).forEach((x) => x.reset())}
      />
    </div>
  );
}
