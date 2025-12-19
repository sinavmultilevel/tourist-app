"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { fetchHotels, Hotel } from "@/lib/api";
import { BedDouble, Phone } from "lucide-react";

export default function HotelsPage() {
    const { t } = useTranslation();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels()
            .then(data => {
                setHotels(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('hotels.pageTitle') || "Hotels"} />

            <div className="p-6">
                <div className="text-center mb-8 mt-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <BedDouble className="text-blue-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('hotels.heroTitle') || "Stay in Ichan Kala"}</h1>
                    <p className="text-slate-500 max-w-xs mx-auto">{t('hotels.heroDesc') || "Find the best places to rest in the ancient city."}</p>
                </div>

                {loading && <div className="text-center py-10">Loading hotels...</div>}

                {!loading && hotels.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        No hotels available at the moment.
                    </div>
                )}

                <div className="space-y-4">
                    {hotels.map(hotel => (
                        <Card key={hotel.id} className="p-0 border-none shadow-md flex items-center group hover:bg-white hover:scale-[1.02] transition-all overflow-hidden">
                            <div className="w-24 h-24 relative flex-shrink-0 bg-slate-100">
                                {hotel.photo_url ? (
                                    <img src={hotel.photo_url} alt={hotel.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <BedDouble size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 text-lg">{hotel.name}</h3>
                                {hotel.contact_info && (
                                    <div className="flex items-center text-slate-500 text-sm mt-1">
                                        <Phone size={14} className="mr-2" />
                                        <span>{hotel.contact_info}</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
