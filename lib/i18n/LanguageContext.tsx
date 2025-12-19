"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

type Locale = 'en' | 'tr' | 'ru' | 'de' | 'fr';

// Define the shape of our dictionary based on the English file
type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
    en,
    tr,
    ru,
    de,
    fr
};

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // 1. Check localStorage
        const savedLocale = localStorage.getItem('app-locale') as Locale;

        if (savedLocale && dictionaries[savedLocale]) {
            setLocaleState(savedLocale);
        } else {
            // 2. Check browser language
            const browserLang = navigator.language.split('-')[0] as Locale;
            if (dictionaries[browserLang]) {
                setLocaleState(browserLang);
            }
        }
        setIsLoaded(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('app-locale', newLocale);
    };

    // Helper to get nested values by dot notation string (e.g. "nav.home")
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = dictionaries[locale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                // Fallback to English if key missing
                let fallback: any = dictionaries['en'];
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in fallback) {
                        fallback = fallback[fk as keyof typeof fallback];
                    } else {
                        return key; // Key not found in EN either
                    }
                }
                return typeof fallback === 'string' ? fallback : key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
