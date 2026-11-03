'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GalleryItem } from '@/lib/types';
import { toBnDigits } from '@/lib/calendar';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface GalleryScreenProps {
  item: GalleryItem;
  index: number;
  total: number;
}

export default function GalleryScreen({ item, index, total }: GalleryScreenProps) {
  const { lang, t } = useLanguage();

  const title = lang === 'bn' ? item.titleBn : item.titleEn;
  const desc = lang === 'bn' ? item.descBn : item.descEn;
  const category = lang === 'bn' ? item.categoryBn : item.categoryEn;

  // Harmonized picture-based accent color
  const fallbackColors = ['#60a5fa', '#2dd4bf', '#c084fc', '#f43f5e', '#fb923c'];
  const accent = item.accentColor || fallbackColors[index % fallbackColors.length];

  const pageNumStr = lang === 'bn'
    ? `স্মৃতি ${toBnDigits(index + 1)} / ${toBnDigits(total)}`
    : `Moment ${index + 1} of ${total}`;

  return (
    <section className="w-full h-screen h-[100dvh] min-h-[100dvh] relative flex flex-col justify-between items-center bg-slate-950 text-white overflow-hidden p-3 sm:p-8">
      {/* Background ambient lighting matching the photo's palette */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ backgroundColor: `${accent}22` }}
      />

      {/* TOP: Headline and Category (হেডলাইনটা ওপরে দেখাবে - Safe from Mobile Language Button) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-2 space-y-1.5 pr-14 sm:pr-0"
      >
        <div className="flex items-center justify-between w-full pb-1">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md"
            style={{
              backgroundColor: `${accent}18`,
              border: `1px solid ${accent}40`,
              color: accent
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{category || t('galleryTitle')}</span>
          </div>

          <span className="text-xs px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
            {pageNumStr}
          </span>
        </div>

        {/* The Main Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
      </motion.div>

      {/* CENTER: Full Image Showcase (ফুল আকারে দেখাবে with Picture-Harmonized Border Glow) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl my-auto flex items-center justify-center"
      >
        <div
          className="relative w-full max-h-[50vh] sm:max-h-[55vh] aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl group transition-all duration-500"
          style={{
            border: `2px solid ${accent}50`,
            boxShadow: `0 20px 50px -10px ${accent}25`
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={title}
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none"
          />
          {/* Transparent Protection Shield to prevent contextmenu / save image on touch or mouse */}
          <div className="absolute inset-0 z-10 select-none" onContextMenu={(e) => e.preventDefault()} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* BOTTOM: Description Details + Scroll Hint (সেটার বিস্তারিত গুলো নিচে দেখাবে) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-3 pb-2">
        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-200 leading-relaxed p-3.5 rounded-2xl backdrop-blur-md shadow-md"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: `1px solid ${accent}30`
            }}
          >
            {desc}
          </motion.p>
        )}

      </div>

      {/* Bottom Spacer */}
      <div className="h-4" />
    </section>
  );
}
