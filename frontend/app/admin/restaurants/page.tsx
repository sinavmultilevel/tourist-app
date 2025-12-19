"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Utensils, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AdminModal } from "@/components/ui/AdminModal";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function AdminRestaurantsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", category: "local", price_level: "$$", is_recommended: false, is_active: true, photo_url: "" });

    const fetchItems = async () => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("http://localhost:8000/api/v1/admin/restaurants", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setItems(await res.json());
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        const url = currentItem
            ? `http://localhost:8000/api/v1/admin/restaurants/${currentItem.id}`
            : "http://localhost:8000/api/v1/admin/restaurants";

        try {
            await fetch(url, {
                method: currentItem ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            fetchItems();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this restaurant?")) return;
        const token = localStorage.getItem("admin_token");
        await fetch(`http://localhost:8000/api/v1/admin/restaurants/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
    };

    const openCreate = () => {
        setCurrentItem(null);
        setFormData({ name: "", category: "local", price_level: "$$", is_recommended: false, is_active: true, photo_url: "" });
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        setCurrentItem(item);
        setFormData({ name: item.name, category: item.category, price_level: item.price_level, is_recommended: item.is_recommended, is_active: item.is_active, photo_url: item.photo_url || "" });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Restaurants</h1>
                    <p className="text-slate-500">Manage dining options.</p>
                </div>
                <Button onClick={openCreate}><Plus size={18} className="mr-2" /> Add Restaurant</Button>
            </div>

            <div className="grid gap-4">
                {items.map((item) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                                <Utensils size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center">
                                    {item.name}
                                    {item.is_recommended && <Star size={12} className="ml-2 text-amber-500 fill-amber-500" />}
                                </h3>
                                <div className="flex items-center text-xs text-slate-500 space-x-3">
                                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded">{item.category}</span>
                                    <span className="font-bold text-slate-700">{item.price_level}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(item)} className="p-2 hover:bg-slate-100 rounded text-slate-600"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-rose-50 rounded text-rose-500"><Trash2 size={18} /></button>
                        </div>
                    </Card>
                ))}
            </div>

            <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? "Edit Restaurant" : "Add Restaurant"} onSubmit={handleSubmit} loading={loading}>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cover Image</label>
                        <ImageUpload
                            value={formData.photo_url}
                            onChange={url => setFormData({ ...formData, photo_url: url })}
                            onRemove={() => setFormData({ ...formData, photo_url: "" })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="local">Local Food</option>
                                <option value="cafe">Cafe</option>
                                <option value="fast_food">Fast Food</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Price Level</label>
                            <select
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl"
                                value={formData.price_level}
                                onChange={e => setFormData({ ...formData, price_level: e.target.value })}
                            >
                                <option value="$">$ (Cheap)</option>
                                <option value="$$">$$ (Moderate)</option>
                                <option value="$$$">$$$ (Expensive)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.is_recommended} onChange={e => setFormData({ ...formData, is_recommended: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                            <span className="text-sm font-medium">Recommended</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                            <span className="text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}
