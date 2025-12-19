export type LanguageCode = 'en' | 'tr' | 'ru' | 'de' | 'fr';

export interface Language {
    code: LanguageCode;
    label: string;
    flag: string;
    speechCode: string; // for Web Speech API
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', label: 'English', flag: '🇬🇧', speechCode: 'en-US' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', speechCode: 'tr-TR' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
];
