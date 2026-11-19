import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";

/** Constant-time comparison, so the secret cannot be guessed from response times. */
function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// For maintenance: refreshes the site after a direct change in the database.
// POST /api/revalidate with header "x-secret: <REVALIDATE_SECRET>"
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-secret") ?? "";
  if (!secret || secret.length < 24 || !same(given, secret)) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
