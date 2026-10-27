import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Readymag in Milan",
  description: "Join us in Milan on June 26 and hear from Readymag ambassadors and team",
  keywords: ["readymag", "milan", "design", "meetup", "designers", "typography"],
  openGraph: {
    title: "Readymag in Milan",
    description: "Join us in Milan on June 26 and hear from Readymag ambassadors and team",
    type: "website",
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
        <meta name="theme-color" content="#e5e5e5" />
      </head>
      <body className="bg-[#e5e5e5]">
        {children}
      </body>
    </html>
  );
}
