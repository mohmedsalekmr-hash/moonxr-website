import fs from "fs";
import path from "path";
import { Partner } from "@/data/partners";

const UPSTASH_URL = process.env['UPSTASH_REDIS_REST_URL'];
const UPSTASH_TOKEN = process.env['UPSTASH_REDIS_REST_TOKEN'];
const KEY = "moonxr:providers";

async function redisCmd(command: (string | number | boolean)[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    throw new Error("Missing Upstash Redis environment variables!");
  }

  // Strip double/single quotes from environment variables if present
  const cleanUrl = UPSTASH_URL.replace(/^["']|["']$/g, "").trim();
  const cleanToken = UPSTASH_TOKEN.replace(/^["']|["']$/g, "").trim();

  const res = await fetch(cleanUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upstash Redis error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.result;
}

export async function readProviders(): Promise<Partner[]> {
  try {
    const raw = await redisCmd(["GET", KEY]);
    if (raw && typeof raw === "string") {
      return JSON.parse(raw);
    }
    
    // Seed from local providers.json if Upstash is empty
    const seedData = getLocalProviders();
    if (seedData.length > 0) {
      console.log("Seeding Upstash Redis with local providers.json data");
      await writeProviders(seedData);
      return seedData;
    }
    
    return [];
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Error reading providers from Upstash Redis:", errMsg);
    // Fall back to local providers.json during error so application doesn't crash completely
    return getLocalProviders();
  }
}

export async function writeProviders(data: Partner[]): Promise<void> {
  try {
    await redisCmd(["SET", KEY, JSON.stringify(data)]);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Error writing providers to Upstash Redis:", errMsg);
    throw err;
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
