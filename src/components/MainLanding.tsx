'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SiteConfig } from '@/lib/types';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import IslamicScreen from './screens/IslamicScreen';
import ProfileScreen from './screens/ProfileScreen';
import QuoteScreen from './screens/QuoteScreen';
import GalleryScreen from './screens/GalleryScreen';
import ContactScreen from './screens/ContactScreen';
import PageIndicators from './PageIndicators';
import ShopModal from './ShopModal';
import LiveChatWidget from './LiveChatWidget';
import ContentProtection from './ContentProtection';
import PopupNotificationModal from './PopupNotificationModal';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLandingProps {
  initialConfig: SiteConfig;
}

export default function MainLanding({ initialConfig }: MainLandingProps) {
  const [config] = useState<SiteConfig>(initialConfig);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward/down, -1 = backward/up

  const quotes = config.quotes || [];
  const gallery = config.gallery || [];
  const totalScreens = 2 + quotes.length + gallery.length + 1;

  const isTransitioningRef = useRef(false);
  const lastTriggerTimeRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Navigate to screen with smooth direction
  const goToScreen = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalScreens) return;
    if (newIndex === currentScreen) return;

    setDirection(newIndex > currentScreen ? 1 : -1);
    setCurrentScreen(newIndex);
  }, [currentScreen, totalScreens]);

  // Handle Wheel, Keyboard, and Touch gestures
  useEffect(() => {
    let resetTimer: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept scroll if user is interacting with scrollable modal/chat
      const target = e.target as HTMLElement;
      if (target && target.closest('.allow-scroll')) return;
      if (shopModalOpen) return;

      const now = Date.now();
      // Throttle: ignore events during the active 600ms transition period
      if (isTransitioningRef.current || now - lastTriggerTimeRef.current < 600) {
        return;
      }

      accumulatedDeltaRef.current += e.deltaY;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, 200);

      // Trigger threshold: 30px
      if (Math.abs(accumulatedDeltaRef.current) >= 30) {
        const delta = accumulatedDeltaRef.current;
        accumulatedDeltaRef.current = 0;
        lastTriggerTimeRef.current = now;
        isTransitioningRef.current = true;

        if (delta > 0) {
          goToScreen(currentScreen + 1);
        } else {
          goToScreen(currentScreen - 1);
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
          accumulatedDeltaRef.current = 0;
        }, 600);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keys when user is typing in forms
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (shopModalOpen || isTransitioningRef.current) return;

      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 600) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        lastTriggerTimeRef.current = now;
        isTransitioningRef.current = true;
        goToScreen(currentScreen + 1);
        setTimeout(() => { isTransitioningRef.current = false; }, 600);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        lastTriggerTimeRef.current = now;
        isTransitioningRef.current = true;
        goToScreen(currentScreen - 1);
        setTimeout(() => { isTransitioningRef.current = false; }, 600);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToScreen(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToScreen(totalScreens - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('.allow-scroll')) return;
      if (shopModalOpen || isTransitioningRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartYRef.current - touchEndY;

      if (Math.abs(diff) > 40) {
        const now = Date.now();
        if (now - lastTriggerTimeRef.current < 600) return;
        lastTriggerTimeRef.current = now;
        isTransitioningRef.current = true;

        if (diff > 0) {
          goToScreen(currentScreen + 1);
        } else {
          goToScreen(currentScreen - 1);
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 600);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(resetTimer);
    };
  }, [currentScreen, totalScreens, goToScreen, shopModalOpen]);

  // Framer Motion Luxurious Vertical Parallax Slide Variants:
  // Both incoming and outgoing screens animate in tandem (NO blank pauses)
  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? '100%' : '-100%',
      opacity: 0.25,
      scale: 0.98,
      zIndex: 10,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
      transition: {
        y: { type: 'spring' as const, stiffness: 220, damping: 26 },
        opacity: { duration: 0.45, ease: 'easeOut' as const },
        scale: { duration: 0.45, ease: 'easeOut' as const }
      }
    },
    exit: (dir: number) => ({
      y: dir > 0 ? '-22%' : '22%',
      opacity: 0,
      scale: 0.94,
      filter: 'blur(6px)',
      zIndex: 0,
      transition: {
        y: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
        opacity: { duration: 0.38 },
        scale: { duration: 0.52 },
        filter: { duration: 0.38 }
      }
    })
  };

  // Render the currently active screen component
  const renderCurrentScreen = (screenIndex: number) => {
    // Screen 0: Islamic (Bismillah, Verse, Triple Calendar, Sun simulation)
    if (screenIndex === 0) {
      return <IslamicScreen islamicHeader={config.islamicHeader} />;
    }

    // Screen 1: Profile & Menus (Portfolio -> Blog -> Shop)
    if (screenIndex === 1) {
      return (
        <ProfileScreen
          profile={config.profile}
          menus={config.menus}
          onShopClick={() => setShopModalOpen(true)}
        />
      );
    }

    // Screen 2 to 2 + quotes.length - 1: Quotes
    const quoteIndex = screenIndex - 2;
    if (quoteIndex >= 0 && quoteIndex < quotes.length) {
      return (
        <QuoteScreen
          quote={quotes[quoteIndex]}
          index={quoteIndex}
          total={quotes.length}
        />
      );
    }

    // Screen for Gallery Moments
    const galleryIndex = screenIndex - 2 - quotes.length;
    if (galleryIndex >= 0 && galleryIndex < gallery.length) {
      return (
        <GalleryScreen
          item={gallery[galleryIndex]}
          index={galleryIndex}
          total={gallery.length}
        />
      );
    }

    // Final Screen: Contact, Social Media, Compact Stats & English Copyright
    return (
      <ContactScreen
        contacts={config.contacts}
        profile={config.profile}
      />
    );
  };

  const shopMenu = config.menus.find((m) => m.id === 'shop');

  return (
    <LanguageProvider>
      {/* 1. Global Content Protection (Anti-Copy & Anti-Download) */}
      <ContentProtection />

      <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* 2. Language Switcher (Fixed at Top-Right Corner) */}
        <LanguageToggle />

        {/* 3. Page Dots Indicator on Right (Always fixed and synchronized) */}
        <PageIndicators
          totalScreens={totalScreens}
          activeScreen={currentScreen}
          onSelectScreen={goToScreen}
        />

        {/* 4. Animated Screen Container (Smooth, screen-by-screen progression) */}
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full absolute inset-0 overflow-hidden"
            >
              {renderCurrentScreen(currentScreen)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. Live Chat Widget (FROZEN & FIXED at bottom-right across all screens) */}
        <LiveChatWidget
          chat={{ ...config.chat, enabled: true }}
          profile={config.profile}
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          onClose={() => setChatOpen(false)}
        />

        {/* 6. Shop "Coming Soon" Modal */}
        <ShopModal
          isOpen={shopModalOpen}
          onClose={() => setShopModalOpen(false)}
          messageBn={shopMenu?.upcomingMessageBn}
          messageEn={shopMenu?.upcomingMessageEn}
        />

        {/* 7. Important Popup Notification (Can be enabled/disabled from Admin) */}
        <PopupNotificationModal popupConfig={config.popupNotification} />
      </div>
    </LanguageProvider>
  );
}
