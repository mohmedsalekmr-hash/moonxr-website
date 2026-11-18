"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { CONTENT_TAG } from "@/lib/content";

/** Called after every save in /admin: checks the caller is an admin, then refreshes the public site. */
export async function publish(token: string): Promise<{ ok: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !token) return { ok: false };
  const sb = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: u } = await sb.auth.getUser(token);
  if (!u.user) return { ok: false };
  const { data } = await sb.from("admins").select("user_id").eq("user_id", u.user.id).maybeSingle();
  if (!data) return { ok: false };
  updateTag(CONTENT_TAG);
  // also drop cached pages (e.g. a project page that was hidden and is now published)
  revalidatePath("/", "layout");
  return { ok: true };
}
