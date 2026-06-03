"use client";
import { useEffect } from "react";

export default function KomunitasPage() {
  useEffect(() => {
    window.location.href = "https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS";
  }, []);
  return (
    <div style={{ minHeight:"100vh",background:"#04060f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,'SF Pro Display',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48,marginBottom:16 }}>💬</div>
        <p style={{ color:"#fff",fontWeight:800,fontSize:16,marginBottom:8 }}>Membuka Grup WA...</p>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13 }}>Kamu akan diarahkan ke grup diskusi komunitas</p>
      </div>
    </div>
  );
}
