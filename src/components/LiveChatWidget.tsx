'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChatConfig, ProfileConfig } from '@/lib/types';
import { MessageSquare, X, Send, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveChatWidgetProps {
  chat: ChatConfig;
  profile: ProfileConfig;
  whatsappNumber?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function LiveChatWidget({
  chat,
  profile,
  whatsappNumber,
  isOpen,
  onToggle,
  onClose
}: LiveChatWidgetProps) {
  const { lang, t } = useLanguage();
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          contact: userContact,
          message: userMsg
        })
      });

      if (res.ok) {
        setSentSuccess(true);
        setUserMsg('');
        setUserName('');
        setUserContact('');
        setTimeout(() => {
          setSentSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to submit message to backend:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!chat.enabled) return null;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="relative px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm flex items-center gap-2.5 shadow-2xl shadow-cyan-600/40 border border-white/20 cursor-pointer"
          aria-label="Open Live Chat"
        >
          {/* Live pulsing dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>

          <MessageSquare className="w-5 h-5" />
          <span className="tracking-wide hidden sm:inline">
            {t('chatWithMe')}
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="allow-scroll fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] max-w-[370px] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.logoUrl || profile.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                    alt="Logo"
                    className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {profile.brandName || (lang === 'bn' ? profile.nameBn : profile.nameEn)}
                  </h4>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {lang === 'bn' ? 'সরাসরি ইনবক্স বার্তা' : 'Direct Inbox Message'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
              {/* Bot / Owner Greeting Bubble */}
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 mt-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-800 text-xs text-slate-200 leading-relaxed border border-slate-700">
                  {lang === 'bn' ? chat.greetingBn : chat.greetingEn}
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat Option */}
              {whatsappNumber && (
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      lang === 'bn'
                        ? 'আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট shukhbazz.info.bd থেকে নক দিচ্ছি।'
                        : 'Hello, I am reaching out from your website shukhbazz.info.bd.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 border border-emerald-400/30 transition shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>{lang === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}</span>
                  </a>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase tracking-wider">
                      {lang === 'bn' ? 'অথবা ইনবক্সে লিখুন' : 'Or send inbox note'}
                    </span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>
                </div>
              )}

              {sentSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex flex-col items-center text-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <p className="font-semibold text-sm">
                    {lang === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    {lang === 'bn'
                      ? 'আপনার মেসেজটি সরাসরি ব্যাকএন্ড ইনবক্সে সেভ হয়েছে।'
                      : 'Your message has been directly delivered to the admin inbox.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={lang === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'মোবাইল অথবা ইমেইল' : 'Phone or Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={userContact}
                      onChange={(e) => setUserContact(e.target.value)}
                      placeholder={lang === 'bn' ? '০১৭... অথবা email@...' : 'Contact info'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'আপনার বার্তা / উক্তি' : 'Your Message / Thought'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={userMsg}
                      onChange={(e) => setUserMsg(e.target.value)}
                      placeholder={lang === 'bn' ? 'এখানে বার্তা লিখুন...' : 'Write your message...'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'পাঠানো হচ্ছে...' : (lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message')}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
