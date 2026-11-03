'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/lib/types';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    blog: 'ব্লগ',
    portfolio: 'পোর্টফলিও',
    shop: 'সপ',
    admin: 'অ্যাডমিন',
    contact: 'যোগাযোগ',
    chatWithMe: 'সরাসরি চ্যাট',
    onlineNow: 'অনলাইনে আছেন',
    sendWhatsApp: 'হোয়াটসঅ্যাপে মেসেজ পাঠান',
    copyEmail: 'ইমেইল কপি করুন',
    copyPhone: 'নাম্বার কপি করুন',
    copied: 'কপি করা হয়েছে!',
    liveCounter: 'লাইভ ভিজিটর কাউন্টার',
    day: 'দিন',
    week: 'সপ্তাহ',
    month: 'মাস',
    total: 'টোটাল',
    upcoming: 'শীঘ্রই আসছে',
    shopModalTitle: 'ডিজিタル শপ - আপকামিং!',
    shopModalDesc: 'আমাদের অফিসিয়াল ডিজিটাল শপ খুব শীঘ্রই উন্মোচিত হতে যাচ্ছে! এখানে প্রয়োজনীয় ডিজিটাল প্রোডাক্ট, টেমপ্লেট এবং সার্ভিস পাবেন। সঙ্গে থাকুন!',
    close: 'বন্ধ করুন',
    connectNow: 'কানেক্ট করুন',
    aboutMe: 'আমার সম্পর্কে',
    exploreWork: 'পোর্টফলিও দেখুন',
    readBlog: 'ব্লগ পড়ুন',
    liveTime: 'লাইভ সময় ও ক্যালেন্ডার',
    gregorianCal: 'ইংরেজি ক্যালেন্ডার',
    banglaCal: 'বাংলা ক্যালেন্ডার',
    hijriCal: 'আরবি / হিজরী ক্যালেন্ডার',
    quickContact: 'সরাসরি যোগাযোগ',
    qrCodeTitle: 'কিউআর কোড স্ক্যান করুন',
    qrCodeSubtitle: 'মোবাইলে দ্রুত কন্টাক্ট সেভ করতে স্ক্যান করুন',
    skillsTitle: 'স্কিল ও টেকনোলজি',
    adminLogin: 'অ্যাডমিন লগইন',
    statusAvailable: 'নতুন ভাবনার অন্বেষণে',
    quotesTitle: 'বাণী ও চিন্তাভাবনা',
    quotesSubtitle: 'আমার জীবনের কিছু নিজস্ব উপলব্ধি ও ভাবনার খোরাক',
    galleryTitle: 'অনুভূতি ও মুহূর্তমালা',
    gallerySubtitle: 'ছবি ও দর্শনের মেলবন্ধনে কিছু বিশেষ মুহূর্ত',
    nextQuote: 'পরবর্তী উক্তি',
    prevQuote: 'পূর্ববর্তী উক্তি',
    personalSpaceBadge: 'ব্যক্তিগত ডিজিটাল স্পেস',
    redirectNotice: 'ভিন্ন ওয়েবসাইটে যাবে'
  },
  en: {
    blog: 'Blog',
    portfolio: 'Portfolio',
    shop: 'Shop',
    admin: 'Admin',
    contact: 'Contact',
    chatWithMe: 'Live Chat',
    onlineNow: 'Online Now',
    sendWhatsApp: 'Chat on WhatsApp',
    copyEmail: 'Copy Email',
    copyPhone: 'Copy Phone',
    copied: 'Copied to Clipboard!',
    liveCounter: 'Live Visitor Counter',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    total: 'Total',
    upcoming: 'Coming Soon',
    shopModalTitle: 'Digital Shop - Upcoming!',
    shopModalDesc: 'Our official digital shop is launching very soon! Discover premium digital products, templates, and tech services. Stay tuned!',
    close: 'Close',
    connectNow: 'Connect Now',
    aboutMe: 'About Me',
    exploreWork: 'View Portfolio',
    readBlog: 'Read Blog',
    liveTime: 'Live Time & Calendars',
    gregorianCal: 'English Calendar',
    banglaCal: 'Bangla Calendar',
    hijriCal: 'Hijri / Islamic Calendar',
    quickContact: 'Quick Contact',
    qrCodeTitle: 'Scan QR Code',
    qrCodeSubtitle: 'Scan with your smartphone to save contact details instantly',
    skillsTitle: 'Skills & Tech Stack',
    adminLogin: 'Admin Login',
    statusAvailable: 'Exploring ideas & building',
    quotesTitle: 'Thoughts & Quotations',
    quotesSubtitle: 'Personal reflections, philosophy & words from the heart',
    galleryTitle: 'Visual Moments & Perspectives',
    gallerySubtitle: 'Curated frames capturing serenity, passion and tech',
    nextQuote: 'Next Quote',
    prevQuote: 'Previous Quote',
    personalSpaceBadge: 'Personal Digital Space',
    redirectNotice: 'Redirects to separate site'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn');

  useEffect(() => {
    // 1. Check if user already manually selected a language
    const saved = localStorage.getItem('site_lang') as Language;
    if (saved === 'bn' || saved === 'en') {
      setLangState(saved);
      return;
    }

    // 2. Auto-Geo & Timezone Detection:
    // If visitor is from Bangladesh (Timezone: Asia/Dhaka or Bengali browser locale), default to 'bn'.
    // If visitor is outside Bangladesh, default to 'en'!
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const browserLang = (navigator.language || '').toLowerCase();

      if (userTimeZone.includes('Dhaka') || browserLang.startsWith('bn')) {
        setLangState('bn');
      } else {
        // Outside Bangladesh: English default
        setLangState('en');
      }
    } catch {
      setLangState('bn');
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('site_lang', newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
