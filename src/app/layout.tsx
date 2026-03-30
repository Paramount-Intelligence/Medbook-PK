import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedBook PK — Book Doctors at Top Pakistani Hospitals",
  description: "Book appointments with 437+ specialists at Aga Khan University Hospital, Shaukat Khanum, Liaquat National and more. AI-powered doctor matching in English & Urdu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
