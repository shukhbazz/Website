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
const TMP_STATS_FILE = path.join('/tmp', 'visitor-stats.json');
const TMP_MESSAGES_FILE = path.join('/tmp', 'messages.json');

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

// Helper to access Upstash Redis or Vercel KV if available (robust dynamic lookup)
function getRedisConfig() {
  const env = process.env;
  const urlKey = Object.keys(env).find(
    (k) =>
      k === 'KV_REST_API_URL' ||
      k === 'UPSTASH_REDIS_REST_URL' ||
      k.endsWith('_REST_API_URL') ||
      k.endsWith('_REST_URL')
  );
  const tokenKey = Object.keys(env).find(
    (k) =>
      k === 'KV_REST_API_TOKEN' ||
      k === 'UPSTASH_REDIS_REST_TOKEN' ||
      k.endsWith('_REST_API_TOKEN') ||
      k.endsWith('_REST_TOKEN')
  );

  const url = urlKey ? env[urlKey] : undefined;
  const token = tokenKey ? env[tokenKey] : undefined;

  return { url, token, isConfigured: Boolean(url && token) };
}

async function redisGet<T>(key: string): Promise<T | null> {
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
        body: JSON.stringify(['GET', key]),
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result !== null && data.result !== undefined) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          return parsed as T;
        }
      }
    } catch (err) {
      console.warn(`Redis GET for "${key}" failed, using fallback:`, err);
    }
  }
  return null;
}

async function redisSet<T>(key: string, value: T): Promise<boolean> {
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
        body: JSON.stringify(['SET', key, JSON.stringify(value)])
      });
      return res.ok;
    } catch (err) {
      console.warn(`Redis SET for "${key}" failed:`, err);
    }
  }
  return false;
}

// Helper to auto-sanitize spelling across entire config
function sanitizeConfig(config: SiteConfig): SiteConfig {
  try {
    const jsonStr = JSON.stringify(config);
    if (jsonStr.includes('শুখবাজ')) {
      const fixedStr = jsonStr.replace(/শুখবাজ/g, 'সুখবাজ');
      const fixedConfig = JSON.parse(fixedStr) as SiteConfig;
      // Auto-update Redis in background with sanitized config
      redisSet('shukhbazz_site_config', fixedConfig).catch(() => {});
      return fixedConfig;
    }
  } catch {
    // fallback
  }
  return config;
}

// ---------------- Site Config ----------------
export async function getSiteConfig(): Promise<SiteConfig> {
  // 1. Redis
  const redisVal = await redisGet<SiteConfig>('shukhbazz_site_config');
  if (redisVal) {
    inMemoryConfig = sanitizeConfig(redisVal);
    return inMemoryConfig;
  }

  // 2. /tmp
  try {
    if (fs.existsSync(TMP_CONFIG_FILE)) {
      const data = fs.readFileSync(TMP_CONFIG_FILE, 'utf-8');
      inMemoryConfig = sanitizeConfig(JSON.parse(data));
      return inMemoryConfig;
    }
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      inMemoryConfig = sanitizeConfig(JSON.parse(data));
    }
  } catch (err) {
    console.warn('Could not read site-config.json from disk:', err);
  }

  return inMemoryConfig;
}

export async function saveSiteConfig(newConfig: SiteConfig): Promise<boolean> {
  const sanitized = sanitizeConfig(newConfig);
  inMemoryConfig = sanitized;

  // 1. Redis
  await redisSet('shukhbazz_site_config', sanitized);

  // 2. /tmp
  try {
    fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(sanitized, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(sanitized, null, 2), 'utf-8');
  } catch {
    // expected on serverless
  }

  return true;
}

// ---------------- Visitor Stats ----------------
export async function getVisitorStats(): Promise<VisitorStats> {
  // 1. Redis
  const redisVal = await redisGet<VisitorStats>('shukhbazz_visitor_stats');
  if (redisVal) {
    inMemoryStats = redisVal;
    return inMemoryStats;
  }

  // 2. /tmp
  try {
    if (fs.existsSync(TMP_STATS_FILE)) {
      const data = fs.readFileSync(TMP_STATS_FILE, 'utf-8');
      inMemoryStats = JSON.parse(data);
      return inMemoryStats;
    }
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      inMemoryStats = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read visitor-stats.json from disk:', err);
  }

  return inMemoryStats;
}

export async function saveVisitorStats(stats: VisitorStats): Promise<boolean> {
  inMemoryStats = stats;

  // 1. Redis
  await redisSet('shukhbazz_visitor_stats', stats);

  // 2. /tmp
  try {
    fs.writeFileSync(TMP_STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch {
    // expected on serverless
  }

  return true;
}

export async function recordVisit(): Promise<VisitorStats> {
  const current = await getVisitorStats();
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

  await saveVisitorStats(updated);
  return updated;
}

// ---------------- Chat Messages ----------------
export async function getMessages(): Promise<ChatMessage[]> {
  // 1. Redis
  const redisVal = await redisGet<ChatMessage[]>('shukhbazz_messages');
  if (redisVal && Array.isArray(redisVal)) {
    inMemoryMessages = redisVal;
    return inMemoryMessages;
  }

  // 2. /tmp
  try {
    if (fs.existsSync(TMP_MESSAGES_FILE)) {
      const data = fs.readFileSync(TMP_MESSAGES_FILE, 'utf-8');
      inMemoryMessages = JSON.parse(data);
      return inMemoryMessages;
    }
  } catch {
    // ignore
  }

  // 3. Local disk
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

export async function addMessage(msg: Omit<ChatMessage, 'id' | 'date' | 'read'>): Promise<ChatMessage> {
  const messages = await getMessages();
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    ...msg,
    date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
    read: false
  };

  messages.unshift(newMsg);
  inMemoryMessages = messages;

  // 1. Redis
  await redisSet('shukhbazz_messages', messages);

  // 2. /tmp
  try {
    fs.writeFileSync(TMP_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch {
    // expected on serverless
  }

  return newMsg;
}

export async function deleteMessage(id: string): Promise<boolean> {
  let messages = await getMessages();
  messages = messages.filter((m) => m.id !== id);
  inMemoryMessages = messages;

  // 1. Redis
  await redisSet('shukhbazz_messages', messages);

  // 2. /tmp
  try {
    fs.writeFileSync(TMP_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 3. Local disk
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch {
    // expected on serverless
  }

  return true;
}
