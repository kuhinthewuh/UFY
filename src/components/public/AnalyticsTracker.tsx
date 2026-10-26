"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // Generate or retrieve privacy-conscious session ID (stored only in browser session)
    let sessionId = sessionStorage.getItem("ufy_session_id");
    if (!sessionId) {
      sessionId = "ses_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem("ufy_session_id", sessionId);
    }

    const deviceCategory =
      window.innerWidth <= 768 ? "mobile" : window.innerWidth <= 1024 ? "tablet" : "desktop";

    // Track initial page view
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        path: window.location.pathname,
        sessionId,
        deviceCategory,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});

    // Track CTA button clicks
    const handleCtaClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const isCta =
        target.classList.contains("btn") ||
        target.getAttribute("data-cta") === "true" ||
        target.getAttribute("href") === "#submit-idea";

      if (isCta) {
        const label = target.textContent?.trim().slice(0, 80) || "CTA";
        fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "cta_click",
            path: window.location.pathname,
            targetLabel: label,
            sessionId,
            deviceCategory,
          }),
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleCtaClick);
    return () => {
      document.removeEventListener("click", handleCtaClick);
    };
  }, []);

  return null;
}
