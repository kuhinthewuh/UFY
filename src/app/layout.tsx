import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "UFY — 360° Youth-Led Health Action, Workshops & Community Literacy",
  description:
    "A premier youth-led platform dedicated to practical first-aid certification, pediatric health guides, outdoor mini-libraries, and student-proposed community initiatives.",
  keywords: ["youth", "first aid", "cpr", "health education", "little libraries", "community", "UFY", "montreal youth leadership"],
  authors: [{ name: "UFY Organization" }],
  openGraph: {
    title: "UFY — 360° Youth-Led Health Action & Literacy",
    description: "Equipping young people with tangible first-aid workshops, accessible health tools, and neighborhood mini-libraries.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UFY — 360° Youth-Led Health Action & Literacy",
    description: "Equipping young people with tangible first-aid workshops, accessible health tools, and neighborhood mini-libraries.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#08090e" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
