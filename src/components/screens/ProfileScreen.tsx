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
    <section className="w-full h-screen h-[100dvh] min-h-[100dvh] relative flex flex-col justify-between items-center bg-slate-950 text-white overflow-hidden p-3 sm:p-10">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-4" />

      {/* Center: Profile Logo, Name, Title, Bio, Menus */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto my-auto flex flex-col items-center text-center space-y-5 px-4"
      >
        {/* Animated Personal Logo / Shuffled DP */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 blur-xl group-hover:opacity-75 transition-opacity" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-900 p-2 shadow-2xl flex items-center justify-center select-none">
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

        {/* Name: শুকবাজ / Shukhbazz */}
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? profile.nameBn : profile.nameEn}
          </h2>
          <p className="text-sm sm:text-base font-medium text-cyan-400 flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'bn' ? profile.titleBn : profile.titleEn}</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {lang === 'bn' ? profile.bioBn : profile.bioEn}
        </p>

        {/* 3 Menus in Strict Order: পোর্টফোলিও -> ব্লগ -> সপ */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          {/* 1. পোর্টফোলিও (Portfolio) */}
          <a
            href={portfolioMenu?.url || 'https://portfolio.yourdomain.bd'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-md hover:scale-105 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'bn'
                ? portfolioMenu?.labelBn || 'পোর্টফলিও'
                : portfolioMenu?.labelEn || 'Portfolio'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* 2. ব্লগ (Blog) */}
          <a
            href={blogMenu?.url || 'https://blog.yourdomain.bd'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-md hover:scale-105 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'bn'
                ? blogMenu?.labelBn || 'ব্লগ'
                : blogMenu?.labelEn || 'Blog'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* 3. সপ (Shop - Upcoming Modal) */}
          <button
            onClick={onShopClick}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/40 hover:to-purple-600/40 border border-pink-500/50 hover:border-pink-400 text-pink-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-md hover:scale-105 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            <span>
              {lang === 'bn'
                ? shopMenu?.labelBn || 'সপ'
                : shopMenu?.labelEn || 'Shop'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-500/30 text-pink-300 font-mono">
              {lang === 'bn' ? 'শীঘ্রই' : 'Soon'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Bottom Spacer */}
      <div className="h-6" />
    </section>
  );
}
