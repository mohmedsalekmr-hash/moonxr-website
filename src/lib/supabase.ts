import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://bunivpnqnhnxxfqglhna.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bml2cG5xbmhueHhmcWdsaG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTkyMzYsImV4cCI6MjEwMzgzNTIzNn0.9_WpXtehemg10Nqby33NzLC_Zdf7hS8QdHdY_EmbSmA";

export const supabase = createClient(supabaseUrl, supabaseKey);
