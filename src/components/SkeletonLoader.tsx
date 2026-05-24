import React from "react";
import { getPath } from "../utils/physics";

export function SkeletonPulse({ className = "", style = {} }: { className?: string; style?: React.CSSProperties; key?: React.Key }) {
  return (
    <div
      className={`animate-pulse bg-current opacity-15 ${className}`}
      style={{
        borderRadius: "var(--md-shape-small)",
        color: "var(--md-on-surface-variant)",
        ...style,
      }}
    />
  );
}

export function CalendarSkeleton() {
  return (
    <div
      className="p-8 sm:p-12 w-full flex flex-col gap-8 shadow-sm border"
      style={{
        backgroundColor: "var(--md-surface-container-low)",
        borderColor: "var(--md-outline-variant)",
        borderRadius: "var(--md-shape-extra-extra-large)",
      }}
    >
      {/* Calendar Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-8 h-8 rounded-full" />
          <SkeletonPulse className="w-48 h-8 rounded-md" />
        </div>
        <div className="flex gap-2">
          <SkeletonPulse className="w-10 h-10 rounded-full" />
          <SkeletonPulse className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid Skeleton (Left - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-6 rounded-sm w-full mx-auto" />
            ))}
          </div>
          {/* 35 Calendar Cells */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center p-1 border border-black/5 dark:border-white/5"
                style={{ borderRadius: "var(--md-shape-medium)" }}
              >
                <SkeletonPulse className="w-6 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Events List Skeleton (Right - 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <SkeletonPulse className="w-32 h-6 mb-2 rounded-sm" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 flex gap-4 items-center border border-black/5 dark:border-white/5"
              style={{
                backgroundColor: "var(--md-surface-container)",
                borderRadius: "var(--md-shape-large)",
              }}
            >
              {/* Event Shape Skeleton */}
              <div className="w-12 h-12 shrink-0 relative">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-on-surface-variant animate-pulse opacity-15">
                  <path fill="currentColor" d={getPath("cookie", 100, 100, 0)} />
                </svg>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <SkeletonPulse className="w-3/4 h-5 rounded-sm" />
                <SkeletonPulse className="w-1/2 h-4 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CouncilSkeleton() {
  const shapes = ["cookie", "squircle", "flower", "diamond", "star"] as const;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Title + Toggle Segment */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-8 h-8 rounded-full" />
          <SkeletonPulse className="w-40 h-8 rounded-md" />
        </div>
        {/* Toggle */}
        <SkeletonPulse className="w-56 h-10 rounded-xl" />
      </div>

      {/* Dept Filter Chips */}
      <div className="flex gap-2 overflow-hidden py-2 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className="h-9 shrink-0"
            style={{
              width: i === 0 ? "55px" : i === 2 ? "120px" : i === 5 ? "140px" : "90px",
              borderRadius: "100px",
            }}
          />
        ))}
      </div>

      {/* Member Blobs scroller */}
      <div className="flex gap-8 overflow-hidden py-12 w-full">
        {Array.from({ length: 5 }).map((_, i) => {
          const shape = shapes[i % shapes.length];
          return (
            <div key={i} className="flex flex-col items-center gap-4 shrink-0 w-60">
              {/* Pulsing SVG Blob Shape */}
              <div className="w-[200px] h-[200px] relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-on-surface-variant animate-pulse opacity-15">
                  <path fill="currentColor" d={getPath(shape as any, 100, 100, i)} />
                </svg>
              </div>
              {/* Name */}
              <SkeletonPulse className="w-24 h-6 rounded-md" />
              {/* Role chip */}
              <SkeletonPulse className="w-32 h-7 rounded-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GeneralSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div
      className="p-8 sm:p-12 w-full flex flex-col justify-center items-center gap-4 border"
      style={{
        height,
        backgroundColor: "var(--md-surface-container-low)",
        borderColor: "var(--md-outline-variant)",
        borderRadius: "var(--md-shape-extra-large)",
      }}
    >
      <SkeletonPulse className="w-12 h-12 rounded-full mb-2" />
      <SkeletonPulse className="w-48 h-6 rounded-md" />
      <SkeletonPulse className="w-64 h-4 rounded-md" />
    </div>
  );
}
