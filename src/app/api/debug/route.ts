import { NextResponse } from "next/server";
import { readProviders } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { Partner } from "@/data/partners";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  const debugInfo = {
    database: "Supabase",
    supabase: {
      url_configured: !!supabaseUrl,
      key_configured: !!supabaseKey,
      client_initialized: !!supabase,
    },
    connection: "unknown",
    error: null as string | null,
    providersCount: 0,
    providersList: [] as Partner[],
  };

  try {
    const list = await readProviders();
    debugInfo.connection = "success";
    debugInfo.providersCount = list.length;
    debugInfo.providersList = list;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    debugInfo.connection = "failed";
    debugInfo.error = errMsg;
  }

  return NextResponse.json(debugInfo);
}
