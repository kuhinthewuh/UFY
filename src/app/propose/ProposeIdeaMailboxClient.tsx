"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ShieldCheck,
  Heart,
  BookOpen,
  Activity,
  Lightbulb,
  ArrowRight,
  FolderOpen,
  FolderClosed,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";
import Folder from "@/components/ufy/Folder";

interface ProposeIdeaMailboxClientProps {
  inboxEmail: string;
  title: string;
  subtitle: string;
  acceptedIdeas: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    problemAddressed: string;
    proposedApproach?: string | null;
    linkedOutcome?: string | null;
  }>;
}

const FOLDER_ITEMS = [
  {
    title: "Hospital Care Pitch",
    description: "Pediatric letter writing & craft kits",
  },
  {
    title: "Campus CPR Clinic",
    description: "Hands-only CPR & AED training",
  },
  {
    title: "Neighborhood Book Drive",
    description: "Free youth library shelves",
  },
];

export default function ProposeIdeaMailboxClient({
  inboxEmail,
  title,
  subtitle,
  acceptedIdeas,
}: ProposeIdeaMailboxClientProps) {
  // Interactive Purple Folder Stage State:
  // "closed" -> folder is resting closed
  // "opening" -> folder opens with 3D animation, then fades into the proposal UI
  // "form" -> full proposal mailbox UI is revealed
  const [stage, setStage] = useState<"closed" | "opening" | "form">("closed");
  const [folderOpen, setFolderOpen] = useState(false);

  useEffect(() => {
    if (stage === "opening") {
      const timer = setTimeout(() => {
        setStage("form");
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleFolderOpenChange = (nextOpen: boolean) => {
    setFolderOpen(nextOpen);
    if (nextOpen && stage === "closed") {
      setStage("opening");
    }
  };

  const handleOpenProposalDirectly = () => {
    setFolderOpen(true);
    setStage("opening");
  };

  const handleFoldBackToFolder = () => {
    setFolderOpen(false);
    setStage("closed");
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Pediatric Hospital Care",
    problemAddressed: "",
    description: "",
    proposedApproach: "",
    submitterEmail: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    { label: "Pediatric Hospital Care", icon: Heart },
    { label: "First-Aid & Hands-Only CPR", icon: Activity },
    { label: "Community Literacy & Books", icon: BookOpen },
    { label: "Open Youth Innovation", icon: Lightbulb },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit proposal");
      }

      setStatus("success");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7629f0", "#8e48ff", "#d4b8fc", "#140529"],
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      category: "Pediatric Hospital Care",
      problemAddressed: "",
      description: "",
      proposedApproach: "",
      submitterEmail: "",
      honeypot: "",
    });
    setStatus("idle");
  };

  return (
    <div className="w-full">
      {/* Edge-to-Edge Centered Hero Header (No Top Purple Pill & No Flashing Green Dot) */}
      <section className="ufy-container text-center mb-12 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="propose" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-6 text-center">
          {subtitle}
        </p>

        <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#d4b8fc] shadow-sm text-sm font-semibold text-[#140529] text-center">
          <Mail size={14} className="text-[#7629f0]" />
          <span>Delivering directly to:</span>
          <span className="font-extrabold text-[#7629f0] font-mono">{inboxEmail}</span>
        </div>
      </section>

      {/* STAGE 1: Big Centered UFY Purple Folder (Opens & Fades Into Proposal UI) */}
      {stage !== "form" && (
        <section
          className={`ufy-container mb-20 transition-all duration-500 ${
            stage === "opening" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="ufy-dashed-box rounded-3xl p-8 sm:p-14 lg:p-20 flex flex-col items-center justify-center text-center min-h-[460px] sm:min-h-[520px] relative overflow-hidden">
            <div className="mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#7629f0] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                Step 1 · Click the Purple UFY Folder to Open Your Proposal Dossier
              </span>
            </div>

            {/* Interactive 3D React Bits <Folder /> in UFY Purple */}
            <div
              className="my-8 sm:my-12 flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (!folderOpen) handleOpenProposalDirectly();
              }}
            >
              <Folder
                items={FOLDER_ITEMS}
                color="#7629f0"
                paperColor="#ffffff"
                label="UFY Proposals"
                tabPosition="left"
                mode="flap"
                variant="solid"
                layout="spread"
                size={1.75}
                open={folderOpen}
                onOpenChange={handleFolderOpenChange}
                onItemClick={() => handleOpenProposalDirectly()}
                peek={true}
                intro={true}
                closeOnOutsideClick={false}
                theme="light"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#140529] mt-2 mb-2 text-center">
              Got an Idea for Up for Youth?
            </h2>
            <p className="text-sm sm:text-base text-[#5416b3] max-w-xl mx-auto font-medium mb-6 text-center">
              Click the purple folder above (or the button below) to unfold the official UFY Idea Proposal Form and pitch your workshop, hospital drive, or school initiative.
            </p>

            <button
              type="button"
              onClick={handleOpenProposalDirectly}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#7629f0] hover:bg-[#5f1bc9] text-white font-extrabold text-sm sm:text-base shadow-[0_8px_24px_rgba(118,41,240,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <FolderOpen size={18} />
              <span>Open UFY Idea Proposal Folder</span>
            </button>
          </div>
        </section>
      )}

      {/* STAGE 2: Full Idea Proposal UI (Smoothly Fades In After Folder Opens) */}
      {stage === "form" && (
        <section className="ufy-container mb-16 animate-in fade-in zoom-in-95 duration-500">
          {/* Top Bar to Fold Back Into the Purple Folder */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={handleFoldBackToFolder}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#f8f4fe] text-[#140529] border-2 border-[#140529] shadow-[3px_4px_0px_#140529] text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
            >
              <FolderClosed size={15} className="text-[#7629f0]" />
              <span>Fold Back Into Purple UFY Folder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-start">
            {/* Left Column: Official UFY Mailbox Chute (7 cols) */}
            <div className="lg:col-span-7 relative bg-white rounded-3xl border-2 border-[#140529] shadow-[12px_16px_0px_rgba(20,5,41,0.9)] overflow-hidden">
              <div className="bg-[#140529] text-white px-6 sm:px-10 py-5 flex items-center justify-between border-b-2 border-[#140529]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-xs text-[#d4b8fc] tracking-wider uppercase">
                    UFY Proposal Dossier · Priority Dispatch
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#d4b8fc]">
                  <Mail size={15} />
                  <span>UP FOR YOUTH</span>
                </div>
              </div>

              <div
                className="h-2.5 w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #7629f0, #7629f0 20px, #ffffff 20px, #ffffff 40px, #140529 40px, #140529 60px, #ffffff 60px, #ffffff 80px)",
                }}
              />

              <div className="p-6 sm:p-10 lg:p-12">
                {status === "success" ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#f8f4fe] border-2 border-[#7629f0] text-[#7629f0] flex items-center justify-center mx-auto mb-6 shadow-md animate-bounce">
                      <CheckCircle2 size={44} />
                    </div>
                    <h3 className="text-3xl font-black text-[#140529] mb-3 text-center">
                      Proposal Deposited into UFY Inbox!
                    </h3>
                    <p className="text-base text-[#5416b3] max-w-lg mx-auto font-medium mb-6 text-center">
                      Thank you for stepping up for youth. Your initiative has been routed to{" "}
                      <strong className="text-[#140529] font-mono">{inboxEmail}</strong> and logged in
                      our administrative review queue.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-7 py-3 rounded-full bg-[#7629f0] text-white font-extrabold text-sm hover:bg-[#6019d4] shadow-md transition-all"
                    >
                      Submit Another Proposal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div>
                      <label className="form-label text-sm font-bold text-[#140529] mb-2 flex items-center justify-between">
                        <span>1. Select Initiative Category</span>
                        <span className="text-xs font-normal text-neutral-500">Pick the best match</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = formData.category === cat.label;
                          return (
                            <button
                              key={cat.label}
                              type="button"
                              onClick={() => setFormData({ ...formData, category: cat.label })}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all ${
                                isSelected
                                  ? "border-[#7629f0] bg-[#f8f4fe] text-[#7629f0] shadow-sm"
                                  : "border-neutral-200 bg-white text-[#140529] hover:border-[#d4b8fc]"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-[#7629f0] text-white" : "bg-[#ebdffe] text-[#7629f0]"
                                }`}
                              >
                                <Icon size={16} />
                              </div>
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-sm font-bold text-[#140529] mb-1.5 flex items-center justify-between">
                        <span>2. Idea Title or Campaign Concept</span>
                        <span className="text-xs font-normal text-neutral-500">e.g. Campus CPR Week</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={150}
                        placeholder="Give your proposal a bold, memorable headline..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-input text-base font-semibold"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-bold text-[#140529] mb-1.5 flex items-center justify-between">
                        <span>3. What Community Need Does This Address?</span>
                        <span className="text-xs font-normal text-neutral-500">Who does it serve?</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe the gap in pediatric comfort, youth health literacy, or neighborhood book access..."
                        value={formData.problemAddressed}
                        onChange={(e) => setFormData({ ...formData, problemAddressed: e.target.value })}
                        className="form-textarea text-sm"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-bold text-[#140529] mb-1.5 flex items-center justify-between">
                        <span>4. Detailed Proposal &amp; Action Plan</span>
                        <span className="text-xs font-normal text-neutral-500">How should it work?</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Walk us through the steps, materials, school partnership, or distribution plan..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-textarea text-sm"
                      />
                    </div>

                    <div className="bg-[#f8f4fe] p-5 rounded-2xl border border-[#d4b8fc]">
                      <label className="form-label text-sm font-bold text-[#140529] mb-1 flex items-center justify-between">
                        <span>5. Your Contact Email (Optional)</span>
                        <span className="text-xs font-normal text-[#7629f0] flex items-center gap-1">
                          <ShieldCheck size={14} /> Zero spam guarantee
                        </span>
                      </label>
                      <p className="text-xs text-[#5416b3] mb-2.5 font-medium">
                        Leave blank for anonymity, or share your email so UFY organizers can invite you to co-lead!
                      </p>
                      <input
                        type="email"
                        placeholder="you@school.edu"
                        value={formData.submitterEmail}
                        onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                        className="form-input bg-white text-sm"
                      />
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 px-8 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-base transition-all shadow-[0_8px_24px_rgba(118,41,240,0.35)] hover:shadow-[0_12px_32px_rgba(118,41,240,0.5)] flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {status === "submitting" ? (
                          <span>Depositing Proposal...</span>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Deposit Proposal into UFY Inbox</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: How UFY Incubates Ideas + Live Approved Ideas Wall (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="ufy-dashed-box bg-white/80 p-7 sm:p-8 rounded-3xl text-center flex flex-col items-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7629f0] bg-[#ebdffe] px-3 py-1 rounded-full border border-[#d4b8fc]">
                  From Folder to Real Action
                </span>
                <h2 className="text-2xl font-black text-[#140529] mt-3 mb-4 text-center">
                  How Up for Youth Backs Student Ideas
                </h2>
                <div className="space-y-4 text-sm text-[#5416b3] font-medium text-left">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7629f0] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong className="text-[#140529]">Weekly Youth Review:</strong> Every submission lands in our Admin Portal Inbox for review by UFY chapter leads.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7629f0] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      <strong className="text-[#140529]">Supplies &amp; Mentorship:</strong> Approved ideas get stationery kits, training mannequins, or volunteer mobilization.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7629f0] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      <strong className="text-[#140529]">Verified Service Credit:</strong> Lead your initiative and log official volunteer hours through your UFY Volunteer Portal.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#7629f0]/15 flex justify-center w-full">
                  <Link
                    href="/volunteer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#7629f0] hover:text-[#140529] transition-colors"
                  >
                    <span>Want to volunteer right away? Join UFY Volunteers</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {acceptedIdeas.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#140529]">Ideas That Became Reality</h3>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {acceptedIdeas.length} Active
                    </span>
                  </div>

                  {acceptedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white p-6 rounded-2xl border-2 border-[#d4b8fc] hover:border-[#7629f0] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2.5 w-full">
                        <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#f8f4fe] text-[#7629f0] border border-[#d4b8fc]">
                          {idea.category}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">
                          ✓ Approved
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-[#140529] mb-1.5 text-center">
                        {idea.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5416b3] font-medium leading-relaxed text-center">
                        {idea.description}
                      </p>
                      {idea.linkedOutcome && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-100 text-xs font-bold text-[#140529] flex items-center justify-center gap-1.5 w-full">
                          <CheckCircle2 size={14} className="text-[#7629f0] shrink-0" />
                          <span>Outcome: {idea.linkedOutcome}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
