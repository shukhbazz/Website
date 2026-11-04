import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shukhbazz.info.bd';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          bn: `${baseUrl}?lang=bn`,
          en: `${baseUrl}?lang=en`,
        },
      },
    },
  ];
}
