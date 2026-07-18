"use client";
import { useState } from "react";
import Link from "next/link";
import MoreMenu from "./components/MoreMenu";

/* ============================================================
   ICONS — pure Lucide-style SVG, zero emoji
   ============================================================ */
const Icon = {
  Compass:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  BarChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  Eye:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Lock:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  ChevDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ShieldAlert: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.5 8.5-4-1-7.5-3.5-7.5-8.5V6l7.5-3 7.5 3v7Z"/><path d="M12 8v4M12 16h.01"/></svg>,
  Mail:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  LineChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  ArrowUpRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>,
};

/* ============================================================
   HEADER — clean bar, all navigation lives inside the 3-dot menu
   ============================================================ */
function Header() {
  const menuItems = [
    { id: "sinyal",    label: "Sinyal Trading",   onSelect: () => (window.location.href = "/sinyal") },
    { id: "workspace", label: "Workspace",        onSelect: () => (window.location.href = "/workspace") },
    { id: "info",      label: "Info & Berita",    onSelect: () => (window.location.href = "/info") },
    { id: "komunitas", label: "Komunitas",        onSelect: () => (window.location.href = "/komunitas") },
    { id: "cari",      label: "Cari Saham",       onSelect: () => (window.location.href = "/cari") },
    { id: "alat",      label: "Alat & Kalkulator",onSelect: () => (window.location.href = "/alat") },
    { id: "ai",        label: "AI Assistant",     onSelect: () => (window.location.href = "/ai") },
    { id: "paket",     label: "Paket VIP",        onSelect: () => (window.location.href = "/paket") },
    { id: "testimoni", label: "Testimoni",        onSelect: () => (window.location.href = "/testimoni") },
    { id: "order",     label: "Riwayat Order",    onSelect: () => (window.location.href = "/order") },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(3,7,18,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(37,99,235,.45)",
          }}
        >
          <Icon.Compass />
        </div>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
          RITEL <span style={{ color: "#3B82F6" }}>COMMUNITY</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link
          href="/login"
          style={{
            fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase",
            color: "#93C5FD", padding: "8px 14px", border: "1px solid rgba(37,99,235,.35)",
            borderRadius: 10, background: "rgba(37,99,235,.08)", textDecoration: "none",
          }}
        >
          Masuk
        </Link>
        <MoreMenu items={menuItems} />
      </div>
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section style={{ padding: "56px 20px 40px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px",
          borderRadius: 999, border: "1px solid rgba(37,99,235,.35)", background: "rgba(37,99,235,.08)",
          fontSize: 10.5, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#60A5FA",
          marginBottom: 22,
        }}
      >
        <Icon.Activity />
        Market Intelligence Platform
      </div>

      <h1
        style={{
          fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em",
          color: "#F8FAFC", maxWidth: 640, margin: "0 auto 16px",
        }}
      >
        Navigasi Pasar dengan <span style={{ color: "#3B82F6", textShadow: "0 0 24px rgba(37,99,235,.4)" }}>Data & Presisi</span>
      </h1>

      <p style={{ fontSize: 14.5, color: "#94A3B8", maxWidth: 480, margin: "0 auto 34px", lineHeight: 1.7 }}>
        Riset pasar saham berbasis data, edukasi analisis teknikal, dan manajemen risiko —
        dirancang untuk investor yang berpikir sebelum bertindak.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/login"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px",
            borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff",
            fontSize: 12.5, fontWeight: 800, letterSpacing: ".04em", textDecoration: "none",
            boxShadow: "0 8px 28px rgba(37,99,235,.35)",
          }}
        >
          Mulai Riset <Icon.ArrowRight />
        </Link>
        <a
          href="#market-insight"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px",
            borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)",
            color: "#E2E8F0", fontSize: 12.5, fontWeight: 800, letterSpacing: ".04em", textDecoration: "none",
          }}
        >
          Lihat Preview Data
        </a>
      </div>
    </section>
  );
}

/* ============================================================
   MARKET INSIGHT — 3 locked/blurred glass cards
   ============================================================ */
