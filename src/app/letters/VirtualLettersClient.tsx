"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Heart,
  Sun,
  Mail,
  MailOpen,
  Send,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Clock,
  Info,
  Smile,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";
import { AffirmationLetterData } from "@/lib/types";

interface VirtualLettersClientProps {
  title: string;
  subtitle: string;
  initialLetters: AffirmationLetterData[];
  currentVolunteer: {
    id: string;
    fullName: string;
    email: string;
    totalVerifiedHours: number;
  } | null;
  hoursPerLetter: number;
}

const STATIONERY_OPTIONS = [
  { label: "Crisp Ivory", hex: "#ffffff" },
  { label: "Soft Lilac", hex: "#f8f4fe" },
  { label: "Warm Sunshine", hex: "#fef3c7" },
  { label: "Petal Blush", hex: "#fce7f3" },
  { label: "Sky Breeze", hex: "#e0f2fe" },
];

const RECIPIENT_TAGS = [
  "For Hospitalized Youth",
  "For Someone Having a Tough Day",
  "For Fellow Students",
  "Open Sunshine",
];

const STAMP_OPTIONS = [
  { key: "heart", label: "Heart", Icon: Heart },
  { key: "star", label: "Award", Icon: Award },
  { key: "sun", label: "Sun", Icon: Sun },
  { key: "sparkle", label: "Smile", Icon: Smile },
];

