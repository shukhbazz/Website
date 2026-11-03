'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileConfig, MenuItem } from '@/lib/types';
import { ArrowUpRight, MessageCircle, Layers, BookOpen, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroSectionProps {
  profile: ProfileConfig;
  menus: MenuItem[];
  onOpenChat: () => void;
}

export default function HeroSection({ profile, menus, onOpenChat }: HeroSectionProps) {
  const { lang, t } = useLanguage();

  const portfolioMenu = menus.find((m) => m.id === 'portfolio');
  const blogMenu = menus.find((m) => m.id === 'blog');

  // Dynamic Scroll-Linked Logo Animation:
  // As the visitor scrolls down, the logo animates between left, right, up, down, and scales gracefully!
  const { scrollYProgress } = useScroll();
  const logoX = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 60, -60, 40, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -25, 20, -15, 0]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 10, -10, 0]);

  return (
    <section className="relative pt-16 sm:pt-24 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge */}
          {profile.availableForWork && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-semibold mb-8 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'bn' ? profile.statusBn : profile.statusEn}</span>
            </motion.div>
          )}

          {/* Dynamic Scroll-Animated Personal Logo */}
          <motion.div
            style={{ x: logoX, y: logoY, rotate: logoRotate }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative mb-8 cursor-pointer group"
          >
            {/* Glow halo */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 blur-xl group-hover:opacity-80 transition-opacity duration-500" />

            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-900 p-2 shadow-2xl flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  profile.logoUrl ||
                  profile.avatarUrl ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
                }
                alt="Personal Logo"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Name & Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3"
          >
            {lang === 'bn' ? profile.nameBn : profile.nameEn}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-base sm:text-xl font-medium text-cyan-400 mb-6 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'bn' ? profile.titleBn : profile.titleEn}</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </motion.h2>

          {/* Personal Thoughtful Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8"
          >
            {lang === 'bn' ? profile.bioBn : profile.bioEn}
          </motion.p>

          {/* Action Buttons: Chat, Portfolio redirect, Blog redirect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            {/* Live Message / Chat Trigger */}
            <button
              onClick={onOpenChat}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('chatWithMe')}</span>
            </button>

            {/* Portfolio Subdomain Link */}
            {portfolioMenu && portfolioMenu.enabled && (
              <a
                href={portfolioMenu.url || '#'}
                target={portfolioMenu.isExternal ? '_blank' : '_self'}
                rel={portfolioMenu.isExternal ? 'noopener noreferrer' : undefined}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all group shadow-sm hover:scale-105"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? portfolioMenu.labelBn : portfolioMenu.labelEn}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            )}

            {/* Blog Subdomain Link */}
            {blogMenu && blogMenu.enabled && (
              <a
                href={blogMenu.url || '#'}
                target={blogMenu.isExternal ? '_blank' : '_self'}
                rel={blogMenu.isExternal ? 'noopener noreferrer' : undefined}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-400 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all group shadow-sm hover:scale-105"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{lang === 'bn' ? blogMenu.labelBn : blogMenu.labelEn}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
