"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Scan, Headphones, PenTool, Languages, ShoppingBag, Map as MapIcon, ChevronRight, ShieldCheck, Zap, Globe, Clock, ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PricingSection } from "@/components/ui/PricingSection";
import { SocialProof } from "@/components/ui/SocialProof";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { fetchPlaces, Place } from "@/lib/api";
import OnboardingTutorial from "@/components/ui/OnboardingTutorial";

export default function Home() {
    const { t } = useTranslation();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch only places for the homepage as per new requirements
        fetchPlaces()
            .then(data => {
                // Take first 4 places for homepage
                setPlaces(data.slice(0, 4));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch homepage data:", err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-sand-50 relative pb-32">
            <OnboardingTutorial />
            {/* Hero Section */}
            <div className="relative min-h-[55vh] w-full overflow-hidden rounded-b-[3rem] shadow-2xl shadow-primary-900/20">
                <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-primary-900/40 to-primary-900/90" />

                <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-12 pt-24">
                    <div className="flex justify-between items-start mb-auto">
                        <div className="inline-flex items-center space-x-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span dangerouslySetInnerHTML={{ __html: t('home.liveInKhiva') }} className="text-emerald-50 text-[10px] font-bold tracking-widest uppercase" />
                        </div>
                        <LanguageSelector />
                    </div>

                    <h1 className="text-5xl font-bold text-white leading-tight mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: t('home.heroTitle') }} />
                    <p className="text-primary-50 text-base max-w-[85%] font-medium leading-relaxed mb-6">
                        {t('home.heroSubtitle')}
                    </p>

                    <div className="flex items-center justify-between">
                        <Link
                            href="/tour"
                            className="bg-white text-primary-900 hover:bg-primary-50 active:bg-primary-100 border-none shadow-xl px-8 relative inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 h-12 text-base"
                        >
                            {t('home.startExploring')}
                        </Link>
                        <SocialProof />
                    </div>
                </div>
            </div>

            {/* Main Actions - Elevated */}
            <div className="px-6 -mt-10 relative z-20 space-y-5">
                <Link href="/camera" className="block">
                    <Card className="p-1 flex items-center justify-between border-none shadow-xl bg-white active:scale-[0.98] transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="flex items-center p-4">
                            <div className="w-14 h-14 bg-secondary-50 text-secondary rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                                <Camera size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{t('home.scanCardTitle')}</h3>
                                <p className="text-slate-500 text-xs font-medium">{t('home.scanCardDesc')}</p>
                            </div>
                        </div>
                        <div className="pr-5">
                            <div className="bg-sand-100 p-2 rounded-full">
                                <ChevronRight size={20} className="text-slate-400" />
                            </div>
                        </div>
                    </Card>
                </Link>

                <div className="grid grid-cols-3 gap-3">
                    <Link href="/tour" className="group">
                        <Card className="p-4 h-full flex flex-col justify-between border-none shadow-lg group-active:scale-[0.98] transition-all bg-white hover:bg-sand-50">
                            <div className="w-10 h-10 bg-primary-50 text-primary rounded-xl flex items-center justify-center mb-3">
                                <Headphones size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm leading-tight" dangerouslySetInnerHTML={{ __html: t('home.tourCardTitle') }} />
                                <p className="text-slate-400 text-[10px] mt-1 font-medium leading-tight">{t('home.tourCardDesc')}</p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/plan" className="group">
                        <Card className="p-4 h-full flex flex-col justify-between border-none shadow-lg group-active:scale-[0.98] transition-all bg-white hover:bg-sand-50">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                                <MapIcon size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm leading-tight" dangerouslySetInnerHTML={{ __html: t('home.planCardTitle') }} />
                                <p className="text-slate-400 text-[10px] mt-1 font-medium leading-tight">{t('home.planCardDesc')}</p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/translate" className="group">
                        <Card className="p-4 h-full flex flex-col justify-between border-none shadow-lg group-active:scale-[0.98] transition-all bg-white hover:bg-sand-50">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                                <Languages size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm leading-tight">{t('home.translator')}</h3>
                                <p className="text-slate-400 text-[10px] mt-1 font-medium leading-tight">{t('home.transDesc')}</p>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Featured Places */}
            <div className="px-6 mt-12 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-slate-900 font-bold text-xl">{t('home.featuredTitle') || "Featured Places"}</h2>
                    <Link href="/tour">
                        <span className="text-xs font-bold text-primary flex items-center">
                            View All <ArrowRight size={14} className="ml-1" />
                        </span>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-400 text-sm">Loading places...</div>
                ) : places.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">Places coming soon...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {places.map(place => (
                            <Link href={`/ places / ${place.id} `} key={place.id} className="block group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-sand-100 group-hover:shadow-lg transition-all h-full flex flex-col">
                                    <div className="h-28 w-full bg-slate-200 relative">
                                        {place.photo_url ? (
                                            <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-xs">No Image</div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md rounded-lg px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                            {place.type}
                                        </div>
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{place.name}</h3>
                                        <p className="text-slate-500 text-[10px] line-clamp-2 mb-2 flex-1">{place.short_desc || place.description}</p>
                                        <div className="flex items-center text-slate-400 text-[10px] font-bold mt-auto">
                                            <Clock size={10} className="mr-1" /> 5 min
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Trust & Tools */}
            <div className="px-6 mt-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-slate-900 font-bold text-xl">{t('home.toolsTitle')}</h2>
                    <span className="text-xs font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">Beta</span>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-2 gap-4 mb-24">
                    <Link href="/camera" className="col-span-2 group relative overflow-hidden rounded-3xl bg-black aspect-[2/1] shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1590233630635-424a18012a67?q=80&w=800&auto=format&fit=crop"
                            alt="Scan"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-full bg-emerald-500 text-white">
                                    <Scan size={24} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg backdrop-blur-md">AI Powered</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t('home.cards.scan.title')}</h3>
                            <p className="text-white/80 text-sm line-clamp-2">{t('home.cards.scan.desc')}</p>
                        </div>
                    </Link>

                    <Link href="/tour" className="group p-6 rounded-3xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
                        <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                            <Headphones size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{t('home.cards.tours.title')}</h3>
                        <p className="text-slate-500 text-xs">{t('home.cards.tours.desc')}</p>
                    </Link>

                    <Link href="/plan" className="group p-6 rounded-3xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
                        <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm text-rose-600 group-hover:scale-110 transition-transform">
                            <PenTool size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{t('home.cards.plan.title')}</h3>
                        <p className="text-slate-500 text-xs">{t('home.cards.plan.desc')}</p>
                    </Link>

                    <Link href="/translator" className="group p-6 rounded-3xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
                        <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                            <Languages size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{t('home.cards.translate.title')}</h3>
                        <p className="text-slate-500 text-xs">{t('home.cards.translate.desc')}</p>
                    </Link>

                    {/* NEW MAP BUTTON */}
                    <Link href="/map" className="group p-6 rounded-3xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
                        <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm text-amber-600 group-hover:scale-110 transition-transform">
                            <MapIcon size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{t('nav.map') || "Map"}</h3>
                        <p className="text-slate-500 text-xs">{t('nav.mapDesc') || "Explore Ichan Kala"}</p>
                    </Link>
                </div>
                <div className="space-y-4">
                    <Link href="/shops" className="block group">
                        <div className="bg-white p-4 rounded-2xl flex items-center space-x-4 shadow-sm border border-sand-200 group-hover:border-primary/30 transition-colors">
                            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                                <ShoppingBag size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{t('home.authChecker')}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{t('home.authDesc')}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </Link>

                </div>
            </div>

            {/* Trust Signals */}
            <div className="px-6 py-8 bg-sand-100/50">
                <div className="flex justify-around text-center">
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck size={20} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: t('home.trustVerified') }} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Zap size={20} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: t('home.trustInstant') }} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Globe size={20} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: t('home.trustOffline') }} />
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <PricingSection />

        </main>
    );
}
