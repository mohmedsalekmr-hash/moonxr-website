"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sb } from "./sb";
import { PAGES as TEXT_PAGES } from "./Texts";
import { hasUnsaved } from "./ui";
import { adminLang, setAdminLang, ADMIN_UI_LANGS, tr } from "./i18n";

/** Line icons (24×24 paths) for the menu. */
export const ICON = {
  overview: "M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-4H4zM14 7h6V4h-6z",
  requests: "M4 5h16v11H8l-4 4zM8 9h8M8 12h5",
  projects: "M4 6h16v12H4zM4 14l4-4 4 4 3-3 5 5",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  texts: "M5 6h14M5 11h14M5 16h9",
  orgs: "M4 20V8l8-4 8 4v12M9 20v-6h6v6M8 10h.01M16 10h.01",
  seo: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 11h6M11 8v6",
  contact: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  history: "M12 8v4l3 2M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8",
  brand: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  key: "M15 7a4 4 0 1 1-3.9 5H4v3h3v3h3v-3h1.1A4 4 0 0 1 15 7zM16 10h.01",
  logout: "M15 4h4v16h-4M10 17l5-5-5-5M15 12H4",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3z",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5 9-10",
  alert: "M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
};
export function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export type Tab = "overview" | "requests" | "projects" | "home" | "texts" | "orgs" | "seo" | "contact" | "history" | "brand";
export type Go = (tab: Tab, focus?: string) => void;

export const NAV: { group: string; items: { id: Tab; label: string; icon: string }[] }[] = [
  {
    group: "",
    items: [
      { id: "overview", label: tr("نظرة عامة"), icon: ICON.overview },
      { id: "requests", label: tr("الطلبات"), icon: ICON.requests },
    ],
  },
  {
    group: tr("المحتوى"),
    items: [
      { id: "projects", label: tr("المشاريع"), icon: ICON.projects },
      { id: "home", label: tr("الصفحة الرئيسية"), icon: ICON.home },
      { id: "texts", label: tr("نصوص الموقع"), icon: ICON.texts },
      { id: "orgs", label: tr("العملاء والشركاء"), icon: ICON.orgs },
    ],
  },
  {
    group: tr("الإعدادات"),
    items: [
      { id: "seo", label: tr("الظهور والمشاركة"), icon: ICON.seo },
      { id: "contact", label: tr("التواصل"), icon: ICON.contact },
      { id: "history", label: tr("السجل"), icon: ICON.history },
      { id: "brand", label: tr("دليل الهوية"), icon: ICON.brand },
    ],
  },
];
const ALL = NAV.flatMap((g) => g.items);
/** The four shortcuts of the phone's bottom bar; everything else is under «المزيد». */
const MOBILE: Tab[] = ["overview", "requests", "projects", "texts"];

/** Leaving a tab with unsaved edits asks first. */
export const confirmLeave = () => !hasUnsaved() || confirm(tr("لديك تعديلات غير محفوظة. الخروج دون حفظها؟"));

