'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { QuoteItem } from '@/lib/types';
import { toBnDigits } from '@/lib/calendar';
import { Quote, ChevronDown, Feather } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuoteScreenProps {
  quote: QuoteItem;
  index: number;
  total: number;
}

export default function QuoteScreen({ quote, index, total }: QuoteScreenProps) {
  const { lang } = useLanguage();

  const quoteText = lang === 'bn' ? quote.textBn : quote.textEn;
  const rawAuthor = lang === 'bn' ? quote.authorBn : quote.authorEn;
  const authorText = rawAuthor ? rawAuthor.replace(/শুখবাজ/g, 'সুখবাজ') : '';
  const categoryText = lang === 'bn' ? quote.categoryBn : quote.categoryEn;

  // Harmonized picture-based accent color
  const fallbackColors = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#ec4899'];
  const accent = quote.accentColor || fallbackColors[index % fallbackColors.length];

  const pageNumStr = lang === 'bn'
    ? `বাণী ${toBnDigits(index + 1)} / ${toBnDigits(total)}`
    : `Thought ${index + 1} of ${total}`;

  return (
    <section className="w-full h-screen h-[100dvh] min-h-[100dvh] relative flex flex-col justify-between items-center bg-slate-950 text-white overflow-hidden p-4 sm:p-12">
      {/* 1. Full-screen Background Picture */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${quote.bgImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80'})`
        }}
      />

      {/* Picture-based Color Tint Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accent}22 0%, rgba(11, 17, 32, 0.88) 60%, #020617 100%)`
        }}
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-slate-950/75 pointer-events-none backdrop-blur-[2px]" />

      {/* Dynamic ambient orb matched to picture */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: `${accent}25` }}
      />

      {/* Top Bar: Category Pill & Index Badge (pr-16 on mobile avoids language button) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pt-2 sm:pt-4 pr-16 sm:pr-0">
        <div className="flex items-center gap-2">
          <span
            className="p-2 rounded-xl backdrop-blur-md"
            style={{
              backgroundColor: `${accent}18`,
              border: `1px solid ${accent}40`,
              color: accent
            }}
          >
            <Feather className="w-4 h-4" />
          </span>

          {categoryText && (
            <span
              className="px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm"
              style={{
                backgroundColor: `${accent}18`,
                border: `1px solid ${accent}40`,
                color: accent
              }}
            >
              {categoryText}
            </span>
          )}
        </div>

        <span className="text-xs px-3.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 font-mono backdrop-blur-md">
          {pageNumStr}
        </span>
      </div>

      {/* Center: The Large Animated Quote Card with Picture-Based Accent */}
      <div className="relative z-10 max-w-3xl mx-auto my-auto text-center space-y-4 sm:space-y-6 px-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: `${accent}22`,
            border: `1px solid ${accent}50`,
            color: accent
          }}
        >
          <Quote className="w-7 h-7 rotate-180" />
        </div>

        <blockquote className="text-xl sm:text-3xl md:text-4xl font-medium text-white leading-relaxed sm:leading-loose tracking-wide font-sans drop-shadow-lg">
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        {authorText && (
          <p
            className="text-base sm:text-lg font-bold italic font-mono pt-2"
            style={{ color: accent }}
          >
            {authorText}
          </p>
        )}
      </div>

      {/* Bottom Spacer */}
      <div className="h-6" />
    </section>
  );
}
