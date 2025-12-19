const apiHost = process.env.NEXT_PUBLIC_API_HOST;
// Trim to handle accidental spaces in env vars
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || (apiHost ? `https://${apiHost}/api/v1` : 'https://ichan-kala-backend.onrender.com/api/v1')).trim();

export interface Place {
    id: number;
    name: string;
    description?: string;
    short_desc?: string;
    long_desc?: string;
    location_lat: number;
    location_lng: number;
    photo_url?: string;
    audio_url?: string;
    type: string;
}

export interface Shop {
    id: number;
    name: string;
    is_handmade: boolean;
    is_verified: boolean;
    commission_rate: number;
    photo_url?: string;
    admin_notes?: string;
}

export interface Config {
    key: string;
    value: string;
}

export interface Hotel {
    id: number;
    name: string;
    contact_info?: string;
    commission_rate: number;
    photo_url?: string;
    is_active: boolean;
}

export interface Restaurant {
    id: number;
    name: string;
    category?: string;
    price_level?: string;
    photo_url?: string;
    is_recommended: boolean;
    is_active: boolean;
}

export async function fetchPlace(id: string): Promise<Place> {
    const res = await fetch(`${API_URL}/places/${id}`);
    if (!res.ok) throw new Error('Failed to fetch place');
    return res.json();
}

export async function fetchPlaces(): Promise<Place[]> {
    const res = await fetch(`${API_URL}/places`);
    if (!res.ok) throw new Error('Failed to fetch places');
    return res.json();
}

export async function getPlaceByLocation(lat: number, lng: number): Promise<Place> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const res = await fetch(`${API_URL}/places/by-location?lat=${lat}&lng=${lng}`, {
            signal: controller.signal
        });
        clearTimeout(id);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const msg = errorData.detail || 'Failed to fetch place by location';

            if (res.status === 404) throw new Error(msg);
            throw new Error(msg);
        }
        return res.json();
    } catch (err: any) {
        clearTimeout(id);
        const errStr = err.message || err.toString();
        if (err.name === 'AbortError' || errStr.includes('aborted')) {
            throw new Error('Connection timed out (30s). Server is slow or unreachable.');
        }
        throw err;
    }
}

export async function fetchHotels(): Promise<Hotel[]> {
    const res = await fetch(`${API_URL}/hotels`);
    if (!res.ok) throw new Error('Failed to fetch hotels');
    return res.json();
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
    const res = await fetch(`${API_URL}/restaurants`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return res.json();
}

export async function fetchShops(): Promise<Shop[]> {
    const res = await fetch(`${API_URL}/shops`);
    if (!res.ok) throw new Error('Failed to fetch shops');
    return res.json();
}

export async function fetchConfig(): Promise<Config[]> {
    const res = await fetch(`${API_URL}/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
}

export interface ChatResponse {
    response: string;
    audio_available: boolean;
}

export async function chatWithAI(query: string, context: string, lang: string): Promise<ChatResponse> {
    const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context, lang })
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
}

export interface AudioResponse {
    audio_base64: string;
    content_type: string;
    text_content?: string;
}

export async function speakText(text: string, target_lang: string): Promise<AudioResponse> {
    const res = await fetch(`${API_URL}/audio/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_lang, source_lang: "auto" }) // Adjust inputs as needed by schema
    });
    if (!res.ok) throw new Error('TTS failed');
    return res.json();
}

export const getPlaceAudio = async (placeId: number, lang: string = 'en', mode: 'short' | 'long' = 'short'): Promise<AudioResponse> => {
    const res = await fetch(`${API_URL}/places/${placeId}/audio?lang=${lang}&mode=${mode}`);
    if (!res.ok) throw new Error("Failed to fetch audio");
    return res.json();
};

export const getPlaceIntro = async (placeId: number, lang: string = 'en'): Promise<AudioResponse> => {
    const res = await fetch(`${API_URL}/places/${placeId}/intro?lang=${lang}`);
    if (!res.ok) throw new Error("Failed to fetch intro");
    return res.json();
};

export interface TranslationResponse {
    original: string;
    translated: string;
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResponse> {
    const res = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang })
    });
    if (!res.ok) throw new Error("Translation failed");
    return res.json();
}
