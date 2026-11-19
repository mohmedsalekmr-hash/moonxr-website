import { notFound } from "next/navigation";
import Page, { generateMetadata as meta } from "../a-propos/page";

/** English address of /a-propos — the same page; other languages keep the French address. */
export async function generateMetadata(props: PageProps<"/[lang]/about">) {
  if ((await props.params).lang !== "en") notFound();
  return meta(props as unknown as PageProps<"/[lang]/a-propos">);
}
export default async function EnglishPage(props: PageProps<"/[lang]/about">) {
  if ((await props.params).lang !== "en") notFound();
  return Page(props as unknown as PageProps<"/[lang]/a-propos">);
}
