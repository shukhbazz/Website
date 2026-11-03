'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="fixed top-5 right-5 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLang}
        className="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-xl cursor-pointer transition-all"
        title="Toggle Language"
        aria-label="Toggle Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-sans tracking-wide">
          {lang === 'bn' ? 'English' : 'বাংলা'}
        </span>
      </motion.button>
    </div>
  );
}
