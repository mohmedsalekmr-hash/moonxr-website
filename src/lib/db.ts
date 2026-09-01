import fs from "fs";
import path from "path";
import { Partner } from "@/data/partners";
import { supabase } from "@/lib/supabase";

export async function readProviders(): Promise<Partner[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("providers")
        .select("id, name, url, logo_url, is_visible")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase readProviders error:", error.message);
      } else if (data && data.length > 0) {
        return data as Partner[];
      }
    }
  } catch (err) {
    console.error("Unexpected error in readProviders (Supabase):", err);
  }

  // Fall back to local providers.json
  return getLocalProviders();
}

export async function writeProviders(data: Partner[]): Promise<void> {
  // Always update local file
  writeLocalProviders(data);

  try {
    if (supabase) {
      const payload = data.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.url,
        logo_url: p.logo_url ?? null,
        is_visible: p.is_visible ?? true,
      }));

      const { error } = await supabase
        .from("providers")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error("Supabase writeProviders upsert error:", error.message);
      }
    }
  } catch (err) {
    console.error("Unexpected error in writeProviders (Supabase):", err);
  }
}

export async function deleteProviderFromDb(id: string): Promise<void> {
  try {
    if (supabase) {
      const { error } = await supabase.from("providers").delete().eq("id", id);
      if (error) {
        console.error("Supabase deleteProvider error:", error.message);
      }
    }
  } catch (err) {
    console.error("Unexpected error in deleteProviderFromDb:", err);
  }
}

function writeLocalProviders(data: Partner[]): void {
  try {
    const filePath = path.join(process.cwd(), "src/data/providers.json");
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local providers.json:", err);
  }
}

function getLocalProviders(): Partner[] {
  try {
    const filePath = path.join(process.cwd(), "src/data/providers.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local providers.json:", err);
  }
  return [];
}
