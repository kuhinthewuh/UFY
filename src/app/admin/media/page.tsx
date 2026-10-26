"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { UploadCloud, Image as ImageIcon, Search, Trash2, CheckCircle, Crosshair, AlertCircle } from "lucide-react";
import { MediaAssetData } from "@/lib/types";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAssetData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetData | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, [search]);

  const fetchAssets = async () => {
    try {
      const url = search ? `/api/media?search=${encodeURIComponent(search)}` : "/api/media";
      const res = await fetch(url);
      const data = await res.json();
      if (data.assets) {
        setAssets(data.assets);
        if (data.assets.length > 0 && !selectedAsset) {
          setSelectedAsset(data.assets[0]);
        }
      }
    } catch {}
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file");

      setAssets((prev) => [data.asset, ...prev]);
      setSelectedAsset(data.asset);
      setSavedMessage("Image uploaded successfully to UFY media library!");
      setTimeout(() => setSavedMessage(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!selectedAsset) return;
    setError(null);
    try {
      const res = await fetch(`/api/media/${selectedAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: selectedAsset.altText,
          caption: selectedAsset.caption,
          credit: selectedAsset.credit,
          focalPointX: selectedAsset.focalPointX,
          focalPointY: selectedAsset.focalPointY,
        }),
      });
      if (res.ok) {
        setSavedMessage("Metadata & focal points saved!");
        setTimeout(() => setSavedMessage(null), 3000);
      }
    } catch {
      setError("Failed to update asset metadata");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete asset");
      }
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setSelectedAsset(null);
      setSavedMessage("Asset deleted successfully.");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Cannot delete asset");
    }
  };

  // Focal point click picker
  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAsset) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setSelectedAsset({ ...selectedAsset, focalPointX: x, focalPointY: y });
  };

  return (
    <div>
      <AdminHeader
        title="Media Library"
        subtitle="Upload photos, set focal points & alt text, and track usage across the site"
        actions={
          <label className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem", cursor: "pointer" }}>
            <UploadCloud size={16} />
            <span>{uploading ? "Uploading..." : "Upload New Photo"}</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        }
      />

      <div style={{ padding: "32px" }}>
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

        {/* Search Bar */}
        <div style={{ marginBottom: "24px", maxWidth: "460px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search images by name or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "42px" }}
            />
            <Search
              size={18}
              style={{ position: "absolute", left: "14px", top: "14px", color: "var(--ufy-purple-400)" }}
            />
          </div>
        </div>

        {/* Media Grid & Inspector Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "28px" }} className="media-split">
          {/* Assets Grid */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "24px",
              minHeight: "450px",
            }}
          >
            {assets.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
                <ImageIcon size={48} style={{ margin: "0 auto 12px auto", opacity: 0.4 }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                  No Media Assets Found
                </h3>
                <p style={{ fontSize: "0.88rem", marginTop: "4px" }}>
                  Upload genuine photographs or workshop images using the button above.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "16px",
                }}
              >
                {assets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "14px",
                        overflow: "hidden",
                        border: isSelected ? "3px solid var(--ufy-primary)" : "1px solid var(--ufy-purple-100)",
                        cursor: "pointer",
                        backgroundColor: "var(--ufy-purple-50)",
                        boxShadow: isSelected ? "var(--shadow-card)" : "none",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.originalName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Asset Inspector Panel */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Asset Inspector
            </h3>

            {selectedAsset ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Focal Point Interactive Picker */}
                <div>
                  <label className="form-label">
                    Focal Point & Crop Focus (Click image to set)
                  </label>
                  <div
                    onClick={handleFocalPointClick}
                    style={{
                      position: "relative",
                      height: "180px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid var(--ufy-purple-200)",
                      cursor: "crosshair",
                      backgroundColor: "var(--ufy-purple-50)",
                    }}
                  >
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.altText}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Focal Reticle Pin */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${selectedAsset.focalPointX}%`,
                        top: `${selectedAsset.focalPointY}%`,
                        transform: "translate(-50%, -50%)",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: "2px solid #ffffff",
                        backgroundColor: "var(--ufy-primary)",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--ufy-purple-700)", marginTop: "4px", display: "block" }}>
                    Selected focal coordinates: X: {selectedAsset.focalPointX}%, Y: {selectedAsset.focalPointY}%
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Alt Text (Crucial for Accessibility)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedAsset.altText}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, altText: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Optional Caption</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedAsset.caption || ""}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, caption: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Photo Credit / Source</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedAsset.credit || ""}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, credit: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={handleUpdateMetadata}
                    className="btn btn-primary"
                    style={{ flexGrow: 1, padding: "10px", justifyContent: "center" }}
                  >
                    Save Metadata
                  </button>

                  <button
                    onClick={() => handleDelete(selectedAsset.id)}
                    className="btn btn-outline-purple"
                    style={{ padding: "10px" }}
                    title="Delete Asset"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--ufy-purple-700)", padding: "30px 10px", fontSize: "0.88rem" }}>
                Select an image from the library to inspect focal points and edit accessibility alt text.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

