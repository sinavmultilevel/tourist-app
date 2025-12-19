"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Local state for form values
    const [pricing, setPricing] = useState({ price: "9.99", currency: "USD" });
    const [languages, setLanguages] = useState({ en: true, tr: true, ru: true, de: true, fr: true });

    const fetchConfigs = async () => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("http://localhost:8000/api/v1/admin/config", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setConfigs(data);

            // Hydrate state from fetched config (mocked logic as we just store key/values)
            const pricingConfig = data.find((c: any) => c.key === "pricing");
            if (pricingConfig) setPricing(JSON.parse(pricingConfig.value));

            const langConfig = data.find((c: any) => c.key === "languages");
            if (langConfig) setLanguages(JSON.parse(langConfig.value));
        }
    };

    useEffect(() => { fetchConfigs(); }, []);

    const saveConfig = async (key: string, value: any) => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            await fetch("http://localhost:8000/api/v1/admin/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ key, value: JSON.stringify(value) })
            });
            alert("Settings saved!");
            fetchConfigs();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Global configuration.</p>
            </div>

            <Card className="p-6 space-y-6">
                <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Premium Price</label>
                        <Input value={pricing.price} onChange={e => setPricing({ ...pricing, price: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                        <Input value={pricing.currency} onChange={e => setPricing({ ...pricing, currency: e.target.value })} />
                    </div>
                </div>
                <Button onClick={() => saveConfig("pricing", pricing)} isLoading={loading} className="w-full">
                    <Save size={18} className="mr-2" /> Save Pricing
                </Button>
            </Card>

            <Card className="p-6 space-y-6">
                <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Languages</h3>
                <div className="space-y-3">
                    {Object.entries(languages).map(([lang, enabled]) => (
                        <div key={lang} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="uppercase font-bold text-slate-700">{lang}</span>
                            <div className="flex items-center space-x-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={enabled} onChange={e => setLanguages({ ...languages, [lang]: e.target.checked })} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <Button onClick={() => saveConfig("languages", languages)} isLoading={loading} className="w-full">
                    <Save size={18} className="mr-2" /> Save Languages
                </Button>
            </Card>
        </div>
    );
}
