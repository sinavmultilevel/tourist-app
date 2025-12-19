"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { MapPin, Building, Utensils, ShoppingBag, Users } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:8000/api/v1/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("admin_token");
                    window.location.href = "/admin/login";
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setStats(data.items);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <div className="p-8">Loading stats...</div>;

    const cards = [
        { label: "Total Places", value: stats.places, icon: MapPin, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Hotels", value: stats.hotels, icon: Building, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Restaurants", value: stats.restaurants, icon: Utensils, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Shops", value: stats.shops, icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Users", value: stats.users, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Overview of system status and content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.label} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                                    <Icon className={card.color} size={24} />
                                </div>
                                <span className={`text-2xl font-bold text-slate-900`}>{card.value}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.label}</h3>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
        </div>
    );
}