const insightData = [
  {
    icon: <Icon.Activity />,
    title: "Sinyal Screener",
    desc: "Deteksi momentum & volume tidak wajar secara real-time",
    rows: ["BUMI  →  Breakout Volume", "BBCA  →  Akumulasi Bandar", "ANTM  →  Resistance Test"],
  },
  {
    icon: <Icon.BarChart />,
    title: "Watchlist Bandarmologi",
    desc: "Pantau pergerakan dana besar di saham pilihan",
    rows: ["ADRO  →  Net Buy 12.4M", "MDKA  →  Distribusi", "PGAS  →  Net Buy 8.1M"],
  },
  {
    icon: <Icon.Eye />,
    title: "Analisa Teknikal Harian",
    desc: "Level support, resistance, dan proyeksi arah IHSG",
    rows: ["IHSG  →  Uptrend Confirmed", "Support  →  7,120", "Resistance  →  7,340"],
  },
];

function MarketInsight() {
  return (
    <section id="market-insight" style={{ padding: "20px 20px 48px", position: "relative", zIndex: 2 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.01em" }}>Market Insight</h2>
        <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 6 }}>Cuplikan data riset — akses penuh khusus member VIP</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720, margin: "0 auto" }}>
        {insightData.map((card, i) => (
          <div
            key={i}
            style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              background: "#08111F", border: "1px solid rgba(37,99,235,.16)",
              padding: "20px 22px", display: "flex", alignItems: "center", gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                background: "rgba(37,99,235,.1)", border: "1px solid rgba(37,99,235,.25)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA",
              }}
            >
              {card.icon}
            </div>

            <div style={{ minWidth: 160, flex: "1 1 160px" }}>
              <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 800 }}>{card.title}</div>
              <div style={{ color: "#64748B", fontSize: 11.5, marginTop: 3 }}>{card.desc}</div>
            </div>

            {/* blurred preview data + lock overlay */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
              <div style={{ filter: "blur(4.5px)", opacity: 0.55, userSelect: "none" }}>
                {card.rows.map((r, j) => (
                  <div key={j} style={{ fontSize: 11.5, color: "#94A3B8", fontFamily: "monospace", padding: "3px 0" }}>
                    {r}
                  </div>
                ))}
              </div>
              <div
                style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 6, background: "rgba(3,7,18,0.28)", borderRadius: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
                    borderRadius: 999, background: "rgba(37,99,235,.16)", border: "1px solid rgba(37,99,235,.4)",
                    color: "#93C5FD", fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Icon.Lock /> Eksklusif VIP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PARTNER PROMO — cross-link to LASTQUESTION FOREX
   ============================================================ */
function PartnerPromo() {
  return (
    <section style={{ padding: "0 20px 48px", position: "relative", zIndex: 2 }}>
      <a
        href="https://lastquestion.store"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
          maxWidth: 720, margin: "0 auto", textDecoration: "none",
          borderRadius: 16, border: "1px solid rgba(37,99,235,.22)",
          background: "linear-gradient(135deg, rgba(37,99,235,.10), #08111F 65%)",
          padding: "22px 24px",
        }}
      >
        <div
          style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.3)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA",
          }}
        >
          <Icon.LineChart />
        </div>

        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <span
            style={{
              display: "inline-block", fontSize: 9.5, fontWeight: 800, letterSpacing: ".1em",
              textTransform: "uppercase", color: "#60A5FA", background: "rgba(37,99,235,.12)",
              border: "1px solid rgba(37,99,235,.3)", borderRadius: 999, padding: "3px 9px", marginBottom: 6,
            }}
          >
            Partner Platform
          </span>
          <div style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>LASTQUESTION FOREX</div>
          <p style={{ color: "#94A3B8", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            Web Forex — sinyal trading, edukasi, dan komunitas trader forex &amp; crypto profesional. Platform saudara dari RITEL COMMUNITY.
          </p>
        </div>

        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800,
            color: "#3B82F6", flexShrink: 0, whiteSpace: "nowrap",
          }}
        >
          Kunjungi lastquestion.store <Icon.ArrowUpRight />
        </div>
      </a>
    </section>
  );
}

/* ============================================================
   FAQ EDUKASI SAHAM — accordion
   ============================================================ */
