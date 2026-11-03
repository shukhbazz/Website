'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { QuoteItem } from '@/lib/types';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuotesSectionProps {
  quotes: QuoteItem[];
}

export default function QuotesSection({ quotes }: QuotesSectionProps) {
  const { lang, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate quotes every 7 seconds if not paused
  useEffect(() => {
    if (quotes.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [quotes.length, isPaused]);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex] || quotes[0];
  const quoteText = lang === 'bn' ? currentQuote.textBn : currentQuote.textEn;
  const authorText = lang === 'bn' ? currentQuote.authorBn : currentQuote.authorEn;
  const categoryText = lang === 'bn' ? currentQuote.categoryBn : currentQuote.categoryEn;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Feather className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('quotesTitle')}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'আমার কিছু নিজস্ব ভাবনা ও বাণী' : 'Reflections, Thoughts & Words'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t('quotesSubtitle')}
          </p>
        </div>

        {/* Next-Level Animated Card Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative min-h-[340px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 group"
        >
          {/* Animated Background Image with smooth crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id + currentQuote.bgImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.28, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage: `url(${currentQuote.bgImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'})`
              }}
            />
          </AnimatePresence>

          {/* Dark gradient overlay for extreme legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950/95 pointer-events-none" />

          {/* Ambient glowing orbs */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar of Card: Category Tag & Quote Icon */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-cyan-400 shadow-md">
              <Quote className="w-6 h-6 rotate-180" />
            </div>

            {categoryText && (
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-cyan-300 border border-cyan-500/30 font-medium">
                {categoryText}
              </span>
            )}
          </div>

          {/* Middle: The Quote Text with Smooth Animation */}
          <div className="relative z-10 my-auto py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote.id + lang}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium text-white leading-relaxed sm:leading-loose tracking-wide font-sans">
                  &ldquo;{quoteText}&rdquo;
                </blockquote>

                {authorText && (
                  <p className="text-sm sm:text-base font-semibold text-cyan-400 text-right italic font-mono">
                    {authorText}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar: Navigation Controls & Progress Dots */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {quotes.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-cyan-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to quote ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/60"
                title={t('prevQuote')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/60"
                title={t('nextQuote')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
