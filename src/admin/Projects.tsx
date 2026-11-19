"use client";

import { tr } from "./i18n";
import { useCallback, useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";
import { countMissingEn, emptyT, Field, MediaBox, MissingEn, moveItem, RowTools, SaveBar, TField, Toggle, type T } from "./ui";

type Category = "event" | "training" | "dev";
type Media = { type: "image" | "video"; src: string; w: number; h: number; poster?: string; pos?: string };
type Scene = { media: Media; kicker?: T; title: T; text?: T };
type Fact = { k: T; v: T };
type Photo = { src: string; alt: T; w: number; h: number; pos?: string };
type Row = {
  id?: string;
  slug: string;
  category: Category;
  position: number;
  published: boolean;
  title: T;
  short: T;
  meta: T;
  intro: T;
  cover: Photo | null;
  facts: Fact[];
  scenes: Scene[];
};

const CATS: { id: Category; label: string }[] = [
  { id: "event", label: tr("فعالية") },
  { id: "training", label: tr("مشروع منجَز (تدريب)") },
  { id: "dev", label: tr("من تطوير Moon") },
];

const POS = [
  { v: "", label: tr("الوسط") },
  { v: "50% 20%", label: tr("الأعلى") },
  { v: "50% 80%", label: tr("الأسفل") },
  { v: "25% 50%", label: tr("اليسار") },
  { v: "75% 50%", label: tr("اليمين") },
];

const blank = (position: number): Row => ({
  slug: "",
  category: "event",
  position,
  published: false,
  title: emptyT(),
  short: emptyT(),
  meta: emptyT(),
  intro: emptyT(),
  cover: null,
  facts: [],
  scenes: [],
});

export default function ProjectsTab({ focus, isNew }: { focus?: string; isNew?: boolean }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [edit, setEdit] = useState<Row | null>(null);
  const [err, setErr] = useState("");

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    sb.from("projects")
      .select("*")
      .order("position")
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        const list = (data as Row[]) ?? [];
        setRows(list);
        // opened from search or the overview: go straight to that project (or a new one)
        if (focus && tick === 0) setEdit(list.find((r) => r.slug === focus) ?? null);
        if (isNew && tick === 0) setEdit(blank(list.length));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setErr("");
    try {
      await saveAndPublish(fn);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("خطأ"));
    }
    load();
  };

  const reorder = (from: number, to: number) => {
    if (!rows) return;
    const next = moveItem(rows, from, to).map((r, i) => ({ ...r, position: i }));
    setRows(next);
    run(async () => {
      const res = await Promise.all(next.map((r) => sb.from("projects").update({ position: r.position }).eq("id", r.id!)));
      return { error: res.find((x) => x.error)?.error ?? null };
    });
  };

  if (edit)
    return (
      <Editor
        initial={edit}
        taken={(rows ?? []).filter((r) => r.id !== edit.id).map((r) => r.slug)}
        onClose={() => {
          setEdit(null);
          load();
        }}
      />
    );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tr("المشاريع")}</h1>
          <p className="mt-1 text-sm text-black/55">{tr("الترتيب هنا هو ترتيب العرض في الموقع. المشروع المخفي لا يظهر للزوار.")}</p>
        </div>
        <button className="btn btn-dark" onClick={() => setEdit(blank(rows?.length ?? 0))}>{tr("+ مشروع جديد")}</button>
      </div>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <div className="mt-6 space-y-2">
        {rows === null && <p className="text-black/40">…</p>}
        {rows?.map((r, i) => (
          <div key={r.id} className="card flex items-center gap-4 p-3">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black/5">
              { }
              {r.cover?.src && <img src={r.cover.src} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 truncate font-semibold">
                {r.title?.ar || r.title?.fr || tr("بدون عنوان")}
                {countMissingEn(r) > 0 && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-px text-[0.7rem] font-semibold text-amber-800">{tr("EN ناقص")}</span>}
              </div>
              <div className="truncate text-xs text-black/45" dir="ltr">
                /projets/{r.slug} · {r.scenes?.length ?? 0} scènes
              </div>
            </div>
            <Toggle
              on={r.published}
              label={r.published ? tr("منشور") : tr("مخفي")}
              onChange={(v) => {
                setRows(rows.map((x) => (x.id === r.id ? { ...x, published: v } : x)));
                run(() => sb.from("projects").update({ published: v }).eq("id", r.id!));
              }}
            />
            <button className="btn btn-light" onClick={() => setEdit(r)}>{tr("تعديل")}</button>
            <RowTools i={i} n={rows.length} move={reorder} />
          </div>
        ))}
      </div>
    </div>
  );
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

function Editor({ initial, taken, onClose }: { initial: Row; taken: string[]; onClose: () => void }) {
  const [p, setP] = useState<Row>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isNew = !p.id;
  const dirty = JSON.stringify(p) !== saved;
  const set = <K extends keyof Row>(k: K, v: Row[K]) => setP((x) => ({ ...x, [k]: v }));
  const folder = `projects/${p.slug || "new"}`;

  const save = async () => {
    setErr("");
    const slug = p.slug.trim();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return setErr(tr("الرابط (slug) يجب أن يحتوي على أحرف لاتينية صغيرة وأرقام وشرطات فقط"));
    if (taken.includes(slug)) return setErr(tr("هذا الرابط مستخدم لمشروع آخر"));
    if (!p.title.fr || !p.title.ar) return setErr(tr("العنوان مطلوب بالعربية والفرنسية"));
    if (!p.cover) return setErr(tr("صورة الغلاف مطلوبة"));
    const bad = p.scenes.findIndex((s) => !s.media?.src || !s.title?.fr || !s.title?.ar);
    if (bad >= 0) return setErr(tr("المشهد {0} يحتاج إلى صورة أو فيديو وعنوان بالعربية والفرنسية", bad + 1));
    setSaving(true);
    try {
      const { id, ...data } = { ...p, slug, cover: { ...p.cover, alt: p.title } };
      let newId = id;
      await saveAndPublish(async () => {
        if (id) return sb.from("projects").update(data).eq("id", id);
        const r = await sb.from("projects").insert(data).select("id").single();
        newId = r.data?.id;
        return r;
      });
      const next = { ...p, id: newId, slug };
      setP(next);
      setSaved(JSON.stringify(next));
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("خطأ"));
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!p.id || !confirm(tr("حذف هذا المشروع نهائياً؟"))) return;
    try {
      await saveAndPublish(() => sb.from("projects").delete().eq("id", p.id!));
      // free the storage used by this project's uploads
      const { data } = await sb.storage.from("media").list(`projects/${p.slug}`);
      if (data?.length) await sb.storage.from("media").remove(data.map((f) => `projects/${p.slug}/${f.name}`));
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("خطأ"));
    }
  };

  const setScene = (i: number, s: Scene) => set("scenes", p.scenes.map((x, j) => (j === i ? s : x)));
  const setFact = (i: number, f: Fact) => set("facts", p.facts.map((x, j) => (j === i ? f : x)));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-light" onClick={() => (!dirty || confirm(tr("الخروج دون حفظ التعديلات؟"))) && onClose()}>{tr("→ كل المشاريع")}</button>
        <h1 className="text-2xl font-bold">{isNew ? tr("مشروع جديد") : p.title.ar || p.title.fr}</h1>
        <div className="ms-auto flex items-center gap-3">
          {!isNew && p.published && (
            <a className="btn btn-light" href={`/ar/projets/${p.slug}`} target="_blank">{tr("عرض ↗")}</a>
          )}
          <Toggle on={p.published} onChange={(v) => set("published", v)} label={p.published ? tr("منشور") : tr("مخفي")} />
        </div>
      </div>
      {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <MissingEn n={countMissingEn(p)} />

      <Section title={tr("المعلومات الأساسية")}>
        <TField label={tr("العنوان")} value={p.title} onChange={(v) => setP((x) => ({ ...x, title: v, slug: isNew && (!x.slug || x.slug === slugify(x.title.fr)) ? slugify(v.fr) : x.slug }))} />
        <TField label={tr("وصف قصير")} hint={tr("يظهر على بطاقة المشروع")} value={p.short} onChange={(v) => set("short", v)} />
        <TField label={tr("سطر التعريف")} hint={tr("مثال: Nouakchott · 2025")} value={p.meta} onChange={(v) => set("meta", v)} />
        <TField label={tr("المقدمة")} hint={tr("تظهر في أعلى صفحة المشروع")} multi value={p.intro} onChange={(v) => set("intro", v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{tr("النوع")}</span>
            <select className="inp" value={p.category} onChange={(e) => set("category", e.target.value as Category)}>
              {CATS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          {isNew ? (
            <Field label={tr("الرابط (slug)")} hint={tr("بالحروف اللاتينية")} value={p.slug} onChange={(v) => set("slug", v.toLowerCase())} placeholder="mon-projet" />
          ) : (
            <div>
              <span className="mb-1.5 block text-sm font-semibold">{tr("الرابط")}</span>
              <div className="inp bg-black/[0.03] text-black/55" dir="ltr">
                /projets/{p.slug}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title={tr("صورة الغلاف")} sub={tr("تظهر في الصفحة الرئيسية وقائمة المشاريع. الصور تُضغط تلقائياً.")}>
        <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
          <MediaBox height="h-56" folder={folder} value={p.cover} onChange={(m) => set("cover", { src: m.src, w: m.w, h: m.h, alt: p.title, pos: p.cover?.pos })} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{tr("موضع القصّ")}</span>
            <select className="inp" value={p.cover?.pos ?? ""} disabled={!p.cover} onChange={(e) => p.cover && set("cover", { ...p.cover, pos: e.target.value || undefined })}>
              {POS.map((x) => (
                <option key={x.v} value={x.v}>
                  {x.label}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs leading-5 text-black/45">{tr("الجزء الذي يبقى ظاهراً عندما تُقصّ الصورة في البطاقات.")}</span>
          </label>
        </div>
      </Section>

      <Section title={tr("أرقام ومعلومات")} sub={tr("حتى 4 معلومات تظهر تحت المقدمة (مثلاً: العميل، التاريخ، المكان، التجهيزات).")}>
        {p.facts.map((f, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-black/[0.025] p-3">
            <div className="grid flex-1 gap-3">
              <TField label={tr("العنوان")} value={f.k} onChange={(v) => setFact(i, { ...f, k: v })} />
              <TField label={tr("القيمة")} value={f.v} onChange={(v) => setFact(i, { ...f, v })} />
            </div>
            <RowTools i={i} n={p.facts.length} move={(a, b) => set("facts", moveItem(p.facts, a, b))} remove={() => set("facts", p.facts.filter((_, j) => j !== i))} />
          </div>
        ))}
        {p.facts.length < 4 && (
          <button className="btn btn-light self-start" onClick={() => set("facts", [...p.facts, { k: emptyT(), v: emptyT() }])}>{tr("+ إضافة معلومة")}</button>
        )}
      </Section>

      <Section title={tr("مشاهد القصة")} sub={tr("كل مشهد = صورة أو فيديو مع نص. الفيديو لقطة قصيرة فقط (3–5 ثوانٍ، MP4، أقل من 3 MB)، وفيديو واحد يكفي لكل مشروع. المشهد الأول يُعرض مع عنوان المشروع والمقدمة، فلا يظهر نصه.")}>
        {p.scenes.map((s, i) => (
          <div key={i} className="grid gap-4 rounded-xl bg-black/[0.025] p-4 md:grid-cols-[16rem_1fr_auto]">
            <div>
              <div className="mb-1.5 text-sm font-semibold">{tr("المشهد")}{" "}{i + 1}</div>
              <MediaBox height="h-44" accept="image/*,video/mp4" folder={folder} value={s.media} onChange={(m) => setScene(i, { ...s, media: { ...m, pos: s.media?.pos } })} />
            </div>
            <div className="grid content-start gap-3">
              <TField label={tr("عنوان صغير")} hint={tr("اختياري")} value={s.kicker} onChange={(v) => setScene(i, { ...s, kicker: v })} />
              <TField label={tr("العنوان")} value={s.title} onChange={(v) => setScene(i, { ...s, title: v })} />
              <TField label={tr("النص")} hint={tr("اختياري")} multi value={s.text} onChange={(v) => setScene(i, { ...s, text: v })} />
            </div>
            <RowTools i={i} n={p.scenes.length} move={(a, b) => set("scenes", moveItem(p.scenes, a, b))} remove={() => confirm(tr("حذف هذا المشهد؟")) && set("scenes", p.scenes.filter((_, j) => j !== i))} />
          </div>
        ))}
        <button
          className="btn btn-light self-start"
          onClick={() => set("scenes", [...p.scenes, { media: { type: "image", src: "", w: 1600, h: 900 }, title: emptyT() }])}
        >{tr("+ إضافة مشهد")}</button>
      </Section>

      {!isNew && (
        <div className="mt-10 flex justify-end">
          <button className="btn btn-danger" onClick={remove}>{tr("حذف المشروع")}</button>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onCancel={() => setP(JSON.parse(saved))} />
    </div>
  );
}

export function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="card mt-6 p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {sub && <p className="mt-1 text-sm leading-6 text-black/55">{sub}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
