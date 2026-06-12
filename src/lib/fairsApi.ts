const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface FairAddress {
  venue?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode?: string;
}

export interface FairScheduleEntry {
  date: string;
  openTime: string;
  closeTime: string;
}

export interface TransportLinks {
  googleMaps?: string;
  waze?: string;
  uber?: string;
  ninetyNine?: string;
}

export interface ExhibitorBrand {
  name: string;
  logoUrl: string;
}

export interface StandOption {
  id: string;
  name: string;
  dimensions: string;
  area: number;
  quantity: number;
  totalPrice: number;
  description: string;
}

export interface FairListItem {
  id: string;
  name: string;
  edition: string;
  bannerUrl?: string;
  status: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  expectedVisitors: number;
  expectedExhibitors: number;
  standsAvailable?: number;
}

export interface FairDetail extends FairListItem {
  description?: string;
  address?: FairAddress;
  coordinates?: { lat: number; lng: number };
  transportLinks?: TransportLinks;
  dailySchedule?: FairScheduleEntry[];
  exhibitorBrands?: ExhibitorBrand[];
  standOptions?: StandOption[];
}

export async function fetchFair(id: string): Promise<FairDetail | null> {
  if (!id || !API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/public/fairs/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchFairs(): Promise<FairListItem[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/public/fairs`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const PT_MONTHS = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];

export function formatFairDates(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate + "T12:00:00");
    const end = new Date(endDate + "T12:00:00");
    const month = PT_MONTHS[start.getMonth()];
    const year = start.getFullYear();
    const days: number[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      days.push(cur.getDate());
      cur.setDate(cur.getDate() + 1);
    }
    if (days.length === 0) return "";
    const pad = (d: number) => String(d).padStart(2, "0");
    const daysStr =
      days.length === 1
        ? pad(days[0])
        : days.slice(0, -1).map(pad).join(", ") + " E " + pad(days[days.length - 1]);
    return `${daysStr} DE ${month} DE ${year}`;
  } catch {
    return "";
  }
}

export function formatFairSchedule(schedule: FairScheduleEntry[]): string {
  if (!schedule || schedule.length === 0) return "";
  try {
    const open = schedule[0].openTime.split(":")[0].replace(/^0/, "") + "H";
    const close = schedule[0].closeTime.split(":")[0].replace(/^0/, "") + "H";
    return `${open} ÀS ${close}`;
  } catch {
    return "";
  }
}

export function formatFairLocation(address: FairAddress): string {
  if (address.venue) return address.venue.toUpperCase();
  const parts = [address.street, address.number].filter(Boolean);
  return parts.join(", ").toUpperCase();
}

export function buildMapEmbedUrl(
  coords?: { lat: number; lng: number },
  venue?: string,
  city?: string
): string {
  if (coords?.lat && coords?.lng) {
    return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  if (venue || city) {
    const query = encodeURIComponent([venue, city].filter(Boolean).join(", "));
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  return "";
}
