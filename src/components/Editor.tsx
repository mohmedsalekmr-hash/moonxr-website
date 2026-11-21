"use client";

/**
 * Edit mode on the public site: hover any text or photo, click it, change it, save.
 * Nothing on the pages is tagged: the clicked text (or photo) is looked up in everything
 * the admin stores (site texts, projects, logos), and saved back to the same place.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { sb } from "@/admin/sb";
import { tr } from "@/admin/i18n";
import { saveAndPublish } from "@/admin/save";
import { uploadMedia } from "@/admin/media";
import { merge } from "@/admin/useContent";
import * as I from "@/data/i18n";
import { aboutPage, partnersPage } from "@/data/pages";
import { explorer as defExplorer, steps as defTour } from "@/data/explorer";
import { SERVICE_IMG } from "@/components/ServiceBento";
import { PAGES } from "@/admin/Texts";

/** Words for the parts of a stored item, so the place reads "Project X › Scene 2 › Title". */
const FIELD: Record<string, string> = {
  title: "العنوان", sub: "الفقرة", kicker: "العنوان الصغير", text: "النص", intro: "المقدمة", short: "الوصف القصير", meta: "السطر تحت العنوان",
  facts: "المعلومات", k: "الاسم", v: "القيمة", scenes: "المشهد", cover: "صورة الغلاف", gallery: "صورة المعرض", src: "", image: "الصورة",
  caption: "التعليق", items: "العنصر", t: "العنوان", d: "الشرح", role: "الدور", body: "الوصف", points: "النقطة", story: "القصة",
  need: "الحاجة", approach: "ما قمنا به", result: "النتيجة", pillars: "«التزامنا»", xr: "«الاسم»", heroShots: "صور أعلى الصفحة", logo: "الشعار", alt: "",
};
const uiLabels = new Map(PAGES.flatMap((pg) => pg.fields.map(([path, label]) => [path, `${pg.name} › ${label}`] as const)));
function placeLabel(src: { id: string; label: string }, path: (string | number)[]) {
  if (src.id === "ui") {
    const key = path.join(".");
    const found = uiLabels.get(key) ?? uiLabels.get(path.slice(0, -1).join("."));
    if (found) return found;
  }
  const parts: string[] = [];
  path.forEach((k, i) => {
    if (typeof k === "number") {
      if (parts.length) parts[parts.length - 1] += ` ${k + 1}`;
      else parts.push(String(k + 1));
    } else if (!(k in { fr: 1, ar: 1, en: 1 })) {
      const w = FIELD[k];
      if (w === undefined) parts.push(k);
      else if (w) parts.push(tr(w));
    }
    void i;
  });
  return [src.label, ...parts].join(" › ");
}

type Lang = "fr" | "ar" | "en";
type TT = { fr: string; ar: string; en?: string };
type Path = (string | number)[];
type Source = { id: string; label: string; value: unknown; save: (v: unknown) => Promise<void> };
type Hit = { src: Source; path: Path; label: string };

const LANGS: { k: Lang; name: string; dir: "rtl" | "ltr" }[] = [
  { k: "ar", name: "العربية", dir: "rtl" },
  { k: "fr", name: "Français", dir: "ltr" },
  { k: "en", name: "English", dir: "ltr" },
];

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
/** "/media/photos/x-480.webp" and "/media/photos/x.webp" are the same photo */
const normSrc = (s: string) => {
  try {
    s = new URL(s, location.origin).pathname;
  } catch {}
  return decodeURIComponent(s).replace(/-(\d{3,4})\.webp$/, ".webp");
};
const isT = (v: unknown): v is TT => !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as TT).fr === "string" && typeof (v as TT).ar === "string";
const IMG = /\.(webp|png|jpe?g|svg|gif|avif)$/i;

function getAt(v: unknown, p: Path): unknown {
  return p.reduce<unknown>((o, k) => (o == null ? o : (o as Record<string | number, unknown>)[k]), v);
}
function setAt<V>(v: V, p: Path, x: unknown): V {
  if (!p.length) return x as V;
  const [k, ...rest] = p;
  const base: Record<string | number, unknown> = Array.isArray(v) ? [...(v as unknown[])] as unknown as Record<number, unknown> : { ...(v as Record<string, unknown>) };
  base[k] = setAt(base[k], rest, x);
  return base as V;
}

