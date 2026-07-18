"use client";
import { useEffect } from "react";

export default function KomunitasPage() {
  useEffect(() => {
    window.location.href = "https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS";
  }, []);
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="text-center max-w-sm glass-card p-8">
        <div className="index-badge w-16 h-16 mx-auto mb-6 bg-neutral-900 border border-emerald-500/30 text-emerald-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h1 className="headline text-lg tracking-wider mb-2">MEMBUKA <span className="accent">DISKUSI</span></h1>
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Kamu sedang diarahkan ke grup WhatsApp komunitas...</p>
      </div>
    </div>
  );
}
