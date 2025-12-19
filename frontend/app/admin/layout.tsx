"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, MapPin, Building, Utensils, ShoppingBag, Settings, LogOut, Footprints } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
        } else {
            setAuthorized(true);
        }
    }, [pathname, router]);

    if (!authorized) return null; // Or a loading spinner

    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">{children}</div>;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/places", label: "Places", icon: MapPin },
        { href: "/admin/hotels", label: "Hotels", icon: Building },
        { href: "/admin/restaurants", label: "Restaurants", icon: Utensils },
        { href: "/admin/shops", label: "Shops", icon: ShoppingBag },
        { href: "/admin/mapper", label: "Location Mapper", icon: Footprints },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full left-0 top-0 overflow-y-auto hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-primary-400">ICHAN KALA</h1>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Admin Panel</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem("admin_token");
                            router.push("/admin/login");
                        }}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
