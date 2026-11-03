'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GalleryItem } from '@/lib/types';
import { Image as ImageIcon, Sparkles, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const { lang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-950/70 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>{t('galleryTitle')}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'মুহূর্ত, স্মৃতি ও রূপকল্প' : 'Visual Moments & Reflections'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t('gallerySubtitle')}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, index) => {
            const title = lang === 'bn' ? item.titleBn : item.titleEn;
            const desc = lang === 'bn' ? item.descBn : item.descEn;
            const category = lang === 'bn' ? item.categoryBn : item.categoryEn;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedImage(item)}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Pill */}
                  {category && (
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[11px] font-medium text-cyan-300 backdrop-blur-md">
                      {category}
                    </div>
                  )}

                  {/* Expand icon */}
                  <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-950/70 text-white/70 group-hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                      {title}
                    </h4>
                    {desc && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 z-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.imageUrl}
                  alt={lang === 'bn' ? selectedImage.titleBn : selectedImage.titleEn}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white mb-1">
                  {lang === 'bn' ? selectedImage.titleBn : selectedImage.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {lang === 'bn' ? selectedImage.descBn : selectedImage.descEn}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
