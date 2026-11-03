'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MenuItem } from '@/lib/types';
import { Globe, ShieldCheck, Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  menus: MenuItem[];
  onShopClick: () => void;
  brandName?: string;
  nameBn?: string;
  nameEn?: string;
}

export default function Navbar({
  menus,
  onShopClick,
  brandName,
  nameBn,
  nameEn
}: NavbarProps) {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMenus = menus.filter((m) => m.enabled).sort((a, b) => a.order - b.order);

  const handleMenuClick = (menu: MenuItem, e: React.MouseEvent) => {
    if (menu.isUpcoming || menu.id === 'shop') {
      e.preventDefault();
      onShopClick();
      setMobileMenuOpen(false);
    }
  };

  const displayName = lang === 'bn' ? (nameBn || brandName || 'সুখবাজ') : (nameEn || brandName || 'Shukhbazz');

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Top-Left Corner: Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <span className="text-cyan-400 font-extrabold text-base">
                  {displayName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight group-hover:text-cyan-300 transition-colors">
                {displayName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menus */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {activeMenus.map((menu) => {
              const label = lang === 'bn' ? menu.labelBn : menu.labelEn;
              const isShop = menu.isUpcoming || menu.id === 'shop';

              return isShop ? (
                <button
                  key={menu.id}
                  onClick={(e) => handleMenuClick(menu, e)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {label}
                </button>
              ) : (
                <a
                  key={menu.id}
                  href={menu.url || '#'}
                  target={menu.isExternal ? '_blank' : '_self'}
                  rel={menu.isExternal ? 'noopener noreferrer' : undefined}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 group"
                >
                  <span>{label}</span>
                  {menu.isExternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Action Icons: Language Toggle & Admin Portal */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Admin Portal Button */}
            <Link
              href="/admin/login"
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all shadow-sm"
              title={t('adminLogin')}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2"
          >
            {activeMenus.map((menu) => {
              const label = lang === 'bn' ? menu.labelBn : menu.labelEn;
              const isShop = menu.isUpcoming || menu.id === 'shop';

              return isShop ? (
                <button
                  key={menu.id}
                  onClick={(e) => handleMenuClick(menu, e)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{label}</span>
                </button>
              ) : (
                <a
                  key={menu.id}
                  href={menu.url || '#'}
                  target={menu.isExternal ? '_blank' : '_self'}
                  rel={menu.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{label}</span>
                  {menu.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                </a>
              );
            })}

            <div className="pt-3 border-t border-slate-800">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{t('adminLogin')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
