"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/Button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans`}>
                <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Critical Error</h2>
                    <p className="text-slate-600 mb-8">A critical error occurred in the application.</p>
                    <Button onClick={() => reset()}>Try again</Button>
                </div>
            </body>
        </html>
    );
}
