"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { fetchPlace, Place } from "@/lib/api";
import { MapPin, Clock, Headphones, Play } from "lucide-react";
import { notFound } from "next/navigation";

export default function PlaceDetailPage({ params }: { params: { id: string } }) {
    const { t } = useTranslation();
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlace(params.id)
            .then(data => {
                setPlace(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-sand-50 pt-20 text-center">Loading...</div>;
    if (!place) return <div className="min-h-screen bg-sand-50 pt-20 text-center">Place not found</div>;

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={place.name} />

            <div className="relative h-72 w-full">
                {place.photo_url ? (
                    <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sand-50 to-transparent" />
            </div>

            <div className="px-6 -mt-12 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                {place.type}
                            </span>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{place.name}</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-slate-500 text-sm mb-6 border-b border-slate-100 pb-6">
                        <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            <span>5 min</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={16} className="mr-2 text-primary" />
                            <span>View on Map</span>
                        </div>
                    </div>

                    {place.audio_url && (
                        <div className="bg-slate-900 rounded-xl p-4 text-white flex items-center justify-between mb-8 shadow-lg shadow-slate-900/20">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                                    <Headphones size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audio Guide</p>
                                    <p className="font-bold">Play History</p>
                                </div>
                            </div>
                            <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-white text-slate-900 hover:bg-slate-200">
                                <Play size={16} fill="currentColor" className="ml-0.5" />
                            </Button>
                        </div>
                    )}

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('tour.about') || "About"}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {place.description || place.long_desc || place.short_desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
