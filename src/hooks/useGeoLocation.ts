
"use client";

import { useState, useEffect } from 'react';

export type City = 'manaus' | 'belem' | null;
type StoredChoice = 'manaus' | 'belem' | 'outros';

const LS_CITY = 'expo_mm_selected_city';

interface GeoLocationState {
  city: City;
  hasChosen: boolean;
  loading: boolean;
}

export function useGeoLocation() {
  const [state, setState] = useState<GeoLocationState>({
    city: null,
    hasChosen: false,
    loading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(LS_CITY) as StoredChoice | null;
    setState({
      city: stored === 'manaus' || stored === 'belem' ? stored : null,
      hasChosen: stored !== null,
      loading: false,
    });
  }, []);

  const setCity = (choice: StoredChoice) => {
    localStorage.setItem(LS_CITY, choice);
    setState({
      city: choice === 'manaus' || choice === 'belem' ? choice : null,
      hasChosen: true,
      loading: false,
    });
  };

  return { ...state, setCity };
}
