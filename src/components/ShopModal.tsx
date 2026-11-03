'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag, Sparkles, X, Bell, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageBn?: string;
  messageEn?: string;
}

export default function ShopModal({ isOpen, onClose, messageBn, messageEn }: ShopModalProps) {
  const { lang, t } = useLanguage();
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');

  if (!isOpen) return null;

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="allow-scroll relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Glowing accent circles */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                UPCOMING
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t('shopModalTitle')}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {lang === 'bn'
                ? (messageBn || t('shopModalDesc'))
                : (messageEn || t('shopModalDesc'))}
            </p>

            {/* Newsletter or Notify when launched */}
            {subscribed ? (
              <div className="w-full py-3 px-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'ধন্যবাদ! শপ চালু হলেই আপনাকে জানানো হবে।' : 'Thank you! We will notify you once launched.'}</span>
              </div>
            ) : (
              <form onSubmit={handleNotifyMe} className="w-full flex flex-col gap-2.5 mb-5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={lang === 'bn' ? 'আপনার ইমেইল দিন (নোটিফিকেশনের জন্য)' : 'Enter email for launch alert'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-indigo-400/30 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'উদ্বোধনের নোটিফিকেশন পান' : 'Get Launch Alert'}</span>
                </button>
              </form>
            )}

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline cursor-pointer"
            >
              {t('close')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
