"use client";
import { useEffect } from "react";

export default function KomunitasPage() {
  useEffect(() => {
    window.location.href = "https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS";
  }, []);
  return (
    <div style={{ minHeight:"100vh",background:"#04060f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,'SF Pro Display',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.6" style={{ margin:"0 auto 16px" }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <p style={{ color:"#fff",fontWeight:800,fontSize:16,marginBottom:8 }}>Membuka Grup WA...</p>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13 }}>Kamu akan diarahkan ke grup diskusi komunitas</p>
      </div>
    </div>
  );
}
