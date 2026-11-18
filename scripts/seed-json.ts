import { writeFileSync } from "node:fs";
import { projects, clients, partners, suppliers } from "../src/data/projects";
import { ui, services, steps, CONTACT } from "../src/data/i18n";
const orgs = [
  ...clients.map((o, i) => ({ kind: "client", o, i })),
  ...partners.map((o, i) => ({ kind: "partner", o, i })),
  ...suppliers.map((o, i) => ({ kind: "supplier", o, i })),
].map(({ kind, o, i }) => {
  const x = o as typeof o & { points?: unknown };
  return { kind, name: o.name, logo: o.logo, ratio: o.r, url: o.url ?? null, role: o.role ?? null, body: o.text ?? null, points: x.points ?? null, position: i };
});
const data = {
  projects: projects.map((p, i) => ({ slug: p.slug, category: p.category, position: i, title: p.title, short: p.short, meta: p.meta, intro: p.intro, cover: p.cover, facts: p.facts, scenes: p.scenes })),
  orgs,
  content: [
    { key: "ui", value: ui },
    { key: "services", value: services },
    { key: "steps", value: steps },
    { key: "contact", value: CONTACT },
    { key: "home_sections", value: ["hero", "about", "work", "process", "ecosystem", "contact"].map((id) => ({ id, visible: true })) },
  ],
};
writeFileSync("public/seed-7f3k.json", JSON.stringify(data));
console.log("ok");
