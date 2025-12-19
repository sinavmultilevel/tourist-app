"use client";

import { User } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export function SocialProof() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-sand-200 border-2 border-primary-900 flex items-center justify-center overflow-hidden">
                        <User size={12} className="text-slate-400" />
                    </div>
                ))}
            </div>
            <div className="text-xs">
                <span className="font-bold text-white block">12,000+</span>
                <span className="text-primary-100 opacity-80">{t('home.socialProof')}</span>
            </div>
        </div>
    );
}
