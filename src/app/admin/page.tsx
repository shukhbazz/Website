'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteConfig, MenuItem, VisitorStats, QuoteItem, GalleryItem, ChatMessage, CustomContactLink } from '@/lib/types';
import {
  ShieldCheck,
  User,
  Menu as MenuIcon,
  PhoneCall,
  Inbox,
  Users,
  Key,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Feather,
  Image as ImageIcon,
  BookOpen,
  LayoutDashboard,
  Clock,
  Bell,
  Globe
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'popup' | 'islamic' | 'profile' | 'quotes' | 'gallery' | 'menus' | 'contacts' | 'inbox' | 'visitors' | 'security'
  >('overview');
  const [newPassword, setNewPassword] = useState('');

  // Check auth & fetch data
  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);

    async function loadData(pass: string) {
      try {
        const [configRes, statsRes, messagesRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/visitors'),
          fetch('/api/messages', { headers: { 'x-admin-pass': pass } })
        ]);
        const configData = await configRes.json();
        const statsData = await statsRes.json();
        const messagesData = await messagesRes.json().catch(() => []);

        setConfig(configData);
        setStats(statsData);
        if (Array.isArray(messagesData)) {
          setMessages(messagesData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData(savedToken);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const handleSave = async () => {
    if (!config || !token) return;
    setSaving(true);
    setAlert(null);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': token
        },
        body: JSON.stringify({
          newConfig: config,
          newPassword: newPassword.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (newPassword.trim()) {
          sessionStorage.setItem('admin_token', newPassword.trim());
          setToken(newPassword.trim());
          setNewPassword('');
        }
        setAlert({ type: 'success', text: 'সকল পরিবর্তন সফলভাবে সেভ হয়েছে!' });
      } else {
        setAlert({ type: 'error', text: data.error || 'সেভ করতে সমস্যা হয়েছে।' });
      }
    } catch {
      setAlert({ type: 'error', text: 'সার্ভারে কানেক্ট করা যায়নি।' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStats = async () => {
    if (!stats || !token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': token
        },
        body: JSON.stringify({ action: 'set', stats })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: 'success', text: 'কাউন্টার সফলভাবে আপডেট হয়েছে!' });
      }
    } catch {
      setAlert({ type: 'error', text: 'আপডেট করা যায়নি।' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': token
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  // Quotes
  const handleAddQuote = () => {
    if (!config) return;
    const newQuote: QuoteItem = {
      id: `q_${Date.now()}`,
      textBn: 'নতুন ভাবনার বাণী এখানে লিখুন...',
      textEn: 'Write your reflective thought here...',
      authorBn: '— শুখবাজ',
      authorEn: '— Shukhbazz',
      categoryBn: 'চিন্তাভাবনা',
      categoryEn: 'Thoughts',
      bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    };
    setConfig({ ...config, quotes: [...(config.quotes || []), newQuote] });
  };

  const handleDeleteQuote = (id: string) => {
    if (!config) return;
    setConfig({ ...config, quotes: config.quotes.filter((q) => q.id !== id) });
  };

  // Gallery
  const handleAddGallery = () => {
    if (!config) return;
    const newItem: GalleryItem = {
      id: `g_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      titleBn: 'নতুন ছবির শিরোনাম',
      titleEn: 'New Photo Title',
      descBn: 'ছবির বর্ণনা এখানে লিখুন',
      descEn: 'Write short description here',
      categoryBn: 'মুহূর্ত',
      categoryEn: 'Moments'
    };
    setConfig({ ...config, gallery: [...(config.gallery || []), newItem] });
  };

  const handleDeleteGallery = (id: string) => {
    if (!config) return;
    setConfig({ ...config, gallery: config.gallery.filter((g) => g.id !== id) });
  };

  // Menus
  const handleAddMenu = () => {
    if (!config) return;
    const newMenu: MenuItem = {
      id: `custom_${Date.now()}`,
      labelBn: 'নতুন মেনু',
      labelEn: 'New Menu',
      url: 'https://',
      enabled: true,
      isExternal: true,
      order: config.menus.length + 1
    };
    setConfig({ ...config, menus: [...config.menus, newMenu] });
  };

  const handleDeleteMenu = (id: string) => {
    if (!config) return;
    setConfig({ ...config, menus: config.menus.filter((m) => m.id !== id) });
  };

  const handleAddCustomContact = () => {
    if (!config) return;
    const newCustom: CustomContactLink = {
      id: `custom_${Date.now()}`,
      name: 'অন্যান্য লিংক',
      url: '',
      iconUrl: '',
      enabled: true,
      bgColor: 'bg-slate-800 hover:bg-slate-700'
    };
    setConfig({
      ...config,
      contacts: {
        ...config.contacts,
        customLinks: [...(config.contacts.customLinks || []), newCustom]
      }
    });
  };

  const handleDeleteCustomContact = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      contacts: {
        ...config.contacts,
        customLinks: (config.contacts.customLinks || []).filter((c) => c.id !== id)
      }
    });
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>অ্যাডমিন প্যানেল লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
    { id: 'popup', label: 'পপআপ নোটিশ', icon: Bell },
    { id: 'islamic', label: 'বিসমিল্লাহ ও আয়াত', icon: BookOpen },
    { id: 'profile', label: 'প্রোফাইল ও লোগো', icon: User },
    { id: 'quotes', label: 'বাণী ও উক্তি', icon: Feather },
    { id: 'gallery', label: 'ফটো গ্যালারি', icon: ImageIcon },
    { id: 'menus', label: 'মেনু ও সাবডোমেইন', icon: MenuIcon },
    { id: 'contacts', label: 'সোশ্যাল ও কন্টাক্ট', icon: PhoneCall },
    { id: 'inbox', label: `ইনবক্স মেসেজ (${messages.length})`, icon: Inbox },
    { id: 'visitors', label: 'ভিজিটর কাউন্টার', icon: Users },
    { id: 'security', label: 'পাসওয়ার্ড', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* 1. Left Sidebar Navigation (As requested by user!) */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">অ্যাডমিন সেন্টার</h2>
            <p className="text-[11px] text-cyan-400 font-mono">
              {config.profile.brandName || 'Shukhbazz'}
            </p>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {sidebarLinks.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  active
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>সাইট ভিউ করুন</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-950/50 hover:bg-red-900/50 text-red-300 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>কন্ট্রোল প্যানেল &bull; {sidebarLinks.find((s) => s.id === activeTab)?.label}</span>
          </h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
          </button>
        </header>

        {/* Main Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {alert && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm ${
                alert.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/80 border border-red-500/40 text-red-300'
              }`}
            >
              {alert.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{alert.text}</span>
            </div>
          )}

          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2">
                  স্বাগতম, {config.profile.brandName || config.profile.nameBn}!
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  বাম পাশের সাইডবার থেকে আপনি ওয়েবসাইটটির সব কনটেন্ট, বাণী, ফটো গ্যালারি, সোশ্যাল মিডিয়া লিংক ও ইনবক্স মেসেজ নিয়ন্ত্রণ করতে পারেন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">মোট বাণী ও উক্তি</span>
                  <span className="text-2xl font-bold font-mono text-cyan-400">
                    {config.quotes?.length || 0}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">গ্যালারির ছবি</span>
                  <span className="text-2xl font-bold font-mono text-pink-400">
                    {config.gallery?.length || 0}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">ইনবক্সে মেসেজ</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {messages.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Popup Notification */}
          {activeTab === 'popup' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">পপআপ নোটিফিকেশন সেটিংস (Popup Notice)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ওয়েবসাইট ভিজিট করলে কোনো গুরুত্বপূর্ণ নোটিশ বা ঘোষণা দেখাতে এটি অন/অফ করুন
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={config.popupNotification?.enabled || false}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            titleBn: 'জরুরি নোটিশ',
                            titleEn: 'Important Notice',
                            messageBn: '',
                            messageEn: '',
                            showOncePerSession: true
                          }),
                          enabled: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={config.popupNotification?.enabled ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}>
                    {config.popupNotification?.enabled ? 'পপআপ চালু (ON)' : 'পপআপ বন্ধ (OFF)'}
                  </span>
                </label>
              </div>

              {/* Show once per session checkbox */}
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="showOnce"
                  checked={config.popupNotification?.showOncePerSession ?? true}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      popupNotification: {
                        ...(config.popupNotification || {
                          enabled: false,
                          titleBn: '',
                          titleEn: '',
                          messageBn: '',
                          messageEn: ''
                        }),
                        showOncePerSession: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 rounded text-cyan-600 cursor-pointer"
                />
                <label htmlFor="showOnce" className="cursor-pointer">
                  একই ভিজিটরকে প্রতি সেশনে মাত্র একবার নোটিশটি দেখাবে (বারবার বিরক্তি এড়াতে)
                </label>
              </div>

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    নোটিশ শিরোনাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={config.popupNotification?.titleBn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleEn: '',
                            messageBn: '',
                            messageEn: ''
                          }),
                          titleBn: e.target.value
                        }
                      })
                    }
                    placeholder="জরুরি নোটিশ / ঘোষণা"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notice Title (English)
                  </label>
                  <input
                    type="text"
                    value={config.popupNotification?.titleEn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            messageBn: '',
                            messageEn: ''
                          }),
                          titleEn: e.target.value
                        }
                      })
                    }
                    placeholder="Important Notice / Announcement"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              {/* Message Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    নোটিশ বার্তা / বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={config.popupNotification?.messageBn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            titleEn: '',
                            messageEn: ''
                          }),
                          messageBn: e.target.value
                        }
                      })
                    }
                    placeholder="নোটিশের বিস্তারিত বিবরণ এখানে লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notice Message (English)
                  </label>
                  <textarea
                    rows={4}
                    value={config.popupNotification?.messageEn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            titleEn: '',
                            messageBn: ''
                          }),
                          messageEn: e.target.value
                        }
                      })
                    }
                    placeholder="Write detailed announcement here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              {/* Optional Banner Image Upload */}
              <ImageUploader
                label="নোটিশের ছবি / ব্যানার (ঐচ্ছিক)"
                sublabel="নোটিশে কোনো ছবি বা পোস্টার দেখাতে চাইলে ডিভাইস থেকে সরাসরি আপলোড করুন"
                value={config.popupNotification?.imageUrl || ''}
                onChange={(url) =>
                  setConfig({
                    ...config,
                    popupNotification: {
                      ...(config.popupNotification || {
                        enabled: false,
                        titleBn: '',
                        titleEn: '',
                        messageBn: '',
                        messageEn: ''
                      }),
                      imageUrl: url
                    }
                  })
                }
                token={token}
                aspectRatio="wide"
              />

              {/* Action Button Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    বাটন টেক্সট (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={config.popupNotification?.buttonTextBn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            titleEn: '',
                            messageBn: '',
                            messageEn: ''
                          }),
                          buttonTextBn: e.target.value
                        }
                      })
                    }
                    placeholder="ঠিক আছে / বিস্তারিত জানুন"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Button Text (English)
                  </label>
                  <input
                    type="text"
                    value={config.popupNotification?.buttonTextEn || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            titleEn: '',
                            messageBn: '',
                            messageEn: ''
                          }),
                          buttonTextEn: e.target.value
                        }
                      })
                    }
                    placeholder="Got It / Learn More"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    বাটন রিডাইরেক্ট লিংক (URL, ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={config.popupNotification?.buttonUrl || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popupNotification: {
                          ...(config.popupNotification || {
                            enabled: false,
                            titleBn: '',
                            titleEn: '',
                            messageBn: '',
                            messageEn: ''
                          }),
                          buttonUrl: e.target.value
                        }
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-cyan-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Islamic Header (Bismillah & Quranic Verse) */}
          {activeTab === 'islamic' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                    <span>বিসমিল্লাহ ও কোরআনের আয়াত কনফিগারেশন</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ওয়েবসাইটের সর্ব উপরে প্রদর্শিত বিসমিল্লাহ ও যেকোনো কোরআনের আয়াত এখানে পরিবর্তন করতে পারবেন
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={config.islamicHeader?.enabled ?? true}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        islamicHeader: { ...config.islamicHeader, enabled: e.target.checked }
                      })
                    }
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-0"
                  />
                  <span className="text-cyan-400 font-medium">সক্রিয়</span>
                </label>
              </div>

              {/* Bismillah */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  ১. বিসমিল্লাহির রহমানির রহিম
                </h4>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">আরবি টেক্সট</label>
                  <input
                    type="text"
                    value={config.islamicHeader.bismillahArabic}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        islamicHeader: { ...config.islamicHeader, bismillahArabic: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-amber-200 font-serif"
                    dir="rtl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">বাংলা অর্থ</label>
                    <input
                      type="text"
                      value={config.islamicHeader.bismillahBn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, bismillahBn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">English Translation</label>
                    <input
                      type="text"
                      value={config.islamicHeader.bismillahEn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, bismillahEn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Quranic Verse */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  ২. কোরআনের আয়াত
                </h4>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">আয়াত (আরবি টেক্সট)</label>
                  <textarea
                    rows={2}
                    value={config.islamicHeader.quranArabic}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        islamicHeader: { ...config.islamicHeader, quranArabic: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-emerald-300 font-serif"
                    dir="rtl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">বাংলা অর্থ</label>
                    <textarea
                      rows={2}
                      value={config.islamicHeader.quranBn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, quranBn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">English Translation</label>
                    <textarea
                      rows={2}
                      value={config.islamicHeader.quranEn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, quranEn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">সূরার রেফারেন্স (বাংলা)</label>
                    <input
                      type="text"
                      value={config.islamicHeader.quranSurahBn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, quranSurahBn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Surah Reference (English)</label>
                    <input
                      type="text"
                      value={config.islamicHeader.quranSurahEn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          islamicHeader: { ...config.islamicHeader, quranSurahEn: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Profile & Animated Logo */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-5 h-5 text-cyan-400" />
                <span>প্রোফাইল তথ্য ও স্ক্রল-অ্যানিমেটেড লোগো</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1">
                  উপরে বামে প্রদর্শিত ব্র্যান্ড নাম (Top-Left Navbar Name)
                </label>
                <input
                  type="text"
                  value={config.profile.brandName || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, brandName: e.target.value }
                    })
                  }
                  placeholder="Shukhbazz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-bold"
                />
              </div>

              <ImageUploader
                label="ব্যক্তিগত লোগো ও প্রোফাইল ছবি (Personal Logo & Avatar)"
                sublabel="পিসি বা মোবাইল থেকে সরাসরি আপনার পছন্দের লোগো বা প্রোফাইল ছবি আপলোড করুন"
                value={config.profile.logoUrl || config.profile.avatarUrl || ''}
                onChange={(url) =>
                  setConfig({
                    ...config,
                    profile: { ...config.profile, logoUrl: url, avatarUrl: url }
                  })
                }
                token={token}
                aspectRatio="square"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={config.profile.nameBn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, nameBn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Name (English)</label>
                  <input
                    type="text"
                    value={config.profile.nameEn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, nameEn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">টাইটেল (বাংলা)</label>
                  <input
                    type="text"
                    value={config.profile.titleBn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, titleBn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={config.profile.titleEn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, titleEn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">বায়ো / পরিচিতি (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={config.profile.bioBn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, bioBn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bio (English)</label>
                  <textarea
                    rows={3}
                    value={config.profile.bioEn}
                    onChange={(e) =>
                      setConfig({ ...config, profile: { ...config.profile, bioEn: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white leading-relaxed"
                  />
                </div>
              </div>

              {/* Shuffle DPs Section */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>শাফেল ডিপি / প্রোফাইল ছবি সমূহ (Shuffle Profile Pictures)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    এখানে ৩-৪টি বা একাধিক ছবি আপলোড করে রাখুন। কেউ ওয়েবসাইট রিফ্রেশ বা নতুন করে পুনরায় ভিজিট করলে একেকবার একেকটি ছবি প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(config.profile.avatarUrls || []).map((dpUrl, idx) => (
                    <div key={idx} className="relative p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">ডিপি #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (config.profile.avatarUrls || []).filter((_, i) => i !== idx);
                            setConfig({
                              ...config,
                              profile: { ...config.profile, avatarUrls: updated }
                            });
                          }}
                          className="p-1 rounded-lg bg-rose-950/60 text-rose-400 hover:text-white border border-rose-500/30 cursor-pointer transition"
                          title="ডিপি মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ImageUploader
                        label={`ডিপি #${idx + 1}`}
                        value={dpUrl}
                        onChange={(url) => {
                          const updated = [...(config.profile.avatarUrls || [])];
                          updated[idx] = url;
                          setConfig({
                            ...config,
                            profile: { ...config.profile, avatarUrls: updated }
                          });
                        }}
                        token={token}
                        aspectRatio="square"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const current = config.profile.avatarUrls || [];
                    setConfig({
                      ...config,
                      profile: {
                        ...config.profile,
                        avatarUrls: [...current, '']
                      }
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>➕ নতুন ডিপি ছবি যোগ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Quotes */}
          {activeTab === 'quotes' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Feather className="w-5 h-5 text-cyan-400" />
                    <span>বাণী ও উক্তি পরিচালনা</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    প্রতিটি বাণীর সাথে পেছনের ব্যাকগ্রাউন্ড ছবি সেট করতে পারবেন
                  </p>
                </div>
                <button
                  onClick={handleAddQuote}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন বাণী যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {config.quotes && config.quotes.map((q, index) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 uppercase">বাণী #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteQuote(q.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">বাণী (বাংলা)</label>
                        <textarea
                          rows={2}
                          value={q.textBn}
                          onChange={(e) => {
                            const updated = [...config.quotes];
                            updated[index].textBn = e.target.value;
                            setConfig({ ...config, quotes: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Quote (English)</label>
                        <textarea
                          rows={2}
                          value={q.textEn}
                          onChange={(e) => {
                            const updated = [...config.quotes];
                            updated[index].textEn = e.target.value;
                            setConfig({ ...config, quotes: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <ImageUploader
                      label="বাণীর ব্যাকগ্রাউন্ড পিকচার (Background Image)"
                      sublabel="এই বাণীর পেছনে প্রদর্শিত ছবি পিসি বা মোবাইল থেকে সরাসরি আপলোড করুন"
                      value={q.bgImage || ''}
                      onChange={(url) => {
                        const updated = [...config.quotes];
                        updated[index].bgImage = url;
                        setConfig({ ...config, quotes: updated });
                      }}
                      token={token}
                      aspectRatio="wide"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Gallery */}
          {activeTab === 'gallery' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-pink-400" />
                    <span>ফটো গ্যালারি পরিচালনা</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">ছবি এবং ক্যাপশন এডিট ও যোগ করুন</p>
                </div>
                <button
                  onClick={handleAddGallery}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ছবি যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.gallery && config.gallery.map((g, index) => (
                  <div key={g.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300">ছবি #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="p-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ImageUploader
                      label="স্মৃতির ছবি (Moment Photo)"
                      sublabel="ডিভাইস থেকে সরাসরি ছবি আপলোড করুন"
                      value={g.imageUrl || ''}
                      onChange={(url) => {
                        const updated = [...config.gallery];
                        updated[index].imageUrl = url;
                        setConfig({ ...config, gallery: updated });
                      }}
                      token={token}
                      aspectRatio="video"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">শিরোনাম (বাংলা)</label>
                        <input
                          type="text"
                          value={g.titleBn}
                          onChange={(e) => {
                            const updated = [...config.gallery];
                            updated[index].titleBn = e.target.value;
                            setConfig({ ...config, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={g.titleEn}
                          onChange={(e) => {
                            const updated = [...config.gallery];
                            updated[index].titleEn = e.target.value;
                            setConfig({ ...config, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Menus & Subdomains */}
          {activeTab === 'menus' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MenuIcon className="w-5 h-5 text-indigo-400" />
                    <span>মেনু ও সাবডোমেইন রিডাইরেক্ট</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ব্লগ ও পোর্টফোলিওর সাবডোমেইন লিংক দিন এবং মেনু অন/অফ করুন
                  </p>
                </div>
                <button
                  onClick={handleAddMenu}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন মেনু</span>
                </button>
              </div>

              <div className="space-y-4">
                {config.menus.map((menu, index) => (
                  <div key={menu.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">
                        {menu.labelBn} / {menu.labelEn}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={menu.enabled}
                            onChange={(e) => {
                              const updated = [...config.menus];
                              updated[index].enabled = e.target.checked;
                              setConfig({ ...config, menus: updated });
                            }}
                            className="w-4 h-4 rounded text-indigo-600"
                          />
                          <span className={menu.enabled ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            {menu.enabled ? 'ON' : 'OFF'}
                          </span>
                        </label>
                        {menu.id.startsWith('custom_') && (
                          <button
                            onClick={() => handleDeleteMenu(menu.id)}
                            className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        রিডাইরেক্ট সাবডোমেন বা ওয়েবসাইট লিংক (URL)
                      </label>
                      <input
                        type="text"
                        value={menu.url}
                        onChange={(e) => {
                          const updated = [...config.menus];
                          updated[index].url = e.target.value;
                          setConfig({ ...config, menus: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Social Media & Contacts */}
          {activeTab === 'contacts' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-emerald-400" />
                    <span>সোশ্যাল মিডিয়া প্রোফাইল ও কন্টাক্ট লিংকসমূহ</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    যে লিংকগুলো অন রাখবেন বা লিংক দিয়ে রাখবেন শুধুমাত্র সেগুলোই ওয়েবসাইটে দেখাবে। কোনো ব্ল্যাংক আইকন দেখাবে না।
                  </p>
                </div>
              </div>

              {/* Standard Social Links Grid with ON/OFF Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { key: 'facebook', label: 'Facebook URL', prop: 'facebookUrl' as const, placeholder: 'https://facebook.com/...' },
                  { key: 'youtube', label: 'YouTube Channel URL', prop: 'youtubeUrl' as const, placeholder: 'https://youtube.com/@...' },
                  { key: 'whatsapp', label: 'WhatsApp Number', prop: 'whatsappNumber' as const, placeholder: '+8801700000000' },
                  { key: 'instagram', label: 'Instagram URL', prop: 'instagramUrl' as const, placeholder: 'https://instagram.com/...' },
                  { key: 'twitter', label: 'X (Twitter) URL', prop: 'twitterUrl' as const, placeholder: 'https://x.com/...' },
                  { key: 'threads', label: 'Threads URL', prop: 'threadsUrl' as const, placeholder: 'https://threads.net/@...' },
                  { key: 'linkedin', label: 'LinkedIn URL', prop: 'linkedinUrl' as const, placeholder: 'https://linkedin.com/in/...' },
                  { key: 'github', label: 'GitHub URL', prop: 'githubUrl' as const, placeholder: 'https://github.com/...' },
                  { key: 'telegram', label: 'Telegram Link', prop: 'telegramUrl' as const, placeholder: 'https://t.me/...' }
                ].map((item) => {
                  const isEnabled = config.contacts.enabledSocials?.[item.key as keyof typeof config.contacts.enabledSocials] !== false;
                  return (
                    <div key={item.key} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-200">{item.label}</label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                contacts: {
                                  ...config.contacts,
                                  enabledSocials: {
                                    ...config.contacts.enabledSocials,
                                    [item.key]: e.target.checked
                                  }
                                }
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-cyan-600 cursor-pointer"
                          />
                          <span className={isEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                            {isEnabled ? 'অন' : 'অফ'}
                          </span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={config.contacts[item.prop] || ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            contacts: {
                              ...config.contacts,
                              [item.prop]: e.target.value
                            }
                          })
                        }
                        placeholder={item.placeholder}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Direct Contact (Email & Phone) */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  সরাসরি যোগাযোগ (Email ও Phone)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={config.contacts.email}
                      onChange={(e) =>
                        setConfig({ ...config, contacts: { ...config.contacts, email: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={config.contacts.phone}
                      onChange={(e) =>
                        setConfig({ ...config, contacts: { ...config.contacts, phone: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Social / Website Links with Uploaded Icons */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>কাস্টম সোশ্যাল বা অন্য কোনো লিংক (Custom Links with Uploaded Icons)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      এখানে আপনার যেকোনো অন্য প্ল্যাটফর্ম বা ওয়েবসাইটের লিংক দিতে পারেন এবং ডিভাইস থেকে আইকন ছবি আপলোড করতে পারেন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomContact}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন কাস্টম লিংক যুক্ত করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(config.contacts.customLinks || []).map((custom, cIdx) => (
                    <div key={custom.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">কাস্টম লিংক #{cIdx + 1}</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                            <input
                              type="checkbox"
                              checked={custom.enabled}
                              onChange={(e) => {
                                const updated = [...(config.contacts.customLinks || [])];
                                updated[cIdx].enabled = e.target.checked;
                                setConfig({ ...config, contacts: { ...config.contacts, customLinks: updated } });
                              }}
                              className="w-3.5 h-3.5 rounded text-cyan-600 cursor-pointer"
                            />
                            <span className={custom.enabled ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                              {custom.enabled ? 'অন' : 'অফ'}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomContact(custom.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:text-white border border-rose-500/30 cursor-pointer transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">প্ল্যাটফর্ম বা লিংকের নাম</label>
                          <input
                            type="text"
                            value={custom.name}
                            onChange={(e) => {
                              const updated = [...(config.contacts.customLinks || [])];
                              updated[cIdx].name = e.target.value;
                              setConfig({ ...config, contacts: { ...config.contacts, customLinks: updated } });
                            }}
                            placeholder="e.g. Discord, Behance"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">URL লিংক</label>
                          <input
                            type="text"
                            value={custom.url}
                            onChange={(e) => {
                              const updated = [...(config.contacts.customLinks || [])];
                              updated[cIdx].url = e.target.value;
                              setConfig({ ...config, contacts: { ...config.contacts, customLinks: updated } });
                            }}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono"
                          />
                        </div>
                      </div>

                      <ImageUploader
                        label="কাস্টম আইকন ছবি আপলোড করুন"
                        sublabel="ডিভাইস থেকে স্কয়ার আইকন বা লোগো নির্বাচন করুন"
                        value={custom.iconUrl || ''}
                        onChange={(url) => {
                          const updated = [...(config.contacts.customLinks || [])];
                          updated[cIdx].iconUrl = url;
                          setConfig({ ...config, contacts: { ...config.contacts, customLinks: updated } });
                        }}
                        token={token}
                        aspectRatio="square"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Inbox Messages */}
          {activeTab === 'inbox' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-cyan-400" />
                    <span>ভিজিটরদের ইনবক্স মেসেজ ও লাইভ চ্যাট এসএমএস</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ওয়েবসাইটের লাইভ চ্যাট থেকে পাঠানো সকল মেসেজ সরাসরি এখানে জমা হয়
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  {messages.length} টি বার্তা
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  এখনো কোনো বার্তা আসেনি।
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-white">{m.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono">
                            {m.contact}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {m.date}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          {m.message}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-white transition cursor-pointer self-end sm:self-start"
                        title="বার্তা মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: Visitor Counter */}
          {activeTab === 'visitors' && stats && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>লাইভ ভিজিটর কাউন্টার কন্ট্রোল</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    কাউন্টার সংখ্যা দেখতে বা ম্যানুয়ালি পরিবর্তন করতে পারেন
                  </p>
                </div>
                <button
                  onClick={handleSaveStats}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  কাউন্টার আপডেট করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <label className="block text-xs font-semibold text-cyan-400 mb-1">আজকের ভিজিটর</label>
                  <input
                    type="number"
                    value={stats.today}
                    onChange={(e) => setStats({ ...stats, today: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-white font-mono"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <label className="block text-xs font-semibold text-indigo-400 mb-1">এই সপ্তাহের ভিজিটর</label>
                  <input
                    type="number"
                    value={stats.thisWeek}
                    onChange={(e) => setStats({ ...stats, thisWeek: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-white font-mono"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <label className="block text-xs font-semibold text-purple-400 mb-1">এই মাসের ভিজিটর</label>
                  <input
                    type="number"
                    value={stats.thisMonth}
                    onChange={(e) => setStats({ ...stats, thisMonth: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-white font-mono"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <label className="block text-xs font-semibold text-pink-400 mb-1">সর্বমোট ভিজিটর</label>
                  <input
                    type="number"
                    value={stats.total}
                    onChange={(e) => setStats({ ...stats, total: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: Security */}
          {activeTab === 'security' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Key className="w-5 h-5 text-amber-400" />
                <span>অ্যাডমিন পাসওয়ার্ড পরিবর্তন</span>
              </h3>
              <div className="max-w-md space-y-3">
                <label className="block text-xs font-medium text-slate-300">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড লিখুন"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                />
                <p className="text-[11px] text-slate-400">
                  পাসওয়ার্ড পরিবর্তন কার্যকর করতে উপরে &lsquo;সেভ করুন&rsquo; বাটনে ক্লিক করুন।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
