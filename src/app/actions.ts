"use server";

import { Partner } from "@/data/partners";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface ProviderUser {
  id: string;
  provider_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
}

// =========================================================================
// MAPPING HELPER
// Reconstructs flattened database rows into the nested TypeScript Partner interface
// used throughout the frontend.
// =========================================================================
function mapRowToPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    sector: row.sector,
    country: row.country,
    flag: row.flag,
    domain: row.domain,
    description: {
      en: row.description_en,
      fr: row.description_fr,
    },
    pricing: {
      en: row.pricing_en,
      fr: row.pricing_fr,
    },
    opportunities: {
      en: row.opportunities_en,
      fr: row.opportunities_fr,
    },
    headquarters: row.headquarters || undefined,
    foundedYear: row.founded_year || undefined,
    roiMetrics: (row.roi_metrics_en || row.roi_metrics_fr) ? {
      en: row.roi_metrics_en || "",
      fr: row.roi_metrics_fr || "",
    } : undefined,
    compliance: row.compliance || undefined,
    logoUrl: row.logo_url || undefined,
    isVisible: row.is_visible ?? true,
  };
}

// =========================================================================
// PROVIDERS CRUD ACTIONS
// =========================================================================

// 1. Get all providers ordered by name
export async function getProvidersAction(): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching providers from Supabase:", error);
      return [];
    }

    return (data || []).map(mapRowToPartner);
  } catch (err) {
    console.error("Unexpected error in getProvidersAction:", err);
    return [];
  }
}

// 2. Create a new provider
export async function createProviderAction(partner: Omit<Partner, "logoUrl"> & { logoUrl?: string }) {
  try {
    const row = {
      id: partner.id,
      name: partner.name,
      sector: partner.sector,
      country: partner.country,
      flag: partner.flag,
      domain: partner.domain,
      description_en: partner.description.en,
      description_fr: partner.description.fr,
      pricing_en: partner.pricing.en,
      pricing_fr: partner.pricing.fr,
      opportunities_en: partner.opportunities.en,
      opportunities_fr: partner.opportunities.fr,
      headquarters: partner.headquarters || null,
      founded_year: partner.foundedYear || null,
      roi_metrics_en: partner.roiMetrics?.en || null,
      roi_metrics_fr: partner.roiMetrics?.fr || null,
      compliance: partner.compliance || null,
      logo_url: partner.logoUrl || null,
      is_visible: partner.isVisible ?? true,
    };

    const { data, error } = await supabase.from("providers").insert([row]).select();

    if (error) throw error;

    // Purge caches to instantly reflect database additions
    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in createProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// 3. Update an existing provider
export async function updateProviderAction(id: string, partner: Omit<Partner, "logoUrl"> & { logoUrl?: string }) {
  try {
    const row = {
      name: partner.name,
      sector: partner.sector,
      country: partner.country,
      flag: partner.flag,
      domain: partner.domain,
      description_en: partner.description.en,
      description_fr: partner.description.fr,
      pricing_en: partner.pricing.en,
      pricing_fr: partner.pricing.fr,
      opportunities_en: partner.opportunities.en,
      opportunities_fr: partner.opportunities.fr,
      headquarters: partner.headquarters || null,
      founded_year: partner.foundedYear || null,
      roi_metrics_en: partner.roiMetrics?.en || null,
      roi_metrics_fr: partner.roiMetrics?.fr || null,
      compliance: partner.compliance || null,
      logo_url: partner.logoUrl || null,
      is_visible: partner.isVisible ?? true,
    };

    const { data, error } = await supabase
      .from("providers")
      .update(row)
      .eq("id", id)
      .select();

    if (error) throw error;

    // Purge caches to instantly reflect updates
    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in updateProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// 4. Delete an existing provider
export async function deleteProviderAction(id: string) {
  try {
    const { error } = await supabase.from("providers").delete().eq("id", id);
    if (error) throw error;

    // Purge caches to instantly reflect deletions
    revalidatePath("/");
    revalidatePath("/providers");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteProviderAction:", err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// PROVIDER USERS CRUD ACTIONS
// =========================================================================

// 1. Get all users for a specific provider
export async function getProviderUsersAction(providerId: string): Promise<ProviderUser[]> {
  try {
    const { data, error } = await supabase
      .from("provider_users")
      .select("*")
      .eq("provider_id", providerId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error in getProviderUsersAction:", err);
    return [];
  }
}

// 2. Add a new user to a provider
export async function createProviderUserAction(user: Omit<ProviderUser, "id">) {
  try {
    const { data, error } = await supabase
      .from("provider_users")
      .insert([user])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in createProviderUserAction:", err);
    return { success: false, error: err.message };
  }
}

// 3. Update an existing user
export async function updateProviderUserAction(id: string, user: Partial<Omit<ProviderUser, "id">>) {
  try {
    const { data, error } = await supabase
      .from("provider_users")
      .update(user)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in updateProviderUserAction:", err);
    return { success: false, error: err.message };
  }
}

// 4. Delete an existing user
export async function deleteProviderUserAction(id: string) {
  try {
    const { error } = await supabase
      .from("provider_users")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteProviderUserAction:", err);
    return { success: false, error: err.message };
  }
}
