'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { IslamicHeaderConfig } from '@/lib/types';
import { getTripleCalendarInfo, getVisitorLocalDate } from '@/lib/calendar';
import { motion } from 'framer-motion';

interface IslamicScreenProps {
  islamicHeader: IslamicHeaderConfig;
  visitorTimezone?: string;
}

type DayTimeState = 'dawn' | 'day' | 'sunset' | 'night';

function computeTimeState(rawNow: Date, timeZone?: string): DayTimeState {
  const now = getVisitorLocalDate(rawNow, timeZone);
  const hour = now.getHours();
  const minute = now.getMinutes();
  const month = now.getMonth();
  const timeInDecimal = hour + minute / 60;

  // Seasonal twilight/sunset calculation for visitor's location
  const sunsetStart = (month >= 9 || month <= 1) ? 17.15 : 18.0;
  const nightStart = sunsetStart + 1.5;

  if (timeInDecimal >= 5.0 && timeInDecimal < 6.8) {
    return 'dawn';
  } else if (timeInDecimal >= 6.8 && timeInDecimal < (sunsetStart - 0.4)) {
    return 'day';
  } else if (timeInDecimal >= (sunsetStart - 0.4) && timeInDecimal < nightStart) {
    return 'sunset';
  } else {
    return 'night';
  }
}

