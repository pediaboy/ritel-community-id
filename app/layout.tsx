import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RITEL COMMUNITY.ID — Platform Saham Premium Indonesia",
  description: "Komunitas saham premium dengan sinyal realtime, analisis mendalam, dan AI Agent eksklusif.",
  keywords: "saham, investasi, sinyal saham, IHSG, komunitas saham, ritel community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
