"use server";

import { Partner } from "@/data/partners";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// ─── Row mapping ──────────────────────────────────────────────────────────────
// Maps a Supabase DB row to the Partner object used in the frontend.
// Only reads the 5 columns the website actually needs.
function mapRowToPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    domain: row.domain,
    logoUrl: row.logo_url || undefined,
    isVisible: row.is_visible ?? true,
  };
}

// ─── READ ─────────────────────────────────────────────────────────────────────
export async function getProvidersAction(): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, domain, logo_url, is_visible")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching providers:", error);
      return [];
    }

    return (data || []).map(mapRowToPartner);
  } catch (err) {
    console.error("Unexpected error in getProvidersAction:", err);
    return [];
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────
export async function createProviderAction(partner: Partner) {
  try {
    const row = {
      id: partner.id,
      name: partner.name,
      domain: partner.domain,
      logo_url: partner.logoUrl || null,
      is_visible: partner.isVisible ?? true,
    };

    const { data, error } = await supabase
      .from("providers")
      .insert([row])
      .select("id, name, domain, logo_url, is_visible");

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in createProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export async function updateProviderAction(id: string, partner: Partner) {
  try {
    const row = {
      name: partner.name,
      domain: partner.domain,
      logo_url: partner.logoUrl || null,
      is_visible: partner.isVisible ?? true,
    };

    const { data, error } = await supabase
      .from("providers")
      .update(row)
      .eq("id", id)
      .select("id, name, domain, logo_url, is_visible");

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in updateProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function deleteProviderAction(id: string) {
  try {
    const { error } = await supabase.from("providers").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// ─── Legacy stubs (keep so old imports compile during transition) ─────────────
export async function getCategoriesAction() { return []; }
export async function createCategoryAction() { return { success: false, error: "Categories removed" }; }
export async function updateCategoryAction() { return { success: false, error: "Categories removed" }; }
export async function deleteCategoryAction() { return { success: false, error: "Categories removed" }; }
export async function getProviderUsersAction() { return []; }
export async function createProviderUserAction() { return { success: false, error: "Users removed" }; }
export async function updateProviderUserAction() { return { success: false, error: "Users removed" }; }
export async function deleteProviderUserAction() { return { success: false, error: "Users removed" }; }
