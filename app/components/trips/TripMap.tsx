"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-gpx";

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Photo Marker Icon
const photoIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: white; border-radius: 50%; padding: 4px; border: 2px solid #3b82f6; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface PointOfInterest {
  lat: number;
  lng: number;
  title: string;
  image?: string;
}

interface TripMapProps {
  coordinates: [number, number]; // [lat, lng]
  title: string;
  route?: [number, number][]; // Array of lat/lng for Polyline
  gpxUrl?: string; // URL to GPX file
  pointsOfInterest?: PointOfInterest[];
}

const RecenterMap = ({ coordinates, route }: { coordinates: [number, number]; route?: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (!route) {
      map.setView(coordinates);
    }
  }, [coordinates, route, map]);
  return null;
};

const GpxLayer = ({ url }: { url: string }) => {
  const map = useMap();
  useEffect(() => {
    if (!url) return;
    
    // @ts-ignore
    const gpx = new L.GPX(url, {
      async: true,
      marker_options: {
        startIconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        endIconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        shadowSize: [41, 41],
      },
      polyline_options: {
        color: '#0ea5e9',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
      }
    }).on('loaded', (e: any) => {
      map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
    }).addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [url, map]);
  return null;
};

const TripMap = ({ coordinates, title, route, gpxUrl, pointsOfInterest }: TripMapProps) => {
  if (!coordinates || coordinates.length !== 2) {
    return (
      <div className="w-full h-[400px] bg-slate-100 flex items-center justify-center rounded-3xl">
        <p className="text-slate-500">Map location not available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
      <MapContainer
        center={coordinates}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates} icon={icon}>
          <Popup>{title}</Popup>
        </Marker>
        
        {/* GPX Route Line */}
        {route && (
          <Polyline 
            positions={route} 
            pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.8, dashArray: '10, 10' }} 
          />
        )}

        {/* GPX File Layer */}
        {gpxUrl && <GpxLayer url={gpxUrl} />}

        {/* Points of Interest with Photo Popups */}
        {pointsOfInterest && pointsOfInterest.map((poi, idx) => (
          <Marker 
            key={idx} 
            position={[poi.lat, poi.lng]} 
            icon={photoIcon}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <h4 className="font-bold text-slate-800 text-sm">{poi.title}</h4>
                {poi.image && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden">
                    <img src={poi.image} alt={poi.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {!gpxUrl && <RecenterMap coordinates={coordinates} route={route} />}
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-md">
        Interactive Preview
      </div>
    </div>
  );
};


export default TripMap;
