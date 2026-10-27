"use client";

import React from "react";
import Link from "next/link";

export default function SignupsClosedSection() {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-[1440px] mx-auto">
      {/* Capacity Notification Pill */}
      <div className="flex justify-center mb-[-24px] z-20 relative">
        <div className="bg-white border border-neutral-300 px-6 py-4 rounded-none shadow-sm max-w-[420px] text-center">
          <p className="text-[13px] sm:text-[14px] text-[#003227] leading-snug font-normal">
            thank you for your interest in this meetup!
            <br />
            we’ve reached full capacity and can no
            <br />
            longer accept new registrations.
          </p>
        </div>
      </div>

      {/* Large Dashed Box Container */}
      <div className="border-2 border-dashed border-[#003227]/40 p-8 sm:p-14 text-center relative bg-transparent">
        {/* Giant "sign-ups are now closed" Cut-Out Typography */}
        <div className="flex justify-center my-8">
          <img
            src="/readymag_assets/svg_12.svg"
            alt="sign-ups are now closed"
            className="w-full max-w-[1100px] h-auto object-contain"
          />
        </div>

        {/* Footer Subtext & Links */}
        <div className="max-w-[700px] mx-auto mt-10 space-y-3">
          <p className="text-[17px] sm:text-[20px] text-[#003227] font-normal">
            follow us on{" "}
            <Link
              href="https://instagram.com/readymag"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D51F1F] underline decoration-1 underline-offset-4"
            >
              instagram
            </Link>{" "}
            for updates on future events.
          </p>

          <p className="text-[17px] sm:text-[20px] text-[#003227] font-normal">
            if you'd like to host events like this one,{" "}
            <Link
              href="https://readymag.com/ambassadors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D51F1F] underline decoration-1 underline-offset-4"
            >
              apply to become a readymag ambassador
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
