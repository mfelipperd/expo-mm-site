import { fetchFair, fetchFairs, type FairDetail } from "./fairsApi";
import { getSiteMode } from "./siteMode";

interface ResolvedCityFair {
  fair: FairDetail | null;
  fairId: string;
  registrationOpen: boolean;
}

/**
 * Picks the soonest upcoming/ongoing fair for a city instead of trusting a fixed
 * env-var fair id, which goes stale the moment a new edition is created with a new id.
 */
export async function resolveCityFair(city: string, fallbackFairId: string): Promise<ResolvedCityFair> {
  const fairs = await fetchFairs();
  const cityFairs = fairs
    .filter((f) => f.city.toLowerCase() === city.toLowerCase() && (f.status === "upcoming" || f.status === "ongoing"))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const activeFair = cityFairs[0];
  const fairId = activeFair?.id || fallbackFairId;
  const fair = fairId ? await fetchFair(fairId) : null;
  const registrationOpen = activeFair ? getSiteMode([activeFair]) === "visitantes" : false;

  return { fair, fairId, registrationOpen };
}
