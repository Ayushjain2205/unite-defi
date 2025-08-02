'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OrbIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: 1 | 2 | 3 | 4 | 5;
  pulse?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const gradientClasses = {
  1: 'orb-gradient-1',
  2: 'orb-gradient-2', 
  3: 'orb-gradient-3',
  4: 'orb-gradient-4',
  5: 'orb-gradient-5'
};

export function OrbIcon({ 
  size = 'md', 
  gradient = 1, 
  pulse = false, 
  className 
}: OrbIconProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center relative overflow-hidden',
        'shadow-lg border-2 border-white/20',
        'before:absolute before:inset-0 before:rounded-full',
        'before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent',
        'after:absolute after:inset-[2px] after:rounded-full',
        'after:bg-gradient-to-t after:from-black/10 after:via-transparent after:to-white/20',
        sizeClasses[size],
        gradientClasses[gradient],
        pulse && 'orb-pulse',
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
      
      {/* Highlight spot */}
      <div className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/60 blur-sm" />
    </div>
  );
}