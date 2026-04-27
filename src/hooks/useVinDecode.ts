import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAuditEvent } from "@/lib/utils";

/* ---------- Types ---------- */

export type VinDecodeStatus =
  | "idle"
  | "typing"
  | "validating"
  | "success"
  | "partial"
  | "not_found"
  | "duplicate"
  | "format_error"
  | "timeout"
  | "offline"
  | "error";

export interface DecodedVehicleData {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  body_style?: string;
  drivetrain?: string;
  cylinders?: string;
  engine_displacement?: string;
  engine?: string; // composed: "2.0L 4-Cylinder"
  fuel_type?: string;
  transmission?: string;
  doors?: string;
  manufactured_in?: string;
  vehicle_type?: string;
  series?: string;
  gvwr?: string;
  ev_type?: string;
  /** Field keys whose NHTSA value was empty/missing. */
  missingFields: string[];
  /** Whether the decode came from the local cache. */
  fromCache: boolean;
}

export interface UseVinDecodeOptions {
  /** Existing listing id to ignore when running the duplicate check. */
  ignoreListingId?: string | null;
  /** When true, skip the duplicate check (admin override). */
  skipDuplicateCheck?: boolean;
}

export interface UseVinDecodeReturn {
  status: VinDecodeStatus;
  data: DecodedVehicleData | null;
  error: string | null;
  isLoading: boolean;
  duplicateListingId: string | null;
  decodeVin: (vin: string) => Promise<DecodedVehicleData | null>;
  resetVin: () => void;
  setTyping: () => void;
}

/* ---------- Constants ---------- */

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const NHTSA_TIMEOUT_MS = 5_000;
const CACHE_TTL_DAYS = 30;

const BODY_CLASS_MAP: Array<[RegExp, string]> = [
  [/sport utility|suv|mpv/i, "SUV"],
  [/pickup/i, "Truck"],
  [/sedan/i, "Sedan"],
  [/hatchback|liftback|notchback/i, "Hatchback"],
  [/convertible|cabriolet/i, "Convertible"],
  [/coupe/i, "Coupe"],
  [/wagon/i, "Wagon"],
  [/van/i, "Van"],
];

function mapBodyClass(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  for (const [re, label] of BODY_CLASS_MAP) {
    if (re.test(raw)) return label;
  }
  return "Other";
}