/** Every place where a text (in the page's language) or a photo is stored. */
function find(sources: Source[], lang: Lang, want: { text?: string; img?: string }): Hit[] {
  const hits: Hit[] = [];
  const walk = (src: Source, v: unknown, path: Path) => {
    if (want.text && isT(v)) {
      const shown = lang === "en" && !(v.en ?? "").trim() ? v.fr : v[lang] ?? "";
      if (norm(shown) === want.text) hits.push({ src, path, label: placeLabel(src, path) });
      return;
    }
    if (typeof v === "string") {
      if (want.text && norm(v) === want.text) hits.push({ src, path, label: placeLabel(src, path) });
      if (want.img && IMG.test(v) && normSrc(v) === want.img) hits.push({ src, path, label: placeLabel(src, path) });
      return;
    }
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(src, x, [...path, Array.isArray(v) ? Number(k) : k]);
  };
  for (const s of sources) walk(s, s.value, []);
  return hits;
}

async function loadSources(): Promise<Source[]> {
  const [{ data: kv }, { data: projects }, { data: orgs }] = await Promise.all([
    sb.from("site_content").select("key,value"),
    sb.from("projects").select("*").order("position"),
    sb.from("orgs").select("*").order("position"),
  ]);
  const db = (k: string) => kv?.find((x) => x.key === k)?.value;
  const content = (key: string, label: string, value: unknown): Source => ({
    id: key,
    label,
    value,
    save: async (v) => {
      await saveAndPublish(() => sb.from("site_content").upsert({ key, value: v }));
    },
  });
  // the four service photos live in the code until one is chosen in the admin
  const services = ((db("services") as I.Service[]) ?? I.services).map((s, i) => ({ ...s, image: s.image ?? SERVICE_IMG[i % 4].src }));
  const ex = (db("explorer") as { explorer?: unknown; steps?: { id: string }[] }) ?? {};
  const out: Source[] = [
    content("ui", tr("نصوص الموقع"), merge(I.ui, db("ui"))),
    content("about", tr("صفحة «من نحن»"), merge(aboutPage, db("about"))),
    content("partners_page", tr("صفحة «الشركاء»"), merge(partnersPage, db("partners_page"))),
    content("contact", tr("بيانات التواصل"), merge(I.CONTACT, db("contact"))),
    content("services", tr("الخدمات"), services),
    content("steps", tr("خطوات العمل"), (db("steps") as unknown) ?? I.steps),
    content("explorer", tr("النظارة ثلاثية الأبعاد"), {
      explorer: merge(defExplorer, ex.explorer),
      steps: defTour.map((s) => merge(s, ex.steps?.find((x) => x.id === s.id))),
    }),
  ];
  for (const p of projects ?? []) {
    const { slug, title } = p as { slug: string; title: TT };
    const { id: _id, position: _p, created_at: _c, updated_at: _u, ...fields } = p as Record<string, unknown>;
    out.push({
      id: `project:${slug}`,
      label: `${tr("مشروع")}: ${title?.ar || title?.fr || slug}`,
      value: fields,
      save: async (v) => {
        const next = v as Record<string, unknown>;
        const changed = Object.fromEntries(Object.entries(next).filter(([k, x]) => JSON.stringify(x) !== JSON.stringify(fields[k])));
        await saveAndPublish(() => sb.from("projects").update(changed).eq("slug", slug));
      },
    });
  }
  for (const o of orgs ?? []) {
    const { id, name, logo, role, body, points, image } = o as Record<string, unknown>;
    const value = { name, logo, role, body, points, image };
    out.push({
      id: `org:${id}`,
      label: `${tr("شعار")}: ${name}`,
      value,
      save: async (v) => {
        await saveAndPublish(() => sb.from("orgs").update(v as Record<string, unknown>).eq("id", id as string));
      },
    });
  }
  return out;
}

type Target = { el: HTMLElement; kind: "text" | "img"; text?: string; img?: string; hits: Hit[] };

