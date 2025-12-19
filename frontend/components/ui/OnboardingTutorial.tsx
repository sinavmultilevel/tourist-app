"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, ScanLine, Languages, Headphones, Map, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function OnboardingTutorial() {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Swipe state
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const slides = [
        {
            id: 1,
            title: t('tutorial.scan.title'),
            desc: t('tutorial.scan.desc'),
            icon: <ScanLine size={80} className="text-white mb-6 drop-shadow-lg" />,
            color: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            descColor: "text-blue-100"
        },
        {
            id: 2,
            title: t('tutorial.translate.title'),
            desc: t('tutorial.translate.desc'),
            icon: <Languages size={80} className="text-white mb-6 drop-shadow-lg" />,
            color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            descColor: "text-emerald-100"
        },
        {
            id: 3,
            title: t('tutorial.audio.title'),
            desc: t('tutorial.audio.desc'),
            icon: <Headphones size={80} className="text-white mb-6 drop-shadow-lg" />,
            color: "bg-gradient-to-br from-amber-500 to-orange-600",
            textColor: "text-white",
            descColor: "text-amber-100"
        },
        {
            id: 4,
            title: t('tutorial.plan.title'),
            desc: t('tutorial.plan.desc'),
            icon: <Map size={80} className="text-white mb-6 drop-shadow-lg" />,
            color: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            descColor: "text-rose-100"
        }
    ];

    useEffect(() => {
        // Check if user has seen tutorial
        const hasSeen = localStorage.getItem("hasSeenOnboarding");
        if (!hasSeen) {
            setShow(true);
        }
    }, []);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            finishTutorial();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    const finishTutorial = () => {
        localStorage.setItem("hasSeenOnboarding", "true");
        setShow(false);
    };

    // Touch Handlers
    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300 overflow-hidden touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* Skip Button */}
            <button
                onClick={finishTutorial}
                className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
            >
                <span className="text-xs font-bold uppercase tracking-wider">{t('tutorial.skip')}</span>
            </button>

            {/* Slides Container */}
            <div className="flex-1 relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-transform duration-500 ease-out ${slide.color
                            } ${index === currentSlide ? "translate-x-0" :
                                index < currentSlide ? "-translate-x-full" : "translate-x-full"
                            }`}
                    >
                        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto">
                            <div className="transform transition-all duration-700 delay-100 hover:scale-110">
                                {slide.icon}
                            </div>
                            <h2 className={`text-4xl font-bold ${slide.textColor} mb-4 tracking-tight drop-shadow-sm`}>
                                {slide.title}
                            </h2>
                            <p className={`text-lg ${slide.descColor} leading-relaxed font-medium`}>
                                {slide.desc}
                            </p>
                        </div>

                        {/* Spacing for bottom controls */}
                        <div className="h-32" />
                    </div>
                ))}
            </div>

            {/* Bottom Controls (Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/20 to-transparent z-10">
                <div className="max-w-md mx-auto w-full flex flex-col gap-8">
                    {/* Dots */}
                    <div className="flex justify-center gap-2">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 border border-white/30 ${idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-2xl bg-white text-slate-900 hover:bg-slate-100 shadow-xl border-none transition-transform active:scale-95"
                    >
                        {currentSlide === slides.length - 1 ? (
                            <span className="flex items-center justify-center gap-2">{t('tutorial.getStarted')} <Check size={22} /></span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">{t('tutorial.next')} <ChevronRight size={22} /></span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
