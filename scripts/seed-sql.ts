// Generates SQL that copies the current site content (code) into Supabase.
import { writeFileSync } from "node:fs";
import { projects, clients, partners, suppliers } from "../src/data/projects";
import { ui, services, steps, CONTACT } from "../src/data/i18n";

const j = (v: unknown) => `'${JSON.stringify(v ?? null).replace(/'/g, "''")}'::jsonb`;
const s = (v: string) => `'${v.replace(/'/g, "''")}'`;
const out: string[] = [];

out.push("delete from public.projects; delete from public.orgs; delete from public.site_content;");
projects.forEach((p, i) => {
  out.push(
    `insert into public.projects (slug, category, position, title, short, meta, intro, cover, facts, scenes) values (${s(p.slug)}, ${s(p.category)}, ${i}, ${j(p.title)}, ${j(p.short)}, ${j(p.meta)}, ${j(p.intro)}, ${j(p.cover)}, ${j(p.facts)}, ${j(p.scenes)});`,
  );
});
const orgs: [string, typeof clients][] = [["client", clients], ["partner", partners], ["supplier", suppliers]];
for (const [kind, list] of orgs) {
  list.forEach((o, i) => {
    const x = o as typeof o & { points?: unknown };
    out.push(
      `insert into public.orgs (kind, name, logo, ratio, url, role, body, points, position) values (${s(kind)}, ${s(o.name)}, ${s(o.logo)}, ${o.r}, ${o.url ? s(o.url) : "null"}, ${j(o.role)}, ${j(o.text)}, ${j(x.points)}, ${i});`,
    );
  });
}
const content: Record<string, unknown> = {
  ui,
  services,
  steps,
  contact: CONTACT,
  home_sections: [
    { id: "hero", visible: true },
    { id: "about", visible: true },
    { id: "work", visible: true },
    { id: "process", visible: true },
    { id: "ecosystem", visible: true },
    { id: "contact", visible: true },
  ],
};
for (const [k, v] of Object.entries(content)) out.push(`insert into public.site_content (key, value) values (${s(k)}, ${j(v)});`);
writeFileSync("/tmp/seed.sql", out.join("\n"));
console.log(out.length, "statements");
