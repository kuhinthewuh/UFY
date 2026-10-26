"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Shield, Plus, Key, Trash2, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

export default function UsersSecurityPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
  });

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/auth/me"),
      ]);
      const usersData = await usersRes.json();
      const meData = await meRes.json();

      if (usersData.users) setUsers(usersData.users);
      if (meData.user) setCurrentUser(meData.user);
    } catch {}
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator");

      setUsers((prev) => [data.user, ...prev]);
      setShowInviteModal(false);
      setNewUser({ name: "", email: "", password: "", role: "EDITOR" });
      setMessage(`Administrator ${data.user.name} created successfully!`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to invite administrator");
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        setShowPasswordModal(null);
        setNewPassword("");
        setMessage("Password updated successfully!");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setError("Failed to update password");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this administrator?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage("Administrator account deleted");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Users & Security"
        subtitle="Manage authorized administrators, role permissions & authentication settings"
        actions={
          currentUser?.role === "SUPER_ADMIN" ? (
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.85rem" }}
            >
              <Plus size={16} />
              <span>Create Administrator</span>
            </button>
          ) : null
        }
      />

      <div style={{ padding: "32px", maxWidth: "1150px" }}>
        {error && (
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
            <AlertCircle size={18} style={{ color: "var(--ufy-primary)" }} />
            <span>{error}</span>
          </div>
        )}

        {message && (
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
            <span>{message}</span>
          </div>
        )}

        {/* Security Overview Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "24px 28px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "var(--ufy-purple-50)",
              color: "var(--ufy-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
              Role-Based Authorization Active
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--ufy-purple-700)", marginTop: "2px" }}>
              Logged in as: <strong>{currentUser?.name || "Administrator"}</strong> ({currentUser?.email}) • Role:{" "}
              <strong>{currentUser?.role}</strong>
            </p>
          </div>
        </div>

        {/* Admin User Accounts List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {users.map((user) => {
            const isSelf = user.id === currentUser?.id;

            return (
              <div
                key={user.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "18px",
                  padding: "22px 28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      backgroundColor: "var(--ufy-primary)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                        {user.name}
                      </h4>
                      {isSelf && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            backgroundColor: "var(--ufy-purple-100)",
                            color: "var(--ufy-purple-900)",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontWeight: 700,
                          }}
                        >
                          You
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          backgroundColor: user.role === "SUPER_ADMIN" ? "var(--ufy-primary)" : "var(--ufy-purple-50)",
                          color: user.role === "SUPER_ADMIN" ? "#ffffff" : "var(--ufy-purple-800)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontWeight: 700,
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)", marginTop: "2px" }}>
                      {user.email} • Created {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => setShowPasswordModal(user.id)}
                    className="btn btn-outline-purple"
                    style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                  >
                    <Key size={14} />
                    <span>Reset Password</span>
                  </button>

                  {currentUser?.role === "SUPER_ADMIN" && !isSelf && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-outline-purple"
                      style={{ padding: "6px 10px" }}
                      title="Delete administrator"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Administrator Modal */}
        {showInviteModal && (
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
                maxWidth: "520px",
                padding: "32px",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
                Create Administrator Account
              </h3>

              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Password * (Minimum 8 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="EDITOR">Content Editor (Manage Content & Inbox)</option>
                    <option value="SUPER_ADMIN">Super Administrator (Full System Permissions)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setShowInviteModal(false)} className="btn btn-outline-purple">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
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
                maxWidth: "460px",
                padding: "32px",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
                Update Password
              </h3>

              <div className="form-group">
                <label className="form-label">New Password (Minimum 8 characters)</label>
                <input
                  type="password"
                  minLength={8}
                  className="form-input"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(null);
                    setNewPassword("");
                  }}
                  className="btn btn-outline-purple"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleChangePassword(showPasswordModal)}
                  className="btn btn-primary"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
