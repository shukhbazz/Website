'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ContactConfig, ProfileConfig } from '@/lib/types';
import { QrCode, X, Copy, Check, Share2, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileConfig;
  contacts: ContactConfig;
}

export default function QRCodeModal({ isOpen, onClose, profile, contacts }: QRCodeModalProps) {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // We can generate a QR code pointing to WhatsApp or current website url
  const qrTarget = contacts.whatsappNumber
    ? `https://wa.me/${contacts.whatsappNumber.replace(/[^0-9+]/g, '')}`
    : typeof window !== 'undefined' ? window.location.href : 'https://yourdomain.bd';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrTarget)}&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 text-center shadow-2xl z-10 overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {t('qrCodeTitle')}
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            {t('qrCodeSubtitle')}
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl mx-auto w-fit shadow-lg shadow-cyan-500/20 mb-4 border-2 border-cyan-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt="Contact QR Code"
              className="w-48 h-48 rounded-lg object-contain"
            />
          </div>

          <p className="text-[11px] text-slate-400 mb-4 truncate font-mono">
            {qrTarget}
          </p>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('copied') : (lang === 'bn' ? 'কন্টাক্ট লিংক কপি করুন' : 'Copy Contact Link')}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
