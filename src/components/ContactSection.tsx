'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ContactConfig } from '@/lib/types';
import {
  Mail,
  Phone,
  Copy,
  Check,
  Send,
  Sparkles
} from 'lucide-react';
import {
  FacebookIcon,
  YouTubeIcon,
  WhatsAppIcon,
  InstagramIcon,
  TwitterXIcon,
  ThreadsIcon,
  LinkedInIcon,
  GitHubIcon,
  TelegramIcon
} from './Icons';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  contacts: ContactConfig;
  onOpenChat: () => void;
}

export default function ContactSection({ contacts, onOpenChat }: ContactSectionProps) {
  const { lang, t } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');

  const socialLinks = [
    {
      name: 'Facebook',
      url: contacts.facebookUrl,
      icon: FacebookIcon,
      bgColor: 'bg-blue-600 hover:bg-blue-500',
    },
    {
      name: 'YouTube',
      url: contacts.youtubeUrl,
      icon: YouTubeIcon,
      bgColor: 'bg-red-600 hover:bg-red-500',
    },
    {
      name: 'WhatsApp',
      url: contacts.whatsappNumber
        ? `https://wa.me/${cleanPhone(contacts.whatsappNumber)}`
        : undefined,
      icon: WhatsAppIcon,
      bgColor: 'bg-emerald-600 hover:bg-emerald-500',
    },
    {
      name: 'Instagram',
      url: contacts.instagramUrl,
      icon: InstagramIcon,
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90',
    },
    {
      name: 'X (Twitter)',
      url: contacts.twitterUrl,
      icon: TwitterXIcon,
      bgColor: 'bg-slate-800 hover:bg-slate-700',
    },
    {
      name: 'Threads',
      url: contacts.threadsUrl,
      icon: ThreadsIcon,
      bgColor: 'bg-slate-800 hover:bg-slate-700',
    },
    {
      name: 'LinkedIn',
      url: contacts.linkedinUrl,
      icon: LinkedInIcon,
      bgColor: 'bg-blue-700 hover:bg-blue-600',
    },
    {
      name: 'GitHub',
      url: contacts.githubUrl,
      icon: GitHubIcon,
      bgColor: 'bg-slate-800 hover:bg-slate-700',
    },
    {
      name: 'Telegram',
      url: contacts.telegramUrl,
      icon: TelegramIcon,
      bgColor: 'bg-cyan-600 hover:bg-cyan-500',
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 relative bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('quickContact')}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'সোশ্যাল মিডিয়া ও যোগাযোগের মাধ্যম' : 'Connect on Social Media'}
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            {lang === 'bn'
              ? 'আমার সাথে যুক্ত থাকতে বা যেকোনো বার্তা পাঠাতে নিচের যেকোনো মাধ্যমে কানেক্ট হতে পারেন'
              : 'Feel free to connect or follow along across preferred platforms below'}
          </p>
        </motion.div>

        {/* 1. Rounded Squircle Social Media Grid (as per user reference image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {socialLinks.map(
              (item) =>
                item.url && (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${item.bgColor} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-200 group relative`}
                    title={item.name}
                  >
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    <span className="absolute -bottom-8 px-2 py-0.5 rounded bg-slate-950 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">
                      {item.name}
                    </span>
                  </a>
                )
            )}
          </div>
        </motion.div>

        {/* 2. Direct Contact Cards: WhatsApp, Email, Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp Direct */}
          {contacts.whatsappNumber && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  WHATSAPP
                </span>
                <button
                  onClick={() => handleCopy(contacts.whatsappNumber, 'wa')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy"
                >
                  {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-bold text-white mb-4 font-mono truncate">
                {contacts.whatsappNumber}
              </p>
              <a
                href={`https://wa.me/${cleanPhone(contacts.whatsappNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('sendWhatsApp')}</span>
              </a>
            </div>
          )}

          {/* Email Direct */}
          {contacts.email && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  EMAIL
                </span>
                <button
                  onClick={() => handleCopy(contacts.email, 'email')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-bold text-white mb-4 font-mono truncate">
                {contacts.email}
              </p>
              <a
                href={`mailto:${contacts.email}`}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'মেইল পাঠান' : 'Send Mail'}</span>
              </a>
            </div>
          )}

          {/* Phone Direct */}
          {contacts.phone && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  PHONE
                </span>
                <button
                  onClick={() => handleCopy(contacts.phone, 'phone')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy"
                >
                  {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-bold text-white mb-4 font-mono truncate">
                {contacts.phone}
              </p>
              <a
                href={`tel:${cleanPhone(contacts.phone)}`}
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call Now'}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
