"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Activity,
  BookOpen,
  Users,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  HeartHandshake,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";

interface ImpactMetricItem {
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
}

interface ImpactCounterClientProps {
  title: string;
  subtitle: string;
  initialMetrics: ImpactMetricItem[];
  educatedCount?: number;
}

function AnimatedNumber({
  value,
  duration = 1600,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ImpactCounterClient({
  title,
  subtitle,
  initialMetrics,
  educatedCount = 0,
}: ImpactCounterClientProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return Heart;
      case "Activity":
        return Activity;
      case "BookOpen":
        return BookOpen;
      case "Users":
        return Users;
      case "Clock":
        return Clock;
      default:
        return Award;
    }
  };

  return (
    <div className="w-full">
      {/* Edge-to-Edge Centered Hero Header (No Top Purple Pill & No Flashing Green Dot) */}
      <section className="ufy-container text-center mb-14 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="impact" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-6 text-center">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-[#d4b8fc] text-xs font-bold text-[#140529] shadow-sm text-center">
            <ShieldCheck size={14} className="text-[#7629f0] shrink-0" />
            <span>
              Verified via hospital delivery receipts, virtual letters &amp; workshop sign-ins
            </span>
          </div>
          <Link
            href="/videos"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#7629f0] text-white text-xs font-extrabold shadow-sm hover:bg-[#5f1bc9] transition-colors text-center"
          >
            <PlayCircle size={14} />
            <span>{educatedCount.toLocaleString()} People Educated via UFY Videos →</span>
          </Link>
        </div>
      </section>

      {/* Edge-to-Edge Centered Live Impact Counter Grid (Without Flashing Green Dot) */}
      <section className="ufy-container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {initialMetrics.map((metric) => {
            const Icon = getIcon(metric.icon);

            return (
              <div
                key={metric.id}
                className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-[#140529] shadow-[8px_10px_0px_rgba(20,5,41,0.9)] hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col items-center justify-between text-center"
              >
                <div className="flex flex-col items-center w-full">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                    style={{ backgroundColor: `${metric.color}18`, color: metric.color }}
                  >
                    <Icon size={28} />
                  </div>

                  <div className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#140529] tracking-tight mb-2 text-center">
                    {metric.prefix}
                    <AnimatedNumber value={metric.currentValue ?? metric.targetValue ?? 0} />
                    {metric.suffix}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#140529] mb-3 leading-snug text-center">
                    {metric.label}
                  </h3>
                </div>

                {metric.subtitle && (
                  <p className="text-xs sm:text-sm text-[#5416b3] font-medium leading-relaxed pt-4 border-t border-neutral-100 text-center w-full">
                    {metric.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Centered Call-to-Action Banner */}
      <section className="ufy-container mb-8">
        <div className="ufy-dashed-box rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-4xl font-black text-[#140529] mb-3 text-center">
            Help Push Our Community Counters Higher
          </h2>
          <p className="text-sm sm:text-base text-[#5416b3] max-w-2xl mx-auto font-medium mb-6 text-center">
            Every virtual letter written, workshop hosted, and book donated in Manteca and beyond updates our live Up for Youth community totals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/letters"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#7629f0] hover:bg-[#5f1bc9] text-white font-extrabold text-sm shadow-lg transition-all"
            >
              <span>Write a Virtual Letter</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#f8f4fe] text-[#140529] border-2 border-[#140529] shadow-[3px_4px_0px_#140529] font-extrabold text-sm transition-all"
            >
              <HeartHandshake size={16} className="text-[#7629f0]" />
              <span>Sign Up as a Volunteer</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
