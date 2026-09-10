"use client";

import { useState, useEffect } from "react";
import { useGeoLocation } from "./useGeoLocation";
import { fetchActiveFairs, type FairListItem } from "@/lib/fairsApi";

export interface FairRoutingResult {
  loading: boolean;
  activeFairs: FairListItem[];
  detectedCity: "manaus" | "belem" | null;
  hasChosenCity: boolean;
  setCity: (choice: "manaus" | "belem" | "outros") => void;
}

/**
 * `initialActiveFairs` seeds state with server-resolved data (see src/app/page.tsx) so the
 * hero renders the right content on first paint instead of flashing the empty-array default
 * while this effect's fetch is in flight.
 */
export function useFairRouting(initialActiveFairs: FairListItem[] = []): FairRoutingResult {
  const { city: detectedCity, hasChosen: hasChosenCity, loading: cityLoading, setCity } = useGeoLocation();
  const [activeFairs, setActiveFairs] = useState<FairListItem[]>(initialActiveFairs);
  const [fairsLoading, setFairsLoading] = useState(initialActiveFairs.length === 0);

  useEffect(() => {
    fetchActiveFairs().then((fairs) => {
      setActiveFairs(fairs);
      setFairsLoading(false);
    });
  }, []);

  return {
    loading: cityLoading || fairsLoading,
    activeFairs,
    detectedCity,
    hasChosenCity,
    setCity,
  };
}
