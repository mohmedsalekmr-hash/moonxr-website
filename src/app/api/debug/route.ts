import { NextResponse } from "next/server";
import { readProviders } from "@/lib/db";

// Trigger automatic Vercel redeployment with updated environment variables
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const debugInfo = {
    version: "v3 (triggered at 09:27)",
    env: {
      UPSTASH_REDIS_REST_URL_exists: !!url,
      UPSTASH_REDIS_REST_URL_length: url ? url.length : 0,
      UPSTASH_REDIS_REST_TOKEN_exists: !!token,
      UPSTASH_REDIS_REST_TOKEN_length: token ? token.length : 0,
      UPSTASH_REDIS_REST_URL_has_quotes: url ? (url.startsWith('"') || url.endsWith('"') || url.startsWith("'") || url.endsWith("'")) : false,
      UPSTASH_REDIS_REST_TOKEN_has_quotes: token ? (token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'")) : false,
    },
    connection: "unknown",
    error: null as string | null,
    providersCount: 0,
    providersList: [] as any[],
  };

  try {
    const list = await readProviders();
    debugInfo.connection = "success";
    debugInfo.providersCount = list.length;
    debugInfo.providersList = list;
  } catch (err: any) {
    debugInfo.connection = "failed";
    debugInfo.error = err.message;
  }

  return NextResponse.json(debugInfo);
}
