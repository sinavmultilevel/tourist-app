"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { fetchRestaurants, Restaurant } from "@/lib/api";
import { Utensils, Star, BadgeDollarSign } from "lucide-react";

export default function RestaurantsPage() {
    const { t } = useTranslation();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants()
            .then(data => {
                // Sort recommended first
                const sorted = data.sort((a, b) => (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0));
                setRestaurants(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('restaurants.pageTitle') || "Dining"} />

            <div className="p-6">
                <div className="text-center mb-8 mt-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                        <Utensils className="text-amber-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('restaurants.heroTitle') || "Taste of Khiva"}</h1>
                    <p className="text-slate-500 max-w-xs mx-auto">{t('restaurants.heroDesc') || "Experience authentic Khorezmian cuisine."}</p>
                </div>

                {loading && <div className="text-center py-10">Loading restaurants...</div>}
                {!loading && restaurants.length === 0 && <div className="text-center py-10 text-slate-400">No restaurants found.</div>}

                <div className="space-y-4">
                    {restaurants.map(rest => (
                        <Card key={rest.id} className="p-0 border-none shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="h-40 bg-slate-100 relative">
                                {rest.photo_url ? (
                                    <img src={rest.photo_url} alt={rest.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-amber-50">
                                        <Utensils size={32} className="text-amber-200" />
                                    </div>
                                )}
                                {rest.is_recommended && (
                                    <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider flex items-center">
                                        <Star size={10} className="mr-1" fill="currentColor" /> Recommended
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 text-lg">{rest.name}</h3>
                                <div className="flex items-center space-x-3 mt-1 text-sm">
                                    <span className="text-slate-500 bg-sand-100 px-2 py-0.5 rounded-full text-xs font-bold uppercase">{rest.category || "General"}</span>
                                    {rest.price_level && (
                                        <div className="flex items-center text-slate-500 text-xs font-bold">
                                            <BadgeDollarSign size={14} className="mr-1" />
                                            {rest.price_level}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
