import fs from "fs";
import path from "path";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "moonxr:providers";

async function redisCmd(command: any[]) {
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

export async function readProviders(): Promise<any[]> {
  try {
    const raw = await redisCmd(["GET", KEY]);
    if (raw) {
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
  } catch (err: any) {
    console.error("Error reading providers from Upstash Redis:", err.message);
    // Fall back to local providers.json during error so application doesn't crash completely
    return getLocalProviders();
  }
}

export async function writeProviders(data: any[]): Promise<void> {
  try {
    await redisCmd(["SET", KEY, JSON.stringify(data)]);
  } catch (err: any) {
    console.error("Error writing providers to Upstash Redis:", err.message);
    throw err;
  }
}

function getLocalProviders(): any[] {
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
