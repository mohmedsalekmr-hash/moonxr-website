"use server";

import { Partner } from "@/data/partners";
import { revalidatePath } from "next/cache";
import { readProviders, writeProviders } from "@/lib/db";

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

function makeId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── READ: Get all providers ──────────────────────────────────────────────────
export async function getProvidersAction(): Promise<Partner[]> {
  try {
    const data = await readProviders();
    console.log("getProvidersAction retrieved from DB:", data.length, "providers");
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
    const { name, url, logo_url, is_visible } = provider;
    if (!name?.trim() || !url?.trim()) {
      throw new Error("Name and URL are required.");
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

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: [mapRow(newProvider)] };
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
    if (!id) throw new Error("Provider ID is required.");

    const { name, url, logo_url, is_visible } = provider;
    const providers = await readProviders();
    const idx = providers.findIndex((p) => p.id === id);

    if (idx === -1) {
      throw new Error("Provider not found.");
    }

    providers[idx] = {
      ...providers[idx],
      ...(name !== undefined && { name: name.trim() }),
      ...(url !== undefined && { url: url.trim() }),
      ...(logo_url !== undefined && { logo_url: logo_url ?? null }),
      ...(is_visible !== undefined && { is_visible }),
    };

    await writeProviders(providers);

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: [mapRow(providers[idx])] };
  } catch (err: any) {
    console.error("updateProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── DELETE: Remove a provider ────────────────────────────────────────────────
export async function deleteProviderAction(id: string) {
  try {
    if (!id) throw new Error("Provider ID is required.");

    const providers = await readProviders();
    const filtered = providers.filter((p) => p.id !== id);

    if (filtered.length === providers.length) {
      throw new Error("Provider not found.");
    }

    await writeProviders(filtered);

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
