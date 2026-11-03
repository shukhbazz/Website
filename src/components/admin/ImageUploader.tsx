'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2, Check } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  token?: string | null;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export default function ImageUploader({
  label,
  sublabel,
  value,
  onChange,
  token,
  aspectRatio = 'wide'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('দয়া করে শুধুমাত্র ছবি (JPG, PNG, WEBP, GIF) ফাইল নির্বাচন করুন।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-pass': token || sessionStorage.getItem('admin_token') || ''
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে');
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'আপলোড করার সময় সমস্যা হয়েছে';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'w-28 h-28 sm:w-32 sm:h-32 rounded-2xl'
      : aspectRatio === 'video'
      ? 'w-full h-44 sm:h-52 rounded-2xl'
      : 'w-full h-36 sm:h-44 rounded-2xl';

  return (
    <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-200">{label}</label>
          {sublabel && <p className="text-[11px] text-slate-400 mt-0.5">{sublabel}</p>}
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'লিংক ইনপুট লুকান' : 'অথবা লিংক ব্যবহার করুন'}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Main Uploader Box */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Preview Thumbnail */}
        {value ? (
          <div className="relative group shrink-0">
            <div
              className={`${aspectClass} overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-md relative`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white text-[11px] font-semibold cursor-pointer shadow"
                >
                  পরিবর্তন করুন
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow cursor-pointer transition"
              title="ছবি মুছে ফেলুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className={`${aspectClass} border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center text-slate-500 gap-1.5 shrink-0`}
          >
            <ImageIcon className="w-8 h-8 text-slate-600" />
            <span className="text-[10px]">কোনো ছবি নেই</span>
          </div>
        )}

        {/* Upload Action Card */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full p-4 rounded-xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-slate-700 hover:border-cyan-500 bg-slate-950/40 hover:bg-slate-950/80'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <p className="text-xs text-cyan-300 font-semibold">ডিভাইস থেকে আপলোড হচ্ছে...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  ডিভাইস থেকে ছবি আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  পিসি বা মোবাইল থেকে ছবি সিলেক্ট করতে ক্লিক করুন অথবা ড্র্যাগ করুন
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                JPG, PNG, WEBP, GIF (সর্বোচ্চ 10MB)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-[11px] text-slate-400 mb-1">
            সরাসরি ছবির ওয়েব লিংক (URL) দিন:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
            />
            {value && (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                <Check className="w-3.5 h-3.5" /> যুক্ত আছে
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
