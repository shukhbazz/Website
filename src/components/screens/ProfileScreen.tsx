'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileConfig, MenuItem } from '@/lib/types';
import { ArrowUpRight, Layers, BookOpen, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileScreenProps {
  profile: ProfileConfig;
  menus: MenuItem[];
  onShopClick: () => void;
}

export default function ProfileScreen({ profile, menus, onShopClick }: ProfileScreenProps) {
  const { lang } = useLanguage();

  // Initial fallback DP
  const defaultInitial =
    profile.logoUrl ||
    profile.avatarUrl ||
    (profile.avatarUrls && profile.avatarUrls[0]) ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';

  const [currentDp, setCurrentDp] = useState<string>(defaultInitial);

  // Shuffle DP on Page Refresh / Mount only (never changes merely on scroll)
  useEffect(() => {
    const pool: string[] = [];
    if (Array.isArray(profile.avatarUrls) && profile.avatarUrls.length > 0) {
      pool.push(...profile.avatarUrls.filter(Boolean));
    }
    if (profile.avatarUrl && !pool.includes(profile.avatarUrl)) {
      pool.push(profile.avatarUrl);
    }
    if (profile.logoUrl && !pool.includes(profile.logoUrl)) {
      pool.push(profile.logoUrl);
    }

    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentDp(pool[randomIndex]);
    }
  }, [profile.avatarUrls, profile.avatarUrl, profile.logoUrl]);

  const portfolioMenu = menus.find((m) => m.id === 'portfolio');
  const blogMenu = menus.find((m) => m.id === 'blog');
  const shopMenu = menus.find((m) => m.id === 'shop');

  return (
    <section className="w-full h-full relative flex flex-col justify-between items-center bg-slate-950 text-white overflow-hidden p-3 sm:p-10 landscape:p-3 landscape:px-8">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-4 landscape:h-1" />

      {/* Center: Profile Logo, Name, Title, Bio, Menus (Adaptive flex-col on portrait, flex-row on landscape) */}
      <div className="max-w-4xl mx-auto my-auto flex flex-col landscape:flex-row items-center text-center landscape:text-left space-y-4 sm:space-y-5 landscape:space-y-0 landscape:gap-8 px-3 sm:px-4">
        {/* Animated Personal Logo / Shuffled DP */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative group cursor-pointer shrink-0"
        >
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 blur-xl group-hover:opacity-75 transition-opacity" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 landscape:w-24 landscape:h-24 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-900 p-2 shadow-2xl flex items-center justify-center select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentDp}
              alt={profile.brandName || 'Shukhbazz Logo'}
              draggable={false}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
            />
            {/* Transparent Shield to prevent long-press/right-click image save */}
            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
          </div>
        </motion.div>

        {/* Info Wrapper: Name, Title, Bio, Menus */}
        <div className="flex flex-col items-center landscape:items-start space-y-2.5 landscape:space-y-1.5">
          {/* Name: সুখবাজ / Shukhbazz */}
          <div className="space-y-0.5">
            <h2 className="text-2xl sm:text-5xl landscape:text-2xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? (profile.nameBn || 'সুখবাজ').replace(/শুখবাজ/g, 'সুখবাজ') : (profile.nameEn || 'Shukhbazz')}
            </h2>
            <p className="text-xs sm:text-base landscape:text-xs font-medium text-cyan-400 flex items-center justify-center landscape:justify-start gap-1.5 pt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? profile.titleBn : profile.titleEn}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </p>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm landscape:text-xs text-slate-300 max-w-xl landscape:max-w-md leading-relaxed">
            {lang === 'bn' ? profile.bioBn : profile.bioEn}
          </p>

          {/* 3 Menus in Strict Order: পোর্টফোলিও -> ব্লগ -> সপ */}
          <div className="flex flex-wrap items-center justify-center landscape:justify-start gap-2.5 pt-2 landscape:pt-1">
            {/* 1. পোর্টফোলিও (Portfolio) */}
            <a
              href={portfolioMenu?.url || 'https://portfolio.yourdomain.bd'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-6 sm:py-2.5 landscape:px-3.5 landscape:py-1.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition shadow-md hover:scale-105 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              <span>
                {lang === 'bn'
                  ? portfolioMenu?.labelBn || 'পোর্টফলিও'
                  : portfolioMenu?.labelEn || 'Portfolio'}
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            </a>

            {/* 2. ব্লগ (Blog) */}
            <a
              href={blogMenu?.url || 'https://blog.yourdomain.bd'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-6 sm:py-2.5 landscape:px-3.5 landscape:py-1.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition shadow-md hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              <span>
                {lang === 'bn'
                  ? blogMenu?.labelBn || 'ব্লগ'
                  : blogMenu?.labelEn || 'Blog'}
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            </a>

            {/* 3. সপ (Shop - Upcoming Modal) */}
            <button
              onClick={onShopClick}
              className="px-4 py-2 sm:px-6 sm:py-2.5 landscape:px-3.5 landscape:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/40 hover:to-purple-600/40 border border-pink-500/50 hover:border-pink-400 text-pink-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition shadow-md hover:scale-105 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
              <span>
                {lang === 'bn'
                  ? shopMenu?.labelBn || 'সপ'
                  : shopMenu?.labelEn || 'Shop'}
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md bg-pink-500/30 text-pink-300 font-mono">
                {lang === 'bn' ? 'শীঘ্রই' : 'Soon'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Spacer with Mobile Chat Clearance */}
      <div className="h-16 sm:h-6 landscape:h-1" />
    </section>
  );
}
