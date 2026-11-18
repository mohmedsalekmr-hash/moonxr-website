"use client";
import { sb } from "./sb";
import { publish } from "@/app/admin/actions";

/** Saves to the database, then refreshes the public site. Throws on error. */
export async function saveAndPublish(write: () => PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await write();
  if (error) throw new Error(error.message);
  const { data } = await sb.auth.getSession();
  const r = await publish(data.session?.access_token ?? "");
  if (!r.ok) throw new Error("تم الحفظ، لكن تعذّر تحديث الموقع");
}

