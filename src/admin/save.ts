"use client";
import { tr } from "./i18n";
import { sb } from "./sb";
import { publish } from "@/app/admin/actions";

/** Saves to the database, then refreshes the public site. Throws on error. */
export async function saveAndPublish(write: () => PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await write();
  if (error) throw new Error(error.message);
  const { data } = await sb.auth.getSession();
  const r = await publish(data.session?.access_token ?? "");
  if (!r.ok) throw new Error(tr("تم الحفظ، لكن تعذّر تحديث الموقع"));
  toast(tr("تم الحفظ والنشر على الموقع"));
}

/** Small confirmation at the bottom of the screen (shown by the admin shell). */
export function toast(text: string, kind: "ok" | "error" = "ok") {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("mx-toast", { detail: { text, kind } }));
}

