import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 bg-sand-50 text-center border-t border-sand-200 mt-auto">
            <div className="flex justify-center space-x-6 text-xs text-slate-500 font-medium uppercase tracking-widest">
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">© {new Date().getFullYear()} Ichan Kala Guide. All rights reserved.</p>
        </footer>
    );
}
