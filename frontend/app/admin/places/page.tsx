"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AdminModal } from "@/components/ui/AdminModal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { API_URL } from "@/lib/api";

export default function AdminPlacesPage() {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "", short_desc: "", long_desc: "", type: "historical",
        latitude: 41.378, longitude: 60.364, photo_url: "", is_active: true
    });

    const fetchPlaces = async () => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_URL}/admin/places`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setPlaces(await res.json());
    };

    useEffect(() => { fetchPlaces(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        const url = currentItem
            ? `${API_URL}/admin/places/${currentItem.id}`
            : `${API_URL}/admin/places`;

        try {
            await fetch(url, {
                method: currentItem ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            fetchPlaces();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this place?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${API_URL}/admin/places/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchPlaces();
            } else {
                alert("Failed to delete place. It might be referenced by other items.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server.");
        }
    };

    const openCreate = () => {
        setCurrentItem(null);
        setFormData({ name: "", short_desc: "", long_desc: "", type: "historical", latitude: 41.378, longitude: 60.364, photo_url: "", is_active: true });
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            short_desc: item.short_desc || "",
            long_desc: item.long_desc || "",
            type: item.type,
            latitude: item.latitude,
            longitude: item.longitude,
            photo_url: item.photo_url || "",
            is_active: item.is_active !== undefined ? item.is_active : true
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Places</h1>
                    <p className="text-slate-500">Manage historical sites and attractions.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus size={18} className="mr-2" /> Add New Place
                </Button>
            </div>

            <div className="grid gap-4">
                {places.map((place) => (
                    <Card key={place.id} className="p-4 flex items-center justify-between group hover:border-primary-200 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-sand-100 rounded-lg overflow-hidden relative">
                                {place.photo_url && <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{place.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm space-x-2">
                                    <span className="capitalize bg-sand-100 px-2 py-0.5 rounded text-xs font-bold">{place.type}</span>
                                    <span>•</span>
                                    <span>{place.short_desc?.substring(0, 50)}...</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(place)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-primary">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(place.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-600 hover:text-rose-500">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? "Edit Place" : "Add Place"} onSubmit={handleSubmit} loading={loading}>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Short Description (Card)</label>
                        <Input value={formData.short_desc} onChange={e => setFormData({ ...formData, short_desc: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                        <select
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="historical">Historical Site</option>
                            <option value="museum">Museum</option>
                            <option value="mosque">Mosque</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Latitude</label>
                            <Input type="number" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Longitude</label>
                            <Input type="number" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cover Image</label>
                        <ImageUpload
                            value={formData.photo_url}
                            onChange={url => setFormData({ ...formData, photo_url: url })}
                            onRemove={() => setFormData({ ...formData, photo_url: "" })}
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                        <span className="text-sm font-medium">Active Status</span>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}
