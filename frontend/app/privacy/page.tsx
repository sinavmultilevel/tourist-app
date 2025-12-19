"use client";

import { TopBar } from "@/components/ui/TopBar";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title="Privacy Policy" />

            <div className="p-6 max-w-2xl mx-auto space-y-6 text-slate-700 leading-relaxed font-sans text-sm md:text-base">
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information Collection</h2>
                    <p>
                        Ichan Kala AI Tour Guide ("we," "us," "our") values your privacy. We may collect minimal information to improve your experience, such as your selected language preference (stored locally) and usage data related to audio tours and image scans.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">2. Data Usage</h2>
                    <p>
                        We use the collected data to provide AI-powered features, generate itineraries, and maintain the functionality of our services. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">3. Camera & Microphone</h2>
                    <p>
                        Our application requires access to your device's camera and microphone for visual recognition and translation features. This data is processed in real-time and is not permanently stored on our servers unless explicitly stated for feature improvement.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">4. Cookies & Storage</h2>
                    <p>
                        We use local storage technology to remember your settings (e.g., language, progress). By using our app, you consent to this local data storage.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">5. Changes</h2>
                    <p>
                        We may update this policy occasionally. Continued use of the service implies acceptance of the new terms.
                    </p>
                </section>
            </div>
        </div>
    );
}