export function Shell({ tab, go, email, newCount, children }: { tab: Tab; go: Go; email: string; newCount: number; children: React.ReactNode }) {
  const [more, setMore] = useState(false);
  const [search, setSearch] = useState(false);
  const [toast, setToast] = useState<{ text: string; kind: "ok" | "error"; id: number } | null>(null);

  // the browser asks before closing the page with unsaved edits
  useEffect(() => {
    const on = (e: BeforeUnloadEvent) => {
      if (hasUnsaved()) e.preventDefault();
    };
    window.addEventListener("beforeunload", on);
    return () => window.removeEventListener("beforeunload", on);
  }, []);
  // Ctrl+K / ⌘K opens the search
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ text: string; kind: "ok" | "error" }>).detail;
      setToast({ ...d, id: Date.now() });
      clearTimeout(t);
      t = setTimeout(() => setToast(null), 3200);
    };
    window.addEventListener("mx-toast", on);
    return () => window.removeEventListener("mx-toast", on);
  }, []);

  const lang = adminLang();
  const site = `/${lang === "ar" ? "ar" : lang}`;

  const item = (i: (typeof ALL)[number], onPick?: () => void) => (
    <button
      key={i.id}
      onClick={() => {
        go(i.id);
        onPick?.();
      }}
      aria-current={tab === i.id ? "page" : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] font-semibold transition ${
        tab === i.id ? "bg-navy text-white shadow-[0_8px_20px_-12px_rgba(20,36,84,0.8)]" : "text-black/60 hover:bg-black/[0.04] hover:text-black"
      }`}
    >
      <Icon d={i.icon} className={`h-[1.15rem] w-[1.15rem] ${tab === i.id ? "text-sun" : "text-black/40 group-hover:text-black/70"}`} />
      <span className="flex-1 text-start">{i.label}</span>
      {i.id === "requests" && newCount > 0 && <span className="rounded-full bg-sun px-2 py-0.5 text-[0.7rem] font-bold text-ink">{newCount}</span>}
    </button>
  );

  return (
    <div className="min-h-screen lg:ps-64">
      {/* sidebar (computer) */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-black/[0.06] bg-white lg:flex">
        <div className="px-5 pb-4 pt-5">
                    <img src="/media/logos/moonxr-l.svg?v=2" alt="Moon XR" className="h-10 w-auto" />
          <div className="mt-2 text-xs font-semibold text-black/40">{tr("لوحة التحكم")}</div>
        </div>
        <button
          onClick={() => setSearch(true)}
          className="mx-4 mb-3 flex items-center gap-2 rounded-xl bg-black/[0.04] px-3 py-2 text-sm text-black/45 transition hover:bg-black/[0.07] hover:text-black/70"
        >
          <Icon d={ICON.search} className="h-4 w-4" />
          <span className="flex-1 text-start">{tr("بحث…")}</span>
          <kbd className="rounded bg-white px-1.5 py-0.5 font-sans text-[0.65rem] text-black/45 ring-1 ring-black/10" dir="ltr">
            Ctrl K
          </kbd>
        </button>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {NAV.map((g) => (
            <div key={g.group || "main"}>
              {g.group && <div className="mb-1.5 px-3 text-[0.7rem] font-bold uppercase tracking-wide text-black/35">{g.group}</div>}
              <div className="space-y-0.5">{g.items.map((i) => item(i))}</div>
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-black/[0.06] p-3">
          <a href={site} target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-black/60 hover:bg-black/[0.04] hover:text-black">
            <Icon d={ICON.external} className="h-4 w-4 text-black/40" />{tr("عرض الموقع")}</a>
          <LangPicker />
          <Account email={email} />
        </div>
      </aside>

      {/* top bar (phone and tablet) */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/[0.06] bg-white/90 px-4 py-2.5 backdrop-blur lg:hidden">
                <img src="/media/logos/moonxr-l.svg?v=2" alt="Moon XR" className="h-8 w-auto" />
        <div className="ms-auto flex items-center gap-1">
          <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full text-black/60 hover:bg-black/5" aria-label={tr("بحث")}>
            <Icon d={ICON.search} />
          </button>
          <a href={site} target="_blank" className="grid h-10 w-10 place-items-center rounded-full text-black/60 hover:bg-black/5" aria-label={tr("عرض الموقع")}>
            <Icon d={ICON.external} />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 lg:pb-12 lg:pt-8">{children}</main>

      {/* bottom bar (phone) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-black/[0.08] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {MOBILE.map((id) => {
          const i = ALL.find((x) => x.id === id)!;
          return (
            <button key={id} onClick={() => go(id)} className={`relative flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-semibold ${tab === id ? "text-navy" : "text-black/45"}`}>
              <Icon d={i.icon} className="h-5 w-5" />
              <span className="max-w-full truncate px-1">{i.label}</span>
              {id === "requests" && newCount > 0 && <span className="absolute end-[22%] top-1 h-2 w-2 rounded-full bg-sun ring-2 ring-white" />}
            </button>
          );
        })}
        <button onClick={() => setMore(true)} className={`flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-semibold ${!MOBILE.includes(tab) ? "text-navy" : "text-black/45"}`}>
          <Icon d={ICON.more} className="h-5 w-5" />{tr("المزيد")}</button>
      </nav>

      {/* «more» sheet (phone) */}
      {more && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMore(false)}>
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" />
            {NAV.map((g) => (
              <div key={g.group || "main"} className="mb-3">
                {g.group && <div className="mb-1 px-3 text-[0.7rem] font-bold text-black/35">{g.group}</div>}
                {g.items.map((i) => item(i, () => setMore(false)))}
              </div>
            ))}
            <div className="space-y-1 border-t border-black/[0.06] pt-3">
              <LangPicker />
              <Account email={email} />
            </div>
          </div>
        </div>
      )}

      {search && <Search go={go} onClose={() => setSearch(false)} />}

      {toast && (
        <div key={toast.id} role="status" className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6">
          <div className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-xl ${toast.kind === "ok" ? "bg-emerald-600" : "bg-red-600"}`} style={{ animation: "mx-pop .25s ease-out" }}>
            <Icon d={toast.kind === "ok" ? ICON.check : ICON.alert} className="h-4 w-4" />
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}

