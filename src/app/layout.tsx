import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "UFY — Youth-Led Action, Health Education & Community Learning",
  description:
    "A youth-driven platform dedicated to peer pediatric health literacy, first aid workshops, community Little Libraries, and student-proposed initiatives.",
  keywords: ["youth", "first aid", "health education", "little libraries", "community", "UFY", "youth leadership"],
  authors: [{ name: "UFY Organization" }],
  openGraph: {
    title: "UFY — Youth-Led Action & Learning",
    description: "Equipping young people with tangible first-aid workshops, accessible health tools, and neighborhood mini-libraries.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UFY — Youth-Led Action & Learning",
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
        <meta name="theme-color" content="#7629f0" />
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
