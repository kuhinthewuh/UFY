import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "UFY — Youth-Led Compassionate Action, First-Aid & Community Literacy",
  description:
    "A youth-driven initiative dedicated to uplifting communities through handwritten cards for hospitalized children, hands-on first-aid workshops, and local library book donations.",
  keywords: [
    "UFY",
    "youth-led",
    "letters for children",
    "pediatric hospital",
    "first aid workshop",
    "CPR training",
    "library book donations",
    "community literacy",
    "Montreal youth",
  ],
  authors: [{ name: "UFY Organization" }],
  openGraph: {
    title: "UFY — Youth-Led Compassionate Action & Health Literacy",
    description:
      "Handwritten letters for hospitalized children, community first-aid workshops, and local library book donation drives designed by youth, for youth.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UFY — Youth-Led Compassionate Action & Health Literacy",
    description:
      "Handwritten letters for hospitalized children, community first-aid workshops, and local library book donation drives designed by youth, for youth.",
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
      <body className="bg-[#f7f4fc]">
        {children}
      </body>
    </html>
  );
}
