"use client";
import { useShared } from "@/components/ContentProvider";

import { useState } from "react";
import { categories, type Category, type Project } from "@/data/projects";
import { type Locale } from "@/data/i18n";
import ProjectCard from "./ProjectCard";

export default function ProjectFilter({ projects, lang }: { projects: Project[]; lang: Locale }) {
  const { ui } = useShared();
  const [cat, setCat] = useState<Category | "all">("all");
  const list = cat === "all" ? projects : projects.filter((p) => p.category === cat);
  const tabs: (Category | "all")[] = ["all", "event", "training", "dev"];
  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              cat === c ? "border-sun bg-sun text-ink" : "border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink"
            }`}
          >
            {c === "all" ? ui.work.all[lang] : categories[c][lang]}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} lang={lang} index={projects.indexOf(p)} />
        ))}
      </div>
    </>
  );
}
