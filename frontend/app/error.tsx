"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertTriangle size={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
            <p className="text-slate-600 mb-8 max-w-xs text-sm">
                We encountered an unexpected error. Please try again.
            </p>
            <Button
                onClick={() => reset()}
                variant="secondary"
                className="flex items-center"
            >
                <RotateCcw size={18} className="mr-2" />
                Try Again
            </Button>
        </div>
    );
}
