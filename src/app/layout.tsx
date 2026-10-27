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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --ufy-bg: #f7f4fc;
            --ufy-dark-violet: #140529;
            --ufy-primary-purple: #7629f0;
            --ufy-bright-violet: #8e48ff;
          }
          html { scroll-behavior: smooth; background: #f7f4fc; color: #140529; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f7f4fc;
            background-image: radial-gradient(rgba(118, 41, 240, 0.035) 1px, transparent 0);
            background-size: 24px 24px;
            color: #140529;
            line-height: 1.5;
            margin: 0;
            overflow-x: hidden;
          }
          .ufy-dashed-box {
            border: 2px dashed rgba(118, 41, 240, 0.45);
            background: transparent;
            position: relative;
            transition: border-color 0.3s ease;
          }
          .ufy-dashed-box:hover {
            border-color: rgba(118, 41, 240, 0.7);
          }
          @keyframes marqueeLeftToRight {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0%, 0, 0); }
          }
          .animate-marquee-lr {
            display: flex !important;
            width: max-content !important;
            animation: marqueeLeftToRight 28s linear infinite !important;
            will-change: transform;
          }
          .animate-marquee-lr:hover { animation-play-state: paused; }
          .ufy-sticker {
            display: inline-block;
            padding: 1rem 1.5rem;
            font-size: 1.05rem;
            line-height: 1.35;
            border-radius: 2px;
            box-shadow: 4px 6px 0px rgba(20, 5, 41, 0.18);
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
            user-select: none;
          }
          .ufy-sticker-black { background-color: #140529; color: #ffffff; }
          .ufy-sticker-purple { background-color: #7629f0; color: #ffffff; box-shadow: 4px 6px 0px rgba(118, 41, 240, 0.3); }
          .ufy-sticker-violet { background-color: #8e48ff; color: #ffffff; box-shadow: 4px 6px 0px rgba(142, 72, 255, 0.3); }
          .ufy-tilt-neg3 { transform: rotate(-3deg); }
          .ufy-tilt-neg3:hover { transform: rotate(-1deg) scale(1.02); }
          .ufy-tilt-pos3 { transform: rotate(3deg); }
          .ufy-tilt-pos3:hover { transform: rotate(5deg) scale(1.02); }
          .ufy-tilt-neg1 { transform: rotate(-1deg); }
          .ufy-tilt-neg1:hover { transform: rotate(1deg) scale(1.02); }
          .ufy-tilt-neg5 { transform: rotate(-5deg); }
          .ufy-tilt-neg5:hover { transform: rotate(-2deg) scale(1.02); }
          .ufy-tilt-neg6 { transform: rotate(-6deg); }
          .ufy-tilt-neg6:hover { transform: rotate(-2deg) scale(1.02); }
          .ufy-tilt-pos5 { transform: rotate(5deg); }
          .ufy-tilt-pos5:hover { transform: rotate(1deg) scale(1.02); }
          .ufy-tilt-pos6 { transform: rotate(6deg); }
          .ufy-tilt-pos6:hover { transform: rotate(2deg) scale(1.02); }
          .ufy-polaroid-frame {
            background-color: #ffffff;
            padding: 10px;
            display: inline-block;
            box-shadow: 0 10px 25px -5px rgba(20, 5, 41, 0.15), 0 8px 10px -6px rgba(20, 5, 41, 0.1);
            border: 1px solid rgba(20, 5, 41, 0.08);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          }
          .ufy-polaroid-frame:hover {
            box-shadow: 0 20px 30px -8px rgba(118, 41, 240, 0.28);
          }
          .ufy-duotone-purple {
            filter: grayscale(100%) brightness(95%) sepia(100%) hue-rotate(225deg) saturate(320%) contrast(115%);
            transition: filter 0.35s ease;
          }
          .ufy-duotone-purple:hover { filter: grayscale(0%) contrast(100%); }
          .ufy-duotone-violet {
            filter: grayscale(100%) brightness(95%) sepia(100%) hue-rotate(245deg) saturate(360%) contrast(115%);
            transition: filter 0.35s ease;
          }
          .ufy-duotone-violet:hover { filter: grayscale(0%) contrast(100%); }
        ` }} />
      </head>
      <body className="bg-[#f7f4fc]">
        {children}
      </body>
    </html>
  );
}
