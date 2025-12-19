"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const languages = SUPPORTED_LANGUAGES;

export function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
    const { locale, setLocale } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="relative z-50">
            <button
                onClick={toggleOpen}
                className={`flex items-center space-x-2 rounded-full transition-all active:scale-95 ${variant === 'minimal'
                    ? "bg-white/10 backdrop-blur-sm text-slate-800 p-2 hover:bg-white/20"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 hover:bg-white/20"
                    }`}
            >
                <Globe size={variant === 'minimal' ? 20 : 16} />
                {variant !== 'minimal' && <span className="text-xs font-bold uppercase tracking-wider">{languages.find(l => l.code === locale)?.code}</span>}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-sand-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLocale(lang.code as any);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-sand-50 flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className={`text-sm font-medium ${locale === lang.code ? 'text-primary' : 'text-slate-600'}`}>
                                        {lang.label}
                                    </span>
                                </div>
                                {locale === lang.code && <Check size={14} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
