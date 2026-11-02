"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Hand, Eye, Maximize2, Minimize2 } from "lucide-react";
import DomeGallery from "@/components/ufy/DomeGallery";
import CutoutTypography from "@/components/ufy/CutoutTypography";

interface GalleryPhotoItem {
  id: string;
  imageUrl: string;
  caption: string;
  dateLabel?: string | null;
  location?: string | null;
  orientation: string;
  tiltAngle: number;
  pegColor: string;
  displayOrder: number;
}

interface WireHangingGalleryClientProps {
  title: string;
  subtitle: string;
  initialPhotos: GalleryPhotoItem[];
}

export default function WireHangingGalleryClient({
  title,
  subtitle,
  initialPhotos,
}: WireHangingGalleryClientProps) {
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const domeStageRef = useRef<HTMLDivElement | null>(null);

  const domeImages = useMemo(() => {
    if (!initialPhotos || initialPhotos.length === 0) return undefined;
    return initialPhotos.map((p) => ({
      src: p.imageUrl,
      alt: `${p.caption}${p.location ? ` — ${p.location}` : ""}`,
    }));
  }, [initialPhotos]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleFullScreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (domeStageRef.current && domeStageRef.current.requestFullscreen) {
          await domeStageRef.current.requestFullscreen();
        }
      } catch {
        // Fallback to fixed viewport fullscreen overlay (`fixed inset-0 z-[100]`)
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {}
    }
  };

  return (
    <div className="w-full">
      {/* Edge-to-Edge Centered Hero Header (No Top Purple Pill Badge) */}
      <section className="ufy-container text-center mb-10 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="gallery" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-6 text-center">
          {subtitle}
        </p>

        {/* Centered Interactive Controls & Full Screen Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#d4b8fc] text-xs font-extrabold text-[#140529] shadow-sm text-center">
            <Hand size={14} className="text-[#7629f0]" />
            <span>Drag to spin the 3D dome · Click any photo to enlarge</span>
          </div>

          <button
            type="button"
            onClick={() => setGrayscaleMode((prev) => !prev)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
              grayscaleMode
                ? "bg-[#140529] text-white border-[#140529]"
                : "bg-white text-[#140529] border-[#d4b8fc] hover:border-[#7629f0]"
            }`}
          >
            <Eye size={14} className="text-[#7629f0]" />
            <span>{grayscaleMode ? "Editorial B&W: ON" : "Vibrant Color: ON"}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullScreen}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#7629f0] hover:bg-[#5f1bc9] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
          >
            <Maximize2 size={15} />
            <span>Full Screen Gallery</span>
          </button>
        </div>
      </section>

      {/* Expansive Full-Page 3D React Bits <DomeGallery /> Stage */}
      <section className="w-full px-2 sm:px-4 lg:px-8 mb-8">
        <div className="ufy-dashed-box w-full p-2 sm:p-3 rounded-[28px] overflow-hidden shadow-2xl">
          <div
            ref={domeStageRef}
            className={
              isFullscreen
                ? "fixed inset-0 z-[100] w-screen h-screen bg-[#140529] overflow-hidden"
                : "w-full rounded-[22px] overflow-hidden relative border-2 border-[#140529]"
            }
            style={
              isFullscreen
                ? { width: "100vw", height: "100vh", backgroundColor: "#140529" }
                : { height: "clamp(680px, 88vh, 980px)", backgroundColor: "#140529" }
            }
          >
            {/* Floating Full Screen / Exit Full Screen Control Inside the Dome Viewer */}
            <div className="absolute top-5 right-5 z-50 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setGrayscaleMode((prev) => !prev)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs font-extrabold transition-all cursor-pointer"
              >
                <Eye size={14} />
                <span>{grayscaleMode ? "Color Mode" : "B&W Mode"}</span>
              </button>

              <button
                type="button"
                onClick={toggleFullScreen}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#7629f0] hover:bg-[#8e48ff] text-white border border-white/30 text-xs font-extrabold shadow-lg transition-all cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 size={14} />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={14} />
                    <span>Full Screen</span>
                  </>
                )}
              </button>
            </div>

            <DomeGallery
              images={domeImages}
              fit={0.62}
              minRadius={620}
              overlayBlurColor="#140529"
              maxVerticalRotationDeg={6}
              dragSensitivity={20}
              enlargeTransitionMs={300}
              segments={35}
              dragDampening={2}
              openedImageWidth="460px"
              openedImageHeight="460px"
              imageBorderRadius="24px"
              openedImageBorderRadius="28px"
              grayscale={grayscaleMode}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
