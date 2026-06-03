"use server";

import { Partner } from "@/data/partners";
import { revalidatePath } from "next/cache";

// ─── Base URL helper ──────────────────────────────────────────────────────────
// Works in both local dev and production (Vercel etc.)
function apiBase(): string {
  // Server-side: use the app URL env var, or fall back to localhost
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  return base.replace(/\/$/, "");
}

// ─── Row → Partner mapper ─────────────────────────────────────────────────────
function mapRow(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    logo_url: row.logo_url ?? undefined,
    is_visible: row.is_visible ?? true,
  };
}

// ─── READ: Get all providers ──────────────────────────────────────────────────
export async function getProvidersAction(): Promise<Partner[]> {
  try {
    const res = await fetch(`${apiBase()}/api/providers`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getProvidersAction: API responded with", res.status);
      return [];
    }

    const data = await res.json();
    return (Array.isArray(data) ? data : []).map(mapRow);
  } catch (err: any) {
    console.error("getProvidersAction unexpected error:", err);
    return [];
  }
}

// ─── CREATE: Add a new provider ───────────────────────────────────────────────
export async function createProviderAction(
  provider: Omit<Partner, "id"> & { name: string }
) {
  try {
    const res = await fetch(`${apiBase()}/api/providers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provider),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error ?? "Unknown error");

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: [mapRow(result.data)] };
  } catch (err: any) {
    console.error("createProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── UPDATE: Edit an existing provider ────────────────────────────────────────
export async function updateProviderAction(
  id: string,
  provider: Partial<Partner>
) {
  try {
    const res = await fetch(`${apiBase()}/api/providers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...provider }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error ?? "Unknown error");

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: [mapRow(result.data)] };
  } catch (err: any) {
    console.error("updateProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── DELETE: Remove a provider ────────────────────────────────────────────────
export async function deleteProviderAction(id: string) {
  try {
    const res = await fetch(`${apiBase()}/api/providers`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error ?? "Unknown error");

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true };
  } catch (err: any) {
    console.error("deleteProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── Legacy stubs (keep so old imports compile) ───────────────────────────────
export async function getCategoriesAction() { return []; }
export async function createCategoryAction() { return { success: false, error: "Removed" }; }
export async function updateCategoryAction() { return { success: false, error: "Removed" }; }
export async function deleteCategoryAction() { return { success: false, error: "Removed" }; }
export async function getProviderUsersAction() { return []; }
export async function createProviderUserAction() { return { success: false, error: "Removed" }; }
export async function updateProviderUserAction() { return { success: false, error: "Removed" }; }
export async function deleteProviderUserAction() { return { success: false, error: "Removed" }; }
