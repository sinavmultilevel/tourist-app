"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Building, Percent, Phone, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AdminModal } from "@/components/ui/AdminModal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { API_URL } from "@/lib/api";

export default function AdminHotelsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", contact_info: "", commission_rate: 0, is_active: true, photo_url: "" });

    const fetchItems = async () => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_URL}/admin/hotels`, {
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
            ? `${API_URL}/admin/hotels/${currentItem.id}`
            : `${API_URL}/admin/hotels`;

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
        if (!confirm("Delete this hotel?")) return;
        const token = localStorage.getItem("admin_token");
        await fetch(`${API_URL}/admin/hotels/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
    };

    const openCreate = () => {
        setCurrentItem(null);
        setFormData({ name: "", contact_info: "", commission_rate: 0, is_active: true, photo_url: "" });
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        setCurrentItem(item);
        setFormData({ name: item.name, contact_info: item.contact_info, commission_rate: item.commission_rate, is_active: item.is_active, photo_url: item.photo_url || "" });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hotels</h1>
                    <p className="text-slate-500">Manage accommodation partners.</p>
                </div>
                <Button onClick={openCreate}><Plus size={18} className="mr-2" /> Add Hotel</Button>
            </div>

            <div className="grid gap-4">
                {items.map((item) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                <Building size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{item.name}</h3>
                                <div className="flex items-center text-xs text-slate-500 space-x-3">
                                    <span className="flex items-center"><Phone size={12} className="mr-1" /> {item.contact_info || "-"}</span>
                                    <span className="flex items-center text-emerald-600 font-bold"><Percent size={12} className="mr-1" /> {item.commission_rate}%</span>
                                    {item.is_active ? <span className="text-emerald-500 flex items-center"><CheckCircle size={12} className="mr-1" /> Active</span> : <span className="text-slate-400 flex items-center"><XCircle size={12} className="mr-1" /> Inactive</span>}
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

            <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? "Edit Hotel" : "Add Hotel"} onSubmit={handleSubmit} loading={loading}>
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
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Contact Info</label>
                        <Input value={formData.contact_info} onChange={e => setFormData({ ...formData, contact_info: e.target.value })} placeholder="Phone or Telegram" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Commission Rate (%)</label>
                        <Input type="number" step="0.1" value={formData.commission_rate} onChange={e => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) || 0 })} />
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
