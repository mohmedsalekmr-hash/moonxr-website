import { notFound } from "next/navigation";
import Page, { generateMetadata as meta, generateStaticParams as all } from "../../projets/[slug]/page";

/** English address of a project page (/en/projects/…) — the same page as /fr/projets/…. */
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await all()).filter((p) => p.lang === "fr").map((p) => ({ ...p, lang: "en" }));
}
export async function generateMetadata(props: PageProps<"/[lang]/projects/[slug]">) {
  if ((await props.params).lang !== "en") notFound();
  return meta(props as unknown as PageProps<"/[lang]/projets/[slug]">);
}
export default async function EnglishProject(props: PageProps<"/[lang]/projects/[slug]">) {
  if ((await props.params).lang !== "en") notFound();
  return Page(props as unknown as PageProps<"/[lang]/projets/[slug]">);
}