export default function Editor({ onClose }: { onClose: () => void }) {
  const lang = ((location.pathname.split("/")[1] || "fr") as Lang) in { fr: 1, ar: 1, en: 1 } ? (location.pathname.split("/")[1] as Lang) : "fr";
  const [sources, setSources] = useState<Source[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [miss, setMiss] = useState("");
  const hover = useRef<HTMLElement | null>(null);

  // only an admin of the site may edit (the database refuses everyone else anyway)
  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getSession();
      const uid = data.session?.user.id;
      const ok = uid ? !!(await sb.from("admins").select("user_id").eq("user_id", uid).maybeSingle()).data : false;
      if (!ok) return setDenied(true);
      setSources(await loadSources());
    })();
  }, []);

  /** The clicked element, or the nearest parent, whose text or photo is stored somewhere. */
  const cache = useRef(new WeakMap<HTMLElement, Target | null>());
  const resolve = useCallback(
    (start: HTMLElement, x: number, y: number): Target | null => {
      if (!sources) return null;
      // photos first: the one actually visible under the pointer (slideshows stack several, most of them hidden)
      if (start instanceof HTMLImageElement || !norm(start.innerText || "")) {
        const img = visibleImgAt(x, y);
        if (img) {
          const src = normSrc(img.currentSrc || img.src);
          return { el: img, kind: "img", img: src, hits: find(sources, lang, { img: src }) };
        }
      }
      if (cache.current.has(start)) return cache.current.get(start)!;
      const r = look(start);
      cache.current.set(start, r);
      return r;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources, lang],
  );
  /** The topmost image under the point that can really be seen (not faded out, not hidden). */
  const visibleImgAt = (x: number, y: number): HTMLImageElement | null => {
    for (const el of document.elementsFromPoint(x, y)) {
      if (el.closest("[data-mx-editor]")) continue;
      if (!(el instanceof HTMLImageElement)) continue;
      let shown = true;
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.15) {
          shown = false;
          break;
        }
      }
      if (shown) return el;
    }
    return null;
  };
  const look = (start: HTMLElement): Target | null => {
      if (!sources) return null;
      let el: HTMLElement | null = start;
      for (let up = 0; el && up < 5 && el !== document.body; up++, el = el.parentElement) {
        if (el.closest("[data-mx-editor]")) return null;
        const img = el instanceof HTMLImageElement ? el : null;
        if (img) {
          const src = normSrc(img.currentSrc || img.src);
          const hits = find(sources, lang, { img: src });
          return { el: img, kind: "img", img: src, hits };
        }
        const text = norm(el.innerText || "");
        if (text && text.length < 1200) {
          const hits = find(sources, lang, { text });
          if (hits.length) return { el, kind: "text", text, hits };
        }
      }
      // a photo under a caption or a dark layer
      const img = start.closest("a,div,figure,li")?.querySelector("img");
      if (img && !start.innerText?.trim()) {
        const src = normSrc(img.currentSrc || img.src);
        return { el: img as HTMLElement, kind: "img", img: src, hits: find(sources, lang, { img: src }) };
      }
      return null;
  };

  useEffect(() => {
    if (!sources) return;
    document.documentElement.classList.add("mx-editing");
    const mark = (el: HTMLElement | null) => {
      hover.current?.removeAttribute("data-mx-hover");
      hover.current = el;
      el?.setAttribute("data-mx-hover", "");
    };
    const onMove = (e: MouseEvent) => {
      if (target) return;
      const t = e.target as HTMLElement;
      if (t.closest("[data-mx-editor]")) return mark(null);
      const r = resolve(t, e.clientX, e.clientY);
      mark(r?.el ?? null);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-mx-editor]") || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const r = resolve(t, e.clientX, e.clientY);
      if (!r || !r.hits.length) {
        setMiss(r?.kind === "img" ? tr("هذه الصورة يختارها الموقع تلقائياً. غيّرها من لوحة التحكم.") : tr("هذا الجزء لا يُعدَّل من هنا."));
        setTimeout(() => setMiss(""), 2600);
        return;
      }
      mark(null);
      setTarget(r);
    };
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.documentElement.classList.remove("mx-editing");
      mark(null);
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [sources, resolve, target]);

  return (
    <div data-mx-editor>
      <style>{`
        html.mx-editing [data-mx-hover]{outline:2px dashed #FAB62D!important;outline-offset:4px;cursor:pointer!important;border-radius:6px}
        html.mx-editing a, html.mx-editing button{cursor:default}
      `}</style>
      <div className="fixed inset-x-0 bottom-0 z-[90] flex justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="flex flex-wrap items-center gap-3 rounded-full bg-navy px-5 py-3 text-sm text-white shadow-[0_20px_50px_-15px_rgba(10,20,49,.7)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sun" />
          <span className="font-semibold">{denied ? tr("هذا الحساب ليس حساب مدير.") : sources ? tr("وضع التعديل: اضغط على أي نص أو صورة لتعديلها") : tr("جارٍ التحميل…")}</span>
          {sources && <span className="hidden text-white/55 md:inline">{tr("للتنقّل بين الصفحات: Alt + ضغطة")}</span>}
          <button type="button" onClick={onClose} className="rounded-full bg-white/15 px-3 py-1 font-semibold hover:bg-white/25">
            {tr("إنهاء")}
          </button>
        </div>
      </div>
      {miss && (
        <div className="fixed inset-x-0 top-24 z-[90] flex justify-center px-4">
          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-xl ring-1 ring-line">{miss}</div>
        </div>
      )}
      {target && <Panel target={target} lang={lang} onClose={() => setTarget(null)} />}
    </div>
  );
}

