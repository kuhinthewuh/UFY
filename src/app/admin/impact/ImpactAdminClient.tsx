"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Activity,
  Heart,
  BookOpen,
  Clock,
  Users,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";

interface ImpactMetric {
  id: string;
  label: string;
  targetValue: number;
  currentValue: number;
  prefix?: string | null;
  suffix?: string | null;
  subtitle?: string | null;
  icon: string;
  color: string;
  isLive: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export default function ImpactAdminClient({ initialMetrics }: { initialMetrics: ImpactMetric[] }) {
  const [metrics, setMetrics] = useState<ImpactMetric[]>(initialMetrics);
  const [editingMetric, setEditingMetric] = useState<ImpactMetric | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    label: "",
    targetValue: 0,
    currentValue: 0,
    prefix: "",
    suffix: "",
    subtitle: "",
    icon: "Heart",
    color: "#7629f0",
    isLive: true,
    displayOrder: 0,
    isPublished: true,
  });

  const availableIcons = ["Heart", "Activity", "BookOpen", "Clock", "Users", "Award"];
  const colorOptions = ["#7629f0", "#8e48ff", "#5c18c9", "#140529", "#10b981", "#f59e0b", "#ec4899"];

  const openCreateModal = () => {
    setForm({
      label: "",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "",
      icon: "Heart",
      color: "#7629f0",
      isLive: true,
      displayOrder: metrics.length + 1,
      isPublished: true,
    });
    setEditingMetric(null);
    setIsCreating(true);
  };

  const openEditModal = (metric: ImpactMetric) => {
    setEditingMetric(metric);
    setForm({
      label: metric.label,
      targetValue: metric.targetValue,
      currentValue: metric.currentValue,
      prefix: metric.prefix || "",
      suffix: metric.suffix || "+",
      subtitle: metric.subtitle || "",
      icon: metric.icon,
      color: metric.color,
      isLive: metric.isLive,
      displayOrder: metric.displayOrder,
      isPublished: metric.isPublished,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (editingMetric) {
        const res = await fetch(`/api/impact/${editingMetric.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update metric");

        setMetrics(metrics.map((m) => (m.id === editingMetric.id ? data.metric : m)));
        setFeedback({ type: "success", text: "Impact counter updated!" });
      } else {
        const res = await fetch("/api/impact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create metric");

        setMetrics([...metrics, data.metric].sort((a, b) => a.displayOrder - b.displayOrder));
        setFeedback({ type: "success", text: "New impact counter added to page!" });
      }
      setIsCreating(false);
      setEditingMetric(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save metric" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete the counter for "${label}"?`)) return;

    try {
      const res = await fetch(`/api/impact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete metric");

      setMetrics(metrics.filter((m) => m.id !== id));
      setFeedback({ type: "success", text: `Metric "${label}" deleted.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Could not delete metric" });
    }
  };

  const togglePublish = async (metric: ImpactMetric) => {
    try {
      const res = await fetch(`/api/impact/${metric.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !metric.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMetrics(metrics.map((m) => (m.id === metric.id ? data.metric : m)));
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to toggle status" });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#140529]">
            Active Impact Counters ({metrics.length})
          </h2>
          <p className="text-xs text-[#5416b3]">
            Edit values, live pulse animations, and labels displayed on <code className="bg-[#ebdffe] px-1.5 py-0.5 rounded font-mono">/impact</code>
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} />
          <span>Add New Impact Counter</span>
        </button>
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

      {/* Grid of editable impact counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-6 border-2 border-[#d4b8fc] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono font-bold text-[#7629f0] bg-[#f8f4fe] px-2.5 py-1 rounded border border-[#d4b8fc]">
                  Order #{m.displayOrder}
                </span>

                <div className="flex items-center gap-1.5">
                  {m.isLive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Pulse
                    </span>
                  )}
                  <button
                    onClick={() => togglePublish(m)}
                    className={`p-1.5 rounded text-xs font-bold ${
                      m.isPublished ? "text-emerald-700 hover:bg-emerald-50" : "text-neutral-400 hover:bg-neutral-100"
                    }`}
                    title={m.isPublished ? "Visible on page" : "Hidden"}
                  >
                    {m.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Number and Suffix */}
              <div className="text-3xl sm:text-4xl font-black text-[#140529] tracking-tight mb-1">
                {m.prefix}
                {m.currentValue.toLocaleString()}
                {m.suffix}
              </div>

              <h3 className="text-base font-bold text-[#140529] mb-2">{m.label}</h3>

              {m.subtitle && (
                <p className="text-xs text-[#5416b3] font-medium line-clamp-2 mb-4">{m.subtitle}</p>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(m)}
                className="p-2 rounded-lg bg-[#f8f4fe] border border-[#d4b8fc] text-[#7629f0] hover:bg-[#ebdffe] transition-all text-xs font-bold flex items-center gap-1"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(m.id, m.label)}
                className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all text-xs font-bold flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
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
              {editingMetric ? "Edit Impact Counter" : "Add New Impact Counter"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Metric Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hospital Letters Delivered"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Current Counter Number</label>
                  <input
                    type="number"
                    required
                    value={form.currentValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        currentValue: Number(e.target.value),
                        targetValue: Number(e.target.value),
                      })
                    }
                    className="form-input text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="form-label">Suffix (e.g. +, hrs, books)</label>
                  <input
                    type="text"
                    value={form.suffix}
                    onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="form-select"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Subtitle / Context</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handcrafted cards delivered directly to pediatric bedsides..."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#140529]">
                  <input
                    type="checkbox"
                    checked={form.isLive}
                    onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
                    className="w-4 h-4 accent-[#7629f0]"
                  />
                  <span>Show "LIVE" pulse badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#140529]">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#7629f0]"
                  />
                  <span>Published (Visible)</span>
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
                <button type="submit" disabled={loading} className="btn-primary text-xs px-6 py-2.5">
                  <Save size={15} />
                  <span>{editingMetric ? "Save Counter Changes" : "Create Counter"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
