"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <div className="bg-sand-100 p-6 rounded-full mb-6">
                <AlertCircle size={64} className="text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h2>
            <p className="text-slate-600 mb-8 max-w-xs">
                Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <Link href="/">
                <Button size="lg">Return Home</Button>
            </Link>
        </div>
    );
}
