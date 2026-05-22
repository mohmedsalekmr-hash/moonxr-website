// ─── Partner Interface ────────────────────────────────────────────────────────
// Only contains the fields actually used by the website.
// The database mirrors these exact 5 fields.
export interface Partner {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  isVisible?: boolean;
}

// Empty static fallback — all live data is fetched from Supabase.
export const partnersData: Partner[] = [];

// ─── Legacy stubs (kept so old imports don't break during transition) ─────────
// These can be removed once all components are fully updated.
export type Category = never;
export const defaultCategories: never[] = [];
export function normalizeSector(s: string): string { return s; }