export default function VirtualLettersClient({
  title,
  subtitle,
  initialLetters,
  currentVolunteer,
  hoursPerLetter,
}: VirtualLettersClientProps) {
  const [letters, setLetters] = useState<AffirmationLetterData[]>(initialLetters);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [activeLetter, setActiveLetter] = useState<AffirmationLetterData | null>(null);
  const [heartedIds, setHeartedIds] = useState<Record<string, boolean>>({});

  // Composer State
  const [mode, setMode] = useState<"public" | "volunteer">(
    currentVolunteer ? "volunteer" : "public"
  );
  const [authorName, setAuthorName] = useState(currentVolunteer?.fullName || "");
  const [recipientTag, setRecipientTag] = useState("For Hospitalized Youth");
  const [stationeryColor, setStationeryColor] = useState("#f8f4fe");
  const [stampStyle, setStampStyle] = useState("heart");
  const [minutesSpent, setMinutesSpent] = useState(15);
  const [message, setMessage] = useState("");
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(true);

  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  const getStampIcon = (stamp: string) => {
    switch (stamp) {
      case "star":
        return Award;
      case "sun":
        return Sun;
      case "sparkle":
        return Smile;
      default:
        return Heart;
    }
  };

  const handleSubmitLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "volunteer" && !currentVolunteer) return;
    if (mode === "volunteer" && !guidelinesAccepted) {
      setSubmitStatus("error");
      setFeedbackMsg("Please confirm the UFY Hospital Card Guidelines before requesting hours.");
      return;
    }

    setSubmitStatus("submitting");
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName || currentVolunteer?.fullName || "A UFY Friend",
          recipientTag,
          message,
          stationeryColor,
          stampStyle,
          requestVolunteerHours: mode === "volunteer" && Boolean(currentVolunteer),
          minutesSpent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send letter");
      }

      if (data.letter && data.letter.status === "APPROVED") {
        setLetters((prev) => [data.letter, ...prev]);
      }

      setSubmitStatus("success");
      setFeedbackMsg(data.message || "Your virtual letter has been sealed and delivered!");
      setMessage("");
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#7629f0", "#8e48ff", "#d4b8fc", "#140529"],
      });
    } catch (err: any) {
      setSubmitStatus("error");
      setFeedbackMsg(err.message || "Could not submit your letter.");
    }
  };

  const handleHeart = async (letter: AffirmationLetterData) => {
    if (heartedIds[letter.id]) return;
    setHeartedIds((prev) => ({ ...prev, [letter.id]: true }));
    setLetters((prev) =>
      prev.map((item) =>
        item.id === letter.id ? { ...item, heartsCount: item.heartsCount + 1 } : item
      )
    );
    if (activeLetter?.id === letter.id) {
      setActiveLetter((prev) => (prev ? { ...prev, heartsCount: prev.heartsCount + 1 } : null));
    }

    try {
      await fetch(`/api/letters/${letter.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "heart" }),
      });
    } catch {
      // optimistic UI preserved
    }
  };

  const filteredLetters =
    selectedFilter === "ALL"
      ? letters
      : letters.filter((l) => l.recipientTag === selectedFilter);

  const PreviewStamp = getStampIcon(stampStyle);

  return (
    <div className="w-full">
      {/* Edge-to-Edge Hero Header */}
      <section className="ufy-container text-center mb-14 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="letters" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed text-center">
          {subtitle}
        </p>
      </section>

      {/* Edge-to-Edge Interactive Letter Writing Studio (2 Columns: Composer + Live Stationery Preview) */}
      <section className="ufy-container mb-20">
        <div className="ufy-dashed-box p-6 sm:p-10 lg:p-14 rounded-3xl bg-white/60">
          {/* Mode Selector Tabs: Public Quick Affirmation vs. Verified Volunteer Credit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#7629f0]/20">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border-2 border-[#140529] shadow-sm">
              <button
                type="button"
                onClick={() => setMode("public")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  mode === "public"
                    ? "bg-[#7629f0] text-white shadow-sm"
                    : "text-[#140529] hover:bg-[#f8f4fe]"
                }`}
              >
                <Mail size={15} />
                <span>Quick Word of Affirmation (No Account Needed)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("volunteer")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  mode === "volunteer"
                    ? "bg-[#7629f0] text-white shadow-sm"
                    : "text-[#140529] hover:bg-[#f8f4fe]"
                }`}
              >
                <Award size={15} />
                <span>Write for UFY Volunteer Hours (+{hoursPerLetter} hr/letter)</span>
              </button>
            </div>

            {currentVolunteer ? (
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold"
              >
                <UserCheck size={14} className="text-emerald-600" />
                <span>
                  Signed in as {currentVolunteer.fullName} ({currentVolunteer.totalVerifiedHours}h verified)
                </span>
              </Link>
            ) : (
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#d4b8fc] text-[#7629f0] hover:bg-[#ebdffe] text-xs font-extrabold transition-colors"
              >
                <Award size={14} />
                <span>Create Free UFY Volunteer Account →</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-start">
            {/* Left Column: Composer Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border-2 border-[#140529] shadow-[8px_10px_0px_rgba(20,5,41,0.9)]">
              {mode === "volunteer" && !currentVolunteer ? (
                <div className="py-10 text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center mx-auto border border-[#d4b8fc]">
                    <Award size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#140529]">
                    Sign In to Track Verified Volunteer Hours
                  </h3>
                  <p className="text-sm sm:text-base text-[#5416b3] max-w-lg mx-auto font-medium leading-relaxed">
                    Up for Youth awards <strong>{hoursPerLetter} verified service hours</strong> per thoughtful virtual letter written for hospitalized kids and youth programs. Create a free UFY Volunteer Account in 30 seconds to log your service!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                      href="/volunteer"
                      className="px-7 py-3.5 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-sm shadow-md transition-all"
                    >
                      Sign Up / Log In to Volunteer Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMode("public")}
                      className="px-6 py-3.5 rounded-full bg-[#f8f4fe] hover:bg-[#ebdffe] text-[#140529] border border-[#d4b8fc] font-extrabold text-sm transition-all"
                    >
                      Or Write Without Hours
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitLetter} className="space-y-6">
                  {mode === "volunteer" && (
                    <div className="p-4 rounded-2xl bg-[#f8f4fe] border border-[#d4b8fc] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#7629f0] uppercase tracking-wider">
                        <Info size={14} />
                        <span>UFY Hospital &amp; Youth Card Guidelines (For Hour Credit)</span>
                      </div>
                      <ul className="text-xs text-[#140529]/85 font-medium space-y-1 list-disc pl-5">
                        <li>Write at least <strong>20 uplifting, heartfelt words</strong> celebrating resilience, courage, and brightness.</li>
                        <li>Avoid phrases like <em>&ldquo;Get well soon&rdquo;</em> or medical/religious assumptions so every child feels included.</li>
                        <li>Sign with your first name only (no phone numbers or social handles).</li>
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Signed By (First Name)
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        placeholder="e.g. Maya · UFY Friend"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="form-input text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Envelope Recipient
                      </label>
                      <select
                        value={recipientTag}
                        onChange={(e) => setRecipientTag(e.target.value)}
                        className="form-select text-sm font-semibold"
                      >
                        {RECIPIENT_TAGS.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Stationery Color & Stamp Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Stationery Paper Tint
                      </label>
                      <div className="flex items-center gap-2.5 pt-1">
                        {STATIONERY_OPTIONS.map((opt) => (
                          <button
                            key={opt.hex}
                            type="button"
                            onClick={() => setStationeryColor(opt.hex)}
                            title={opt.label}
                            style={{ backgroundColor: opt.hex }}
                            className={`w-9 h-9 rounded-full border-2 transition-transform ${
                              stationeryColor === opt.hex
                                ? "border-[#7629f0] scale-115 ring-2 ring-[#7629f0]/30"
                                : "border-[#140529]/25 hover:scale-105"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Envelope Wax / Postal Stamp
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {STAMP_OPTIONS.map(({ key, label, Icon }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setStampStyle(key)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all ${
                              stampStyle === key
                                ? "bg-[#7629f0] text-white border-[#7629f0]"
                                : "bg-white text-[#140529] border-neutral-200 hover:border-[#7629f0]"
                            }`}
                          >
                            <Icon size={13} />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {mode === "volunteer" && (
                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529] flex items-center justify-between">
                        <span>Estimated Time Spent Crafting Letter</span>
                        <span className="font-mono text-[#7629f0]">{minutesSpent} mins</span>
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={45}
                        step={5}
                        value={minutesSpent}
                        onChange={(e) => setMinutesSpent(Number(e.target.value))}
                        className="w-full accent-[#7629f0]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529] flex items-center justify-between">
                      <span>Your Uplifting Letter or Affirmation</span>
                      <span
                        className={`font-mono text-xs ${
                          mode === "volunteer" && wordCount < 20
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {wordCount} words {mode === "volunteer" ? "(20+ min for hours)" : ""}
                      </span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      maxLength={1200}
                      placeholder="Dear friend, I wanted to send a burst of sunshine your way today..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea text-base leading-relaxed"
                    />
                  </div>

                  {mode === "volunteer" && (
                    <label className="flex items-start gap-2.5 text-xs font-semibold text-[#140529] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={guidelinesAccepted}
                        onChange={(e) => setGuidelinesAccepted(e.target.checked)}
                        className="mt-0.5 accent-[#7629f0]"
                      />
                      <span>
                        I wrote this original letter thoughtfully without AI spam and followed UFY&apos;s inclusive pediatric card guidelines.
                      </span>
                    </label>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{feedbackMsg}</span>
                    </div>
                  )}

                  {submitStatus === "success" && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span>{feedbackMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitStatus === "submitting"}
                    className="w-full py-4 px-8 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-sm sm:text-base shadow-[0_8px_24px_rgba(118,41,240,0.35)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
                  >
                    <Send size={17} />
                    <span>
                      {submitStatus === "submitting"
                        ? "Sealing Envelope..."
                        : mode === "volunteer"
                        ? `Seal Letter & Log +${hoursPerLetter} Volunteer Hours`
                        : "Seal & Post Affirmation Envelope"}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Live Tactile Envelope & Stationery Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#7629f0] text-center lg:text-left">
                Live Stationery Preview
              </div>

              <div
                style={{ backgroundColor: stationeryColor }}
                className="rounded-3xl p-7 sm:p-9 border-2 border-[#140529] shadow-[10px_12px_0px_rgba(20,5,41,0.88)] relative transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-6">
                  <span className="px-3.5 py-1 rounded-full bg-white/90 border border-[#140529]/15 text-[11px] font-extrabold uppercase tracking-wider text-[#7629f0]">
                    {recipientTag}
                  </span>

                  <div className="w-12 h-14 rounded-lg bg-white border-2 border-dashed border-[#7629f0] flex flex-col items-center justify-center text-[#7629f0] shadow-sm shrink-0 rotate-3">
                    <PreviewStamp size={18} />
                    <span className="text-[8px] font-mono font-extrabold mt-0.5">UFY</span>
                  </div>
                </div>

                <p className="text-lg sm:text-xl font-semibold text-[#140529] leading-relaxed min-h-[140px] whitespace-pre-line">
                  {message.trim()
                    ? `“${message}”`
                    : "“Your words of warmth will appear right here on custom stationery, ready to brighten someone’s hospital stay or study break...”"}
                </p>

                <div className="mt-6 pt-4 border-t border-[#140529]/15 flex items-center justify-between text-xs font-bold text-[#5416b3]">
                  <span>With warmth, {authorName || currentVolunteer?.fullName || "A UFY Friend"}</span>
                  {mode === "volunteer" && currentVolunteer && (
                    <span className="inline-flex items-center gap-1 text-[#7629f0]">
                      <Clock size={12} /> +{hoursPerLetter}h credit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edge-to-Edge Interactive Community Envelope Wall */}
      <section className="ufy-container text-center">
        <div className="flex flex-col items-center justify-center gap-4 mb-10 text-center">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#140529] text-center">
              Click an Envelope to Read a Sweet Note
            </h2>
            <p className="text-sm text-[#5416b3] font-medium mt-1 text-center">
              {filteredLetters.length} sealed notes of encouragement written by Up for Youth members &amp; visitors
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {["ALL", ...RECIPIENT_TAGS].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all ${
                  selectedFilter === tag
                    ? "bg-[#7629f0] text-white shadow-sm"
                    : "bg-white text-[#140529] border border-[#d4b8fc] hover:bg-[#ebdffe]"
                }`}
              >
                {tag === "ALL" ? "All Envelopes" : tag}
              </button>
            ))}
          </div>
        </div>

        {filteredLetters.length === 0 ? (
          <div className="ufy-dashed-box bg-white/85 rounded-3xl p-10 sm:p-14 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f8f4fe] border border-[#d4b8fc] text-[#7629f0] flex items-center justify-center mb-4">
              <MailOpen size={30} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#140529] mb-2 text-center">
              No Envelopes on the Wall Yet — Be the First!
            </h3>
            <p className="text-sm sm:text-base text-[#5416b3] font-medium max-w-md text-center">
              Use the interactive stationery studio above to write and seal the very first real virtual letter or word of affirmation for our community wall.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLetters.map((letter, idx) => {
              const StampIcon = getStampIcon(letter.stampStyle);
              const tilt = idx % 2 === 0 ? "-rotate-1" : "rotate-1";

              return (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => setActiveLetter(letter)}
                  style={{ backgroundColor: letter.stationeryColor || "#ffffff" }}
                  className={`group text-left rounded-2xl p-6 border-2 border-[#140529] shadow-[5px_7px_0px_rgba(20,5,41,0.88)] hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[225px] ${tilt}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/85 border border-[#140529]/15 text-[10px] font-extrabold uppercase tracking-wider text-[#7629f0]">
                        {letter.recipientTag}
                      </span>
                      <div className="w-9 h-10 rounded-md bg-white border border-dashed border-[#7629f0] flex flex-col items-center justify-center text-[#7629f0] shrink-0">
                        <StampIcon size={14} />
                        <span className="text-[7px] font-mono font-bold">UFY</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-[#140529] leading-relaxed line-clamp-4">
                      &ldquo;{letter.message}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#140529]/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5416b3] truncate max-w-[150px]">
                      — {letter.authorName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#7629f0]">
                      <Heart size={12} className="fill-[#7629f0]" />
                      <span>{letter.heartsCount}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Open Envelope Reader Modal */}
      {activeLetter && (
        <div
          className="fixed inset-0 z-50 bg-[#140529]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveLetter(null)}
        >
          <div
            style={{ backgroundColor: activeLetter.stationeryColor || "#ffffff" }}
            className="relative max-w-xl w-full rounded-3xl p-7 sm:p-10 border-2 border-[#140529] shadow-[12px_16px_0px_rgba(20,5,41,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveLetter(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/90 hover:bg-[#ebdffe] border border-[#140529]/20 flex items-center justify-center text-[#140529]"
            >
              <X size={18} />
            </button>

            <span className="inline-block px-3.5 py-1 rounded-full bg-white/90 border border-[#140529]/15 text-xs font-extrabold text-[#7629f0] mb-5">
              {activeLetter.recipientTag}
            </span>

            <p className="text-lg sm:text-2xl font-semibold text-[#140529] leading-relaxed mb-8 whitespace-pre-line">
              &ldquo;{activeLetter.message}&rdquo;
            </p>

            <div className="pt-5 border-t border-[#140529]/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#5416b3]">
                  Written with care by
                </div>
                <div className="text-base font-black text-[#140529]">{activeLetter.authorName}</div>
              </div>

              <button
                type="button"
                onClick={() => handleHeart(activeLetter)}
                disabled={heartedIds[activeLetter.id]}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold border-2 transition-all ${
                  heartedIds[activeLetter.id]
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white text-[#140529] border-[#140529] hover:bg-rose-50"
                }`}
              >
                <Heart size={14} className={heartedIds[activeLetter.id] ? "fill-white" : "text-rose-500"} />
                <span>
                  {heartedIds[activeLetter.id] ? "Sent Love" : "Send Love"} ({activeLetter.heartsCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

