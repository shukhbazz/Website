'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getTripleCalendarInfo } from '@/lib/calendar';
import { Calendar, Clock, Moon, Sparkles, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarTimeWidget() {
  const { lang, t } = useLanguage();
  const [info, setInfo] = useState<ReturnType<typeof getTripleCalendarInfo> | null>(null);

  useEffect(() => {
    setInfo(getTripleCalendarInfo());
    // Live clock update every 1 second
    const timer = setInterval(() => {
      setInfo(getTripleCalendarInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!info) {
    return (
      <div className="w-full py-4 px-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 animate-pulse h-28" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-indigo-500/30 p-5 shadow-2xl backdrop-blur-xl"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & Live Clock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {t('liveTime')}
          </span>
        </div>

        {/* Live Clock Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-400/30 text-cyan-300 font-mono text-sm sm:text-base font-semibold shadow-inner shadow-cyan-950/40">
          <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{lang === 'bn' ? info.time.bn : info.time.en}</span>
        </div>
      </div>

      {/* Triple Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
        {/* 1. English / Gregorian Calendar */}
        <div className="group relative p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/40 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {t('gregorianCal')}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 font-medium border border-cyan-800/40">
              {lang === 'bn' ? info.gregorian.dayNameBn : info.gregorian.dayNameEn}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
            {lang === 'bn' ? info.gregorian.bn : info.gregorian.en}
          </p>
        </div>

        {/* 2. Bangla Calendar */}
        <div className="group relative p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-emerald-500/40 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {t('banglaCal')}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-medium border border-emerald-800/40">
              {lang === 'bn' ? info.bangla.seasonBn : info.bangla.seasonEn}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-300 tracking-wide group-hover:text-emerald-200 transition-colors font-sans">
            {lang === 'bn' ? info.bangla.bn : info.bangla.en}
          </p>
        </div>

        {/* 3. Hijri / Arabic Calendar */}
        <div className="group relative p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-purple-500/40 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              {t('hijriCal')}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 font-medium border border-purple-800/40">
              {lang === 'bn' ? 'হিজরী সন' : 'Hijri'}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-purple-200 tracking-wide group-hover:text-purple-100 transition-colors">
            {lang === 'bn' ? info.hijri.bn : info.hijri.en}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
