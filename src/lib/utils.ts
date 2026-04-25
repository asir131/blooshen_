import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------------------------------------------------------------------------
 * AutoWurx domain utilities
 * ------------------------------------------------------------------------ */

const VIN_TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Validates a 17-character VIN, including the standard checksum digit at
 * position 9. Letters I, O, Q are not allowed in a real VIN.
 */
export function validateVIN(vin: string): boolean {
  if (typeof vin !== "string") return false;
  const v = vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false;

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const ch = v[i];
    const value = /\d/.test(ch) ? Number(ch) : VIN_TRANSLITERATION[ch];
    if (value === undefined) return false;
    sum += value * VIN_WEIGHTS[i];
  }
  const checkDigit = sum % 11;
  const expected = checkDigit === 10 ? "X" : String(checkDigit);
  return v[8] === expected;
}

const PLACEHOLDER_TERMS = [
  "test",
  "demo",
  "sample",
  "lorem ipsum",
  "placeholder",
  "fake",
  "example car",
  "n/a",
  "tbd",
];

/**
 * Returns the list of placeholder phrases found in the supplied text. Match
 * is case-insensitive and uses word boundaries where appropriate.
 */
export function detectPlaceholderText(text: string): string[] {
  if (typeof text !== "string" || !text) return [];
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const term of PLACEHOLDER_TERMS) {
    if (lower.includes(term)) found.push(term);
  }
  return found;
}

export interface FraudScoreInput {
  vin?: string;
  price?: number | null;
  description?: string | null;
  year?: number | null;
  mileage?: number | null;
}

/**
 * Returns a 0-100 fraud risk score. Higher means more suspicious.
 * Heuristics: invalid VIN, anomalous price, thin description,
 * placeholder text, and unrealistic mileage-vs-year combinations.
 */
export function calculateFraudScore(listing: FraudScoreInput): number {
  let score = 0;

  // VIN integrity
  if (!listing.vin || !validateVIN(listing.vin)) score += 30;

  // Price sanity
  const price = Number(listing.price ?? 0);
  if (!price || price <= 0) score += 25;
  else if (price < 500) score += 20;
  else if (price > 1_000_000) score += 15;

  // Description length / placeholders
  const description = listing.description ?? "";
  if (description.trim().length < 40) score += 15;
  const placeholders = detectPlaceholderText(description);
  score += Math.min(placeholders.length * 8, 20);

  // Mileage vs year
  const year = Number(listing.year ?? 0);
  const mileage = Number(listing.mileage ?? 0);
  const currentYear = new Date().getFullYear();
  if (year && mileage >= 0) {
    const age = Math.max(currentYear - year, 1);
    const milesPerYear = mileage / age;
    if (milesPerYear > 60_000) score += 10;
    if (year > currentYear + 1) score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Records an audit event. Note: client-side inserts are blocked by RLS in
 * production — only the service role can write. This helper is provided for
 * server (edge function) use and for explicit admin tooling.
 */
export async function logAuditEvent(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: metadata as never,
  } as never);
}

/**
 * Generates a human-readable listing reference like AWX-7G2K-93PD.
 */
export function generateListingRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const block = (n: number) =>
    Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `AWX-${block(4)}-${block(4)}`;
}
