import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    const title = settings?.siteTitle || "UFY — Up for Youth | Youth-Led Action, Care & Learning";
    const description =
      settings?.siteDescription ||
      "Up for Youth (UFY) is a youth-driven movement uplifting communities through letters for hospitalized children, hands-on first-aid & CPR workshops, educational videos, and neighborhood book drives.";

    return {
      title,
      description,
      keywords: [
        "UFY",
        "Up for Youth",
        "youth-led",
        "letters for hospitalized children",
        "virtual volunteer hours",
        "first aid workshop",
        "CPR training",
        "educational videos",
        "library book donations",
      ],
      authors: [{ name: "Up for Youth (UFY)" }],
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "UFY — Up for Youth | Youth-Led Action, Care & Learning",
      description:
        "Up for Youth (UFY) uplifts communities through letters for hospitalized children, first-aid workshops, educational videos, and book drives.",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let theme = null;
  try {
    theme = await prisma.themeSettings.findUnique({ where: { id: "global" } });
  } catch {}

  const headingFont = theme?.headingFont || "Plus Jakarta Sans";
  const bodyFont = theme?.bodyFont || "Inter";
  const bgColor = theme?.bgColor || "#f7f4fc";
  const cardBgColor = theme?.cardBgColor || "#ffffff";
  const primaryColor = theme?.primaryColor || "#7629f0";
  const accentColor = theme?.accentColor || "#8e48ff";
  const darkColor = theme?.darkColor || "#140529";
  const footerBgColor = theme?.footerBgColor || "#0d0519";
  const buttonRadius = theme?.buttonRadius || "9999px";
  const containerMaxWidth = theme?.containerMaxWidth || "100%";
  const headingLetterSpacing = theme?.headingLetterSpacing || "-0.03em";
  const marqueeSpeed = `${theme?.marqueeSpeed || 28}s`;

  const dynamicCssVariables = `
    :root {
      --ufy-bg: ${bgColor};
      --ufy-card-bg: ${cardBgColor};
      --bg-card: ${cardBgColor};
      --ufy-primary-purple: ${primaryColor};
      --ufy-primary: ${primaryColor};
      --ufy-bright-violet: ${accentColor};
      --ufy-dark-violet: ${darkColor};
      --text-primary: ${darkColor};
      --ufy-footer-obsidian: ${footerBgColor};
      --font-heading: '${headingFont}', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-body: '${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif;
      --btn-radius: ${buttonRadius};
      --container-max-width: ${containerMaxWidth};
      --heading-tracking: ${headingLetterSpacing};
      --marquee-speed: ${marqueeSpeed};
    }
  `;

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content={primaryColor} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: dynamicCssVariables }} />
      </head>
      <body
        style={{ backgroundColor: bgColor, color: darkColor }}
        className="antialiased selection:bg-[#7629f0] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
