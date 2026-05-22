"use server";

import { Partner } from "@/data/partners";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, url, logo_url, is_visible")
      .order("name", { ascending: true });

    if (error) {
      console.error("getProvidersAction error:", error.message);
      return [];
    }

    return (data ?? []).map(mapRow);
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
    // Generate a clean slug ID from the name
    const id = provider.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("providers")
      .insert([{
        id,
        name: provider.name,
        url: provider.url,
        logo_url: provider.logo_url ?? null,
        is_visible: provider.is_visible ?? true,
      }])
      .select("id, name, url, logo_url, is_visible");

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: (data ?? []).map(mapRow) };
  } catch (err: any) {
    console.error("createProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── UPDATE: Edit an existing provider ───────────────────────────────────────
export async function updateProviderAction(
  id: string,
  provider: Partial<Partner>
) {
  try {
    const { data, error } = await supabase
      .from("providers")
      .update({
        name: provider.name,
        url: provider.url,
        logo_url: provider.logo_url ?? null,
        is_visible: provider.is_visible ?? true,
      })
      .eq("id", id)
      .select("id, name, url, logo_url, is_visible");

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data: (data ?? []).map(mapRow) };
  } catch (err: any) {
    console.error("updateProviderAction error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── DELETE: Remove a provider ────────────────────────────────────────────────
export async function deleteProviderAction(id: string) {
  try {
    const { error } = await supabase.from("providers").delete().eq("id", id);
    if (error) throw error;

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
