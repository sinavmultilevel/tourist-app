"use client";

import { useState, useEffect } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export function PricingSection() {
    const { t } = useTranslation();

    const [price, setPrice] = useState("9.99");

    useEffect(() => {
        import("@/lib/api").then(({ fetchConfig }) => {
            fetchConfig().then(configs => {
                const priceConfig = configs.find(c => c.key === "pricing");
                if (priceConfig) {
                    try {
                        const parsed = JSON.parse(priceConfig.value);
                        if (parsed.price) setPrice(parsed.price);
                    } catch (e) {
                        console.error("Error parsing pricing config:", e);
                    }
                }
            }).catch(console.error);
        });
    }, []);

    const FEATURES = [
        t('pricing.features.audio'),
        t('pricing.features.offline'),
        t('pricing.features.photo'),
        t('pricing.features.itinerary'),
        t('pricing.features.translate'),
        t('pricing.features.auth')
    ];

    return (
        <section className="py-12 px-6 bg-white relative overflow-hidden" id="pricing">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="text-center mb-10 relative z-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('pricing.title')}</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    {t('pricing.subtitle')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
                {/* Free Tier */}
                <Card className="p-6 border-slate-100 shadow-sm flex flex-col relative opacity-80 hover:opacity-100 transition-opacity">
                    <div className="mb-6">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('pricing.freeTier')}</span>
                        <div className="mt-2 text-4xl font-bold text-slate-900">$0</div>
                        <p className="text-slate-400 text-sm mt-1">{t('pricing.limitedAccess')}</p>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center text-slate-600 text-sm"><Check size={16} className="text-slate-400 mr-2" /> {t('pricing.freeFeatures.story')}</li>
                        <li className="flex items-center text-slate-600 text-sm"><Check size={16} className="text-slate-400 mr-2" /> {t('pricing.freeFeatures.scans')}</li>
                        <li className="flex items-center text-slate-600 text-sm"><Check size={16} className="text-slate-400 mr-2" /> {t('pricing.freeFeatures.map')}</li>
                    </ul>
                    <Button variant="outline" className="w-full">{t('pricing.continueFree')}</Button>
                </Card>

                {/* Premium Tier */}
                <Card className="p-8 border-primary ring-2 ring-primary/20 shadow-xl flex flex-col relative bg-gradient-to-b from-white to-primary-50/30 transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                        {t('pricing.recommended')}
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                            <Star size={14} fill="currentColor" />
                            <span>{t('pricing.premiumPass')}</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-slate-900">${price}</span>
                            <span className="text-slate-500 ml-2">{t('pricing.perTrip')}</span>
                        </div>
                        <p className="text-primary-700 text-sm mt-2 font-medium">{t('pricing.lifetime')}</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        {FEATURES.map((feature) => (
                            <div key={feature} className="flex items-center">
                                <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mr-3 shrink-0">
                                    <Check size={12} className="text-primary-700" strokeWidth={3} />
                                </div>
                                <span className="text-slate-700 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Button size="lg" className="w-full shadow-lg shadow-primary/20 animate-pulse-subtle">
                        {t('pricing.getFullAccess')}
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-3">{t('pricing.secure')}</p>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                        By continuing, you agree to our <a href="/terms" className="underline hover:text-primary">Terms of Use</a>.
                    </p>
                </Card>
            </div>
        </section>
    );
}
