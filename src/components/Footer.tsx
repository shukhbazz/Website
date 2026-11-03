'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileConfig, ContactConfig, VisitorStats } from '@/lib/types';
import { toBnDigits } from '@/lib/calendar';
import { ShieldCheck, Activity } from 'lucide-react';
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

interface FooterProps {
  profile: ProfileConfig;
  contacts: ContactConfig;
}

export default function Footer({ profile, contacts }: FooterProps) {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<VisitorStats>({
    today: 2,
    thisWeek: 11,
    thisMonth: 32,
    total: 44
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/visitors', { cache: 'no-store' });
        const data = await res.json();
        if (data) setStats(data);
      } catch (err) {
        console.warn('Could not fetch stats:', err);
      }
    }
    loadStats();
  }, []);

  const formatNum = (num: number) => {
    return lang === 'bn' ? toBnDigits(num) : String(num);
  };

  const brandName = profile.brandName || 'Shukhbazz';

  const cleanPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');

  const miniSocials = [
    { url: contacts.facebookUrl, icon: FacebookIcon, label: 'Facebook' },
    { url: contacts.youtubeUrl, icon: YouTubeIcon, label: 'YouTube' },
    {
      url: contacts.whatsappNumber ? `https://wa.me/${cleanPhone(contacts.whatsappNumber)}` : undefined,
      icon: WhatsAppIcon,
      label: 'WhatsApp'
    },
    { url: contacts.instagramUrl, icon: InstagramIcon, label: 'Instagram' },
    { url: contacts.twitterUrl, icon: TwitterXIcon, label: 'X' },
    { url: contacts.threadsUrl, icon: ThreadsIcon, label: 'Threads' },
    { url: contacts.linkedinUrl, icon: LinkedInIcon, label: 'LinkedIn' },
    { url: contacts.githubUrl, icon: GitHubIcon, label: 'GitHub' },
    { url: contacts.telegramUrl, icon: TelegramIcon, label: 'Telegram' },
  ];

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-8 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-6">
        {/* Compact Visitor Counter (Clean Minimal Strip as requested) */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono shadow-sm">
          <span className="flex items-center gap-1.5 text-emerald-400 font-sans font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'লাইভ ভিজিটর:' : 'Live Visitors:'}</span>
          </span>

          <span className="text-slate-200">
            {t('day')}-{formatNum(stats.today)}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200">
            {t('week')}-{formatNum(stats.thisWeek)}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200">
            {t('month')}-{formatNum(stats.thisMonth)}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">
            {t('total')}-{formatNum(stats.total)}
          </span>
        </div>

        {/* Small Social Icon Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {miniSocials.map(
            (s) =>
              s.url && (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  title={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              )
          )}
        </div>

        {/* Bottom Line: Copyright (ALWAYS in English as requested) & Admin Link */}
        <div className="pt-4 border-t border-slate-900 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Copyright &copy; 2026 {brandName}. All rights reserved.
          </div>

          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('adminLogin')}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
