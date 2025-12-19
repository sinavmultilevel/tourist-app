import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>}
                <input
                    ref={ref}
                    className={cn(
                        "w-full h-12 px-4 bg-sand-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 text-slate-900",
                        error ? "border-red-500 bg-red-50" : "",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";
