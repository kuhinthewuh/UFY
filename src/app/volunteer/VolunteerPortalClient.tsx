"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  HeartHandshake,
  Award,
  Clock,
  MailOpen,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Printer,
  Activity,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";

interface VolunteerProfile {
  id: string;
  email: string;
  fullName: string;
  schoolOrOrg?: string | null;
  city: string;
  interests: string;
  status: string;
  totalVerifiedHours: number;
  bonusHours: number;
  pendingHours: number;
  createdAt: string;
  letters: Array<{
    id: string;
    recipientTag: string;
    message: string;
    hoursAwarded: number;
    hoursStatus: string;
    status: string;
    createdAt: string;
  }>;
}

interface VolunteerPortalClientProps {
  title: string;
  subtitle: string;
  initialVolunteer: VolunteerProfile | null;
  hoursPerLetter: number;
}

const INTEREST_OPTIONS = [
  "Virtual Hospital Letters",
  "Hands-Only CPR Workshops",
  "Neighborhood Book Drives",
  "Educational Video Creation",
  "Campus Chapter Organizing",
];

export default function VolunteerPortalClient({
  title,
  subtitle,
  initialVolunteer,
  hoursPerLetter,
}: VolunteerPortalClientProps) {
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(initialVolunteer);
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sign-Up Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolOrOrg, setSchoolOrOrg] = useState("");
  const [city, setCity] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Virtual Hospital Letters",
    "Hands-Only CPR Workshops",
  ]);

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const fetchFullProfile = async () => {
    const res = await fetch("/api/volunteers/me");
    const data = await res.json();
    if (data.volunteer) {
      setVolunteer(data.volunteer);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/volunteers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          schoolOrOrg,
          city: city || "Community Chapter",
          interests: selectedInterests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-up failed");

      await fetchFullProfile();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7629f0", "#8e48ff", "#d4b8fc", "#140529"],
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/volunteers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      await fetchFullProfile();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/volunteers/login", { method: "DELETE" });
    setVolunteer(null);
  };

  return (
    <div className="w-full">
      {/* Edge-to-Edge Hero Header */}
      <section className="ufy-container text-center mb-14 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="volunteer" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed text-center">
          {subtitle}
        </p>
      </section>

      {volunteer ? (
        /* SIGNED-IN VOLUNTEER DASHBOARD */
        <section className="ufy-container space-y-10">
          {/* Welcome + Verified Hours Banner */}
          <div className="bg-[#140529] text-white rounded-3xl p-7 sm:p-10 lg:p-12 border-2 border-[#7629f0] shadow-[10px_14px_0px_rgba(118,41,240,0.3)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7629f0] text-white text-xs font-extrabold uppercase tracking-wider mb-3">
                <CheckCircle2 size={13} /> Active UFY Volunteer Account
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Welcome back, {volunteer.fullName}!
              </h2>
              <p className="text-sm text-[#ebdffe] font-medium mt-1">
                {volunteer.schoolOrOrg ? `${volunteer.schoolOrOrg} · ` : ""}
                {volunteer.city} · {volunteer.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/letters"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#7629f0] hover:bg-[#8e48ff] text-white font-extrabold text-sm shadow-lg transition-all"
              >
                <MailOpen size={16} />
                <span>Write Virtual Letter (+{hoursPerLetter}h)</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-extrabold text-xs sm:text-sm transition-all"
              >
                <Printer size={15} />
                <span>Print Hours Log</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-rose-200 border border-white/15 font-bold text-xs transition-all"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* 3 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-7 border-2 border-[#140529] shadow-[6px_8px_0px_rgba(20,5,41,0.9)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#140529]">
                {volunteer.totalVerifiedHours} <span className="text-xl text-[#7629f0]">hrs</span>
              </div>
              <div className="text-sm font-black text-[#140529] mt-1">
                Verified UFY Service Hours
              </div>
              <p className="text-xs text-[#5416b3] mt-1">
                Includes approved virtual letters &amp; in-person workshop credits ({volunteer.bonusHours}h workshop/bonus).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border-2 border-[#140529] shadow-[6px_8px_0px_rgba(20,5,41,0.9)]">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#140529]">
                {volunteer.pendingHours} <span className="text-xl text-amber-600">hrs</span>
              </div>
              <div className="text-sm font-black text-[#140529] mt-1">
                Pending Admin Verification
              </div>
              <p className="text-xs text-[#5416b3] mt-1">
                UFY organizers review submitted virtual letters regularly to certify your hours.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border-2 border-[#140529] shadow-[6px_8px_0px_rgba(20,5,41,0.9)]">
              <div className="w-12 h-12 rounded-2xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center mb-4">
                <MailOpen size={24} />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#140529]">
                {volunteer.letters.length}
              </div>
              <div className="text-sm font-black text-[#140529] mt-1">
                Virtual Letters Written
              </div>
              <p className="text-xs text-[#5416b3] mt-1">
                Interests: {volunteer.interests}
              </p>
            </div>
          </div>

          {/* Submitted Letters History Table */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-[#140529] shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#140529]">
                  Your Virtual Letter &amp; Service Log
                </h3>
                <p className="text-xs sm:text-sm text-[#5416b3] font-medium">
                  Official record of letters submitted under your Up for Youth account
                </p>
              </div>
              <Link
                href="/letters"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7629f0] hover:underline"
              >
                <span>+ Write Another Letter</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {volunteer.letters.length === 0 ? (
              <div className="text-center py-12 bg-[#f8f4fe] rounded-2xl border border-dashed border-[#d4b8fc]">
                <MailOpen size={36} className="mx-auto text-[#7629f0] mb-2 opacity-70" />
                <p className="text-base font-bold text-[#140529]">
                  You haven&apos;t logged your first virtual letter yet!
                </p>
                <p className="text-xs text-[#5416b3] mt-1 mb-4">
                  Head over to the Virtual Letter Desk to write an uplifting note and earn +{hoursPerLetter}h per approved letter.
                </p>
                <Link
                  href="/letters"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7629f0] text-white text-xs font-extrabold"
                >
                  Write Your First Letter
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {volunteer.letters.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl border border-[#d4b8fc] bg-[#f8f4fe]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold text-[#7629f0]">
                          {l.recipientTag}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          · {new Date(l.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#140529] font-medium line-clamp-2">
                        &ldquo;{l.message}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-mono text-xs font-extrabold text-[#140529] bg-white px-3 py-1 rounded-full border border-neutral-200">
                        +{l.hoursAwarded} hr
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          l.hoursStatus === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : l.hoursStatus === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {l.hoursStatus === "VERIFIED"
                          ? "✓ Verified"
                          : l.hoursStatus === "REJECTED"
                          ? "Needs Revision"
                          : "Pending Review"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* SIGNED-OUT ONBOARDING: EDGE-TO-EDGE 2-COLUMN SIGN-UP + TRACKS */
        <section className="ufy-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-start">
            {/* Left Column: Volunteer Tracks & Perks (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="ufy-dashed-box bg-white/80 p-7 sm:p-9 rounded-3xl space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7629f0] bg-[#ebdffe] px-3.5 py-1 rounded-full border border-[#d4b8fc]">
                  4 Ways to Step Up for Youth
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-[#140529] leading-tight">
                  Earn Verified Community Service Hours Anywhere
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center shrink-0">
                      <MailOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#140529]">
                        1. Virtual Letters for Hospitalized Youth
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5416b3] font-medium mt-0.5">
                        Write thoughtful digital encouragement cards from home and earn <strong>{hoursPerLetter} verified volunteer hours</strong> per approved card.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center shrink-0">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#140529]">
                        2. Hands-Only CPR &amp; First-Aid Workshops
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5416b3] font-medium mt-0.5">
                        Co-facilitate peer emergency response demos at high schools and youth centers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#140529]">
                        3. Neighborhood Book &amp; Care Kit Drives
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5416b3] font-medium mt-0.5">
                        Organize book collections and creative art kits for local pediatric wards and libraries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ebdffe] text-[#7629f0] flex items-center justify-center shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#140529]">
                        4. Start a School UFY Chapter
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5416b3] font-medium mt-0.5">
                        Bring Up for Youth to your campus with ready-made workshop slides and organizer mentorship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sign-Up / Sign-In Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#140529] shadow-[12px_16px_0px_rgba(20,5,41,0.9)] overflow-hidden">
              {/* Top Switcher Tabs */}
              <div className="grid grid-cols-2 border-b-2 border-[#140529]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("signup");
                    setErrorMsg("");
                  }}
                  className={`py-4 text-sm font-black uppercase tracking-wider transition-colors ${
                    authTab === "signup"
                      ? "bg-[#7629f0] text-white"
                      : "bg-[#f8f4fe] text-[#140529] hover:bg-[#ebdffe]"
                  }`}
                >
                  New Volunteer Sign-Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setErrorMsg("");
                  }}
                  className={`py-4 text-sm font-black uppercase tracking-wider transition-colors ${
                    authTab === "login"
                      ? "bg-[#7629f0] text-white"
                      : "bg-[#f8f4fe] text-[#140529] hover:bg-[#ebdffe]"
                  }`}
                >
                  Existing Volunteer Login
                </button>
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                {authTab === "signup" ? (
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Alex Rivera"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="form-input text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="alex@school.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                          Create Password (6+ chars) *
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                          School, University, or Group
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Manteca High School / Community Group"
                          value={schoolOrOrg}
                          onChange={(e) => setSchoolOrOrg(e.target.value)}
                          className="form-input text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        City / Chapter Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Manteca, CA / Remote Virtual"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-input text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529] mb-2">
                        How Would You Like to Volunteer?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((item) => {
                          const active = selectedInterests.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleInterest(item)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                                active
                                  ? "bg-[#7629f0] text-white border-[#7629f0] shadow-sm"
                                  : "bg-[#f8f4fe] text-[#140529] border-[#d4b8fc] hover:bg-[#ebdffe]"
                              }`}
                            >
                              {active ? `✓ ${item}` : `+ ${item}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-8 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-base shadow-[0_8px_24px_rgba(118,41,240,0.35)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
                    >
                      <HeartHandshake size={18} />
                      <span>
                        {loading ? "Creating Your UFY Account..." : "Create Free UFY Volunteer Account"}
                      </span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Volunteer Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs font-extrabold uppercase tracking-wider text-[#140529]">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input text-sm font-semibold"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-8 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-base shadow-[0_8px_24px_rgba(118,41,240,0.35)] transition-all disabled:opacity-50"
                    >
                      {loading ? "Signing In..." : "Sign In to Volunteer Dashboard"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

