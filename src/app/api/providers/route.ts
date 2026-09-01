import { NextRequest, NextResponse } from "next/server";
import { readProviders, writeProviders, deleteProviderFromDb } from "@/lib/db";

function makeId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── GET — fetch all providers ───────────────────────────────────────────────
export async function GET() {
  try {
    const providers = await readProviders();
    return NextResponse.json(providers);
  } catch (err) {
    console.error("GET /api/providers error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// ─── POST — create a new provider ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, logo_url, is_visible } = body;

    if (!name?.trim() || !url?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and URL are required." },
        { status: 400 }
      );
    }

    const providers = await readProviders();

    let id = makeId(name);
    if (providers.some((p) => p.id === id)) {
      id = `${id}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const newProvider = {
      id,
      name: name.trim(),
      url: url.trim(),
      logo_url: logo_url ?? null,
      is_visible: is_visible ?? true,
    };

    providers.push(newProvider);
    await writeProviders(providers);

    return NextResponse.json({ success: true, data: newProvider });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/providers error:", err);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}

// ─── PUT — update an existing provider ───────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, url, logo_url, is_visible } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Provider ID is required." },
        { status: 400 }
      );
    }

    const providers = await readProviders();
    const idx = providers.findIndex((p) => p.id === id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Provider not found." },
        { status: 404 }
      );
    }

    providers[idx] = {
      ...providers[idx],
      ...(name !== undefined && { name: name.trim() }),
      ...(url !== undefined && { url: url.trim() }),
      ...(logo_url !== undefined && { logo_url: logo_url ?? null }),
      ...(is_visible !== undefined && { is_visible }),
    };

    await writeProviders(providers);

    return NextResponse.json({ success: true, data: providers[idx] });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("PUT /api/providers error:", err);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}

// ─── DELETE — remove a provider ───────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Provider ID is required." },
        { status: 400 }
      );
    }

    const providers = await readProviders();
    const filtered = providers.filter((p) => p.id !== id);

    if (filtered.length === providers.length) {
      return NextResponse.json(
        { success: false, error: "Provider not found." },
        { status: 404 }
      );
    }

    await deleteProviderFromDb(id);
    await writeProviders(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("DELETE /api/providers error:", err);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
