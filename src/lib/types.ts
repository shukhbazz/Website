export type Language = 'bn' | 'en';

export interface MenuItem {
  id: string;
  labelBn: string;
  labelEn: string;
  url: string;
  enabled: boolean;
  isExternal: boolean;
  isUpcoming?: boolean;
  upcomingMessageBn?: string;
  upcomingMessageEn?: string;
  order: number;
}

export interface QuoteItem {
  id: string;
  textBn: string;
  textEn: string;
  authorBn?: string;
  authorEn?: string;
  categoryBn?: string;
  categoryEn?: string;
  bgImage?: string;
  accentColor?: string; // Theme color based on picture
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  titleBn: string;
  titleEn: string;
  descBn?: string;
  descEn?: string;
  categoryBn?: string;
  categoryEn?: string;
  accentColor?: string; // Theme color based on picture
}

export interface IslamicHeaderConfig {
  enabled: boolean;
  bismillahArabic: string;
  bismillahBn: string;
  bismillahEn: string;
  quranArabic: string;
  quranBn: string;
  quranEn: string;
  quranSurahBn: string;
  quranSurahEn: string;
}

export interface ProfileConfig {
  brandName: string;
  nameBn: string;
  nameEn: string;
  titleBn: string;
  titleEn: string;
  bioBn: string;
  bioEn: string;
  logoUrl: string;
  avatarUrl?: string;
  avatarUrls?: string[]; // Multiple DPs for shuffle on page refresh
  statusBn: string;
  statusEn: string;
  availableForWork: boolean;
}

export interface CustomContactLink {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  enabled: boolean;
  bgColor?: string;
}

export interface ContactConfig {
  facebookUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  twitterUrl: string;
  threadsUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  telegramUrl: string;
  email: string;
  phone: string;
  addressBn: string;
  addressEn: string;
  enabledSocials?: {
    facebook?: boolean;
    youtube?: boolean;
    whatsapp?: boolean;
    instagram?: boolean;
    twitter?: boolean;
    threads?: boolean;
    linkedin?: boolean;
    github?: boolean;
    telegram?: boolean;
  };
  customLinks?: CustomContactLink[];
}

export interface ChatConfig {
  enabled: boolean;
  greetingBn: string;
  greetingEn: string;
}

export interface ChatMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  date: string;
  read: boolean;
}

export interface FeaturesConfig {
  showCalendar: boolean;
  showVisitorCounter: boolean;
  showStatusBadge: boolean;
  showQRCode: boolean;
  showQuotes: boolean;
  showGallery: boolean;
}

export interface PopupNotificationConfig {
  enabled: boolean;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  imageUrl?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  buttonUrl?: string;
  showOncePerSession?: boolean;
}

export interface SiteConfig {
  islamicHeader: IslamicHeaderConfig;
  profile: ProfileConfig;
  contacts: ContactConfig;
  menus: MenuItem[];
  quotes: QuoteItem[];
  gallery: GalleryItem[];
  chat: ChatConfig;
  features: FeaturesConfig;
  popupNotification?: PopupNotificationConfig;
  adminPassword?: string;
}

export interface VisitorStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  lastDateStr?: string;
  lastWeekNum?: number;
  lastMonthNum?: number;
  lastYearNum?: number;
}

export interface TripleCalendarInfo {
  gregorian: {
    bn: string;
    en: string;
    dayNameBn: string;
    dayNameEn: string;
  };
  bangla: {
    bn: string;
    en: string;
    seasonBn: string;
    seasonEn: string;
  };
  hijri: {
    bn: string;
    en: string;
  };
  time: {
    bn: string;
    en: string;
    periodBn: string;
    periodEn: string;
  };
}
