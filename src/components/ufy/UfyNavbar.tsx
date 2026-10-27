"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface UfyNavbarProps {
  onOpenModal: () => void;
}

export default function UfyNavbar({ onOpenModal }: UfyNavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
      {/* UFY Circular Icon Mark */}
      <div className="pointer-events-auto flex items-center">
        <Link
          href="/"
          aria-label="UFY Home"
          className="w-10 h-10 rounded-full bg-[#7629f0] hover:bg-[#631cd9] flex items-center justify-center text-white font-extrabold text-[15px] tracking-tight transition-transform hover:scale-105 shadow-md"
        >
          ufy
        </Link>
      </div>

      {/* Floating Pill Navigation Bar */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-neutral-300/80 rounded-full px-5 py-2 shadow-sm hidden md:flex items-center gap-6 text-[13.5px] font-semibold text-[#140529]">
        <Link href="#initiatives" className="hover:text-[#7629f0] transition-colors">
          Initiatives
        </Link>

        <Link href="#letters" className="hover:text-[#7629f0] transition-colors">
          Hospital Letters
        </Link>

        <Link href="#workshops" className="hover:text-[#7629f0] transition-colors">
          First-Aid CPR
        </Link>

        <Link href="#libraries" className="hover:text-[#7629f0] transition-colors">
          Book Donations
        </Link>

        <Link href="#leaders" className="hover:text-[#7629f0] transition-colors">
          Youth Leaders
        </Link>

        <Link href="#impact" className="hover:text-[#7629f0] transition-colors">
          Impact
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        <Link
          href="/admin/login"
          className="text-[13.5px] font-semibold text-[#140529] px-3 py-2 hover:text-[#7629f0] transition-colors"
        >
          Portal
        </Link>

        <button
          type="button"
          onClick={onOpenModal}
          className="text-[13.5px] font-bold text-white bg-[#7629f0] hover:bg-[#6019d4] px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
        >
          <span>Get Involved</span>
          <Sparkles size={14} />
        </button>
      </div>
    </header>
  );
}
