import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Footer } from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Ichan Kala AI Tour Guide",
    description: "Your personalized AI historian for Khiva's ancient citadel",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-sand-50 text-slate-900`}>
                <LanguageProvider>
                    <main className="pb-20 flex flex-col min-h-screen">
                        <div className="flex-1">
                            {children}
                        </div>
                        <Footer />
                    </main>
                    <BottomNav />
                </LanguageProvider>
            </body>
        </html>
    );
}
