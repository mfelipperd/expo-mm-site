"use client";

import { useState, useEffect } from "react";
import { useGeoLocation } from "./useGeoLocation";
import { fetchFairs, type FairListItem } from "@/lib/fairsApi";

function isFairActive(fair: FairListItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(fair.endDate + "T23:59:59") >= today;
}

export interface FairRoutingResult {
  loading: boolean;
  activeFairs: FairListItem[];
  detectedCity: "manaus" | "belem" | null;
  hasChosenCity: boolean;
  setCity: (choice: "manaus" | "belem" | "outros") => void;
}

export function useFairRouting(): FairRoutingResult {
  const { city: detectedCity, hasChosen: hasChosenCity, loading: cityLoading, setCity } = useGeoLocation();
  const [activeFairs, setActiveFairs] = useState<FairListItem[]>([]);
  const [fairsLoading, setFairsLoading] = useState(true);

  useEffect(() => {
    fetchFairs().then((fairs) => {
      const active = fairs
        .filter(isFairActive)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setActiveFairs(active);
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
