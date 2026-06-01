import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RITEL COMMUNITY.ID | Komunitas Saham Premium Indonesia",
  description: "Platform investasi saham terpercaya dengan sinyal realtime, analisis mendalam, dan komunitas trader profesional. Dikembangkan oleh Thirafi Thariq Al Idris.",
  keywords: "saham, investasi, sinyal saham, IHSG, komunitas saham, trading",
  openGraph: {
    title: "RITEL COMMUNITY.ID",
    description: "Platform investasi saham premium dengan sinyal realtime",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
