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
  Camera,
  MapPin,
  Activity,
  GraduationCap,
  MailOpen,
  HeartHandshake,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {}
  };

  const navGroups = [
    {
      heading: "Site Builder & Design",
      items: [
        { label: "Overview", path: "/admin/overview", icon: LayoutDashboard },
        { label: "Visual Page Builder", path: "/admin/editor", icon: Edit3 },
        { label: "Colors, Fonts & Theme", path: "/admin/theme", icon: Palette },
        { label: "All Page Copy & Settings", path: "/admin/settings", icon: Settings },
        { label: "Homepage Sections", path: "/admin/sections", icon: Layers },
        { label: "Navigation & Footer", path: "/admin/navigation", icon: MenuIcon },
      ],
    },
    {
      heading: "Public Pages & Content",
      items: [
        { label: "Educational Videos", path: "/admin/videos", icon: GraduationCap },
        { label: "Virtual Letters Wall", path: "/admin/letters", icon: MailOpen },
        { label: "Volunteers & Hours", path: "/admin/volunteers", icon: HeartHandshake },
        { label: "Programs & Initiatives", path: "/admin/programs", icon: Compass },
        { label: "Our Team & Pegs", path: "/admin/team", icon: Users },
        { label: "Journey Trail Map", path: "/admin/journey", icon: MapPin },
        { label: "Impact Live Counters", path: "/admin/impact", icon: Activity },
        { label: "Polaroid Gallery", path: "/admin/gallery", icon: Camera },
        { label: "Idea Mailbox Inbox", path: "/admin/inbox", icon: Inbox },
      ],
    },
    {
      heading: "Assets & Operations",
      items: [
        { label: "Media Library", path: "/admin/media", icon: ImageIcon },
        { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { label: "Publishing & Revisions", path: "/admin/revisions", icon: History },
        { label: "Admins & Security", path: "/admin/users", icon: Shield },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: "276px",
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
          padding: "22px 20px",
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
              fontWeight: 900,
              fontSize: "0.95rem",
              color: "#ffffff",
            }}
          >
            ufy
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "#ffffff" }}>
              Up for Youth
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--ufy-purple-300)" }}>
              Admin Site Studio
            </div>
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
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Grouped Navigation Links */}
      <nav
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {navGroups.map((group) => (
          <div key={group.heading} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--ufy-purple-300)",
                padding: "0 12px 6px 12px",
                opacity: 0.8,
              }}
            >
              {group.heading}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                (item.path !== "/admin" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ffffff" : "var(--ufy-purple-100)",
                    backgroundColor: isActive ? "var(--ufy-primary)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <Icon
                    size={17}
                    style={{ color: isActive ? "#ffffff" : "var(--ufy-purple-300)", flexShrink: 0 }}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div
        style={{
          padding: "14px",
          borderTop: "1px solid var(--ufy-purple-900)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--ufy-purple-200)",
            fontSize: "0.86rem",
            fontWeight: 600,
            padding: "8px 12px",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
