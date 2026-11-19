import "server-only";
import * as local from "@/data/projects";
import * as i18n from "@/data/i18n";
import { aboutPage, partnersPage, partnerPoints } from "@/data/pages";
import { explorer as defExplorer, steps as defSteps, type Explorer, type Step } from "@/data/explorer";
import { seo as defSeo, type Seo } from "@/data/seo";
import type { Project, Org } from "@/data/projects";

/**
 * All editable content comes from Supabase (managed in /admin).
 * The files in src/data are the defaults: if the database is unreachable,
 * or a field is missing, the site falls back to them and never breaks.
 */

export type HomeSection = { id: string; visible: boolean };
export type Contact = typeof i18n.CONTACT;
export type UI = typeof i18n.ui;

export type Content = {
  ui: UI;
  contact: Contact;
  services: i18n.Service[];
  explorer: Explorer;
  seo: Seo;
  steps: typeof i18n.steps;
  home: HomeSection[];
  about: typeof aboutPage;
  partnersPage: typeof partnersPage;
  projects: Project[];
  clients: Org[];
  partners: Org[];
  suppliers: Org[];
};

export const CONTENT_TAG = "content";
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function rest<R>(path: string): Promise<R | null> {
  if (!URL || !KEY) return null;
  try {
    const r = await fetch(`${URL}/rest/v1/${path}`, {
      headers: { apikey: KEY },
      next: { tags: [CONTENT_TAG], revalidate: 3600 },
      // a slow database never holds a page: after 4 s the local copy of the content is used
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    return (await r.json()) as R;
  } catch {
    return null;
  }
}

/** Deep merge: values from the database win, keys only present in code are kept. */
function merge<V>(base: V, over: unknown): V {
  if (over === null || over === undefined) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over as V;
  if (typeof over !== "object" || Array.isArray(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = merge(out[k], v);
  return out as V;
}

type ProjectRow = Pick<Project, "slug" | "category" | "title" | "short" | "meta" | "intro" | "cover" | "facts" | "scenes">;
type OrgRow = { kind: "client" | "partner" | "supplier"; name: string; logo: string; ratio: number; url: string | null; role: Org["role"] | null; body: Org["text"] | null; points: unknown; category?: string | null };

function toProject(row: ProjectRow): Project {
  const base = local.getProject(row.slug);
  return {
    // fields the admin does not edit yet come from the code
    story: base?.story ?? { need: row.intro, approach: row.intro, result: row.intro },
    gallery: base?.gallery ?? [],
    placeholders: base?.placeholders,
    ...row,
    facts: row.facts ?? [],
    scenes: row.scenes ?? [],
  };
}

function toOrg(row: OrgRow): Org {
  const o: Org = { name: row.name, logo: row.logo, r: Number(row.ratio) || 1 };
  if (row.url) o.url = row.url;
  if (row.role) o.role = row.role;
  if (row.body) o.text = row.body;
  if (row.category) o.category = row.category;
  o.points = Array.isArray(row.points) && row.points.length ? (row.points as Org["points"]) : partnerPoints[row.name];
  return o;
}

/**
 * Every text the site shows is { fr, ar, en }. Content saved before English existed
 * (or not translated yet) has no `en`: it is shown in French until the admin fills it in.
 */
function fillEnglish<V>(v: V): V {
  if (Array.isArray(v)) return v.map(fillEnglish) as V;
  if (!v || typeof v !== "object") return v;
  const o = v as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(o)) out[k] = fillEnglish(x);
  if ("fr" in o && "ar" in o) {
    const en = o.en;
    const empty = en === undefined || en === null || (typeof en === "string" && !en.trim()) || (Array.isArray(en) && !en.join("").trim());
    if (empty) out.en = o.fr;
  }
  return out as V;
}

/** The headset tour: texts from the admin, hotspots (ids, groups, order) always from the code. */
function toExplorer(v: unknown): Explorer {
  const db = (v ?? {}) as Partial<{ explorer: unknown; steps: Partial<Step>[] }>;
  return {
    explorer: merge(defExplorer, db.explorer),
    steps: defSteps.map((s) => {
      const o = db.steps?.find((x) => x.id === s.id);
      return o ? { ...s, title: o.title ?? s.title, text: o.text ?? s.text, spec: o.spec ?? s.spec } : s;
    }),
  };
}

const DEFAULT_HOME: HomeSection[] = ["hero", "about", "work", "process", "ecosystem", "contact"].map((id) => ({ id, visible: true }));

export async function getContent(): Promise<Content> {
  const [rows, orgs, kv] = await Promise.all([
    rest<ProjectRow[]>("projects?select=slug,category,title,short,meta,intro,cover,facts,scenes&published=eq.true&order=position"),
    rest<OrgRow[]>("orgs?select=*&visible=eq.true&order=position"),
    rest<{ key: string; value: unknown }[]>("site_content?select=key,value"),
  ]);
  const get = (k: string) => kv?.find((x) => x.key === k)?.value;
  const byKind = (k: OrgRow["kind"], fallback: Org[]) =>
    orgs?.length ? orgs.filter((o) => o.kind === k).map(toOrg) : fallback.map((o) => ({ ...o, points: partnerPoints[o.name] }));

  return fillEnglish({
    ui: merge(i18n.ui, get("ui")),
    contact: merge(i18n.CONTACT, get("contact")),
    services: (get("services") as i18n.Service[]) ?? i18n.services,
    explorer: toExplorer(get("explorer")),
    seo: merge(defSeo, get("seo")),
    steps: (get("steps") as typeof i18n.steps) ?? i18n.steps,
    home: (get("home_sections") as HomeSection[]) ?? DEFAULT_HOME,
    about: merge(aboutPage, get("about")),
    partnersPage: merge(partnersPage, get("partners_page")),
    projects: rows?.length ? rows.map(toProject) : local.projects,
    clients: byKind("client", local.clients),
    partners: byKind("partner", local.partners),
    suppliers: byKind("supplier", local.suppliers),
  });
}

/** What client components need (kept small: it is sent to the browser). */
export type Shared = { ui: UI; contact: Contact };
