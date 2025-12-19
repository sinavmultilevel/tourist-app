"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Globe, MoveRight, Volume2, RotateCcw, ChevronDown } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { translateText, speakText } from "@/lib/api";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface Window {
    webkitSpeechRecognition: any;
}

export default function TranslatePage() {
    const { t, locale } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);

    // Default languages
    const [srcLang, setSrcLang] = useState("tr");
    const [tgtLang, setTgtLang] = useState("en");

    const recognitionRef = useRef<any>(null);

    const playAudio = async (text: string, lang: string) => {
        try {
            const res = await speakText(text, lang);
            if (res.audio_base64) {
                const audio = new Audio("data:audio/mp3;base64," + res.audio_base64);
                audio.play();
            }
        } catch (e) {
            console.error("Audio playback error", e);
        }
    };

    const handleTranslate = async (text: string) => {
        if (!text.trim()) return;
        setIsTranslating(true);
        setSourceText(text);

        try {
            const res = await translateText(text, srcLang, tgtLang);
            setTranslatedText(res.translated);
            setIsTranslating(false);

            // Auto-speak result
            playAudio(res.translated, tgtLang);
        } catch (err) {
            console.error(err);
            setTranslatedText("Error translating text.");
            setIsTranslating(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            startListening();
        }
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === srcLang);
            recognitionRef.current.lang = langConfig?.speechCode || 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
                setSourceText("");
                setTranslatedText("");
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSourceText(transcript);
                handleTranslate(transcript);
            };

            recognitionRef.current.onend = () => setIsRecording(false);
            recognitionRef.current.start();
        } else {
            alert("Speech recognition not supported in this browser");
        }
    };

    // Swap languages
    const swapLanguages = () => {
        setSrcLang(tgtLang);
        setTgtLang(srcLang);
        setSourceText("");
        setTranslatedText("");
    };

    return (
        <div className="min-h-screen bg-sand-50 pb-32 flex flex-col">
            <TopBar title={t('translate.pageTitle') || "Live Translator"} />

            <div className="flex-1 p-6 flex flex-col space-y-6">
                {/* Language Selector */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-sand-200 flex items-center justify-between max-w-xs mx-auto w-full">
                    <div className="relative flex-1">
                        <select
                            value={srcLang}
                            onChange={(e) => setSrcLang(e.target.value)}
                            className="w-full appearance-none py-3 pl-4 pr-8 hover:bg-sand-50 rounded-xl transition-colors font-bold text-primary-900 text-sm uppercase bg-transparent text-center focus:outline-none cursor-pointer"
                        >
                            {SUPPORTED_LANGUAGES.map(l => (
                                <option key={l.code} value={l.code}>{l.label} {l.flag}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>

                    <button onClick={swapLanguages} className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-slate-400 active:rotate-180 transition-transform flex-shrink-0 mx-2">
                        <MoveRight size={14} />
                    </button>

                    <div className="relative flex-1">
                        <select
                            value={tgtLang}
                            onChange={(e) => setTgtLang(e.target.value)}
                            className="w-full appearance-none py-3 pl-4 pr-8 hover:bg-sand-50 rounded-xl transition-colors font-bold text-primary-900 text-sm uppercase bg-transparent text-center focus:outline-none cursor-pointer"
                        >
                            {SUPPORTED_LANGUAGES.map(l => (
                                <option key={l.code} value={l.code}>{l.label} {l.flag}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                </div>

                <div className="flex-1 space-y-6 mt-4">
                    {/* User Bubble */}
                    {sourceText && (
                        <div className="flex flex-col items-end space-y-2 animate-in slide-in-from-right-4">
                            <div className="bg-white border border-sand-200 rounded-3xl rounded-tr-none p-6 shadow-sm max-w-[85%]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t('translate.you') || "YOU"}</span>
                                <p className="text-xl font-medium text-slate-800 leading-relaxed">"{sourceText}"</p>
                            </div>
                        </div>
                    )}

                    {/* Translation Bubble */}
                    {translatedText && (
                        <div className="flex flex-col items-start space-y-2 animate-in slide-in-from-left-4 delay-100">
                            <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-3xl rounded-tl-none p-6 shadow-lg max-w-[90%] relative">
                                <span className="text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-2 block">{t('translate.translation') || "TRANSLATION"}</span>
                                <p className="text-xl font-medium leading-relaxed">"{translatedText}"</p>

                                <button
                                    onClick={() => playAudio(translatedText, tgtLang)}
                                    className="absolute -right-4 bottom-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                >
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {!sourceText && !translatedText && (
                        <div className="text-center text-slate-400 mt-20">
                            <Globe className="mx-auto mb-4 opacity-20" size={48} />
                            <p className="text-sm">Tap microphone to start translating</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center -my-4 z-10 relative pt-8">
                    <div className="relative">
                        {isRecording && <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />}
                        <button
                            onClick={toggleRecording}
                            className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all duration-300 ${isRecording ? 'bg-red-500 scale-105' : 'bg-primary hover:bg-primary-dark'} active:scale-95`}
                        >
                            <Mic className="text-white" size={32} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isRecording ? (t('translate.listening') || "Listening...") : (t('translate.tapToSpeak') || "Tap to Speak")}
                </p>
            </div>
        </div>
    );
}
