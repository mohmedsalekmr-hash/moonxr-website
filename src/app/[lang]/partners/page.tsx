import { notFound } from "next/navigation";
import Page, { generateMetadata as meta } from "../partenaires/page";

/** English address of /partenaires — the same page; other languages keep the French address. */
export async function generateMetadata(props: PageProps<"/[lang]/partners">) {
  if ((await props.params).lang !== "en") notFound();
  return meta(props as unknown as PageProps<"/[lang]/partenaires">);
}
export default async function EnglishPage(props: PageProps<"/[lang]/partners">) {
  if ((await props.params).lang !== "en") notFound();
  return Page(props as unknown as PageProps<"/[lang]/partenaires">);
}
