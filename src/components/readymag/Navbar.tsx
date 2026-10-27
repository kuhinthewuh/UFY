"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Readymag Circular Icon Mark */}
      <div className="pointer-events-auto flex items-center">
        <Link href="/" aria-label="Readymag Home" className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-transform hover:scale-105 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" fill="currentColor" />
            <circle cx="17.5" cy="17.5" r="2.5" fill="currentColor" />
          </svg>
        </Link>
      </div>

      {/* Floating Pill Navigation Bar */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-neutral-200/80 rounded-full px-5 py-2 shadow-sm flex items-center gap-6 text-[14px] font-medium text-neutral-800">
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-black transition-colors"
            onClick={() => setSolutionsOpen(!solutionsOpen)}
          >
            <span>Solutions</span>
            <ChevronDown size={14} className="text-neutral-500" />
          </button>
        </div>

        <Link href="#pricing" className="hover:text-black transition-colors">
          Pricing
        </Link>

        <Link href="#examples" className="hover:text-black transition-colors">
          Examples
        </Link>

        <Link href="#templates" className="hover:text-black transition-colors">
          Templates
        </Link>

        <Link href="#learn" className="hover:text-black transition-colors">
          Learn
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        <Link
          href="#login"
          className="text-[14px] font-medium text-neutral-800 px-4 py-2 hover:text-black transition-colors"
        >
          Log in
        </Link>
        <Link
          href="#signup"
          className="text-[14px] font-semibold text-white bg-[#E04B26] hover:bg-[#c93f1d] px-5 py-2 rounded-full transition-all shadow-sm hover:shadow"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
