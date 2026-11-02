"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Compass,
  Eye,
  EyeOff,
} from "lucide-react";

interface JourneyNode {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  category: string;
  description: string;
  stats?: string | null;
  imageUrl?: string | null;
  badgeLabel?: string | null;
  isHighlight: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export default function JourneyAdminClient({ initialNodes }: { initialNodes: JourneyNode[] }) {
  const [nodes, setNodes] = useState<JourneyNode[]>(initialNodes);
  const [editingNode, setEditingNode] = useState<JourneyNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    dateLabel: "",
    location: "",
    category: "Hospital Action",
    description: "",
    stats: "",
    imageUrl: "",
    badgeLabel: "",
    isHighlight: false,
    displayOrder: 0,
    isPublished: true,
  });

  const categories = ["Hospital Action", "First-Aid CPR", "Book Drive", "Milestone", "Community Outreach"];

  const openCreateModal = () => {
    setForm({
      title: "",
      dateLabel: "May 2026",
      location: "Manteca, CA",
      category: "Hospital Action",
      description: "",
      stats: "",
      imageUrl: "",
      badgeLabel: "",
      isHighlight: false,
      displayOrder: nodes.length + 1,
      isPublished: true,
    });
    setEditingNode(null);
    setIsCreating(true);
  };

  const openEditModal = (node: JourneyNode) => {
    setEditingNode(node);
    setForm({
      title: node.title,
      dateLabel: node.dateLabel,
      location: node.location,
      category: node.category,
      description: node.description,
      stats: node.stats || "",
      imageUrl: node.imageUrl || "",
      badgeLabel: node.badgeLabel || "",
      isHighlight: node.isHighlight,
      displayOrder: node.displayOrder,
      isPublished: node.isPublished,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (editingNode) {
        // Update
        const res = await fetch(`/api/journey/${editingNode.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update node");

        setNodes(nodes.map((n) => (n.id === editingNode.id ? data.node : n)));
        setFeedback({ type: "success", text: "Milestone node updated successfully!" });
      } else {
        // Create
        const res = await fetch("/api/journey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create node");

        setNodes([...nodes, data.node].sort((a, b) => a.displayOrder - b.displayOrder));
        setFeedback({ type: "success", text: "New milestone added to the trail!" });
      }
      setIsCreating(false);
      setEditingNode(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save node" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the journey trail?`)) return;

    try {
      const res = await fetch(`/api/journey/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete node");

      setNodes(nodes.filter((n) => n.id !== id));
      setFeedback({ type: "success", text: `Milestone "${title}" deleted.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Could not delete node" });
    }
  };

  const togglePublish = async (node: JourneyNode) => {
    try {
      const res = await fetch(`/api/journey/${node.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !node.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNodes(nodes.map((n) => (n.id === node.id ? data.node : n)));
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to toggle status" });
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#140529]">
            Trail Path Nodes ({nodes.length} Stops)
          </h2>
          <p className="text-xs text-[#5416b3]">
            These events populate the curving dotted trail on <code className="bg-[#ebdffe] px-1.5 py-0.5 rounded font-mono">/journey</code>
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add New Milestone Node</span>
        </button>
      </div>

      {/* Feedback Alert */}
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

      {/* Nodes Table / Cards */}
      <div className="space-y-4">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="bg-white rounded-2xl p-6 border-2 border-[#d4b8fc] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              {/* Order Number Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#7629f0] text-white flex items-center justify-center font-black text-sm shrink-0">
                #{node.displayOrder}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f8f4fe] text-[#7629f0] border border-[#d4b8fc]">
                    {node.category}
                  </span>
                  {node.badgeLabel && (
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {node.badgeLabel}
                    </span>
                  )}
                  {node.isHighlight && (
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#ebdffe] text-[#7629f0]">
                      Highlight Stop
                    </span>
                  )}
                  <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{node.dateLabel}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#140529] mb-1">{node.title}</h3>
                <p className="text-xs text-[#5416b3] font-medium flex items-center gap-1 mb-2">
                  <MapPin size={12} className="text-[#7629f0]" />
                  <span>{node.location}</span>
                  {node.stats && (
                    <span className="ml-2 font-mono text-[#140529] bg-[#ebdffe] px-2 py-0.5 rounded">
                      🎯 {node.stats}
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-600 line-clamp-2 max-w-2xl">{node.description}</p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => togglePublish(node)}
                title={node.isPublished ? "Published (Visible)" : "Draft (Hidden)"}
                className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  node.isPublished
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-neutral-100 text-neutral-500 border-neutral-300"
                }`}
              >
                {node.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{node.isPublished ? "Visible" : "Hidden"}</span>
              </button>

              <button
                onClick={() => openEditModal(node)}
                className="p-2 rounded-lg bg-[#f8f4fe] border border-[#d4b8fc] text-[#7629f0] hover:bg-[#ebdffe] transition-all"
                title="Edit Milestone Details"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => handleDelete(node.id, node.title)}
                className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all"
                title="Delete Milestone"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal Drawer */}
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
              {editingNode ? "Edit Milestone Stop" : "Add New Milestone to Trail"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inaugural Pediatric Card Delivery"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. November 2024"
                    value={form.dateLabel}
                    onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manteca, CA"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Display Order (1, 2, 3...)</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description / Event Story</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what youth volunteers achieved, community impact, or key moments..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Key Statistic (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 180 Letters Delivered"
                    value={form.stats}
                    onChange={(e) => setForm({ ...form, stats: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Badge Label (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Founding Milestone"
                    value={form.badgeLabel}
                    onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /readymag_assets/speaker_1_giovanna.png or Unsplash URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#140529]">
                  <input
                    type="checkbox"
                    checked={form.isHighlight}
                    onChange={(e) => setForm({ ...form, isHighlight: e.target.checked })}
                    className="w-4 h-4 accent-[#7629f0]"
                  />
                  <span>Mark as Major Highlight Stop</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#140529]">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#7629f0]"
                  />
                  <span>Published (Visible on Trail)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-outline text-xs px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs px-6 py-2.5"
                >
                  <Save size={15} />
                  <span>{editingNode ? "Save Milestone Changes" : "Create Milestone Stop"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
