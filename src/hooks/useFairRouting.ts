"use client";

import { useState, useEffect } from "react";
import { useGeoLocation } from "./useGeoLocation";
import { fetchFairs, type FairListItem } from "@/lib/fairsApi";

export type PageMode = "visitor" | "exhibitor" | "generalist";
export type UserType = "lojista" | "expositor";

const LS_USER_TYPE = "expo_mm_user_type";
const DAYS_THRESHOLD = 60;

function isFairActive(fair: FairListItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(fair.endDate + "T23:59:59") >= today;
}

function daysUntilFair(startDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate + "T00:00:00");
  return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function normCity(city: string): string {
  return city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export interface FairRoutingResult {
  mode: PageMode;
  loading: boolean;
  storedUserType: UserType | null;
  setUserType: (type: UserType) => void;
  showTypePrompt: boolean;
  activeFairs: FairListItem[];
  detectedCity: "manaus" | "belem" | null;
}

export function useFairRouting(): FairRoutingResult {
  const { city: detectedCity, loading: geoLoading } = useGeoLocation();
  const [activeFairs, setActiveFairs] = useState<FairListItem[]>([]);
  const [fairsLoading, setFairsLoading] = useState(true);
  const [storedUserType, setStoredUserType] = useState<UserType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LS_USER_TYPE) as UserType | null;
    if (stored === "lojista" || stored === "expositor") {
      setStoredUserType(stored);
    }
  }, []);

  useEffect(() => {
    fetchFairs().then((fairs) => {
      const active = fairs
        .filter(isFairActive)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setActiveFairs(active);
      setFairsLoading(false);
    });
  }, []);

  const setUserType = (type: UserType) => {
    localStorage.setItem(LS_USER_TYPE, type);
    setStoredUserType(type);
  };

  const loading = geoLoading || fairsLoading;

  let mode: PageMode = "generalist";
  let showTypePrompt = false;

  if (!loading) {
    if (detectedCity) {
      const cityFair = activeFairs.find((f) => normCity(f.city).includes(detectedCity));

      if (cityFair) {
        const days = daysUntilFair(cityFair.startDate);
        const standsAvailable = cityFair.standsAvailable;

        if (days <= DAYS_THRESHOLD) {
          // Within 60 days: if stands still for sale keep selling them, otherwise focus on visitors
          mode = standsAvailable !== undefined && standsAvailable > 0 ? "exhibitor" : "visitor";
        } else {
          mode = "exhibitor";
        }
      } else {
        // Geo detected but not in a fair city → likely a supplier/manufacturer
        mode = "exhibitor";
      }
    } else {
      // No geo: honour stored preference, otherwise prompt
      if (storedUserType === "lojista") {
        mode = "visitor";
      } else if (storedUserType === "expositor") {
        mode = "exhibitor";
      } else {
        mode = "generalist";
        showTypePrompt = true;
      }
    }
  }

  return { mode, loading, storedUserType, setUserType, showTypePrompt, activeFairs, detectedCity };
}
