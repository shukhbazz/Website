import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://shukhbazz.info.bd'),
  title: {
    default: 'সুখবাজ | Shukhbazz — Official Digital Space & Portfolio',
    template: '%s | সুখবাজ (Shukhbazz)',
  },
  description:
    'সুখবাজ (Shukhbazz / শুখবাজ) এর অফিশিয়াল ব্যক্তিগত ওয়েবসাইট ও ডিজিটাল স্পেস (shukhbazz.info.bd)। জীবনদর্শন, অনুপ্রেরণামূলক নির্বাচিত বাণী, স্মৃতিময় গ্যালারি ও সৃজনশীল কাজের সংগ্রহশালা।',
  keywords: [
    'সুখবাজ',
    'শুখবাজ',
    'shukhbazz',
    'shukbazz',
    'shukhbazz.info.bd',
    'সুখবাজ ওয়েবসাইট',
    'সুখবাজ পোর্টফোলিও',
    'Shukhbazz Official',
    'Shukhbazz Website',
    'সুখবাজ বাণী',
    'Shukhbazz Portfolio',
    'Shukhbazz Digital Space',
    'sukbazz',
    'সুখবাজ বাংলাদেশ'
  ],
  authors: [{ name: 'সুখবাজ (Shukhbazz)', url: 'https://shukhbazz.info.bd' }],
  creator: 'সুখবাজ (Shukhbazz)',
  publisher: 'সুখবাজ (Shukhbazz)',
  applicationName: 'সুখবাজ | Shukhbazz',
  category: 'Personal Space & Portfolio',
  alternates: {
    canonical: 'https://shukhbazz.info.bd',
    languages: {
      'bn-BD': 'https://shukhbazz.info.bd?lang=bn',
      'en-US': 'https://shukhbazz.info.bd?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    url: 'https://shukhbazz.info.bd',
    siteName: 'সুখবাজ | Shukhbazz',
    title: 'সুখবাজ | Shukhbazz — Official Digital Space & Portfolio',
    description:
      'সুখবাজ (Shukhbazz) এর অফিশিয়াল ডিজিটাল স্পেস (shukhbazz.info.bd)। জীবনদর্শন, অনুপ্রেরণামূলক বাণী ও সৃষ্টিশীল ভুবন।',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'সুখবাজ | Shukhbazz Official Digital Space',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'সুখবাজ | Shukhbazz — Official Digital Space',
    description:
      'সুখবাজ (Shukhbazz / শুখবাজ) এর অফিশিয়াল ব্যক্তিগত ওয়েবসাইট ও ডিজিটাল স্পেস (shukhbazz.info.bd)।',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/icon.svg',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://shukhbazz.info.bd/#person',
      name: 'Shukhbazz',
      alternateName: ['সুখবাজ', 'শুখবাজ', 'shukhbazz', 'shukbazz', 'Shukhbazz Official'],
      url: 'https://shukhbazz.info.bd',
      image: 'https://shukhbazz.info.bd/icon.svg',
      description: 'ব্যক্তিগত স্পেস, নিজস্ব ভাবনা ও জীবনদর্শন — সুখবাজ (Shukhbazz)',
      jobTitle: 'Creator & Thinker',
      sameAs: ['https://shukhbazz.info.bd']
    },
    {
      '@type': 'WebSite',
      '@id': 'https://shukhbazz.info.bd/#website',
      url: 'https://shukhbazz.info.bd',
      name: 'সুখবাজ | Shukhbazz',
      alternateName: [
        'shukhbazz.info.bd',
        'সুখবাজ',
        'শুখবাজ',
        'shukhbazz',
        'shukbazz',
        'Shukhbazz Website'
      ],
      description: 'সুখবাজ (Shukhbazz) এর অফিশিয়াল ডিজিটাল স্পেস ও পার্সোনাল ওয়েবসাইট।',
      publisher: {
        '@id': 'https://shukhbazz.info.bd/#person'
      },
      inLanguage: ['bn-BD', 'en-US']
    },
    {
      '@type': 'WebPage',
      '@id': 'https://shukhbazz.info.bd/#webpage',
      url: 'https://shukhbazz.info.bd',
      name: 'সুখবাজ | Shukhbazz — Official Digital Space & Portfolio',
      isPartOf: {
        '@id': 'https://shukhbazz.info.bd/#website'
      },
      about: {
        '@id': 'https://shukhbazz.info.bd/#person'
      },
      description: 'সুখবাজ (Shukhbazz / শুখবাজ) এর অফিশিয়াল ব্যক্তিগত ওয়েবসাইট ও জীবনদর্শনের সংকলন।'
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
