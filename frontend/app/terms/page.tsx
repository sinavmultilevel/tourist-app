"use client";

import { TopBar } from "@/components/ui/TopBar";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-sand-50 pb-32">
            <TopBar title="Terms of Use" />

            <div className="p-6 max-w-2xl mx-auto space-y-6 text-slate-700 leading-relaxed font-sans text-sm md:text-base">
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance</h2>
                    <p>
                        By accessing or using the Ichan Kala AI Tour Guide, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">2. AI Content Disclaimer</h2>
                    <p>
                        Our tours and information are generated using Artificial Intelligence. While we strive for historical accuracy, content may occasionally be incorrect or incomplete. We are not liable for any historical inaccuracies.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">3. Use of Service</h2>
                    <p>
                        You agree to use this application only for lawful purposes and in accordance with these Terms. You must not misuse our services or attempt to access them using unauthorized methods.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
                    <p>
                        All content, features, and functionality are the exclusive property of Ichan Kala AI Tour Guide and its licensors.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
                    <p>
                        We are not responsible for any damages or losses related to your use of the application, including relied-upon itinerary advice or navigation.
                    </p>
                </section>
            </div>
        </div>
    );
}
