"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Palette,
  Image as ImageIcon,
  Users,
  Compass,
  Inbox,
  BarChart3,
  Menu as MenuIcon,
  Settings,
  History,
  Shield,
  LogOut,
  ExternalLink,
  Edit3,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {}
  };

  const navItems = [
    { label: "Overview", path: "/admin/overview", icon: LayoutDashboard },
    { label: "Visual Editor", path: "/admin/editor", icon: Edit3 },
    { label: "Page Sections", path: "/admin/sections", icon: Layers },
    { label: "Typography & Theme", path: "/admin/theme", icon: Palette },
    { label: "Media Library", path: "/admin/media", icon: ImageIcon },
    { label: "Team Management", path: "/admin/team", icon: Users },
    { label: "Programs & Initiatives", path: "/admin/programs", icon: Compass },
    { label: "Idea Inbox", path: "/admin/inbox", icon: Inbox },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Navigation & Footer", path: "/admin/navigation", icon: MenuIcon },
    { label: "Site Settings", path: "/admin/settings", icon: Settings },
    { label: "Publishing & Revisions", path: "/admin/revisions", icon: History },
    { label: "Users & Security", path: "/admin/users", icon: Shield },
  ];

  return (
    <aside
      style={{
        width: "270px",
        backgroundColor: "var(--ufy-purple-950)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--ufy-purple-900)",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--ufy-purple-900)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/admin/overview" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "var(--ufy-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#ffffff",
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "#ffffff" }}>
              UFY Admin
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--ufy-purple-300)" }}>Control Center</div>
          </div>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live website in new tab"
          style={{
            color: "var(--ufy-purple-300)",
            padding: "6px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ufy-purple-300)")}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Navigation Links Scrollable */}
      <nav
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "0.92rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#ffffff" : "var(--ufy-purple-100)",
                backgroundColor: isActive ? "var(--ufy-primary)" : "transparent",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--ufy-purple-100)";
                }
              }}
            >
              <Icon size={18} style={{ color: isActive ? "#ffffff" : "var(--ufy-purple-300)" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div
        style={{
          padding: "16px 14px",
          borderTop: "1px solid var(--ufy-purple-900)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--ufy-purple-200)",
            fontSize: "0.88rem",
            fontWeight: 600,
            padding: "8px 12px",
            borderRadius: "8px",
            width: "100%",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--ufy-purple-200)";
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
