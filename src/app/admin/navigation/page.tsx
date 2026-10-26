"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Menu, Plus, MoveUp, MoveDown, Trash2, Edit2, Save, CheckCircle, ExternalLink } from "lucide-react";
import { NavigationItemData, SiteSettingsData } from "@/lib/types";

export default function NavigationAdminPage() {
  const [navItems, setNavItems] = useState<NavigationItemData[]>([]);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [editingItem, setEditingItem] = useState<NavigationItemData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchNavAndSettings();
  }, []);

  const fetchNavAndSettings = async () => {
    try {
      const [navRes, settingsRes] = await Promise.all([
        fetch("/api/navigation"),
        fetch("/api/settings"),
      ]);
      const navData = await navRes.json();
      const settingsData = await settingsRes.json();

      if (navData.items) setNavItems(navData.items);
      if (settingsData.settings) setSettings(settingsData.settings);
    } catch {}
    setLoading(false);
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const reordered = [...navItems];
    const temp = reordered[idx - 1];
    reordered[idx - 1] = reordered[idx];
    reordered[idx] = temp;
    setNavItems(reordered);

    await fetch("/api/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reorder",
        orderedIds: reordered.map((i) => i.id),
      }),
    });
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === navItems.length - 1) return;
    const reordered = [...navItems];
    const temp = reordered[idx + 1];
    reordered[idx + 1] = reordered[idx];
    reordered[idx] = temp;
    setNavItems(reordered);

    await fetch("/api/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reorder",
        orderedIds: reordered.map((i) => i.id),
      }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation link?")) return;
    try {
      await fetch(`/api/navigation?id=${id}`, { method: "DELETE" });
      setNavItems((prev) => prev.filter((i) => i.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
    } catch {}
  };

  const handleSaveNavItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await fetch("/api/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingItem),
        });
        const data = await res.json();
        if (data.item) setNavItems((prev) => [...prev, data.item]);
      } else {
        const res = await fetch("/api/navigation", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingItem),
        });
        const data = await res.json();
        if (data.item) {
          setNavItems((prev) => prev.map((i) => (i.id === data.item.id ? data.item : i)));
        }
      }

      setEditingItem(null);
      setIsNew(false);
      setSavedMessage("Navigation item updated!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
    setSaving(false);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSavedMessage("Brand logo & footer settings saved!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
    setSaving(false);
  };

  const handleAddNew = () => {
    setIsNew(true);
    setEditingItem({
      id: "new",
      label: "",
      path: "/",
      target: "_self",
      displayOrder: navItems.length + 1,
      isVisible: true,
      isCta: false,
    });
  };

  if (loading || !settings) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
        Loading navigation settings...
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Navigation & Footer"
        subtitle="Configure header menus, primary call to action, logos, and footer information"
      />

      <div style={{ padding: "32px", maxWidth: "1150px" }}>
        {savedMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--ufy-purple-100)",
              border: "1.5px solid var(--ufy-purple-300)",
              color: "var(--ufy-purple-950)",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "24px",
              fontSize: "0.92rem",
              fontWeight: 600,
            }}
          >
            <CheckCircle size={18} style={{ color: "var(--ufy-primary)" }} />
            <span>{savedMessage}</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "28px" }} className="nav-split">
          {/* Left: Navigation Menu Items */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Header Menu Items
              </h2>
              <button onClick={handleAddNew} className="btn btn-outline-purple" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
                <Plus size={14} />
                <span>Add Link</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {navItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "var(--ufy-purple-25)",
                    border: "1px solid var(--ufy-purple-150, #e6d8fd)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--ufy-purple-700)" }}>
                      Destination: {item.path} {item.isCta && "• (Primary CTA Button)"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="btn btn-outline-purple"
                      style={{ padding: "4px 8px", opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      <MoveUp size={14} />
                    </button>

                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === navItems.length - 1}
                      className="btn btn-outline-purple"
                      style={{ padding: "4px 8px", opacity: idx === navItems.length - 1 ? 0.3 : 1 }}
                    >
                      <MoveDown size={14} />
                    </button>

                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingItem(item);
                      }}
                      className="btn btn-outline-purple"
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-outline-purple"
                      style={{ padding: "4px 8px" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Configuration */}
            <div
              style={{
                borderTop: "1px solid var(--ufy-purple-100)",
                paddingTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                Header Primary Call-to-Action
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">CTA Button Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.primaryCtaLabel}
                    onChange={(e) => setSettings({ ...settings, primaryCtaLabel: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.primaryCtaUrl}
                    onChange={(e) => setSettings({ ...settings, primaryCtaUrl: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSaveSettings} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
                  Save CTA Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right: Logo & Footer Configuration */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Logo & Footer Information
            </h2>

            <div className="form-group">
              <label className="form-label">Custom Logo Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="Leave blank to use clean typeset UFY brand wordmark"
                value={settings.logoUrl || ""}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Logo Height (px)</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.logoHeight}
                  onChange={(e) => setSettings({ ...settings, logoHeight: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="hello@ufy.org"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Footer Mission Statement</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={settings.footerMissionText}
                onChange={(e) => setSettings({ ...settings, footerMissionText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Verified GitHub Repository URL</label>
              <input
                type="text"
                className="form-input"
                value={settings.socialGithub || ""}
                onChange={(e) => setSettings({ ...settings, socialGithub: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Copyright Notice</label>
              <input
                type="text"
                className="form-input"
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Youth Privacy Statement</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={settings.privacyNotice}
                onChange={(e) => setSettings({ ...settings, privacyNotice: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSaveSettings} className="btn btn-primary">
                <span>Save All Footer Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(20, 5, 41, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99,
              padding: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "500px",
                padding: "32px",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
                {isNew ? "Add Navigation Link" : `Edit Link: ${editingItem.label}`}
              </h3>

              <form onSubmit={handleSaveNavItem} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Menu Label *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination URL or Hash Anchor *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="#programs or /initiatives"
                    value={editingItem.path}
                    onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Open in New Tab?</label>
                  <select
                    className="form-select"
                    value={editingItem.target}
                    onChange={(e) => setEditingItem({ ...editingItem, target: e.target.value })}
                  >
                    <option value="_self">Same Tab (_self)</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline-purple">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <span>Save Link</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

