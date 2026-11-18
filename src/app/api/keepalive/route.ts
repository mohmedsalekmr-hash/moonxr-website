// Called once a day by a Vercel cron so the free Supabase project never pauses for inactivity.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return Response.json({ ok: false });
  const r = await fetch(`${url}/rest/v1/site_content?select=key&limit=1`, { headers: { apikey: key }, cache: "no-store" });
  return Response.json({ ok: r.ok });
}
