'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { VisitorStats } from '@/lib/types';
import { toBnDigits } from '@/lib/calendar';
import { Users, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisitorCounter() {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<VisitorStats>({
    today: 2,
    thisWeek: 11,
    thisMonth: 32,
    total: 44
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Record visit on page load
    async function trackVisit() {
      try {
        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'record' })
        });
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Could not record visitor count:', err);
      } finally {
        setLoading(false);
      }
    }
    trackVisit();
  }, []);

  const formatNum = (num: number) => {
    return lang === 'bn' ? toBnDigits(num) : String(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto my-8 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-indigo-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              {t('liveCounter')}
              <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE
              </span>
            </h4>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'bn' ? 'রিয়েলটাইম ট্র্যাকিং সক্রিয়' : 'Real-time tracking active'}</span>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Day */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 transition-all text-center group">
          <span className="text-xs text-slate-400 font-medium block mb-1 group-hover:text-cyan-300 transition-colors">
            {t('day')}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tracking-tight">
            {formatNum(stats.today)}
          </span>
        </div>

        {/* Week */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 transition-all text-center group">
          <span className="text-xs text-slate-400 font-medium block mb-1 group-hover:text-indigo-300 transition-colors">
            {t('week')}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-300 tracking-tight">
            {formatNum(stats.thisWeek)}
          </span>
        </div>

        {/* Month */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 transition-all text-center group">
          <span className="text-xs text-slate-400 font-medium block mb-1 group-hover:text-purple-300 transition-colors">
            {t('month')}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-purple-300 tracking-tight">
            {formatNum(stats.thisMonth)}
          </span>
        </div>

        {/* Total */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-center relative overflow-hidden group">
          <div className="absolute top-1 right-1 opacity-20 group-hover:opacity-60 transition-opacity">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <span className="text-xs text-indigo-200 font-medium block mb-1">
            {t('total')}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            {formatNum(stats.total)}
          </span>
        </div>
      </div>

      {/* Example format subtitle: "দিন-২, সপ্তাহ-১১, মাস-৩২ টোটাল-৪৪" */}
      <div className="mt-3 text-center text-xs text-slate-400 font-mono tracking-wide">
        &ldquo;{t('day')}-{formatNum(stats.today)}, {t('week')}-{formatNum(stats.thisWeek)}, {t('month')}-{formatNum(stats.thisMonth)} {t('total')}-{formatNum(stats.total)}&rdquo;
      </div>
    </motion.div>
  );
}
