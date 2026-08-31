export type FairCity = "belem" | "manaus";

export const CITY_LABELS: Record<FairCity, string> = {
  belem: "Belém",
  manaus: "Manaus",
};

// DDDs exclusive to each state — only these two are treated as a confident signal.
// Any other DDD is ambiguous (rep travelling, distributor in another state, etc.) and is ignored.
const DDD_CITY: Record<string, FairCity> = {
  "91": "belem",
  "92": "manaus",
};

export function normalizeCityName(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function cityFromDDD(phone: string): FairCity | null {
  const ddd = phone.replace(/\D/g, "").slice(0, 2);
  return DDD_CITY[ddd] ?? null;
}

export function cityFromLocality(locality: string | undefined | null): FairCity | null {
  if (!locality) return null;
  const norm = normalizeCityName(locality);
  if (norm.includes("belem")) return "belem";
  if (norm.includes("manaus") || norm.includes("manaos")) return "manaus";
  return null;
}
