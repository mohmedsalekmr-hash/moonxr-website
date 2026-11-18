import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";

// For maintenance: refreshes the site after a direct change in the database.
// POST /api/revalidate with header "x-secret: <REVALIDATE_SECRET>"
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-secret") !== secret) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