function LangPicker() {
  const cur = adminLang();
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-black/60">
      <Icon d={ICON.globe} className="h-4 w-4 text-black/40" />
      <div className="flex flex-1 gap-1 rounded-full bg-black/[0.05] p-0.5">
        {ADMIN_UI_LANGS.map((l) => (
          <button
            key={l.k}
            onClick={() => l.k !== cur && confirmLeave() && setAdminLang(l.k)}
            className={`flex-1 rounded-full px-2 py-1 text-xs font-semibold transition ${cur === l.k ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}
            title={tr("لغة لوحة التحكم")}
          >
            {l.short}
          </button>
        ))}
      </div>
    </div>
  );
}

function Account({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start hover:bg-black/[0.04]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold uppercase text-white">{email.slice(0, 1)}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-black/55" dir="ltr">
          {email}
        </span>
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 ps-3">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-black/60 hover:bg-black/[0.04] hover:text-black"
            onClick={async () => {
              const p = prompt(tr("كلمة المرور الجديدة (8 أحرف على الأقل):"));
              if (!p) return;
              if (p.length < 8) return alert(tr("كلمة المرور قصيرة جداً"));
              const { error } = await sb.auth.updateUser({ password: p });
              alert(error ? error.message : tr("تم تغيير كلمة المرور"));
            }}
          >
            <Icon d={ICON.key} className="h-4 w-4 text-black/40" />{tr("كلمة المرور")}</button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => confirmLeave() && sb.auth.signOut()}>
            <Icon d={ICON.logout} className="h-4 w-4" />{tr("خروج")}</button>
        </div>
      )}
    </div>
  );
}

type Hit = { kind: string; title: string; sub?: string; tab: Tab; focus?: string };

/** Search across tabs, site texts (and their wording), projects, logos and sharing settings. */
function Search({ go, onClose }: { go: Go; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [data, setData] = useState<Hit[]>([]);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const base: Hit[] = [
      ...ALL.map((i) => ({ kind: tr("قسم"), title: i.label, tab: i.id })),
      { kind: tr("إجراء"), title: tr("مشروع جديد"), tab: "projects" as Tab, focus: "new" },
    ];
    Promise.all([sb.from("projects").select("slug,title,short"), sb.from("orgs").select("name,kind"), sb.from("site_content").select("key,value").eq("key", "ui").maybeSingle()]).then(([p, o, u]) => {
      const ui = (u.data?.value ?? {}) as Record<string, unknown>;
      const get = (path: string) => path.split(".").reduce<unknown>((x, k) => (x as Record<string, unknown> | undefined)?.[k], ui) as Record<string, string> | undefined;
      const texts: Hit[] = TEXT_PAGES.flatMap((pg) =>
        pg.fields.map(([path, label]) => {
          const v = get(path);
          return { kind: tr("نص"), title: label, sub: `${pg.name}${v ? " · " + (v.ar || v.fr || "") : ""}`, tab: "texts" as Tab, focus: pg.id };
        }),
      );
      const projects: Hit[] = ((p.data ?? []) as { slug: string; title: Record<string, string>; short: Record<string, string> }[]).map((r) => ({
        kind: tr("مشروع"),
        title: r.title?.ar || r.title?.fr || r.slug,
        sub: [r.title?.fr, r.title?.en, r.short?.ar].filter(Boolean).join(" · "),
        tab: "projects",
        focus: r.slug,
      }));
      const orgs: Hit[] = ((o.data ?? []) as { name: string; kind: string }[]).map((r) => ({
        kind: tr("شعار"),
        title: r.name,
        sub: r.kind === "client" ? tr("عميل") : r.kind === "partner" ? tr("شريك") : tr("مورد تقني"),
        tab: "orgs",
      }));
      setData([...base, ...projects, ...texts, ...orgs]);
    });
  }, []);

  const hits = useMemo(() => {
    const n = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ْ]/g, "");
    const words = n(q).split(/\s+/).filter(Boolean);
    if (!words.length) return data.filter((h) => h.kind === tr("قسم") || h.kind === tr("إجراء"));
    const list = data.filter((h) => words.every((w) => n(`${h.title} ${h.sub ?? ""} ${h.kind}`).includes(w)));
    // best first: matches in the title before matches in the details
    const score = (h: Hit) => (words.every((w) => n(h.title).includes(w)) ? 0 : 1);
    return list.sort((x, y) => score(x) - score(y)).slice(0, 40);
  }, [q, data]);

  const pick = (h?: Hit) => {
    if (!h) return;
    onClose();
    go(h.tab, h.focus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-black/[0.07] px-4">
          <Icon d={ICON.search} className="h-5 w-5 text-black/35" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, hits.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              }
              if (e.key === "Enter") pick(hits[sel]);
              if (e.key === "Escape") onClose();
            }}
            placeholder={tr("ابحث عن مشروع، نص، شعار، أو قسم…")}
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-black/35"
          />
          <kbd className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[0.65rem] text-black/45">Esc</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2">
          {hits.length === 0 && <li className="px-3 py-8 text-center text-sm text-black/40">{tr("لا نتائج")}</li>}
          {hits.map((h, i) => (
            <li key={`${h.kind}-${h.title}-${i}`}>
              <button
                onMouseEnter={() => setSel(i)}
                onClick={() => pick(h)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start ${sel === i ? "bg-navy/[0.06]" : ""}`}
              >
                <span className="w-14 shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-center text-[0.68rem] font-semibold text-black/50">{h.kind}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{h.title}</span>
                  {h.sub && <span className="block truncate text-xs text-black/45">{h.sub}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
