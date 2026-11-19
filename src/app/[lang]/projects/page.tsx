import { notFound } from "next/navigation";
import Page, { generateMetadata as meta } from "../projets/page";

/** English address of /projets — the same page; other languages keep the French address. */
export async function generateMetadata(props: PageProps<"/[lang]/projects">) {
  if ((await props.params).lang !== "en") notFound();
  return meta(props as unknown as PageProps<"/[lang]/projets">);
}
export default async function EnglishPage(props: PageProps<"/[lang]/projects">) {
  if ((await props.params).lang !== "en") notFound();
  return Page(props as unknown as PageProps<"/[lang]/projets">);
}
