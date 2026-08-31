import type { FairListItem } from "./fairsApi";

export type SiteMode = "stands" | "visitantes";

/**
 * Days before a fair starts when the site should switch into visitor-registration mode.
 * Outside this window (or with no fair scheduled at all) the site defaults to selling stands.
 */
export const VISITOR_MODE_WINDOW_DAYS = 60;

function isImminent(fair: FairListItem, today: Date, windowDays: number): boolean {
  const start = new Date(fair.startDate + "T00:00:00");
  const end = new Date(fair.endDate + "T23:59:59");
  if (start <= today && end >= today) return true;
  const daysUntilStart = (start.getTime() - today.getTime()) / 86400000;
  return daysUntilStart >= 0 && daysUntilStart <= windowDays;
}

export function getSiteMode(
  fairs: FairListItem[],
  windowDays: number = VISITOR_MODE_WINDOW_DAYS,
  referenceDate: Date = new Date()
): SiteMode {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const hasImminentFair = fairs.some((f) => isImminent(f, today, windowDays));
  return hasImminentFair ? "visitantes" : "stands";
}
