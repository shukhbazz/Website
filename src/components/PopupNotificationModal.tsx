'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PopupNotificationConfig } from '@/lib/types';
import { Bell, X, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PopupNotificationModalProps {
  popupConfig?: PopupNotificationConfig;
}

export default function PopupNotificationModal({ popupConfig }: PopupNotificationModalProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!popupConfig || !popupConfig.enabled) {
      setIsOpen(false);
      return;
    }

    if (popupConfig.showOncePerSession) {
      const dismissed = sessionStorage.getItem('popup_notice_dismissed');
      if (dismissed === 'true') {
        return;
      }
    }

    // Small delay (700ms) after landing for buttery smooth entrance
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [popupConfig]);

  if (!popupConfig || !popupConfig.enabled || !isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (popupConfig.showOncePerSession) {
      sessionStorage.setItem('popup_notice_dismissed', 'true');
    }
  };

  const title = lang === 'bn' ? popupConfig.titleBn : popupConfig.titleEn;
  const message = lang === 'bn' ? popupConfig.messageBn : popupConfig.messageEn;
  const buttonText =
    lang === 'bn'
      ? popupConfig.buttonTextBn || 'ঠিক আছে'
      : popupConfig.buttonTextEn || 'Got It';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="allow-scroll relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900/95 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl z-10 text-white backdrop-blur-xl max-h-[90vh] overflow-y-auto"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-10"
            aria-label="Close Notice"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/20">
              {lang === 'bn' ? 'জরুরি নোটিশ / ঘোষণা' : 'Notice / Announcement'}
            </span>
          </div>

          {/* Optional Banner Image */}
          {popupConfig.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-slate-700 max-h-52 bg-slate-950 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={popupConfig.imageUrl}
                alt={title || 'Notice Image'}
                draggable={false}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            {popupConfig.buttonUrl ? (
              <a
                href={popupConfig.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                <span>{buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                {buttonText}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
