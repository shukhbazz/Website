'use client';

import React from 'react';

interface PageIndicatorsProps {
  totalScreens: number;
  activeScreen: number;
  onSelectScreen: (index: number) => void;
}

export default function PageIndicators({
  totalScreens,
  activeScreen,
  onSelectScreen
}: PageIndicatorsProps) {
  if (totalScreens <= 1) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2.5 p-2 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-md">
      {Array.from({ length: totalScreens }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelectScreen(idx)}
          className={`rounded-full transition-all duration-300 cursor-pointer ${
            activeScreen === idx
              ? 'w-2.5 h-6 bg-cyan-400 shadow-md shadow-cyan-400/50'
              : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
}
