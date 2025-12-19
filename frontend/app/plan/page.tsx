"use client";

import { useState } from "react";
import { Calendar, CheckCircle, ArrowRight, MapPin, Coffee, Camera, Clock } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PlanPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [duration, setDuration] = useState<string | null>(null);
    const [interests, setInterests] = useState<string[]>([]);
    const [generated, setGenerated] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleInterest = (id: string) => {
        if (interests.includes(id)) {
            setInterests(interests.filter(i => i !== id));
        } else {
            setInterests([...interests, id]);
        }
    };

    const generatePlan = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setGenerated(true);
        }, 2000);
    };

    const steps = [
        {
            id: 1,
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="text-center space-y-2 mt-4">
                        <div className="w-12 h-12 bg-primary-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Calendar size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{t('plan.step1Title')}</h1>
                        <p className="text-slate-500">{t('plan.step1Desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {['2 Hours', 'Half Day', 'Full Day', '2 Days'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setDuration(opt)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${duration === opt ? 'border-primary bg-primary-50 text-primary font-bold' : 'border-sand-200 bg-white hover:border-primary-200'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{opt}</span>
                                    {duration === opt && <CheckCircle size={20} className="text-primary" />}
                                </div>
                            </button>
                        ))}
                    </div>
                    <Button onClick={() => setStep(2)} disabled={!duration} className="w-full" size="lg">
                        {t('plan.continue')}
                    </Button>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="text-center space-y-2 mt-4">
                        <div className="w-12 h-12 bg-secondary-100 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Coffee size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{t('plan.step2Title')}</h1>
                        <p className="text-slate-500">{t('plan.step2Desc')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'history', label: t('plan.interests.history'), icon: <Clock /> },
                            { id: 'food', label: t('plan.interests.food'), icon: <Coffee /> },
                            { id: 'shopping', label: t('plan.interests.shopping'), icon: <MapPin /> }, // Using MapPin as generic for now or replace with ShoppingBag imports
                            { id: 'photo', label: t('plan.interests.photo'), icon: <Camera /> }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => toggleInterest(opt.id)}
                                className={`p-4 rounded-xl border-2 text-center flex flex-col items-center justify-center space-y-3 transition-all h-32 ${interests.includes(opt.id) ? 'border-secondary bg-secondary-50 text-secondary-900 font-bold' : 'border-sand-200 bg-white hover:border-secondary-200'}`}
                            >
                                <div className={`${interests.includes(opt.id) ? 'text-secondary' : 'text-slate-400'}`}>{opt.icon}</div>
                                <span className="text-sm">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                    <Button onClick={generatePlan} isLoading={loading} className="w-full mt-8" size="lg">
                        {loading ? t('plan.crafting') : t('plan.generate')}
                    </Button>
                </div>
            )
        }
    ];

    if (generated) {
        return (
            <div className="min-h-screen bg-sand-50 pb-32">
                <TopBar title="Itinerary" showBack={false} />
                <div className="p-6 space-y-6 animate-in hover:none">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 bg-primary-100 px-3 py-1 rounded-full text-primary-800 text-xs font-bold uppercase mb-4">
                            <CheckCircle size={14} />
                            <span>{t('plan.aiGenerated')}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{t('plan.resultTitle')}</h2>
                        <p className="text-slate-500">{t('plan.resultDesc')}</p>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-sand-300">
                        {/* Timeline Items */}
                        {[
                            { time: '09:00', title: 'Start at West Gate (Ota Darvoza)', desc: 'Enter the ancient citadel.', icon: '🏰' },
                            { time: '10:30', title: 'Kalta Minor & Mohammed Amin', desc: 'Photo stop at the blue minaret.', icon: '📸' },
                            { time: '12:00', title: 'Lunch at Terrassa Cafe', desc: 'Try the local Shivit Oshi.', icon: '🍲' },
                            { time: '14:00', title: 'Juma Mosque', desc: 'Explore the 213 wooden columns.', icon: '🕌' },
                        ].map((item, i) => (
                            <div key={i} className="relative pl-12">
                                <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10 text-lg shadow-sm">
                                    {item.icon}
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-sand-200">
                                    <span className="text-xs font-bold text-primary-600 mb-1 block">{item.time}</span>
                                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full shadow-xl sticky bottom-24 z-20" size="lg">
                        <MapPin className="mr-2" size={18} />
                        {t('plan.startDay1')}
                    </Button>

                    <button onClick={() => setGenerated(false)} className="w-full text-center text-slate-400 text-sm font-medium hover:text-slate-600 p-2">
                        Start Over
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('plan.pageTitle')} />

            {/* Progress Bar */}
            <div className="w-full h-1 bg-sand-200">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${step * 50}%` }} />
            </div>

            <div className="p-6">
                {steps.find(s => s.id === step)?.content}
            </div>
        </div>
    );
}
