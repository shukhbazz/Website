'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { IslamicHeaderConfig } from '@/lib/types';
import { getTripleCalendarInfo } from '@/lib/calendar';
import { motion } from 'framer-motion';

interface TopBarBannerProps {
  islamicHeader: IslamicHeaderConfig;
}

export default function TopBarBanner({ islamicHeader }: TopBarBannerProps) {
  const { lang } = useLanguage();
  const [info, setInfo] = useState<ReturnType<typeof getTripleCalendarInfo> | null>(null);

  useEffect(() => {
    setInfo(getTripleCalendarInfo());
    const timer = setInterval(() => {
      setInfo(getTripleCalendarInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-slate-950 text-white relative z-20 border-b border-slate-800/80">
      {/* 1. Bismillah & Quranic Verse Section */}
      {islamicHeader?.enabled && (
        <div className="w-full py-4 px-4 bg-gradient-to-b from-slate-900 to-slate-950 text-center border-b border-slate-800/60">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* Bismillah */}
            <div>
              <p
                className="text-xl sm:text-2xl font-serif text-amber-200 tracking-wide font-arabic leading-relaxed"
                dir="rtl"
              >
                {islamicHeader.bismillahArabic}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
                {lang === 'bn' ? islamicHeader.bismillahBn : islamicHeader.bismillahEn}
              </p>
            </div>

            {/* Quranic Verse */}
            {islamicHeader.quranArabic && (
              <div className="pt-2 border-t border-slate-800/60">
                <p
                  className="text-base sm:text-lg text-emerald-300 font-serif font-arabic leading-relaxed"
                  dir="rtl"
                >
                  &ldquo;{islamicHeader.quranArabic}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-slate-300 italic mt-0.5">
                  &ldquo;{lang === 'bn' ? islamicHeader.quranBn : islamicHeader.quranEn}&rdquo;{' '}
                  <span className="text-[11px] text-amber-300/80 not-italic font-mono">
                    {lang === 'bn' ? islamicHeader.quranSurahBn : islamicHeader.quranSurahEn}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Horizontal Calendar & Live Time Bar (Like the reference image) */}
      <div className="w-full bg-[#0e7490] text-white py-2 px-4 shadow-sm text-xs sm:text-sm font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-y-1.5 gap-x-4 text-center sm:text-left">
          {info ? (
            <>
              {/* Left side: English Day & Date + Bangla Date */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-cyan-50">
                <span className="font-semibold">
                  {lang === 'bn'
                    ? `${info.gregorian.dayNameBn}, ${info.gregorian.bn}`
                    : `${info.gregorian.dayNameEn}, ${info.gregorian.en}`}
                </span>
                <span className="opacity-60 hidden sm:inline">|</span>
                <span className="text-emerald-100">
                  {lang === 'bn' ? info.bangla.bn : info.bangla.en}
                </span>
                <span className="opacity-60 hidden md:inline">|</span>
                <span className="text-amber-100 hidden md:inline">
                  {lang === 'bn' ? info.hijri.bn : info.hijri.en}
                </span>
              </div>

              {/* Right side: Live Ticking Time */}
              <div className="flex items-center gap-2 font-mono font-bold text-white bg-black/20 px-3 py-0.5 rounded-md">
                <span>{lang === 'bn' ? info.time.bn : info.time.en}</span>
              </div>
            </>
          ) : (
            <div className="h-5 w-48 bg-white/20 rounded animate-pulse mx-auto" />
          )}
        </div>
      </div>
    </header>
  );
}
