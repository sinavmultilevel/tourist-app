"use client";

import { useState, useEffect } from "react";
import { Camera, CheckCircle, AlertTriangle, ShieldCheck, Tag, ShoppingBag } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ShopPage() {
    const { t } = useTranslation();
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAnalyzing(true);
            setTimeout(() => {
                setAnalyzing(false);
                setResult({
                    authentic: true,
                    score: 95,
                    price: "$45 - $60",
                    desc: "Genuine handmade Silk Carpet from a local Bukhara/Khiva workshop. The knot density indicates high quality and natural dyes."
                });
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('shop.pageTitle')} />

            <div className="p-6">
                {!result ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="text-center mb-8 mt-4">
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                <ShieldCheck className="text-rose-500 w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">{t('shop.heroTitle')}</h1>
                            <p className="text-slate-500 max-w-xs mx-auto">{t('shop.heroDesc')}</p>
                        </div>

                        <label className="block cursor-pointer group">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border-2 border-dashed border-sand-300 group-hover:border-primary group-hover:bg-primary-50 transition-all text-center relative overflow-hidden">
                                {analyzing ? (
                                    <div className="py-8 relative z-10">
                                        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
                                        <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">{t('shop.scanning')}</p>
                                    </div>
                                ) : (
                                    <div className="py-2 relative z-10">
                                        <div className="w-24 h-24 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:scale-110 transition-transform shadow-inner">
                                            <Camera className="w-10 h-10 text-slate-400 group-hover:text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('shop.tapToScan')}</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest">{t('shop.supports')}</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleCapture} />
                            </div>
                        </label>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <Card className="p-0 overflow-hidden border-none shadow-2xl rounded-3xl relative">
                            <div className={`h-3 w-full ${result.authentic ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <div className="p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${result.authentic ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                    {result.authentic ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    {result.authentic ? t('shop.verified') : t('shop.standard')}
                                </h2>
                                <div className="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full mt-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{t('shop.confidence')}</span>
                                    <span className="text-sm font-bold text-slate-900">{result.score}%</span>
                                </div>
                            </div>

                            <div className="px-8 pb-8 space-y-6 bg-white">
                                <div className="p-4 bg-sand-50 rounded-2xl border border-sand-100">
                                    <p className="text-slate-600 text-sm leading-relaxed text-center font-medium opacity-90">{result.desc}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-dashed border-sand-200 pt-6">
                                    <div className="flex items-center text-slate-400 space-x-2">
                                        <Tag size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">{t('shop.fairPrice')}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{result.price}</div>
                                </div>
                            </div>
                        </Card>

                        <Button onClick={() => setResult(null)} variant="secondary" className="w-full shadow-xl">{t('shop.scanAnother')}</Button>
                    </div>
                )}
            </div>

            {/* Verified Shops List */}
            <div className="px-6 pb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('shop.verifiedShops')}</h3>
                <ShopList />
            </div>
        </div>
    );
}

function ShopList() {
    const [shops, setShops] = useState<any[]>([]);

    useEffect(() => {
        import("@/lib/api").then(({ fetchShops }) => {
            fetchShops().then(setShops).catch(console.error);
        });
    }, []);

    if (shops.length === 0) return <div className="text-slate-400 text-sm">No partners found.</div>;

    return (
        <div className="space-y-4">
            {shops.map(shop => (
                <Card key={shop.id} className="p-0 border-none shadow-md flex items-center overflow-hidden">
                    <div className="w-20 h-20 relative flex-shrink-0 bg-slate-100">
                        {shop.photo_url ? (
                            <img src={shop.photo_url} alt={shop.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ShoppingBag size={20} />
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-slate-800">{shop.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                            {shop.is_handmade && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">HANDMADE</span>}
                            {shop.is_verified && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">VERIFIED</span>}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
