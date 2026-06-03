// ─── Provider Interface ───────────────────────────────────────────────────────
// Stored locally in src/data/providers.json — no external database needed.
export interface Partner {
  id: string;       // Auto-generated from name (slug)
  name: string;     // Company name shown on card
  url: string;      // Full website URL — clicking the card opens this
  logo_url?: string; // Optional: base64 image or external URL
  is_visible?: boolean; // Controls public visibility
}

// Static fallback — live data comes from /api/providers (providers.json)
export const partnersData: Partner[] = [];

// Legacy stubs — keep so any old import compiles without error
export type Category = never;
export const defaultCategories: never[] = [];
export function normalizeSector(s: string): string { return s; }
