"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
}

interface LiveTrackingMapProps {
  storeLocation: Location;
  destinationLocation: Location;
  riderLocation?: Location & { heading?: number };
  status: string;
}

export default function LiveTrackingMap({
  storeLocation,
  destinationLocation,
  riderLocation,
  status,
}: LiveTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map centered between store and destination
    if (!mapInstanceRef.current) {
      const centerLat = (storeLocation.lat + destinationLocation.lat) / 2;
      const centerLng = (storeLocation.lng + destinationLocation.lng) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // OpenStreetMap standard tiles (ultra-reliable global CDN)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Store Marker (🏪)
      const storeIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="background: #059669; color: white; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(5,150,105,0.4); border: 2px solid white; font-size: 16px;">
            🏪
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([storeLocation.lat, storeLocation.lng], { icon: storeIcon })
        .addTo(map)
        .bindPopup("<b>FreshMart Store</b><br/>Packing Hub");

      // Destination Marker (🏠)
      const destIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="background: #1c1917; color: white; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; font-size: 16px;">
            🏠
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup("<b>Delivery Address</b><br/>Your Doorstep");

      // Route line (dashed emerald path)
      const polyline = L.polyline(
        [
          [storeLocation.lat, storeLocation.lng],
          [destinationLocation.lat, destinationLocation.lng],
        ],
        {
          color: "#059669",
          weight: 4,
          opacity: 0.7,
          dashArray: "8, 8",
        }
      ).addTo(map);

      routePolylineRef.current = polyline;

      // Fit bounds to show both pins comfortably
      map.fitBounds(
        [
          [storeLocation.lat, storeLocation.lng],
          [destinationLocation.lat, destinationLocation.lng],
        ],
        { padding: [50, 50] }
      );

      // Crucial fix: invalidate size after modal animation finishes
      setTimeout(() => {
        map.invalidateSize();
      }, 300);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [storeLocation.lat, storeLocation.lng, destinationLocation.lat, destinationLocation.lng]);

  // 2. Animate and update Rider Marker position reactively
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !riderLocation) return;

    const heading = riderLocation.heading || 0;

    // Custom Rider Scooter Marker with pulsating radar ring
    const riderIcon = L.divIcon({
      className: "rider-pin",
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; background: rgba(16, 185, 129, 0.25); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; background: #047857; color: white; border-radius: 9999px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(4,120,87,0.5); border: 2.5px solid white; font-size: 18px; transform: rotate(${heading}deg); transition: transform 0.3s ease;">
            🛵
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (!riderMarkerRef.current) {
      riderMarkerRef.current = L.marker([riderLocation.lat, riderLocation.lng], {
        icon: riderIcon,
      }).addTo(map);
    } else {
      // Smoothly update location & rotated icon
      riderMarkerRef.current.setLatLng([riderLocation.lat, riderLocation.lng]);
      riderMarkerRef.current.setIcon(riderIcon);
    }
  }, [riderLocation]);

  return (
    <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-inner border border-stone-200">
      <div ref={mapContainerRef} style={{ height: "300px", width: "100%" }} className="z-0" />

      {/* Live Badge overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-stone-200/80 flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold text-stone-800 tracking-wide uppercase">
          {status === "delivered" ? "Delivered" : "Live GPS Tracking"}
        </span>
      </div>
    </div>
  );
}