const faqData = [
  {
    q: "Apa itu risiko trading saham?",
    a: "Risiko adalah kemungkinan nilai investasi turun akibat fluktuasi harga pasar. Trading saham selalu mengandung risiko kerugian modal — tidak ada strategi yang menghilangkan risiko sepenuhnya, hanya manajemen risiko yang bisa membatasi dampaknya.",
  },
  {
    q: "Bagaimana cara kerja analisis teknikal?",
    a: "Analisis teknikal mempelajari pola pergerakan harga dan volume historis untuk mengidentifikasi tren, support/resistance, dan potensi titik masuk-keluar. Ini adalah alat bantu keputusan, bukan alat prediksi yang pasti benar.",
  },
  {
    q: "Apakah sinyal yang diberikan menjamin profit?",
    a: "Tidak. Tidak ada jaminan profit dalam bentuk apa pun di pasar modal. Setiap sinyal adalah hasil analisis teknikal dan bandarmologi yang bersifat edukatif — keputusan dan risiko investasi sepenuhnya berada di tangan masing-masing investor.",
  },
  {
    q: "Apa itu manajemen risiko dalam trading?",
    a: "Manajemen risiko mencakup penentuan ukuran posisi, stop-loss, dan rasio risk-reward sebelum masuk transaksi. Tujuannya menjaga modal tetap bertahan dalam jangka panjang, bukan mengejar profit instan.",
  },
];

function FaqEdukasi() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "20px 20px 52px", position: "relative", zIndex: 2 }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.01em" }}>FAQ Edukasi Saham</h2>
        <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 6 }}>Pahami risiko sebelum mengambil keputusan</p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {faqData.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: 14, border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.02)", overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer",
                  textAlign: "left", color: "#E2E8F0", fontSize: 13, fontWeight: 700,
                }}
              >
                {item.q}
                <span style={{ color: isOpen ? "#3B82F6" : "#64748B", flexShrink: 0, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                  <Icon.ChevDown />
                </span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 16px", color: "#94A3B8", fontSize: 12.5, lineHeight: 1.75 }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER — 3 columns + long risk disclaimer
   ============================================================ */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "44px 20px 28px", position: "relative", zIndex: 2 }}>
      <div
        style={{
          maxWidth: 900, margin: "0 auto 32px", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Compass />
            </div>
            <span style={{ color: "#F1F5F9", fontSize: 12.5, fontWeight: 800 }}>RITEL COMMUNITY</span>
          </div>
          <p style={{ color: "#64748B", fontSize: 11.5, lineHeight: 1.7 }}>
            Platform riset dan edukasi pasar saham Indonesia.
          </p>
        </div>

        <div>
          <div style={{ color: "#94A3B8", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 12 }}>Platform</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { label: "Sinyal Trading", href: "/sinyal" },
              { label: "Paket VIP", href: "/paket" },
              { label: "Cari Saham", href: "/cari" },
              { label: "Komunitas", href: "/komunitas" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ color: "#64748B", fontSize: 12, textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: "#94A3B8", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 12 }}>Kontak</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <a href="https://wa.me/6289663874700" target="_blank" rel="noopener noreferrer" style={{ color: "#64748B", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon.Mail /> WhatsApp Admin
            </a>
            <Link href="/kontak" style={{ color: "#64748B", fontSize: 12, textDecoration: "none" }}>Halaman Kontak</Link>
            <Link href="/faq" style={{ color: "#64748B", fontSize: 12, textDecoration: "none" }}>FAQ Lengkap</Link>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 900, margin: "0 auto", padding: "18px 18px", borderRadius: 12,
          background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}
      >
        <span style={{ color: "#64748B", flexShrink: 0, marginTop: 1 }}><Icon.ShieldAlert /></span>
        <p style={{ color: "#5B6472", fontSize: 10.5, lineHeight: 1.8, margin: 0 }}>
          <strong style={{ color: "#94A3B8" }}>Disclaimer Risiko: </strong>
          Seluruh konten, sinyal, dan analisis pada platform ini disusun untuk tujuan edukasi dan riset semata, bukan merupakan
          ajakan atau rekomendasi jual/beli instrumen keuangan. Perdagangan saham mengandung risiko tinggi, termasuk potensi
          kehilangan seluruh modal yang diinvestasikan. Kinerja masa lalu tidak menjamin hasil di masa depan. Setiap keputusan
          investasi sepenuhnya menjadi tanggung jawab masing-masing investor — kami tidak bertanggung jawab atas kerugian
          finansial dalam bentuk apa pun yang timbul dari penggunaan informasi di platform ini. Pastikan Anda memahami profil
          risiko pribadi sebelum melakukan transaksi, dan pertimbangkan untuk berkonsultasi dengan penasihat keuangan independen.
        </p>
      </div>

      <div style={{ textAlign: "center", color: "#3A4150", fontSize: 10.5, marginTop: 22 }}>
        © 2026 Ritel Community.ID. All rights reserved.
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", flexDirection: "column" }}>
      <Header />
      <Hero />
      <MarketInsight />
      <PartnerPromo />
      <FaqEdukasi />
      <Footer />
    </div>
  );
}
