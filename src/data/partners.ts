// ─── Provider Interface ───────────────────────────────────────────────────────
// Mirrors the Supabase `providers` table exactly.
// Only 4 real fields + auto fields (id, created_at managed by DB).
export interface Partner {
  id: string;       // Auto-generated from name (slug)
  name: string;     // Company name shown on card
  url: string;      // Full website URL — clicking the card opens this
  logo_url?: string; // Optional: base64 image or external URL
  is_visible?: boolean; // Controls public visibility
}

// Static fallback — all live data comes from Supabase
export const partnersData: Partner[] = [];

// Legacy stubs — keep so any old import compiles without error
export type Category = never;
export const defaultCategories: never[] = [];
export function normalizeSector(s: string): string { return s; }
