
import { useState, useEffect } from 'react';

type City = 'manaus' | 'belem' | null;

interface GeoLocationState {
  city: City;
  loading: boolean;
  error: string | null;
}

const CITIES = {
  manaus: { lat: -3.1190275, lng: -60.0217314 },
  belem: { lat: -1.4557549, lng: -48.4901799 }
};

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const MAX_DISTANCE_KM = 100; // Tolerance radius

export function useGeoLocation() {
  const [state, setState] = useState<GeoLocationState>({
    city: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Check for DevTools override
    if (process.env.NODE_ENV === 'development') {
      const override = localStorage.getItem('debug_city_override');
      if (override) {
        console.log('[DevTools] Using overridden city:', override);
        setState({
          city: override === 'none' ? null : (override as City),
          loading: false,
          error: null
        });
        return; // Skip actual geolocation
      }
    }

    if (!('geolocation' in navigator)) {
      setState(s => ({ ...s, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const distManaus = calculateDistance(latitude, longitude, CITIES.manaus.lat, CITIES.manaus.lng);
        const distBelem = calculateDistance(latitude, longitude, CITIES.belem.lat, CITIES.belem.lng);

        console.log(`Distances - Manaus: ${distManaus.toFixed(2)}km, Belém: ${distBelem.toFixed(2)}km`);

        let detectedCity: City = null;

        if (distManaus < MAX_DISTANCE_KM) {
          detectedCity = 'manaus';
        } else if (distBelem < MAX_DISTANCE_KM) {
          detectedCity = 'belem';
        }

        setState({
          city: detectedCity,
          loading: false,
          error: null
        });
      },
      (error) => {
        console.warn('Geolocation denied or error:', error.message);
        setState({
          city: null,
          loading: false,
          error: error.message
        });
      },
      { timeout: 10000, maximumAge: 60000 } // Don't wait too long, use cached if available
    );
  }, []);

  return state;
}