function Panel({ target, lang, onClose }: { target: Target; lang: Lang; onClose: () => void }) {
  const [pick, setPick] = useState(0);
  const [all, setAll] = useState(false);
  const hit = target.hits[pick];
  const cur = getAt(hit.src.value, hit.path);
  const [val, setVal] = useState<unknown>(cur);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setVal(getAt(target.hits[pick].src.value, target.hits[pick].path)), [pick, target]);

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      const chosen = all ? target.hits : [hit];
      // group by source: one save per place, with every change applied
      const by = new Map<Source, Path[]>();
      for (const h of chosen) by.set(h.src, [...(by.get(h.src) ?? []), h.path]);
      for (const [src, paths] of by) {
        let v = src.value;
        for (const p of paths) {
          const old = getAt(v, p);
          v = setAt(v, p, isT(old) && isT(val) ? { ...old, ...val } : val);
        }
        await src.save(v);
        src.value = v;
      }
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("خطأ"));
      setBusy(false);
    }
  };

  const upload = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const m = await uploadMedia(f, "site");
      // a photo stored with its size (project covers, scenes) keeps the size in step
      const parentPath = hit.path.slice(0, -1);
      const parent = getAt(hit.src.value, parentPath) as Record<string, unknown> | undefined;
      if (hit.path[hit.path.length - 1] === "src" && parent && "w" in parent) {
        const next = setAt(hit.src.value, parentPath, { ...parent, src: m.src, w: m.w, h: m.h });
        await hit.src.save(next);
      } else {
        await hit.src.save(setAt(hit.src.value, hit.path, m.src));
      }
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr("فشل الرفع"));
      setBusy(false);
    }
  };

  const ui = lang === "ar" ? "rtl" : "ltr";
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-navy-deep/30 p-3 backdrop-blur-[2px] md:items-center" onClick={onClose} dir={ui}>
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 text-ink shadow-2xl md:p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">{target.kind === "img" ? tr("تغيير الصورة") : tr("تعديل النص")}</h2>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5 hover:bg-black/10" aria-label={tr("إغلاق")}>
            ✕
          </button>
        </div>

        {target.hits.length > 1 && (
          <div className="mt-4 rounded-xl bg-sun/15 p-3 text-sm">
            <div className="font-semibold">{tr("هذا المحتوى موجود في {0} أماكن:", target.hits.length)}</div>
            <div className="mt-2 grid gap-1.5">
              {target.hits.map((h, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="radio" checked={!all && pick === i} onChange={() => (setAll(false), setPick(i))} />
                  <span className="text-ink/75">{h.label}</span>
                </label>
              ))}
              {target.kind === "text" && (
                <label className="mt-1 flex items-center gap-2 font-semibold">
                  <input type="radio" checked={all} onChange={() => setAll(true)} />
                  {tr("تعديلها كلها معاً")}
                </label>
              )}
            </div>
          </div>
        )}
        {target.hits.length === 1 && <p className="mt-1 text-xs text-ink/45">{hit.label}</p>}

        {target.kind === "img" ? (
          <div className="mt-5">
            <img src={typeof cur === "string" ? cur : ""} alt="" className="max-h-64 w-full rounded-xl bg-black/5 object-contain" />
            <label className={`mt-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-black/15 p-5 text-sm font-semibold hover:border-brand ${busy ? "opacity-50" : ""}`}>
              {busy ? tr("جارٍ الضغط والرفع…") : tr("اختر صورة جديدة")}
              <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </div>
        ) : isT(val) ? (
          <div className="mt-5 grid gap-4">
            {LANGS.map((l) => (
              <label key={l.k} className="block">
                <span className={`text-xs font-semibold ${l.k === lang ? "text-brand" : "text-ink/50"}`}>
                  {l.name}
                  {l.k === lang ? ` · ${tr("لغة هذه الصفحة")}` : ""}
                </span>
                <textarea
                  dir={l.dir}
                  rows={Math.min(6, Math.max(2, Math.ceil(((val as TT)[l.k] ?? "").length / 60)))}
                  value={(val as TT)[l.k] ?? ""}
                  onChange={(e) => setVal({ ...(val as TT), [l.k]: e.target.value })}
                  className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-[15px] outline-none focus:border-brand ${l.k === lang ? "border-brand/40 bg-brand-soft/30" : "border-black/10"}`}
                />
              </label>
            ))}
          </div>
        ) : (
          <input value={String(val ?? "")} onChange={(e) => setVal(e.target.value)} dir="auto" className="mt-5 w-full rounded-xl border border-black/10 px-3 py-2.5 outline-none focus:border-brand" />
        )}

        {err && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        {target.kind === "text" && (
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink/60 hover:bg-black/5">
              {tr("إلغاء")}
            </button>
            <button type="button" disabled={busy} onClick={save} className="rounded-full bg-sun px-6 py-2.5 text-sm font-bold text-ink disabled:opacity-50">
              {busy ? tr("جارٍ الحفظ…") : tr("حفظ ونشر")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
