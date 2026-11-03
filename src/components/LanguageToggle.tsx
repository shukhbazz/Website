'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="fixed top-2.5 right-2.5 sm:top-5 sm:right-6 z-50 select-none">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLang}
        className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-xl cursor-pointer transition-all active:scale-95"
        title="Toggle Language / ভাষা পরিবর্তন"
        aria-label="Toggle Language"
      >
        <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
        <span className="font-sans font-medium tracking-wide">
          <span className="inline sm:hidden">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          <span className="hidden sm:inline">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </span>
      </motion.button>
    </div>
  );
}
