"use client";
// Force rebuild

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
});
import { fetchPlaces, Place } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function MapPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlacesData = async () => {
            try {
                const data = await fetchPlaces();
                setPlaces(data);
            } catch (error) {
                console.error("Failed to fetch places", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlacesData();
    }, []);

    return (
        <div className="h-screen w-full relative bg-slate-100 flex flex-col">
            {/* Top Bar for Back Navigation */}
            <div className="absolute top-0 left-0 right-0 z-[50] p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-slate-800 hover:bg-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-full">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <InteractiveMap places={places} />
                )}
            </div>
        </div>
    );
}
