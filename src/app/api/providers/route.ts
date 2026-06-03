import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ─── Path to the JSON "database" ─────────────────────────────────────────────
const DB_PATH = path.join(process.cwd(), "src", "data", "providers.json");

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readProviders() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as any[];
  } catch {
    return [];
  }
}

function writeProviders(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function makeId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── GET — fetch all providers ───────────────────────────────────────────────
export async function GET() {
  const providers = readProviders();
  return NextResponse.json(providers);
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

    const providers = readProviders();

    // Generate a unique slug ID
    let id = makeId(name);
    // If ID already exists, append a short random suffix
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
    writeProviders(providers);

    return NextResponse.json({ success: true, data: newProvider });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
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

    const providers = readProviders();
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

    writeProviders(providers);

    return NextResponse.json({ success: true, data: providers[idx] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
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

    const providers = readProviders();
    const filtered = providers.filter((p) => p.id !== id);

    if (filtered.length === providers.length) {
      return NextResponse.json(
        { success: false, error: "Provider not found." },
        { status: 404 }
      );
    }

    writeProviders(filtered);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
