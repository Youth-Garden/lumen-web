import React from 'react';
import type { IconProps } from '../types';

export function StudyGraduateIcon({
  className,
  size = 120,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      fill="none"
      {...props}
    >
      <defs>
        <radialGradient
          id="lumen-graduate-face"
          cx="45%"
          cy="40%"
          r="60%"
          fx="40%"
          fy="35%"
        >
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>

        <linearGradient
          id="lumen-graduate-cap"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4B5563" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>

        <linearGradient
          id="lumen-star-gold"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Emoji Face */}
      <circle
        cx="80"
        cy="88"
        r="44"
        fill="url(#lumen-graduate-face)"
        filter="drop-shadow(0 2px 8px rgba(245, 158, 11, 0.25))"
      />

      {/* Cheeks */}
      <ellipse cx="49" cy="98" rx="5.5" ry="4" fill="#F87171" opacity="0.35" />
      <ellipse cx="111" cy="98" rx="5.5" ry="4" fill="#F87171" opacity="0.35" />

      {/* Glasses Frames & Lenses */}
      {/* Left Lens */}
      <circle
        cx="62"
        cy="86"
        r="15"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="4"
      />
      {/* Right Lens */}
      <circle
        cx="98"
        cy="86"
        r="15"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="4"
      />
      {/* Bridge */}
      <path
        d="M77 84 Q80 80 83 84"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Eyes / Pupils with reflections */}
      <circle cx="64" cy="86" r="4.5" fill="#1E293B" />
      <circle cx="66" cy="84" r="1.5" fill="#FFFFFF" />

      <circle cx="96" cy="86" r="4.5" fill="#1E293B" />
      <circle cx="98" cy="84" r="1.5" fill="#FFFFFF" />

      {/* Smile */}
      <path
        d="M66 108 Q80 122 94 108"
        fill="none"
        stroke="#92400E"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Graduation Cap */}
      {/* Base skull cap */}
      <path
        d="M52 48 Q80 34 108 48 L104 60 Q80 48 56 60 Z"
        fill="#1F2937"
      />
      {/* Top Diamond */}
      <polygon
        points="80,20 136,40 80,60 24,40"
        fill="url(#lumen-graduate-cap)"
        stroke="#374151"
        strokeWidth="1.5"
      />
      {/* Cap Center Button */}
      <ellipse cx="80" cy="40" rx="4" ry="2.5" fill="#111827" />

      {/* Tassel */}
      <path
        d="M80 40 Q118 42 120 58 L120 70"
        fill="none"
        stroke="#4B5563"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="120" cy="72" r="3.5" fill="#374151" />

      {/* 5 Stars */}
      <g fill="url(#lumen-star-gold)">
        {/* Star 1 */}
        <polygon
          points="36,138 38.5,143 44,144 40,148 41,153.5 36,151 31,153.5 32,148 28,144 33.5,143"
          filter="drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))"
        />
        {/* Star 2 */}
        <polygon
          points="58,138 60.5,143 66,144 62,148 63,153.5 58,151 53,153.5 54,148 50,144 55.5,143"
          filter="drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))"
        />
        {/* Star 3 (Middle) */}
        <polygon
          points="80,136 82.5,141 88,142 84,146 85,151.5 80,149 75,151.5 76,146 72,142 77.5,141"
          filter="drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))"
        />
        {/* Star 4 */}
        <polygon
          points="102,138 104.5,143 110,144 106,148 107,153.5 102,151 97,153.5 98,148 94,144 99.5,143"
          filter="drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))"
        />
        {/* Star 5 */}
        <polygon
          points="124,138 126.5,143 132,144 128,148 129,153.5 124,151 119,153.5 120,148 116,144 121.5,143"
          filter="drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))"
        />
      </g>
    </svg>
  );
}
