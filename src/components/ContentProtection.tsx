'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentProtection() {
  const { lang } = useLanguage();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      // Don't block right click inside input/textarea if needed
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      triggerNotice();
    };

    // 2. Prevent Image and Content Dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Prevent Copy Events
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      triggerNotice();
    };

    // 4. Prevent Keyboard Shortcuts (Ctrl+C, Ctrl+S, Ctrl+U, Ctrl+P, F12, Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + C (Copy)
      if (ctrlOrCmd && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        triggerNotice();
      }
      // Ctrl/Cmd + S (Save Page)
      if (ctrlOrCmd && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerNotice();
      }
      // Ctrl/Cmd + U (View Source)
      if (ctrlOrCmd && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        triggerNotice();
      }
      // Ctrl/Cmd + P (Print / Save PDF)
      if (ctrlOrCmd && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerNotice();
      }
      // F12 or Inspect (Ctrl+Shift+I)
      if (e.key === 'F12' || (ctrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
        triggerNotice();
      }
    };

    let timer: NodeJS.Timeout;
    const triggerNotice = () => {
      setShowNotice(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowNotice(false);
      }, 2500);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotice && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-slate-900/95 border border-red-500/40 text-red-200 text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 pointer-events-none"
        >
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            {lang === 'bn'
              ? 'কন্টেন্ট ও ছবিসমূহ কপি বা ডাউনলোড করা নিষিদ্ধ ও সংরক্ষিত।'
              : 'Content and images are copyright protected. Copying and saving is disabled.'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
