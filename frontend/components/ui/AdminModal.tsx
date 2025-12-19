"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    loading?: boolean;
}

export function AdminModal({ isOpen, onClose, title, children, onSubmit, loading }: AdminModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
