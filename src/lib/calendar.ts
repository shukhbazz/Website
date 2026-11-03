import { TripleCalendarInfo } from './types';

export function toBnDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function getBengaliDaySuffix(day: number): string {
  if (day === 1) return 'লা';
  if (day === 2 || day === 3) return 'রা';
  if (day === 4) return 'ঠা';
  if (day >= 5 && day <= 18) return 'ই';
  return 'শে';
}

const BN_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

const EN_BN_MONTHS = [
  'Baishakh', 'Jaishtha', 'Asharh', 'Shraban', 'Bhadra', 'Ashwin',
  'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const BN_SEASONS = [
  'গ্রীষ্মকাল', 'বর্ষাকাল', 'শরৎকাল', 'হেমন্তকাল', 'শীতকাল', 'বসন্তকাল'
];

const EN_SEASONS = [
  'Summer', 'Monsoon', 'Autumn', 'Late Autumn', 'Winter', 'Spring'
];

const GREG_MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const GREG_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_BN = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

const DAYS_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Convert Gregorian Date to Bengali San (Bangla Academy System)
export function getBanglaDate(date: Date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth(); // 0-indexed
  const gDay = date.getDate();

  // Days in Gregorian months for the year
  const daysInGregMonth = [
    31, isLeapYear(gYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

  // Month starting days in Gregorian dates (Bangla Academy revised standard):
  // Baishakh 1: Apr 14
  // Jaishtha 1: May 15
  // Asharh 1: Jun 15
  // Shraban 1: Jul 16
  // Bhadra 1: Aug 16
  // Ashwin 1: Sep 16
  // Kartik 1: Oct 17
  // Agrahayan 1: Nov 16
  // Poush 1: Dec 16
  // Magh 1: Jan 15
  // Falgun 1: Feb 14
  // Chaitra 1: Mar 15

  // Month lengths in Bangla year (Bangla Academy):
  // Baishakh - Ashwin: 31 days each (first 6 months)
  // Kartik - Magh: 30 days each (4 months)
  // Falgun: 29 days (30 in leap year)
  // Chaitra: 30 days
  const falgunDays = isLeapYear(gYear) ? 30 : 29;
  const banglaMonthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, falgunDays, 30];

  // Bangla year
  let bYear = gYear - 593;
  // If before April 14, it's previous Bangla year
  if (gMonth < 3 || (gMonth === 3 && gDay < 14)) {
    bYear = gYear - 594;
  }

  // Calculate day and month
  let bMonth = 0;
  let bDay = 1;

  if (gMonth === 3 && gDay >= 14) {
    bMonth = 0; // Baishakh
    bDay = gDay - 13;
  } else if (gMonth === 4) { // May
    if (gDay < 15) {
      bMonth = 0;
      bDay = 17 + gDay; // 31 - 14 + 1 = 18th is 1st of May -> 17 + gDay
    } else {
      bMonth = 1; // Jaishtha
      bDay = gDay - 14;
    }
  } else if (gMonth === 5) { // June
    if (gDay < 15) {
      bMonth = 1;
      bDay = 17 + gDay;
    } else {
      bMonth = 2; // Asharh
      bDay = gDay - 14;
    }
  } else if (gMonth === 6) { // July
    if (gDay < 16) {
      bMonth = 2;
      bDay = 16 + gDay;
    } else {
      bMonth = 3; // Shraban
      bDay = gDay - 15;
    }
  } else if (gMonth === 7) { // August
    if (gDay < 16) {
      bMonth = 3;
      bDay = 16 + gDay;
    } else {
      bMonth = 4; // Bhadra
      bDay = gDay - 15;
    }
  } else if (gMonth === 8) { // September
    if (gDay < 16) {
      bMonth = 4;
      bDay = 16 + gDay;
    } else {
      bMonth = 5; // Ashwin
      bDay = gDay - 15;
    }
  } else if (gMonth === 9) { // October
    if (gDay < 17) {
      bMonth = 5;
      bDay = 15 + gDay;
    } else {
      bMonth = 6; // Kartik
      bDay = gDay - 16;
    }
  } else if (gMonth === 10) { // November
    if (gDay < 16) {
      bMonth = 6;
      bDay = 15 + gDay;
    } else {
      bMonth = 7; // Agrahayan
      bDay = gDay - 15;
    }
  } else if (gMonth === 11) { // December
    if (gDay < 16) {
      bMonth = 7;
      bDay = 15 + gDay;
    } else {
      bMonth = 8; // Poush
      bDay = gDay - 15;
    }
  } else if (gMonth === 0) { // January
    if (gDay < 15) {
      bMonth = 8;
      bDay = 16 + gDay;
    } else {
      bMonth = 9; // Magh
      bDay = gDay - 14;
    }
  } else if (gMonth === 1) { // February
    if (gDay < 14) {
      bMonth = 9;
      bDay = 17 + gDay;
    } else {
      bMonth = 10; // Falgun
      bDay = gDay - 13;
    }
  } else if (gMonth === 2) { // March
    const febDays = isLeapYear(gYear) ? 29 : 28;
    const falgunRemain = (febDays - 14 + 1);
    if (gDay < 15) {
      bMonth = 10;
      bDay = falgunRemain + gDay;
    } else {
      bMonth = 11; // Chaitra
      bDay = gDay - 14;
    }
  } else if (gMonth === 3 && gDay < 14) { // Early April
    bMonth = 11; // Chaitra
    bDay = 17 + gDay;
  }

  const seasonIndex = Math.floor(bMonth / 2);

  const suffix = getBengaliDaySuffix(bDay);
  const bnStr = `${toBnDigits(bDay)}${suffix} ${BN_MONTHS[bMonth]} ${toBnDigits(bYear)} বঙ্গাব্দ`;
  const enStr = `${bDay} ${EN_BN_MONTHS[bMonth]} ${bYear} BS`;

  return {
    day: bDay,
    month: bMonth,
    year: bYear,
    monthNameBn: BN_MONTHS[bMonth],
    monthNameEn: EN_BN_MONTHS[bMonth],
    seasonBn: BN_SEASONS[seasonIndex] || 'ঋতু',
    seasonEn: EN_SEASONS[seasonIndex] || 'Season',
    formattedBn: bnStr,
    formattedEn: enStr
  };
}

// Format Hijri Date
export function getHijriDate(date: Date) {
  try {
    const formatterBn = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formatterEn = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const partsBn = formatterBn.formatToParts(date);
    const dayBn = partsBn.find(p => p.type === 'day')?.value || '';
    const monthBn = partsBn.find(p => p.type === 'month')?.value || '';
    const yearBn = partsBn.find(p => p.type === 'year')?.value || '';

    const partsEn = formatterEn.formatToParts(date);
    const dayEn = partsEn.find(p => p.type === 'day')?.value || '';
    const monthEn = partsEn.find(p => p.type === 'month')?.value || '';
    const yearEn = partsEn.find(p => p.type === 'year')?.value || '';

    // Day numeric for suffix
    const numDay = parseInt(dayEn, 10) || 1;
    const suffixBn = getBengaliDaySuffix(numDay);

    return {
      formattedBn: `${dayBn}${suffixBn} ${monthBn} ${yearBn} হিজরী`,
      formattedEn: `${dayEn} ${monthEn} ${yearEn} AH`
    };
  } catch {
    // Fallback if Intl is not available
    return {
      formattedBn: `১৬ই শাবান ১৪৪৭ হিজরী`,
      formattedEn: `16 Shaban 1447 AH`
    };
  }
}

// Get Bengali Time Period Description with accurate seasonal twilight/sunset calculation for Bangladesh
export function getBengaliTimePeriod(dateOrHour: Date | number = new Date()): { periodBn: string; periodEn: string } {
  let hours: number;
  let minutes = 0;
  let month = 10; // default November

  if (typeof dateOrHour === 'number') {
    hours = dateOrHour;
    month = new Date().getMonth();
    minutes = new Date().getMinutes();
  } else {
    hours = dateOrHour.getHours();
    minutes = dateOrHour.getMinutes();
    month = dateOrHour.getMonth();
  }

  const timeInMinutes = hours * 60 + minutes;

  // Determine sunset time in Bangladesh:
  // Winter (Mid-October to February: months 9, 10, 11, 0, 1):
  // Sunset occurs early between 5:10 PM and 5:25 PM (17:10 - 17:25).
  // Maghrib starts at ~5:15 PM, bringing 'সন্ধ্যা' (Evening)!
  // Summer (April to August: months 3 to 7): Sunset is ~6:30 PM (18:30).
  // Spring/Autumn: Sunset is ~5:50 PM (17:50).
  let sunsetMinute = 18 * 60; // 6:00 PM default
  if (month >= 9 || month <= 1) {
    sunsetMinute = 17 * 60 + 10; // 5:10 PM in winter
  } else if (month >= 3 && month <= 7) {
    sunsetMinute = 18 * 60 + 30; // 6:30 PM in summer
  } else {
    sunsetMinute = 17 * 60 + 50; // 5:50 PM
  }

  // Evening (সন্ধ্যা) continues until Esha / nightfall (~1 hour 45 minutes after sunset)
  const nightfallMinute = sunsetMinute + 105;

  let periodBn = 'রাত';
  const periodEn = hours >= 12 ? 'PM' : 'AM';

  if (timeInMinutes >= 4 * 60 && timeInMinutes < 6 * 60) {
    periodBn = 'ভোর';
  } else if (timeInMinutes >= 6 * 60 && timeInMinutes < 12 * 60) {
    periodBn = 'সকাল';
  } else if (timeInMinutes >= 12 * 60 && timeInMinutes < 15 * 60 + 30) {
    periodBn = 'দুপুর';
  } else if (timeInMinutes >= 15 * 60 + 30 && timeInMinutes < sunsetMinute) {
    periodBn = 'বিকাল';
  } else if (timeInMinutes >= sunsetMinute && timeInMinutes < nightfallMinute) {
    periodBn = 'সন্ধ্যা';
  } else {
    periodBn = 'রাত';
  }

  return { periodBn, periodEn };
}

// Get Full Triple Calendar Info
export function getTripleCalendarInfo(date: Date = new Date()): TripleCalendarInfo {
  // Gregorian
  const gDay = date.getDate();
  const gMonth = date.getMonth();
  const gYear = date.getFullYear();
  const dayOfWeek = date.getDay();

  const gDaySuffix = getBengaliDaySuffix(gDay);
  const gregBn = `${toBnDigits(gDay)}${gDaySuffix} ${GREG_MONTHS_BN[gMonth]} ${toBnDigits(gYear)} ইং`;
  const gregEn = `${gDay} ${GREG_MONTHS_EN[gMonth]} ${gYear} AD`;

  // Bangla
  const bangla = getBanglaDate(date);

  // Hijri
  const hijri = getHijriDate(date);

  // Time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hours12 = hours % 12 || 12;
  const { periodBn, periodEn } = getBengaliTimePeriod(date);

  const pad = (n: number) => String(n).padStart(2, '0');

  const timeBn = `সময় ${periodBn} ${toBnDigits(pad(hours12))}:${toBnDigits(pad(minutes))}:${toBnDigits(pad(seconds))} মিনিট`;
  const timeEn = `${pad(hours12)}:${pad(minutes)}:${pad(seconds)} ${periodEn}`;

  return {
    gregorian: {
      bn: gregBn,
      en: gregEn,
      dayNameBn: DAYS_BN[dayOfWeek],
      dayNameEn: DAYS_EN[dayOfWeek]
    },
    bangla: {
      bn: bangla.formattedBn,
      en: bangla.formattedEn,
      seasonBn: bangla.seasonBn,
      seasonEn: bangla.seasonEn
    },
    hijri: {
      bn: hijri.formattedBn,
      en: hijri.formattedEn
    },
    time: {
      bn: timeBn,
      en: timeEn,
      periodBn,
      periodEn
    }
  };
}