export default function IslamicScreen({ islamicHeader, visitorTimezone }: IslamicScreenProps) {
  const { lang } = useLanguage();
  const [info, setInfo] = useState<ReturnType<typeof getTripleCalendarInfo> | null>(() => {
    return getTripleCalendarInfo(new Date(), typeof window === 'undefined' ? visitorTimezone : undefined);
  });
  const [timeState, setTimeState] = useState<DayTimeState>(() => {
    return computeTimeState(new Date(), typeof window === 'undefined' ? visitorTimezone : undefined);
  });

  useEffect(() => {
    const updateTimeAndSun = () => {
      const now = new Date();
      setInfo(getTripleCalendarInfo(now));
      setTimeState(computeTimeState(now));
    };

    updateTimeAndSun();
    const timer = setInterval(updateTimeAndSun, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sky, Ocean & Celestial (Sun/Moon) atmospheric config based on time of day
  const getSkyConfig = () => {
    switch (timeState) {
      case 'dawn':
        return {
          skyGradient: 'from-[#080d1a] via-[#241031] via-[#5b1e10]/80 to-[#c2410c]/35',
          oceanGradient: 'from-[#1a1c36]/90 via-[#0f172a] to-[#020617]',
          waterShimmer: 'from-amber-300/40 via-orange-400/20 to-transparent',
          sunGlow: 'bg-amber-500/25',
          bodyColor: 'bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-400',
          bodyShadow: 'shadow-[0_0_80px_25px_rgba(251,191,36,0.45)]',
          bodyBottom: '24%',
          isMoon: false,
          statusBn: 'সমুদ্রের দিগন্তে ভোর ও সূর্যোদয়',
          statusEn: 'Dawn Ocean Sunrise',
          statusIcon: '🌅'
        };
      case 'day':
        return {
          skyGradient: 'from-[#021329] via-[#033457] to-[#0284c7]/45',
          oceanGradient: 'from-[#022c44]/90 via-[#031d33] to-[#020d1a]',
          waterShimmer: 'from-cyan-100/45 via-sky-300/25 to-transparent',
          sunGlow: 'bg-amber-300/35',
          bodyColor: 'bg-gradient-to-tr from-yellow-100 via-amber-300 to-orange-400',
          bodyShadow: 'shadow-[0_0_100px_35px_rgba(253,224,71,0.55)]',
          bodyBottom: '48%',
          isMoon: false,
          statusBn: 'সমুদ্রের উপরে উজ্জ্বল দিবাভাগ',
          statusEn: 'Bright Ocean Daylight',
          statusIcon: '☀️'
        };
      case 'sunset':
        return {
          skyGradient: 'from-[#0a0c1b] via-[#3b0764] via-[#831843]/85 to-[#ea580c]/50',
          oceanGradient: 'from-[#2e1065]/80 via-[#180d2b] to-[#020617]',
          waterShimmer: 'from-orange-400/50 via-rose-500/25 to-transparent',
          sunGlow: 'bg-rose-500/40',
          bodyColor: 'bg-gradient-to-tr from-amber-300 via-rose-500 to-red-500',
          bodyShadow: 'shadow-[0_0_90px_30px_rgba(244,63,94,0.5)]',
          bodyBottom: '21%',
          isMoon: false,
          statusBn: 'সমুদে গোধূলি ও সূর্যাস্ত',
          statusEn: 'Twilight Ocean Sunset',
          statusIcon: '🌇'
        };
      case 'night':
      default:
        return {
          skyGradient: 'from-[#01040a] via-[#050b1a] to-[#0c1633]/80',
          oceanGradient: 'from-[#050f24]/90 via-[#030914] to-[#01040a]',
          waterShimmer: 'from-cyan-100/35 via-blue-300/15 to-transparent',
          sunGlow: 'bg-cyan-300/20',
          bodyColor: 'bg-gradient-to-tr from-slate-100 via-slate-200 to-cyan-50',
          bodyShadow: 'shadow-[0_0_60px_20px_rgba(224,242,254,0.35)]',
          bodyBottom: '44%',
          isMoon: true,
          statusBn: 'সমুদ্রের বুকে শান্ত জ্যোৎস্নাময় রজনী',
          statusEn: 'Serene Ocean Moonlight Night',
          statusIcon: '🌙'
        };
    }
  };

  const sky = getSkyConfig();

  return (
    <section className="w-full h-full min-h-[100dvh] relative flex flex-col justify-between items-center text-white overflow-hidden px-3 pt-2 pb-2 sm:p-8">
      {/* 1. Dynamic Celestial Sky Background (Changes color based on time of day) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${sky.skyGradient} transition-colors duration-1000 pointer-events-none`}
      />

      {/* 2. Twinkling Stars for Night Sky */}
      {sky.isMoon && (
        <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
          <div className="absolute top-10 left-[15%] w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-20 right-[25%] w-1.5 h-1.5 bg-amber-100 rounded-full animate-pulse" />
          <div className="absolute top-36 left-[30%] w-1 h-1 bg-cyan-200 rounded-full" />
          <div className="absolute top-28 right-[12%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <div className="absolute top-16 left-[55%] w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-44 right-[45%] w-1 h-1 bg-amber-200 rounded-full animate-pulse" />
          <div className="absolute top-12 right-[65%] w-1.5 h-1.5 bg-blue-100 rounded-full" />
        </div>
      )}

      {/* 3. The Sun / Crescent Moon Rising or Shining over the Ocean Horizon */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-1000 z-0 flex items-center justify-center"
        style={{ bottom: sky.bodyBottom }}
      >
        {/* Outer Radiant Corona Glow */}
        <div className={`w-52 h-52 sm:w-96 sm:h-96 rounded-full ${sky.sunGlow} blur-3xl animate-pulse`} />

        {/* Celestial Body: Sun (Day/Dawn/Sunset) or Authentic Radiant Crescent Moon (Night) */}
        {sky.isMoon ? (
          /* Realistic Radiant Crescent Moon (মার্জিত স্নিগ্ধ জ্যোতির্ময় বাঁকা চাঁদ) */
          <div className="absolute w-14 h-14 sm:w-20 sm:h-20 transition-all duration-1000 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_0_24px_rgba(224,242,254,0.9)] filter"
            >
              <defs>
                <linearGradient id="lunarCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f0fdf4" />
                  <stop offset="85%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <filter id="lunarSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Crescent Moon Path with elegant curves and tapered tips */}
              <path
                d="M 52 8 A 40 40 0 1 0 52 88 A 33 37 0 0 1 52 8 Z"
                fill="url(#lunarCrescentGrad)"
                filter="url(#lunarSoftGlow)"
                transform="rotate(-22 52 48)"
              />
            </svg>
          </div>
        ) : (
          /* Glowing Sun for Dawn, Day, Sunset */
          <div
            className={`absolute w-14 h-14 sm:w-24 sm:h-24 rounded-full ${sky.bodyColor} ${sky.bodyShadow} transition-all duration-1000 flex items-center justify-center`}
          />
        )}
      </div>

      {/* 4. Realistic Ocean Water & Animated Horizon Waves (সমুদ্রের অপর পাশে দিগন্ত ও জলরাশি) */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none z-0 overflow-hidden">
        {/* Ocean Surface Gradient Base */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${sky.oceanGradient} transition-colors duration-1000`}
        />

        {/* Distant Misty Horizon Line / Far-off Coastline Silhouette */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent blur-[0.5px]" />
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent opacity-60" />

        {/* Shimmering Vertical Water Reflection Column */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-64 h-full bg-gradient-to-b ${sky.waterShimmer} blur-md opacity-75 animate-pulse`}
        />

        {/* Water Ripple Light Glimmers */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-[1px] bg-white/40 blur-[0.5px] animate-pulse" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-[1px] bg-white/30 blur-[0.5px] animate-pulse" />
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-[1.5px] bg-white/20 blur-[0.5px]" />

        {/* Animated Ocean Wave SVG Layer 1 */}
        <svg
          className="absolute top-0 w-[200%] h-8 sm:h-12 text-slate-900/40 animate-[wave_12s_ease-in-out_infinite_alternate]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,40 350,-30 500,20 C650,70 900,-20 1200,30 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>

        {/* Animated Ocean Wave SVG Layer 2 */}
        <svg
          className="absolute top-2 sm:top-4 w-[200%] h-10 sm:h-16 text-cyan-950/45 animate-[wave_8s_ease-in-out_infinite_alternate-reverse]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C200,70 400,-10 600,40 C800,90 1000,10 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>

        {/* Dark Vignette over water bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* 5. Top Status Badge (Evocative Ocean State - Safe from Mobile Language Button) */}
      <div className="pt-2 sm:pt-4 z-10 px-14 sm:px-4 text-center shrink-0">
        <span className="text-[10px] sm:text-[11px] font-mono px-3.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 backdrop-blur-md shadow-sm truncate max-w-full inline-block">
          {sky.statusIcon} {lang === 'bn' ? sky.statusBn : sky.statusEn}
        </span>
      </div>

      {/* 6. Center: Bismillah & Quranic Verse with Full Majestic Drop Shadows */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto text-center space-y-2.5 sm:space-y-7 px-4 relative z-10 min-h-0">
        {/* Bismillah */}
        <div className="space-y-1 sm:space-y-2">
          <h1
            className="text-xl sm:text-4xl md:text-5xl font-serif text-amber-200 tracking-wider leading-relaxed font-arabic drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            dir="rtl"
          >
            {islamicHeader.bismillahArabic}
          </h1>
          <p className="text-xs sm:text-base text-slate-100 font-light max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-normal">
            {lang === 'bn' ? islamicHeader.bismillahBn : islamicHeader.bismillahEn}
          </p>
        </div>

        {/* Divider Ornament */}
        <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent mx-auto" />

        {/* Quranic Verse */}
        {islamicHeader.quranArabic && (
          <div className="space-y-1.5 sm:space-y-3 pt-0.5 sm:pt-1">
            <p
              className="text-lg sm:text-3xl text-emerald-300 font-serif font-arabic leading-relaxed sm:leading-loose tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              dir="rtl"
            >
              &ldquo;{islamicHeader.quranArabic}&rdquo;
            </p>
            <p className="text-xs sm:text-lg text-slate-100 italic max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              &ldquo;{lang === 'bn' ? islamicHeader.quranBn : islamicHeader.quranEn}&rdquo;
            </p>
            <p className="text-[10px] sm:text-sm text-amber-300 font-mono drop-shadow">
              {lang === 'bn' ? islamicHeader.quranSurahBn : islamicHeader.quranSurahEn}
            </p>
          </div>
        )}
      </div>

      {/* 7. Bottom Area: Triple Calendar & Live Time */}
      <div className="w-full max-w-5xl mx-auto pb-2 sm:pb-4 z-20 px-1 sm:px-0 shrink-0">
        {info ? (
          <>
            {/* --- MOBILE VIEW: Clean 3-Tier Split (মোবাইলে ৩ ভাগে স্বয়ংক্রিয়ভাবে সাজানো) --- */}
            <div className="sm:hidden w-full bg-[#082f49]/95 backdrop-blur-md rounded-2xl p-2.5 border border-cyan-400/40 shadow-2xl space-y-1.5">
              {/* ভাগ ১: ইংরেজি ক্যালেন্ডার */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-cyan-500/20">
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="text-sm">🗓️</span>
                  <span>
                    {lang === 'bn'
                      ? `${info.gregorian.dayNameBn}, ${info.gregorian.bn}`
                      : `${info.gregorian.dayNameEn}, ${info.gregorian.en}`}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-200 font-mono">
                  {lang === 'bn' ? 'ইংরেজি' : 'Gregorian'}
                </span>
              </div>

              {/* ভাগ ২: ঐতিহ্যবাহী বাংলা ও হিজরী সন */}
              <div className="flex flex-col gap-0.5 text-[11.5px] font-medium py-0.5">
                <div className="flex items-center gap-1.5 text-emerald-200">
                  <span className="text-xs">🌾</span>
                  <span>{lang === 'bn' ? info.bangla.bn : info.bangla.en}</span>
                  {info.bangla.seasonBn && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                      {lang === 'bn' ? info.bangla.seasonBn : info.bangla.seasonEn}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-amber-200">
                  <span className="text-xs">🌙</span>
                  <span>{lang === 'bn' ? info.hijri.bn : info.hijri.en}</span>
                </div>
              </div>

              {/* ভাগ ৩: লাইভ সময় ও প্রহর */}
              <div className="pt-1 border-t border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[11px] text-cyan-300 font-medium">
                    {lang === 'bn' ? 'বর্তমান সময়:' : 'Current Time:'}
                  </span>
                </div>
                <div className="font-mono font-bold text-[11px] text-white bg-black/60 px-2.5 py-0.5 rounded-lg border border-cyan-400/30 shadow-inner" suppressHydrationWarning>
                  <span>{lang === 'bn' ? info.time.bn : info.time.en}</span>
                </div>
              </div>
            </div>

            {/* --- DESKTOP VIEW: Sleek Single Horizontal Bar (ডেক্সটপে এক লাইনে রাজকীয় বার) --- */}
            <div className="hidden sm:flex items-center justify-between w-full bg-[#0e7490]/95 backdrop-blur-md text-white py-2.5 px-5 rounded-2xl shadow-2xl border border-cyan-400/40 text-sm font-medium">
              <div className="flex items-center gap-3 text-cyan-50">
                {/* 1. Gregorian (ইংরেজি) */}
                <span className="font-bold text-white whitespace-nowrap">
                  {lang === 'bn'
                    ? `${info.gregorian.dayNameBn}, ${info.gregorian.bn}`
                    : `${info.gregorian.dayNameEn}, ${info.gregorian.en}`}
                </span>
                <span className="opacity-50 text-cyan-200">|</span>

                {/* 2. Bangla (বাংলা) */}
                <span className="text-emerald-200 font-semibold whitespace-nowrap">
                  {lang === 'bn' ? info.bangla.bn : info.bangla.en}
                </span>
                <span className="opacity-50 text-cyan-200">|</span>

                {/* 3. Hijri (হিজরী) */}
                <span className="text-amber-200 font-semibold whitespace-nowrap">
                  {lang === 'bn' ? info.hijri.bn : info.hijri.en}
                </span>
              </div>

              {/* 4. Live Time (সময়) */}
              <div className="shrink-0 flex items-center gap-1.5 font-mono font-bold text-white bg-black/60 px-3.5 py-1 rounded-lg border border-white/20 text-xs shadow-inner" suppressHydrationWarning>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'bn' ? info.time.bn : info.time.en}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-10 w-full max-w-md bg-white/10 rounded-2xl animate-pulse mx-auto" />
        )}
      </div>
    </section>
  );
}
