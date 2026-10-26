"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ufy.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin/overview");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--ufy-purple-50)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1.5px solid var(--ufy-purple-200)",
          boxShadow: "0 20px 50px rgba(118, 41, 240, 0.12)",
          padding: "44px 36px",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "var(--ufy-primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              boxShadow: "0 8px 20px rgba(118, 41, 240, 0.3)",
            }}
          >
            <Lock size={28} />
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "6px" }}>
            UFY Admin Portal
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--ufy-purple-700)" }}>
            Sign in to manage website content, proposals & analytics
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--ufy-purple-100)",
              border: "1.5px solid var(--ufy-purple-300)",
              color: "var(--ufy-purple-950)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} style={{ color: "var(--ufy-primary)", flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-email"
                type="email"
                required
                className="form-input"
                placeholder="admin@ufy.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1rem",
              justifyContent: "center",
              marginTop: "16px",
              opacity: loading ? 0.75 : 1,
            }}
          >
            <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Security Notice */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid var(--ufy-purple-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "0.82rem",
            color: "var(--ufy-purple-700)",
          }}
        >
          <ShieldCheck size={16} />
          <span>Strict Session Security • Rate-Limited Authentication</span>
        </div>
      </div>
    </div>
  );
}
