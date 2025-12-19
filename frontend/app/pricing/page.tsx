"use client";

import { TopBar } from "@/components/ui/TopBar";
import { PricingSection } from "@/components/ui/PricingSection";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PricingPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title={t('pricing.pageTitle') || "Premium Access"} />
            <PricingSection />
        </div>
    );
}
