"use client";
// Force rebuild

import { useEffect, useState } from 'react';
import { Place } from '@/lib/api'; // Ensure this import path is correct
// Leaflet CSS must be imported globally or here
import 'leaflet/dist/leaflet.css';
// Dynamic import for Leaflet components to avoid SSR issues
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Fix for default marker icons in Leaflet with Next.js
import L from 'leaflet';
const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    places: Place[];
}

export default function InteractiveMap({ places }: MapProps) {
    const defaultCenter: [number, number] = [41.378, 60.364]; // Ichan Kala center
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <div className="h-full w-full relative z-0">
            {/* @ts-ignore - Types sometimes conflict with dynamic imports */}
            <MapContainer center={defaultCenter} zoom={16} scrollWheelZoom={true} className="h-full w-full">
                {/* @ts-ignore */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {places.map((place) => {
                    if (!place.location_lat || !place.location_lng) return null;
                    return (
                        <Marker
                            key={place.id}
                            position={[place.location_lat, place.location_lng]}
                        >
                            <Popup>
                                <div className="p-2 min-w-[150px]">
                                    <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{place.short_desc}</p>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.location_lat},${place.location_lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 block text-center w-full py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Navigate
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
