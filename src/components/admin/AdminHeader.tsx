"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle, ExternalLink, Globe } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    setPublished(false);
    try {
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Quick Publish from Control Bar",
          description: "Published current drafts to live production",
        }),
      });
      if (res.ok) {
        setPublished(true);
        setTimeout(() => setPublished(false), 3500);
      }
    } catch {}
    setPublishing(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--ufy-purple-100)",
        padding: "20px 32px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "0.88rem", color: "var(--ufy-purple-700)", marginTop: "2px" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {actions}

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="btn btn-primary"
          style={{ padding: "9px 20px", fontSize: "0.88rem" }}
        >
          {published ? (
            <>
              <CheckCircle size={16} />
              <span>Published Live!</span>
            </>
          ) : (
            <>
              <UploadCloud size={16} />
              <span>{publishing ? "Publishing..." : "Publish Live Site"}</span>
            </>
          )}
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-purple"
          style={{ padding: "8px 16px", fontSize: "0.88rem" }}
        >
          <Globe size={15} />
          <span>View Public Site</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
