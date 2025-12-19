"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Play, Pause, Scan, MapPin, CheckCircle2, Info, Volume2, VolumeX, Mic, MicOff, ChevronUp, ChevronDown } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getPlaceByLocation, Place } from "@/lib/api";
import { chatWithAI, speakText, getPlaceAudio, getPlaceIntro, API_URL } from "@/lib/api";

type ScanState = 'INIT' | 'SCANNING' | 'LOCATING' | 'SUCCESS' | 'ERROR';
type AudioState = 'IDLE' | 'PREPARING' | 'PLAYING' | 'PAUSED' | 'ERROR';

// Declare Web Speech API types
interface Window {
    webkitSpeechRecognition: any;
}

export default function CameraPage() {
    const [retryCount, setRetryCount] = useState(0);

    return <CameraPageContent key={retryCount} onRetry={() => setRetryCount(c => c + 1)} />;
}

function CameraPageContent({ onRetry }: { onRetry: () => void }) {
    // Chat & STT State
    const [chatInput, setChatInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const recognitionRef = useRef<any>(null);

    // Audio Helper
    const playBase64Audio = async (base64Audio: string) => {
        if (!audioRef.current) return;
        try {
            const byteCharacters = atob(base64Audio);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
            await audioRef.current.play();
            setAudioState('PLAYING');
        } catch (e) {
            console.error("Base64 playback failed", e);
            setAudioState('ERROR');
        }
    };

    const handleChatSubmit = async (text: string) => {
        if (!text.trim()) return;

        setChatHistory(prev => [...prev, { role: 'user', text }]);
        setChatInput("");
        setIsListening(false); // Stop listening if manual send

        // Pause main audio if playing
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setAudioState('PAUSED');
        }

        try {
            const context = result ? result.name : "Ichan Kala General";
            const res = await chatWithAI(text, context, locale || 'en');

            setChatHistory(prev => [...prev, { role: 'ai', text: res.response }]);

            // Speak response
            const audioRes = await speakText(res.response, locale || 'en');
            if (audioRes.audio_base64) {
                await playBase64Audio(audioRes.audio_base64);
            }

        } catch (err) {
            console.error("Chat error", err);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't reach the guide." }]);
        }
    };

    // Push-to-Talk Handlers
    const startListening = () => {
        if (isListening) return;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Use continuous so it doesn't stop automatically while holding
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = locale === 'tr' ? 'tr-TR' : 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setChatInput(""); // Clear previous input
            };

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        // Show interim results if desired, or simpler just use final
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                setChatInput(finalTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                // If it ends unexpectedly
                // setIsListening(false); 
            };

            recognitionRef.current.start();
        } else {
            alert("Speech recognition not supported");
        }
    };

    const stopListening = () => {
        if (!isListening || !recognitionRef.current) return;

        setIsListening(false);
        recognitionRef.current.stop();

        // Wait slightly for the final result to settle, then submit
        setTimeout(() => {
            if (chatInput.trim()) {
                handleChatSubmit(chatInput);
            }
        }, 500);
    };


    const { t, locale } = useTranslation();
    const [scanState, setScanState] = useState<ScanState>('INIT');
    const [scanMessage, setScanMessage] = useState("Kamerayı bir yapıya doğrultun"); // Initial message
    const [result, setResult] = useState<Place | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPos, setCurrentPos] = useState<{ latitude: number, longitude: number } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Audio State
    const [audioState, setAudioState] = useState<AudioState>('IDLE');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [narrationMode, setNarrationMode] = useState<'short' | 'long'>('short');

    useEffect(() => {
        audioRef.current = new Audio();
        const handleEnded = () => setAudioState('IDLE');
        audioRef.current.addEventListener('ended', handleEnded);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    const playAudio = async (placeId: number, mode?: 'short' | 'long') => {
        if (!audioRef.current) return;
        const currentMode = mode || narrationMode;
        setAudioState('PREPARING');
        try {
            const audioRes = await getPlaceAudio(placeId, locale || 'en', currentMode);
            await playBase64Audio(audioRes.audio_base64);
        } catch (err) {
            console.error("Auto-play failed", err);
            setAudioState('IDLE');
        }
    };

    const playIntro = async (placeId: number) => {
        if (!audioRef.current) return;
        setAudioState('PREPARING');
        try {
            const audioRes = await getPlaceIntro(placeId, locale || 'en');
            await playBase64Audio(audioRes.audio_base64);
            // Optionally set chat history with the welcome text if we want:
            if (audioRes.text_content) {
                setChatHistory(prev => [...prev, { role: 'ai', text: audioRes.text_content! }]);
            }
        } catch (err) {
            console.error("Intro failed", err);
            // Fallback to standard audio if intro fails
            playAudio(placeId);
        }
    };

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (audioState === 'PLAYING') {
            audioRef.current.pause();
            setAudioState('PAUSED');
        } else {
            if (!audioRef.current.src && result) playAudio(result.id);
            else {
                audioRef.current.play();
                setAudioState('PLAYING');
            }
        }
    };

    const handleNoMatch = async () => {
        // Switch to "General Guide Mode" instead of Error
        const generalPlace: Place = {
            id: 0,
            name: t('camera.general.title'),
            short_desc: t('camera.general.desc'),
            description: t('camera.general.desc'), // Fallback
            latitude: 0,
            longitude: 0,
            type: "general",
            is_active: true
        };

        setResult(generalPlace);
        setScanState('SUCCESS');

        // Play General Welcome Audio
        const audioText = t('camera.general.welcomeAudio');
        try {
            // We use speakText directly for dynamic greeting
            const audioRes = await speakText(audioText, locale || 'en');
            if (audioRes.audio_base64) {
                await playBase64Audio(audioRes.audio_base64);
            }
            // Add greeting to chat history
            setChatHistory(prev => [...prev, { role: 'ai', text: audioText }]);
        } catch (e) {
            console.error("General audio failed", e);
        }
    };

    // Camera & Scanning Logic
    useEffect(() => {
        let stream: MediaStream | null = null;
        let timeouts: NodeJS.Timeout[] = [];

        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                    if (videoRef.current) videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error", err);
                setError("Camera access denied");
                setScanState('ERROR');
            }
        };
        startCamera();

        // Optimized Sequence with UX Messages
        // Step 1: Initial Warning (0s) - Already set in initial state: "Kamerayı bir yapıya doğrultun"

        // Step 2: "Detecting" Message & Laser Effect (after 0.8s)
        timeouts.push(setTimeout(() => {
            if (scanState !== 'ERROR') {
                setScanMessage(t('camera.analyzing') || "Yapı algılanıyor...");
                setScanState('SCANNING');
            }
        }, 800));

        // Step 3: Location Check & Success (after 1.8s)
        timeouts.push(setTimeout(() => {
            if (scanState === 'ERROR') return;
            setScanState('LOCATING');

            if (!navigator.geolocation) {
                // Fallback if no geolocation support
                handleNoMatch();
                return;
            }
            navigator.geolocation.getCurrentPosition(async (pos) => {
                setCurrentPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                try {
                    const place = await getPlaceByLocation(pos.coords.latitude, pos.coords.longitude);

                    // Immediate feedback once found
                    setResult(place);
                    setScanState('SUCCESS');
                    // Play Dynamic Intro instead of standard audio
                    playIntro(place.id);

                } catch (err: any) {
                    console.error("Scan Error", err);
                    // Instead of generic ERROR, use smart NO_MATCH (General Guide Mode)
                    handleNoMatch();
                }
            }, (err) => {
                // Location error triggers fallback too
                console.error("Location error", err);
                handleNoMatch();
            }, { enableHighAccuracy: true, timeout: 10000 });
        }, 1800));

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            timeouts.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden font-sans">
            {/* Camera Feed with conditional Blur */}
            <div className={`absolute inset-0 z-0 h-full w-full transition-all duration-700 ${scanState === 'SUCCESS' ? 'filter blur-md brightness-50' : ''}`}>
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover opacity-80" />

                {/* Laser Scanning Effect & Message Overlay - During SCANNING/LOCATING/INIT/ERROR */}
                {(scanState === 'SCANNING' || scanState === 'LOCATING' || scanState === 'INIT' || scanState === 'ERROR') && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">

                        {/* Status Message Overlay */}
                        <div className={`absolute top-1/4 px-6 py-3 rounded-full border backdrop-blur-md animate-in fade-in zoom-in duration-500 ${scanState === 'ERROR'
                            ? 'bg-red-500/80 border-red-200 shadow-red-500/20'
                            : 'bg-black/40 border-white/10'
                            }`}>
                            <p className="text-white font-medium text-lg tracking-wide drop-shadow-md flex items-center gap-2">
                                {scanState === 'ERROR' && <Info size={20} />}
                                {scanMessage}
                            </p>
                        </div>

                        {/* Retry Button if Error */}
                        {scanState === 'ERROR' && (
                            <Button
                                onClick={onRetry}
                                className="mt-8 bg-white text-black hover:bg-slate-200 rounded-full px-8"
                            >
                                {t('common.tryAgain') || "Try Again"}
                            </Button>
                        )}

                        {/* Laser Line Effect (Only if NO error) */}
                        {scanState !== 'INIT' && scanState !== 'ERROR' && (
                            <div className="absolute inset-x-0 h-2 bg-emerald-500/50 blur-sm animate-scan-line shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                        )}

                        {/* Still keep the subtle pulse in center */}
                        {scanState !== 'INIT' && (
                            <div className="w-64 h-64 rounded-full border border-primary/20 animate-pulse relative mt-12">
                                <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Split View Overlay (Only on SUCCESS) */}
            {scanState === 'SUCCESS' && result && (
                <div className="relative z-20 h-full w-full flex flex-col animate-in fade-in duration-500">

                    {/* TOP: Visualizer & Info */}
                    <div className="h-[40%] w-full flex flex-col items-center justify-center p-6 text-center relative">
                        <TopBar title="" className="absolute top-0 left-0 right-0 bg-transparent border-none text-white/50" />

                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{result.name}</h1>
                            <p className="text-white/80 text-sm mt-1">{result.short_desc}</p>
                        </div>

                        {/* Wave Visualizer (Moved to Middle) */}
                        {!isListening && audioState !== 'PLAYING' && (
                            <div className="h-12 flex items-center text-white/40 text-sm">
                                Guide is ready to help
                            </div>
                        )}
                    </div>

                    {/* MIDDLE: Microphone Action */}
                    <div className="h-[20%] w-full flex flex-col items-center justify-center z-30 gap-2">
                        {/* Wave Visualizer - Always visible, flat if idle */}
                        <div className="flex items-center gap-1.5 h-8 mb-2">
                            {[75, 150, 200, 300, 150].map((delay, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 bg-white rounded-full shadow-lg transition-all duration-300 ${(audioState === 'PLAYING' || isListening)
                                        ? 'animate-wave h-6'
                                        : 'h-1.5 opacity-60'
                                        }`}
                                    style={{ animationDelay: `${delay}ms` }}
                                />
                            ))}
                        </div>
                        <span className="text-white text-xl font-bold tracking-wider drop-shadow-lg mb-4">Speak With Guide</span>
                        <button
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onMouseLeave={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 touch-none ${isListening ? 'bg-red-500 scale-110' : 'bg-emerald-500 hover:scale-105'}`}
                        >
                            {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                        </button>
                    </div>

                    {/* BOTTOM: Chat Transcript */}
                    <div className="h-[40%] w-full bg-white/95 backdrop-blur-xl rounded-t-3xl p-6 shadow-top flex flex-col">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {chatHistory.length === 0 ? (
                                <div className="text-center text-slate-400 mt-8">
                                    <p className="text-sm">Tap the mic to ask</p>
                                    <p className="text-xs mt-1">"Who built this?"</p>
                                    <p className="text-xs">"When was this made?"</p>
                                </div>
                            ) : (
                                chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-900 rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Text Input Fallback (Optional, kept small) */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2">
                            <input
                                className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                                placeholder="Or type here..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleChatSubmit(chatInput)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Scanning Logic - hidden but active */}
        </div>
    );
}

