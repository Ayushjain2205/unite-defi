"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface OrbIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  orbId?: string; // Hex string for the orb ID
  pulse?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

// Function to get explicit size values
function getSizeValue(size: "sm" | "md" | "lg" | "xl"): {
  width: string;
  height: string;
} {
  const sizeMap = {
    sm: { width: "32px", height: "32px" },
    md: { width: "48px", height: "48px" },
    lg: { width: "64px", height: "64px" },
    xl: { width: "80px", height: "80px" },
  };
  return sizeMap[size];
}

// Function to generate gradient colors from orb ID hex
function generateGradientFromHex(hex: string): string {
  // Remove # if present and ensure we have at least 6 characters
  let cleanHex = hex.replace("#", "");

  // If hex is too short, repeat it to get at least 18 characters
  while (cleanHex.length < 18) {
    cleanHex += cleanHex;
  }

  // Function to generate vibrant colors with different strategies
  function generateVibrantColor(hexSegment: string, strategy: number): string {
    const r = parseInt(hexSegment.slice(0, 2), 16);
    const g = parseInt(hexSegment.slice(2, 4), 16);
    const b = parseInt(hexSegment.slice(4, 6), 16);

    // Different strategies for color generation
    switch (strategy) {
      case 0: // Original color with brightness boost
        return `rgb(${Math.min(255, r + 50)}, ${Math.min(
          255,
          g + 50
        )}, ${Math.min(255, b + 50)})`;

      case 1: // Complementary color (opposite hue)
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const avg = (max + min) / 2;
        return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;

      case 2: // Triadic color (120° rotation)
        const h = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
        const newH = h + (2 * Math.PI) / 3;
        const newR = Math.round(255 * Math.cos(newH));
        const newG = Math.round(255 * Math.cos(newH - (2 * Math.PI) / 3));
        const newB = Math.round(255 * Math.cos(newH + (2 * Math.PI) / 3));
        return `rgb(${Math.max(0, Math.min(255, newR))}, ${Math.max(
          0,
          Math.min(255, newG)
        )}, ${Math.max(0, Math.min(255, newB))})`;

      default:
        // Brighten and saturate
        const factor = 1.5;
        return `rgb(${Math.min(255, r * factor)}, ${Math.min(
          255,
          g * factor
        )}, ${Math.min(255, b * factor)})`;
    }
  }

  // Generate three distinctly different colors
  const color1 = generateVibrantColor(cleanHex.slice(0, 6), 0);
  const color2 = generateVibrantColor(cleanHex.slice(6, 12), 1);
  const color3 = generateVibrantColor(cleanHex.slice(12, 18), 2);

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
}

export function OrbIcon({
  size = "md",
  orbId = "667eea", // Default fallback
  pulse = false,
  className,
}: OrbIconProps) {
  // Generate gradient style based on orb ID
  const gradientStyle = generateGradientFromHex(orbId);
  const sizeValue = getSizeValue(size);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center relative overflow-hidden",
        "shadow-lg border-2 border-white/20",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent",
        "after:absolute after:inset-[2px] after:rounded-full",
        "after:bg-gradient-to-t after:from-black/10 after:via-transparent after:to-white/20",
        sizeClasses[size],
        pulse && "orb-pulse",
        className
      )}
      style={{
        background: gradientStyle,
        borderRadius: "50%",
        width: sizeValue.width,
        height: sizeValue.height,
        minWidth: sizeValue.width,
        minHeight: sizeValue.height,
        maxWidth: sizeValue.width,
        maxHeight: sizeValue.height,
      }}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

      {/* Highlight spot */}
      <div className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/60 blur-sm" />
    </div>
  );
}