function titleCase(s: string | undefined): string | undefined {
  if (!s) return undefined;
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function normalizeFuel(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  if (r.includes("electric")) return "Electric";
  if (r.includes("diesel")) return "Diesel";
  if (r.includes("hybrid")) return "Hybrid";
  if (r.includes("gas")) return "Gasoline";
  return titleCase(raw);
}

function normalizeTransmission(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  if (r.includes("manual")) return "Manual";
  if (r.includes("cvt") || r.includes("continuously variable")) return "CVT";
  if (r.includes("automatic") || r.includes("automated")) return "Automatic";
  return titleCase(raw);
}

function normalizeDrive(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  if (r.includes("4wd") || r.includes("4x4")) return "4WD";
  if (r.includes("awd") || r.includes("all-wheel")) return "AWD";
  if (r.includes("front")) return "FWD";
  if (r.includes("rear")) return "RWD";
  return titleCase(raw);
}

function normalizeEvType(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  if (r.includes("plug")) return "PHEV";
  if (r.includes("hybrid")) return "HEV";
  if (r.includes("electric") || r.includes("bev")) return "BEV";
  return undefined;
}

function parseNhtsaResults(
  vin: string,
  results: Record<string, string> | undefined,
): Omit<DecodedVehicleData, "missingFields" | "fromCache"> & { _empties: string[] } {
  const r = results ?? {};
  const yearStr = (r.ModelYear || "").trim();
  const year = yearStr ? Number(yearStr) : undefined;
  const make = titleCase(r.Make?.trim());
  const model = titleCase(r.Model?.trim());
  const trim = titleCase(r.Trim?.trim());
  const body_style = mapBodyClass(r.BodyClass?.trim());
  const drivetrain = normalizeDrive(r.DriveType?.trim());
  const cylinders = r.EngineCylinders?.trim() || undefined;
  const engine_displacement = r.DisplacementL?.trim() || undefined;
  const fuel_type = normalizeFuel(r.FuelTypePrimary?.trim());
  const transmission = normalizeTransmission(r.TransmissionStyle?.trim());
  const doors = r.Doors?.trim() || undefined;
  const manufactured_in = titleCase(r.PlantCountry?.trim());
  const vehicle_type = titleCase(r.VehicleType?.trim());
  const series = titleCase(r.Series?.trim());
  const gvwr = r.GVWR?.trim() || undefined;
  const ev_type = normalizeEvType(r.ElectrificationLevel?.trim());

  const engine = engine_displacement && cylinders
    ? `${engine_displacement}L ${cylinders}-Cylinder`
    : engine_displacement
      ? `${engine_displacement}L`
      : cylinders
        ? `${cylinders}-Cylinder`
        : undefined;

  const candidates: Record<string, unknown> = {
    year, make, model, trim, body_style, drivetrain, cylinders,
    engine_displacement, engine, fuel_type, transmission, doors,
    manufactured_in, vehicle_type, series, gvwr, ev_type,
  };
  const _empties = Object.entries(candidates)
    .filter(([, v]) => v === undefined || v === null || v === "")
    .map(([k]) => k);

  return {
    vin,
    year,
    make,
    model,
    trim,
    body_style,
    drivetrain,
    cylinders,
    engine_displacement,
    engine,
    fuel_type,
    transmission,
    doors,
    manufactured_in,
    vehicle_type,
    series,
    gvwr,
    ev_type,
    _empties,
  };
}

/* ---------- Hook ---------- */

export function useVinDecode(opts: UseVinDecodeOptions = {}): UseVinDecodeReturn {
  const [status, setStatus] = useState<VinDecodeStatus>("idle");
  const [data, setData] = useState<DecodedVehicleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateListingId, setDuplicateListingId] = useState<string | null>(null);

  const setTyping = useCallback(() => {
    setStatus("typing");
    setError(null);
  }, []);

  const resetVin = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
    setIsLoading(false);
    setDuplicateListingId(null);
  }, []);

  const decodeVin = useCallback(
    async (rawVin: string): Promise<DecodedVehicleData | null> => {
      const vin = rawVin.toUpperCase().trim();

      if (!VIN_REGEX.test(vin)) {
        setStatus("format_error");
        setError("Invalid VIN format — VINs are 17 characters and cannot contain I, O, or Q");
        setData(null);
        return null;
      }

      // Offline check
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setStatus("offline");
        setError("No internet connection — VIN lookup unavailable. Fill details manually.");
        return null;
      }

      setIsLoading(true);
      setStatus("validating");
      setError(null);
      setDuplicateListingId(null);

      try {
        // 1. Duplicate check (skip when explicitly disabled)
        if (!opts.skipDuplicateCheck) {
          let q = supabase
            .from("vehicle_listings")
            .select("id")
            .eq("vin", vin)
            .limit(1);
          if (opts.ignoreListingId) q = q.neq("id", opts.ignoreListingId);
          const { data: dupRows } = await q;
          if (dupRows && dupRows.length > 0) {
            const dupId = (dupRows[0] as { id: string }).id;
            setDuplicateListingId(dupId);
            setStatus("duplicate");
            setError("This VIN is already registered in AutoWurx");
            setData(null);
            return null;
          }
        }

        // 2. Cache lookup
        const { data: cached } = await supabase
          .from("vin_validation_cache")
          .select("decoded_data, validated_at, is_valid")
          .eq("vin", vin)
          .maybeSingle();

        const cacheFresh =
          cached &&
          cached.is_valid &&
          cached.validated_at &&
          (Date.now() - new Date(cached.validated_at).getTime()) <
            CACHE_TTL_DAYS * 86_400_000;

        let parsedCore:
          | (Omit<DecodedVehicleData, "missingFields" | "fromCache"> & { _empties: string[] })
          | null = null;
        let fromCache = false;

        if (cacheFresh) {
          const cd = (cached!.decoded_data ?? {}) as Record<string, unknown>;
          parsedCore = {
            vin,
            year: typeof cd.year === "number" ? (cd.year as number) : undefined,
            make: cd.make as string | undefined,
            model: cd.model as string | undefined,
            trim: cd.trim as string | undefined,
            body_style: cd.body_style as string | undefined,
            drivetrain: cd.drivetrain as string | undefined,
            cylinders: cd.cylinders as string | undefined,
            engine_displacement: cd.engine_displacement as string | undefined,
            engine: cd.engine as string | undefined,
            fuel_type: cd.fuel_type as string | undefined,
            transmission: cd.transmission as string | undefined,
            doors: cd.doors as string | undefined,
            manufactured_in: cd.manufactured_in as string | undefined,
            vehicle_type: cd.vehicle_type as string | undefined,
            series: cd.series as string | undefined,
            gvwr: cd.gvwr as string | undefined,
            ev_type: cd.ev_type as string | undefined,
            _empties: Array.isArray(cd._empties) ? (cd._empties as string[]) : [],
          };
          fromCache = true;
        } else {
          // 3. NHTSA call (with timeout)
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), NHTSA_TIMEOUT_MS);
          let json: { Results?: Record<string, string>[] } | null = null;
          try {
            const res = await fetch(
              `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`,
              { signal: ctl.signal },
            );
            json = await res.json();
          } catch (e) {
            if ((e as Error).name === "AbortError") {
              setStatus("timeout");
              setError("VIN lookup timed out — you can fill in details manually");
              return null;
            }
            throw e;
          } finally {
            clearTimeout(t);
          }

          const r = json?.Results?.[0];
          if (!r) {
            setStatus("not_found");
            setError("VIN not found in NHTSA database — please fill details manually");
            return null;
          }

          const errorCode = (r.ErrorCode || "").trim();
          parsedCore = parseNhtsaResults(vin, r);
          // No essentials? mark not_found
          if (!parsedCore.make && !parsedCore.model && !parsedCore.year) {
            setStatus("not_found");
            setError("VIN not found in NHTSA database — please fill details manually");
            return null;
          }
          // Cache the result (fire-and-forget; ignore RLS errors silently)
          const { _empties, ...cacheable } = parsedCore;
          void supabase
            .from("vin_validation_cache")
            .upsert({
              vin,
              is_valid: errorCode === "" || errorCode === "0",
              decoded_data: { ...cacheable, _empties } as never,
              validated_at: new Date().toISOString(),
            } as never);
        }

        const finalData: DecodedVehicleData = {
          ...parsedCore!,
          missingFields: parsedCore!._empties,
          fromCache,
        };

        // Audit log (best-effort; service-role-only in production)
        try {
          const { data: sess } = await supabase.auth.getUser();
          await logAuditEvent(
            sess.user?.id ?? null,
            "VIN_DECODED",
            "vehicle_listing",
            opts.ignoreListingId ?? null,
            {
              vin,
              source: fromCache ? "cache" : "nhtsa_api",
              fieldsPopulated: Object.entries(finalData)
                .filter(([k, v]) => k !== "missingFields" && k !== "fromCache" && k !== "vin" && v)
                .map(([k]) => k),
              partialDecode: finalData.missingFields.length > 0,
              missingFields: finalData.missingFields,
            },
          );
        } catch {
          /* RLS may block — non-fatal */
        }

        setData(finalData);
        setStatus(finalData.missingFields.length > 0 ? "partial" : "success");
        return finalData;
      } catch (e) {
        setStatus("error");
        setError((e as Error).message || "Unknown error during VIN decode");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [opts.ignoreListingId, opts.skipDuplicateCheck],
  );

  return {
    status,
    data,
    error,
    isLoading,
    duplicateListingId,
    decodeVin,
    resetVin,
    setTyping,
  };
}
