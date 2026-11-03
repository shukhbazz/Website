'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ContactConfig, ProfileConfig, VisitorStats, CustomContactLink } from '@/lib/types';
import { toBnDigits } from '@/lib/calendar';
import {
  Sparkles,
  Activity,
  Phone,
  Mail,
  Check,
  Copy,
  Globe,
  ArrowUpRight
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
} from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactScreenProps {
  contacts: ContactConfig;
  profile: ProfileConfig;
}

export default function ContactScreen({ contacts, profile }: ContactScreenProps) {
  const { lang, t } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredGlow, setHoveredGlow] = useState<string>('rgba(6, 182, 212, 0.15)');
  const [stats, setStats] = useState<VisitorStats>({
    today: 2,
    thisWeek: 11,
    thisMonth: 32,
    total: 44
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/visitors');
        const data = await res.json();
        if (data) setStats(data);
      } catch (err) {
        console.warn('Could not load stats:', err);
      }
    }
    loadStats();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');
  const formatNum = (num: number) => (lang === 'bn' ? toBnDigits(num) : String(num));

  const enabledSocials = contacts.enabledSocials || {};

  // Standard platform items
  interface SatelliteItem {
    id: string;
    name: string;
    url: string;
    icon?: (({ className }: { className?: string }) => React.JSX.Element) | null;
    customIconUrl?: string;
    bgColor: string;
    glow: string;
    enabled: boolean;
  }

  const standardPlatforms: SatelliteItem[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      url: contacts.facebookUrl,
      icon: FacebookIcon,
      bgColor: 'bg-blue-600',
      glow: 'rgba(37, 99, 235, 0.5)',
      enabled: enabledSocials.facebook !== false
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: contacts.youtubeUrl,
      icon: YouTubeIcon,
      bgColor: 'bg-red-600',
      glow: 'rgba(220, 38, 38, 0.5)',
      enabled: enabledSocials.youtube !== false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: contacts.whatsappNumber ? `https://wa.me/${cleanPhone(contacts.whatsappNumber)}` : '',
      icon: WhatsAppIcon,
      bgColor: 'bg-emerald-600',
      glow: 'rgba(16, 185, 129, 0.5)',
      enabled: enabledSocials.whatsapp !== false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: contacts.instagramUrl,
      icon: InstagramIcon,
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      glow: 'rgba(236, 72, 153, 0.5)',
      enabled: enabledSocials.instagram !== false
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: contacts.twitterUrl,
      icon: TwitterXIcon,
      bgColor: 'bg-slate-800',
      glow: 'rgba(148, 163, 184, 0.4)',
      enabled: enabledSocials.twitter !== false
    },
    {
      id: 'threads',
      name: 'Threads',
      url: contacts.threadsUrl,
      icon: ThreadsIcon,
      bgColor: 'bg-slate-800',
      glow: 'rgba(148, 163, 184, 0.4)',
      enabled: enabledSocials.threads !== false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: contacts.linkedinUrl,
      icon: LinkedInIcon,
      bgColor: 'bg-blue-700',
      glow: 'rgba(29, 78, 216, 0.5)',
      enabled: enabledSocials.linkedin !== false
    },
    {
      id: 'github',
      name: 'GitHub',
      url: contacts.githubUrl,
      icon: GitHubIcon,
      bgColor: 'bg-slate-800',
      glow: 'rgba(148, 163, 184, 0.4)',
      enabled: enabledSocials.github !== false
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: contacts.telegramUrl,
      icon: TelegramIcon,
      bgColor: 'bg-cyan-600',
      glow: 'rgba(6, 182, 212, 0.5)',
      enabled: enabledSocials.telegram !== false
    },
  ];

  // Filter only enabled and non-blank items
  const activeStandard: SatelliteItem[] = standardPlatforms.filter(
    (item) => item.enabled && item.url && item.url.trim() !== ''
  );

  const activeCustom: SatelliteItem[] = (contacts.customLinks || [])
    .filter((item) => item.enabled && item.url && item.url.trim() !== '')
    .map((c) => ({
      id: c.id,
      name: c.name,
      url: c.url,
      icon: null,
      customIconUrl: c.iconUrl,
      bgColor: c.bgColor || 'bg-slate-800',
      glow: 'rgba(6, 182, 212, 0.5)',
      enabled: true
    }));

  const allSatellites: SatelliteItem[] = [...activeStandard, ...activeCustom];
  const totalCount = allSatellites.length;

  const primaryPhone = contacts.phone || contacts.whatsappNumber;

  // Center logo picture
  const centerLogo =
    profile.logoUrl ||
    profile.avatarUrl ||
    (profile.avatarUrls && profile.avatarUrls[0]) ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';

  return (
    <section className="w-full h-screen h-[100dvh] min-h-[100dvh] relative flex flex-col justify-between items-center bg-[#020617] text-white overflow-hidden p-3 sm:p-6">
      {/* 0. Deep Galaxy Space Background Layer with Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=80"
          alt="Cosmic Galaxy Background"
          className="w-full h-full object-cover object-center opacity-35 select-none scale-105"
        />
        {/* Gradient overlays for perfect contrast and deep cosmic feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/65 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#020617]/40 to-[#020617]" />
      </div>

      {/* 1. Dynamic Reactive Nebula Glow (Blooms to the hovered platform's color) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[420px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-60 z-0"
        style={{ backgroundColor: hoveredGlow }}
      />

      {/* 2. Top Header (Instructional subtitle removed per user request - Safe from Mobile Language Button) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        className="text-center pt-2 sm:pt-3 z-10 px-14 sm:px-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'কানেকশন হাব ও সোশ্যাল গ্যালাক্সি' : 'Connection Hub & Orbit'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          {lang === 'bn' ? 'সোশ্যাল মিডিয়া ও যোগাযোগের মাধ্যম' : 'Social Media & Connections'}
        </h2>
      </motion.div>

      {/* 3. CENTERPIECE: 3D Celestial Orbit Constellation Hub (Sleek, Compact, Zero Overlap) */}
      <div className="relative w-full max-w-2xl my-auto flex items-center justify-center h-[280px] sm:h-[340px] select-none z-10">
        {/* Orbital Concentric Ring 1 (Inner Glowing Dashed Orbit) */}
        <div className="absolute w-[200px] h-[120px] sm:w-[310px] sm:h-[185px] rounded-[50%] border border-cyan-500/25 border-dashed pointer-events-none animate-[spin_120s_linear_infinite]" />

        {/* Orbital Concentric Ring 2 (Outer Cosmic Orbit Ellipse) */}
        <div className="absolute w-[265px] h-[160px] sm:w-[400px] sm:h-[240px] rounded-[50%] border border-indigo-500/30 pointer-events-none shadow-[0_0_40px_rgba(99,102,241,0.12)]" />

        {/* SVG Constellation Ray Lines connecting the Nucleus to each orbiting satellite */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {allSatellites.map((_, idx) => {
            const angle = (idx / totalCount) * 2 * Math.PI - Math.PI / 2;
            return (
              <line
                key={idx}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${Math.cos(angle) * 80}px)`}
                y2={`calc(50% + ${Math.sin(angle) * 50}px)`}
                stroke="url(#rayGrad)"
                strokeWidth="1"
                strokeDasharray="3 3"
                className="opacity-40"
              />
            );
          })}
        </svg>

        {/* THE NUCLEUS: Central Core with Personal Logo & Pulsing Aura */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              '0 0 25px rgba(6, 182, 212, 0.3)',
              '0 0 45px rgba(6, 182, 212, 0.55)',
              '0 0 25px rgba(6, 182, 212, 0.3)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-cyan-400 p-1 shadow-2xl flex flex-col items-center justify-center cursor-default group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={centerLogo}
            alt={profile.brandName || 'Shukhbazz'}
            draggable={false}
            className="w-full h-full object-cover rounded-xl sm:rounded-2xl select-none pointer-events-none"
          />
          {/* Subtle Live Status Indicator */}
          <span className="absolute -bottom-2.5 px-2 py-0.5 rounded-full bg-slate-950 text-[9px] sm:text-[10px] text-cyan-300 font-mono border border-cyan-400/50 shadow whitespace-nowrap">
            {profile.brandName || 'Shukhbazz'}
          </span>
        </motion.div>

        {/* THE ORBITING SATELLITES (Planetary Social Nodes - Compact & Sleek) */}
        {allSatellites.map((sat, idx) => {
          // Angle in radians around ellipse
          const angle = (idx / totalCount) * 2 * Math.PI - Math.PI / 2;

          // Elliptical coordinates with optimized radii so it never overlaps header or footer
          const floatDelay = idx * 0.4;
          const isHovered = hoveredId === sat.id;

          return (
            <div
              key={sat.id}
              className="absolute z-20"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                marginLeft: `calc(cos(${angle}rad) * min(190px, 34vw))`,
                marginTop: `calc(sin(${angle}rad) * min(110px, 15vh))`
              }}
            >
              {/* Planetary Floating Sine wave */}
              <motion.div
                animate={{
                  y: [-4, 4, -4],
                  x: [-2, 2, -2]
                }}
                transition={{
                  duration: 4.5 + (idx % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: floatDelay
                }}
              >
                <motion.a
                  href={sat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.25, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => {
                    setHoveredId(sat.id);
                    setHoveredGlow(sat.glow);
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setHoveredGlow('rgba(6, 182, 212, 0.15)');
                  }}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${sat.bgColor} text-white flex items-center justify-center shadow-xl border border-white/20 relative group cursor-pointer transition-all duration-300`}
                  style={{
                    boxShadow: isHovered
                      ? `0 0 25px ${sat.glow}, 0 8px 20px rgba(0,0,0,0.5)`
                      : '0 6px 15px rgba(0,0,0,0.4)'
                  }}
                  title={sat.name}
                >
                  {/* Satellites Icon */}
                  {sat.customIconUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={sat.customIconUrl}
                      alt={sat.name}
                      draggable={false}
                      className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 object-contain rounded select-none pointer-events-none"
                    />
                  ) : sat.icon ? (
                    <sat.icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
                  ) : (
                    <Globe className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-cyan-300" />
                  )}

                  {/* Pulsing Satellite Atmosphere Dot */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 border border-slate-950 animate-ping opacity-75" />

                  {/* Interactive Tooltip on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.85 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-slate-950 text-[10px] text-white font-medium whitespace-nowrap border border-cyan-400/40 shadow-2xl flex items-center gap-1 z-30 pointer-events-none"
                      >
                        <span>{sat.name}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-cyan-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.a>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Dock: Contact Strip + Live Stats + English Copyright */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-2.5 pb-2.5 z-10 pt-2 border-t border-slate-800/60">
        {/* Direct Contact Pills: Phone and Email */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-300 font-mono">
          {primaryPhone && (
            <button
              onClick={() => handleCopy(primaryPhone, 'ph')}
              className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-cyan-400 transition cursor-pointer bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 shadow-sm"
              title="Click to copy"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{primaryPhone}</span>
              {copiedKey === 'ph' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          )}

          {contacts.email && (
            <button
              onClick={() => handleCopy(contacts.email, 'em')}
              className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-blue-400 transition cursor-pointer bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-blue-500/40 shadow-sm"
              title="Click to copy"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{contacts.email}</span>
              {copiedKey === 'em' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          )}
        </div>

        {/* Compact Live Visitor Counter Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono shadow-sm">
          <span className="flex items-center gap-1.5 text-emerald-400 font-sans font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <Activity className="w-3 h-3" />
            <span>{lang === 'bn' ? 'লাইভ ভিজিটর:' : 'Live:'}</span>
          </span>
          <span className="text-slate-200">{t('day')}-{formatNum(stats.today)}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-200">{t('week')}-{formatNum(stats.thisWeek)}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-200">{t('month')}-{formatNum(stats.thisMonth)}</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400 font-bold">{t('total')}-{formatNum(stats.total)}</span>
        </div>

        {/* Permanent English Copyright */}
        <div className="text-[11px] sm:text-xs text-slate-500 font-sans">
          Copyright &copy; 2026 {profile.brandName || 'Shukhbazz'}. All rights reserved.
        </div>
      </div>
    </section>
  );
}
