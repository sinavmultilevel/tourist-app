"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Clock, Info, Lock, CheckCircle, Headphones } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { fetchPlaces, Place } from "@/lib/api";

export default function TourPage() {
    const { t } = useTranslation();
    const [playing, setPlaying] = useState<string | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaces()
            .then(data => {
                setPlaces(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const togglePlay = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation when clicking play
        e.stopPropagation();
        if (playing === id) {
            setPlaying(null);
        } else {
            setPlaying(id);
        }
    };

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('tour.pageTitle')} />

            {/* Featured Header */}
            <div className="p-6 pb-2">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('tour.heroTitle')}</h1>
                <p className="text-slate-500">{t('tour.heroSubtitle')}</p>
            </div>

            <div className="p-6 space-y-6">
                {loading && <div className="text-center py-10">Loading places...</div>}
                {!loading && places.length === 0 && <div className="text-center py-10">No active places found. Check Admin Panel.</div>}

                {places.map((place) => (
                    <Link href={`/places/${place.id}`} key={place.id} className="block group">
                        <Card className="relative overflow-hidden border-none shadow-lg group">
                            <div className="absolute inset-0">
                                {place.photo_url ? (
                                    <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
                            </div>

                            <div className="relative z-10 p-6 pt-24 text-white">
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                                        {place.type}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="font-bold text-2xl mb-1 leading-tight">{place.name}</h3>
                                        <div className="flex items-center space-x-3 text-slate-300 text-sm font-medium">
                                            <div className="flex items-center">
                                                <Clock size={14} className="mr-1" />
                                                5:00 {/* Placeholder duration */}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-xs mt-2 line-clamp-1 opacity-80">{place.short_desc || place.description}</p>
                                    </div>
                                    <Button
                                        onClick={(e) => togglePlay(e, place.id.toString())}
                                        variant={playing === place.id.toString() ? "primary" : "secondary"}
                                        className={`rounded-full w-14 h-14 p-0 shadow-lg border-2 border-white/20`}
                                    >
                                        {playing === place.id.toString() ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </Button>
                                </div>
                            </div>
                            {playing === place.id.toString() && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                    <div className="h-full bg-secondary-light animate-progress" style={{ width: '45%' }} />
                                </div>
                            )}
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Now Playing Sticky Bar (Mockup) */}
            {playing && (
                <div className="fixed bottom-20 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-t border-white/10 z-50 animate-in slide-in-from-bottom-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Headphones className="text-white animate-pulse" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('tour.nowPlaying')}</p>
                            <p className="font-bold text-sm">{t('tour.audioGuide')}</p>
                        </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setPlaying(null)}>
                        <Pause size={20} fill="currentColor" />
                    </Button>
                </div>
            )}
        </div>
    );
}
