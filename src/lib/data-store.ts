import fs from 'fs';
import path from 'path';
import { SiteConfig, VisitorStats, ChatMessage } from './types';
import defaultConfig from '../data/site-config.json';
import defaultStats from '../data/visitor-stats.json';
import defaultMessages from '../data/messages.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');
const STATS_FILE = path.join(DATA_DIR, 'visitor-stats.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const TMP_CONFIG_FILE = path.join('/tmp', 'site-config.json');

// In-memory cache for fast access and fallback in read-only environments
let inMemoryConfig: SiteConfig = defaultConfig as unknown as SiteConfig;
let inMemoryStats: VisitorStats = defaultStats as VisitorStats;
let inMemoryMessages: ChatMessage[] = defaultMessages as ChatMessage[];

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Helper to access Upstash Redis or Vercel KV if available
function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token, isConfigured: Boolean(url && token) };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const { url, token, isConfigured } = getRedisConfig();

  // 1. Check Cloud Redis if configured (Vercel KV / Upstash)
  if (isConfigured && url && token) {
    try {
      const cleanUrl = url.replace(/\/+$/, '');
      const res = await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['GET', 'shukhbazz_site_config']),
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          inMemoryConfig = parsed;
          return inMemoryConfig;
        }
      }
    } catch (err) {
      console.warn('Could not read from Redis, falling back to disk/memory:', err);
    }
  }

  // 2. Check writable /tmp fallback (Vercel serverless environment)
  try {
    if (fs.existsSync(TMP_CONFIG_FILE)) {
      const data = fs.readFileSync(TMP_CONFIG_FILE, 'utf-8');
      inMemoryConfig = JSON.parse(data);
      return inMemoryConfig;
    }
  } catch {
    // ignore
  }

  // 3. Check local codebase file
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      inMemoryConfig = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read site-config.json from disk, using memory/fallback:', err);
  }

  return inMemoryConfig;
}

export async function saveSiteConfig(newConfig: SiteConfig): Promise<boolean> {
  inMemoryConfig = newConfig;

  // 1. Save to Cloud Redis if configured (Upstash / Vercel KV)
  const { url, token, isConfigured } = getRedisConfig();
  if (isConfigured && url && token) {
    try {
      const cleanUrl = url.replace(/\/+$/, '');
      const res = await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'shukhbazz_site_config', JSON.stringify(newConfig)])
      });
      if (!res.ok) {
        console.warn('Upstash Redis set command response not OK:', res.status);
      }
    } catch (err) {
      console.warn('Could not save to Redis:', err);
    }
  }

  // 2. Save to /tmp fallback (writable on Vercel lambda)
  try {
    fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 3. Save to local codebase data directory (works on local machine)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write site-config.json to disk (expected on read-only serverless):', err);
  }

  return true;
}

export function getVisitorStats(): VisitorStats {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      inMemoryStats = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read visitor-stats.json from disk, using memory/fallback:', err);
  }
  return inMemoryStats;
}

export function saveVisitorStats(stats: VisitorStats): boolean {
  inMemoryStats = stats;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Could not write visitor-stats.json to disk:', err);
    return true;
  }
}

export function recordVisit(): VisitorStats {
  const current = getVisitorStats();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekNum = getWeekNumber(now);
  const monthNum = now.getMonth();
  const yearNum = now.getFullYear();

  let today = current.today;
  let thisWeek = current.thisWeek;
  let thisMonth = current.thisMonth;
  let total = current.total + 1;

  if (current.lastDateStr !== todayStr) {
    today = 1;
  } else {
    today += 1;
  }

  if (current.lastWeekNum !== weekNum || current.lastYearNum !== yearNum) {
    thisWeek = 1;
  } else {
    thisWeek += 1;
  }

  if (current.lastMonthNum !== monthNum || current.lastYearNum !== yearNum) {
    thisMonth = 1;
  } else {
    thisMonth += 1;
  }

  const updated: VisitorStats = {
    today,
    thisWeek,
    thisMonth,
    total,
    lastDateStr: todayStr,
    lastWeekNum: weekNum,
    lastMonthNum: monthNum,
    lastYearNum: yearNum
  };

  saveVisitorStats(updated);
  return updated;
}

// Chat Messages Handling
export function getMessages(): ChatMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      inMemoryMessages = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read messages.json from disk:', err);
  }
  return inMemoryMessages;
}

export function addMessage(msg: Omit<ChatMessage, 'id' | 'date' | 'read'>): ChatMessage {
  const messages = getMessages();
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    ...msg,
    date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
    read: false
  };

  messages.unshift(newMsg);
  inMemoryMessages = messages;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write messages.json:', err);
  }

  return newMsg;
}

export function deleteMessage(id: string): boolean {
  let messages = getMessages();
  messages = messages.filter((m) => m.id !== id);
  inMemoryMessages = messages;
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch {
    return true;
  }
}
