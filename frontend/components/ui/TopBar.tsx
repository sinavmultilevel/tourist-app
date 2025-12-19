"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TopBarProps {
    title?: string;
    showBack?: boolean;
    className?: string;
}

export function TopBar({ title, showBack = true, className = "" }: TopBarProps) {
    return (
        <header className={`sticky top-0 z-40 bg-sand-50/80 backdrop-blur-md border-b border-sand-200 h-14 flex items-center px-4 ${className}`}>
            <div className="flex-1 flex items-center">
                {showBack && (
                    <Link href="/" className="p-2 -ml-2 text-slate-600 hover:bg-black/5 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                )}
            </div>
            <h1 className="flex-2 font-bold text-center text-slate-800 text-sm uppercase tracking-wider">{title}</h1>
            <div className="flex-1" /> {/* Spacer */}
        </header>
    );
}
