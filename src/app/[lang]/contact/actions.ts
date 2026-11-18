"use server";

export type SendResult = { ok: true } | { ok: false; reason: "invalid" | "flood" | "server" };

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const cut = (v: FormDataEntryValue | null, n: number) => String(v ?? "").trim().slice(0, n);

/** Saves a contact request in Supabase. Robots are dropped silently (honeypot + time check). */
export async function sendRequest(form: FormData): Promise<SendResult> {
  // honeypot: hidden field only robots fill; time: a human needs more than 3 s to fill the form
  const started = Number(form.get("t") || 0);
  if (cut(form.get("website"), 200) || !started || Date.now() - started < 3000) return { ok: true };

  const row = {
    name: cut(form.get("name"), 120),
    org: cut(form.get("org"), 160) || null,
    email: cut(form.get("email"), 200),
    phone: cut(form.get("phone"), 40) || null,
    kind: cut(form.get("type"), 120) || null,
    message: cut(form.get("message"), 5000),
    lang: form.get("lang") === "ar" ? "ar" : "fr",
  };
  if (row.name.length < 2 || row.message.length < 5 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) {
    return { ok: false, reason: "invalid" };
  }
  try {
    const res = await fetch(`${URL}/rest/v1/contact_requests`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    const body = await res.text();
    if (body.includes("too many requests")) return { ok: false, reason: "flood" };
    if (res.status === 400) return { ok: false, reason: "invalid" };
    return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "server" };
  }
}
