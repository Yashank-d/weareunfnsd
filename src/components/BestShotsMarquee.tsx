"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { bestShots } from "../lib/data";

// ─── Bento layout config ──────────────────────────────────────────────────────
// We show the first 7 images in a hand-crafted bento grid that fills 100vh.
// grid-template-areas drives the layout; each area name = "p" + index.
// The remaining images are placed in the single scrolling strip at the bottom.
// ─────────────────────────────────────────────────────────────────────────────

const bentoImages = bestShots.slice(0, 7);
const stripImages = bestShots; // all 20 for the scrolling strip

// Scrolling strip card widths — varied for asymmetry
const stripWidths = [
  "w-[300px]", "w-[180px]", "w-[420px]", "w-[220px]", "w-[350px]",
  "w-[160px]", "w-[400px]", "w-[250px]", "w-[290px]", "w-[380px]",
];

// ─── Hover helpers ────────────────────────────────────────────────────────────
function BentoCard({
  src,
  index,
  className,
}: {
  src: string;
  index: number;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = useCallback(() => {
    gsap.to(cardRef.current, { scale: 1.04, zIndex: 10, duration: 0.55, ease: "expo.out" });
    gsap.to(cardRef.current?.querySelector("img") ?? null, {
      filter: "brightness(1.12) contrast(1.08) saturate(1.2)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(cardRef.current, { scale: 1, zIndex: 1, duration: 0.85, ease: "elastic.out(1, 0.75)" });
    gsap.to(cardRef.current?.querySelector("img") ?? null, {
      filter: "brightness(1) contrast(1.05) saturate(0.82)",
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden bg-bg-surface cursor-pointer ${className ?? ""}`}
      style={{ zIndex: 1, willChange: "transform" }}
    >
      <Image
        src={src}
        alt={`Best shot ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
        unoptimized
      />
    </div>
  );
}

// ─── Scrolling strip card ─────────────────────────────────────────────────────
function StripCard({
  src,
  index,
  width,
  trackRef,
}: {
  src: string;
  index: number;
  width: string;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = useCallback(() => {
    if (trackRef.current) {
      const scrollEl = trackRef.current.querySelector<HTMLElement>("div");
      if (scrollEl) scrollEl.style.animationPlayState = "paused";
    }
    gsap.to(cardRef.current, { scale: 1.06, zIndex: 20, duration: 0.55, ease: "expo.out" });
    gsap.to(cardRef.current?.querySelector("img") ?? null, {
      filter: "brightness(1.1) contrast(1.1) saturate(1.1)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, [trackRef]);

  const onLeave = useCallback(() => {
    if (trackRef.current) {
      const scrollEl = trackRef.current.querySelector<HTMLElement>("div");
      if (scrollEl) scrollEl.style.animationPlayState = "running";
    }
    gsap.to(cardRef.current, { scale: 1, zIndex: 1, duration: 0.85, ease: "elastic.out(1, 0.75)" });
    gsap.to(cardRef.current?.querySelector("img") ?? null, {
      filter: "brightness(1) contrast(1.05) saturate(0.8)",
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, [trackRef]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative shrink-0 h-full overflow-hidden bg-bg-surface cursor-pointer ${width}`}
      style={{ zIndex: 1, willChange: "transform" }}
    >
      <Image
        src={src}
        alt={`Frame ${index + 1}`}
        fill
        className="object-cover"
        sizes="400px"
        unoptimized
      />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BestShotsGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...stripImages, ...stripImages];

  return (
    <section className="w-full bg-bg-primary border-t border-border-glass">

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-5 flex justify-between items-center border-b border-border-glass">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
          Best Shots
        </span>
        <span className="font-mono text-[10px] text-text-muted/40 uppercase tracking-widest">
          {bestShots.length} FRAMES
        </span>
      </div>

      {/* ── Full-viewport bento grid (desktop) ────────────────────────────── */}
      {/*
        Layout (12 cols × ~100vh):
        ┌──────────────────┬────────────┬────────────┐
        │                  │   [1]      │   [2]      │   row 1  (40%)
        │     [0]          ├────────────┴────────────┤
        │   (hero, tall)   │        [3]              │   row 2  (30%)
        │                  ├───────┬─────────────────┤
        ├──────────┬───────┤  [5]  │      [6]        │   row 3  (30%)
        │  [4]     │ text  │       │                 │
        └──────────┴───────┴───────┴─────────────────┘
      */}
      <div
        className="hidden md:grid w-full"
        style={{
          height: "calc(100vh - 41px)", // subtract the label bar
          gridTemplateColumns: "5fr 3fr 4fr",
          gridTemplateRows: "40% 30% 30%",
          gap: "3px",
        }}
      >
        {/* [0] Hero — spans 3 rows on left */}
        <div style={{ gridColumn: "1", gridRow: "1 / 4" }}>
          <BentoCard src={bentoImages[0]} index={0} className="w-full h-full" />
        </div>

        {/* [1] Top-center */}
        <div style={{ gridColumn: "2", gridRow: "1" }}>
          <BentoCard src={bentoImages[1]} index={1} className="w-full h-full" />
        </div>

        {/* [2] Top-right */}
        <div style={{ gridColumn: "3", gridRow: "1" }}>
          <BentoCard src={bentoImages[2]} index={2} className="w-full h-full" />
        </div>

        {/* [3] Mid center+right spanning */}
        <div style={{ gridColumn: "2 / 4", gridRow: "2" }}>
          <BentoCard src={bentoImages[3]} index={3} className="w-full h-full" />
        </div>

        {/* [4] Bottom-center-left */}
        <div style={{ gridColumn: "2", gridRow: "3" }}>
          <BentoCard src={bentoImages[4]} index={4} className="w-full h-full" />
        </div>

        {/* Text card — editorial accent */}
        <div
          className="flex flex-col justify-between p-6 bg-bg-surface border-l border-border-glass"
          style={{ gridColumn: "3", gridRow: "3" }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted">
            Selected Frames
          </span>
          <div>
            <p className="font-display text-3xl xl:text-4xl font-light italic text-text-primary leading-tight mb-3">
              Light &amp; Shadow
            </p>
            <p className="font-mono text-[10px] text-text-muted leading-relaxed max-w-[160px]">
              Unforced moments — Bengaluru, 2021–26
            </p>
          </div>
          <span className="font-mono text-[9px] text-accent tracking-widest uppercase">
            Yashank D. ↗
          </span>
        </div>
      </div>

      {/* ── Mobile: simple 2-col grid ─────────────────────────────────────── */}
      <div className="md:hidden grid grid-cols-2 gap-[3px]">
        {bentoImages.map((src, i) => (
          <div
            key={i}
            className={`relative bg-bg-surface overflow-hidden ${
              i === 0 ? "col-span-2 h-[60vw]" : "h-[45vw]"
            }`}
          >
            <Image
              src={src}
              alt={`Best shot ${i + 1}`}
              fill
              className="object-cover"
              sizes="50vw"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* ── Single scrolling strip ─────────────────────────────────────────── */}
      <div className="border-t border-border-glass">
        <div ref={trackRef} className="relative w-full overflow-hidden h-[120px]">
          <div
            className="flex gap-[3px] w-max h-full animate-marquee-left"
            style={{ animationDuration: "55s" }}
          >
            {doubled.map((src, i) => (
              <StripCard
                key={i}
                src={src}
                index={i % stripImages.length}
                width={stripWidths[i % stripWidths.length]}
                trackRef={trackRef}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
