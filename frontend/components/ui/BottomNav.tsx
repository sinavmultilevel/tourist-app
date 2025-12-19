"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Headphones, Camera, Map, Menu, Bed, Utensils, ShoppingBag } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useState, useRef, useEffect } from "react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function BottomNav() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navItems = [
        { href: "/", label: t('nav.home'), icon: Home },
        { href: "/tour", label: t('nav.tour'), icon: Headphones },
        { href: "/camera", label: t('nav.scan'), icon: Camera, isFab: true },
        { href: "/plan", label: t('nav.plan'), icon: Map },
        {
            href: "#",
            label: t('nav.more'),
            icon: Menu,
            isMenuTrigger: true
        },
    ];

    const menuItems = [
        { href: "/hotels", label: t('nav.hotels') || "Hotels", icon: Bed },
        { href: "/restaurants", label: t('nav.restaurants') || "Restaurants", icon: Utensils },
        { href: "/shops", label: t('nav.shops') || "Shops", icon: ShoppingBag },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 z-50 pb-safe">
            <div className="flex justify-around items-end h-16 max-w-md mx-auto relative px-2">
                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute bottom-20 right-4 bg-white rounded-xl shadow-2xl border border-sand-200 w-48 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50"
                    >
                        <div className="flex flex-col p-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-lg hover:bg-sand-50 transition-colors",
                                        pathname === item.href ? "bg-sand-50 text-primary font-medium" : "text-slate-700"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon size={18} className="mr-3 text-slate-400" />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.isMenuTrigger && isMenuOpen);
                    const Icon = item.icon;

                    if (item.isFab) {
                        return (
                            <div key={item.href} className="relative -top-5">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-primary/30 transition-transform active:scale-95",
                                        isActive ? "bg-primary-900 text-white" : "bg-primary text-white"
                                    )}
                                >
                                    <Icon size={24} />
                                </Link>
                            </div>
                        );
                    }

                    if (item.isMenuTrigger) {
                        return (
                            <button
                                key={item.href}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-full pb-2 transition-colors outline-none",
                                    isActive ? "text-primary font-medium" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Icon size={24} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px]">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-full pb-2 transition-colors",
                                isActive ? "text-primary font-medium" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Icon size={24} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
