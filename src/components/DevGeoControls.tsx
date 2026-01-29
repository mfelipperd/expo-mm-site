
"use client";

import { useState, useEffect } from "react";

export default function DevGeoControls() {
  const [currentOverride, setCurrentOverride] = useState<string | null>(null);

  useEffect(() => {
    // Sync with initial state
    const stored = localStorage.getItem("debug_city_override");
    setCurrentOverride(stored);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  const setOverride = (city: string | null) => {
    if (city) {
      localStorage.setItem("debug_city_override", city);
    } else {
      localStorage.removeItem("debug_city_override");
    }
    setCurrentOverride(city);
    // Dispatch event for hook to pick up
    window.dispatchEvent(new Event("debug_city_change"));
    // Add toast or log
    console.log(`[DevTools] Geo Override set to: ${city || "Auto"}`);
    // Optional: Reload to ensure clean state if hook doesn't listen, but we will make hook listen
     window.location.reload(); 
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs text-white shadow-2xl">
      <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider">DevTools: Geolocation</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setOverride("manaus")}
          className={`px-3 py-1.5 rounded-md border transition-all ${
            currentOverride === "manaus" 
              ? "bg-brand-pink border-brand-pink text-white" 
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          Force Manaus
        </button>
        <button
          onClick={() => setOverride("belem")}
          className={`px-3 py-1.5 rounded-md border transition-all ${
            currentOverride === "belem" 
              ? "bg-brand-cyan border-brand-cyan text-white" 
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          Force Belém
        </button>
        <button
          onClick={() => setOverride("none")}
          className={`px-3 py-1.5 rounded-md border transition-all ${
            currentOverride === "none" 
              ? "bg-red-500/50 border-red-500 text-white" 
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          Force None (Unknown)
        </button>
        <div className="h-px bg-white/10 my-1" />
        <button
          onClick={() => setOverride(null)}
          className={`px-3 py-1.5 rounded-md border transition-all ${
            currentOverride === null 
              ? "bg-green-500/50 border-green-500 text-white" 
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          Reset (Auto Detect)
        </button>
      </div>
    </div>
  );
}
