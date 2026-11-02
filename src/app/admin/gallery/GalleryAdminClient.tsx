"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  UploadCloud,
  GripVertical,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  dateLabel?: string | null;
  location?: string | null;
  orientation: string;
  tiltAngle: number;
  pegColor: string;
  displayOrder: number;
  isPublished: boolean;
}

export default function GalleryAdminClient({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Drag & Drop File Upload State
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag & Drop Card Reordering State
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);

  const [form, setForm] = useState({
    imageUrl: "",
    caption: "",
    dateLabel: "",
    location: "",
    orientation: "portrait",
    tiltAngle: 0,
    pegColor: "#7629f0",
    displayOrder: 0,
    isPublished: true,
  });

  const openCreateModal = () => {
    setForm({
      imageUrl: "",
      caption: "",
      dateLabel: "May 2026",
      location: "Manteca, CA",
      orientation: "portrait",
      tiltAngle: 0,
      pegColor: "#7629f0",
      displayOrder: photos.length + 1,
      isPublished: true,
    });
    setEditingPhoto(null);
    setIsCreating(true);
  };

  const openEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setForm({
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      dateLabel: photo.dateLabel || "",
      location: photo.location || "",
      orientation: photo.orientation,
      tiltAngle: photo.tiltAngle,
      pegColor: photo.pegColor,
      displayOrder: photo.displayOrder,
      isPublished: photo.isPublished,
    });
    setIsCreating(true);
  };

  // Upload one or more image files directly from computer via Drag-and-Drop or File Picker
  const handleDirectFilesUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadingFiles(true);
    setFeedback(null);

    const addedPhotos: GalleryPhoto[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fd = new FormData();
        fd.append("file", file);
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        fd.append("altText", cleanName || "Up for Youth Gallery Photo");
        fd.append("caption", cleanName || "Up for Youth Community Moment");

        const uploadRes = await fetch("/api/media/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || `Failed to upload ${file.name}`);
        }

        // Automatically create a GalleryPhoto entry for the Dome Gallery
        const createRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: uploadData.asset.url,
            caption: cleanName || "Up for Youth Community Moment",
            dateLabel: "2026",
            location: "Manteca, CA",
            orientation: "portrait",
            tiltAngle: 0,
            pegColor: "#7629f0",
            displayOrder: photos.length + addedPhotos.length + 1,
            isPublished: true,
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.error || "Failed to add uploaded image to Dome Gallery");
        }
        addedPhotos.push(createData.photo);
      }

      setPhotos((prev) =>
        [...prev, ...addedPhotos].sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setFeedback({
        type: "success",
        text: `Uploaded and added ${addedPhotos.length} photo${addedPhotos.length > 1 ? "s" : ""} directly to the 3D Dome Gallery!`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "File upload failed" });
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Upload a single file inside the Edit/Add Modal to populate form.imageUrl
  const handleModalFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingFiles(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("altText", form.caption || file.name);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file");

      const defaultCaption =
        form.caption || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setForm((prev) => ({
        ...prev,
        imageUrl: data.asset.url,
        caption: defaultCaption,
      }));
      setFeedback({ type: "success", text: "Image file uploaded! Click Save to finish." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (editingPhoto) {
        const res = await fetch(`/api/gallery/${editingPhoto.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update photo");

        setPhotos(photos.map((p) => (p.id === editingPhoto.id ? data.photo : p)));
        setFeedback({ type: "success", text: "Dome Gallery photo updated!" });
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add photo");

        setPhotos([...photos, data.photo].sort((a, b) => a.displayOrder - b.displayOrder));
        setFeedback({ type: "success", text: "New photo added to the 3D Dome Gallery!" });
      }
      setIsCreating(false);
      setEditingPhoto(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save photo" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this photo from the Dome Gallery?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete photo");

      setPhotos(photos.filter((p) => p.id !== id));
      setFeedback({ type: "success", text: "Photo removed from the Dome Gallery." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Could not delete photo" });
    }
  };

  const togglePublish = async (photo: GalleryPhoto) => {
    try {
      const res = await fetch(`/api/gallery/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !photo.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPhotos(photos.map((p) => (p.id === photo.id ? data.photo : p)));
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to toggle status" });
    }
  };

  // Drag-and-Drop Card Reordering Handler
  const handleCardDrop = async (targetId: string) => {
    if (!draggedPhotoId || draggedPhotoId === targetId) return;
    const fromIndex = photos.findIndex((p) => p.id === draggedPhotoId);
    const toIndex = photos.findIndex((p) => p.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    setPhotos(updatedWithOrder);
    setDraggedPhotoId(null);

    try {
      await Promise.all(
        updatedWithOrder.map((item) =>
          fetch(`/api/gallery/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayOrder: item.displayOrder }),
          })
        )
      );
      setFeedback({ type: "success", text: "Dome Gallery order saved!" });
    } catch {
      setFeedback({ type: "error", text: "Failed to persist new photo order." });
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#140529]">
            3D Dome Gallery Photos ({photos.length} Total)
          </h2>
          <p className="text-xs text-[#5416b3]">
            Drag and drop image files below to upload directly, drag cards to reorder, or click Delete to subtract photos from{" "}
            <code className="bg-[#ebdffe] px-1.5 py-0.5 rounded font-mono">/gallery</code>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFiles}
            className="btn-outline text-xs px-4 py-2.5 flex items-center gap-2"
          >
            {uploadingFiles ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            <span>Upload Image Files</span>
          </button>

          <button onClick={openCreateModal} className="btn-primary text-xs px-5 py-2.5">
            <Plus size={16} />
            <span>Add Photo by URL / Form</span>
          </button>
        </div>
      </div>

      {/* Drag-and-Drop File Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFiles(true);
        }}
        onDragLeave={() => setIsDraggingFiles(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingFiles(false);
          handleDirectFilesUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDraggingFiles
            ? "border-[#7629f0] bg-[#ebdffe]/60 scale-[1.01]"
            : "border-[#d4b8fc] bg-white hover:border-[#7629f0] hover:bg-[#f8f4fe]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => handleDirectFilesUpload(e.target.files)}
        />
        <div className="w-12 h-12 rounded-2xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center mx-auto mb-3">
          {uploadingFiles ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
        </div>
        <div className="text-sm font-black text-[#140529]">
          {uploadingFiles
            ? "Uploading and adding to 3D Dome Gallery..."
            : "Drag & Drop Photos Here, or Click to Browse Your Computer"}
        </div>
        <p className="text-xs text-[#5416b3] mt-1">
          Supports JPEG, PNG, WebP, GIF, and SVG up to 10MB per image. Dropped files are automatically added to the Dome Gallery!
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm font-bold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Grid of Draggable Dome Gallery Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => setDraggedPhotoId(p.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleCardDrop(p.id)}
            className={`bg-white rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
              draggedPhotoId === p.id
                ? "border-[#7629f0] opacity-50 scale-95"
                : "border-[#d4b8fc] hover:border-[#7629f0] shadow-sm hover:shadow-md"
            }`}
          >
            <div>
              {/* Top Drag Handle & Visibility Toggle */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500 cursor-grab">
                  <GripVertical size={15} className="text-[#7629f0]" />
                  <span>#{p.displayOrder}</span>
                </div>

                <button
                  onClick={() => togglePublish(p)}
                  className={`p-1 rounded text-xs font-bold flex items-center gap-1 ${
                    p.isPublished ? "text-emerald-700" : "text-neutral-400"
                  }`}
                  title={p.isPublished ? "Visible in Dome Gallery" : "Hidden"}
                >
                  {p.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                  <span>{p.isPublished ? "Live" : "Hidden"}</span>
                </button>
              </div>

              {/* Photo Thumbnail */}
              <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-900 mb-3 border border-neutral-200">
                <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" />
              </div>

              {/* Caption & Meta */}
              <h4 className="text-sm font-bold text-[#140529] mb-1 line-clamp-2">{p.caption}</h4>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mb-3">
                {p.dateLabel && <span>{p.dateLabel}</span>}
                {p.location && (
                  <>
                    <span>·</span>
                    <span className="text-[#7629f0] font-bold">{p.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(p)}
                className="p-1.5 px-2.5 rounded-lg bg-[#f8f4fe] border border-[#d4b8fc] text-[#7629f0] hover:bg-[#ebdffe] transition-all text-xs font-bold flex items-center gap-1"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-1.5 px-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all text-xs font-bold flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 bg-[#140529]/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 border-2 border-[#140529] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#ebdffe] flex items-center justify-center text-[#140529]"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#140529] mb-4">
              {editingPhoto ? "Edit Dome Gallery Photo" : "Add Photo to 3D Dome Gallery"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Upload File Button Inside Modal */}
              <div className="p-4 rounded-2xl bg-[#f8f4fe] border border-[#d4b8fc] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ImageIcon size={20} className="text-[#7629f0] shrink-0" />
                  <div>
                    <div className="text-xs font-black text-[#140529]">
                      Upload Image File from Computer
                    </div>
                    <div className="text-[11px] text-[#5416b3]">
                      Or paste an image URL directly below
                    </div>
                  </div>
                </div>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleModalFileUpload(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  disabled={uploadingFiles}
                  className="btn-outline text-xs px-3.5 py-2 shrink-0"
                >
                  {uploadingFiles ? "Uploading..." : "Choose File"}
                </button>
              </div>

              <div>
                <label className="form-label">Photo Image URL or Uploaded Path</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /uploads/... or /readymag_assets/speaker_1_giovanna.png"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Photo Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Card crafting workshop circle for pediatric patients"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date Label (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. November 2025"
                    value={form.dateLabel}
                    onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Manteca, CA"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#140529]">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-[#7629f0]"
                    />
                    <span>Visible in 3D Dome Gallery</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-outline text-xs px-5 py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary text-xs px-6 py-2.5">
                  <Save size={15} />
                  <span>{editingPhoto ? "Save Photo Changes" : "Add to Dome Gallery"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
