"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            onChange(data.url);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200 group flex-shrink-0">
                        <img
                            src={value}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onRemove}
                                className="text-white hover:text-rose-400 hover:bg-transparent"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors flex-shrink-0"
                    >
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">Upload Image</span>
                    </div>
                )}

                <div className="flex flex-col gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Option 1: Upload File</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            accept="image/*"
                            className="hidden"
                            disabled={disabled || uploading}
                        />
                        {!value && (
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={disabled || uploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="w-fit"
                            >
                                {uploading ? "Uploading..." : "Select File"}
                                {!uploading && <Upload size={16} className="ml-2" />}
                            </Button>
                        )}
                    </div>

                    {!value && (
                        <>
                            <div className="text-xs text-slate-400 text-center font-bold uppercase">OR</div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Option 2: Paste URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        onChange={(e) => onChange(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    Use this for permanent images hosted elsewhere (e.g. Unsplash, Imgur).
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
