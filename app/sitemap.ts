import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://internleaks.in',
      lastModified: new Date(),
      changeFrequency: 'daily', // Daily kyunki naye scams wall par add hote rahenge
      priority: 1, // 1 ka matlab sabse high priority
    }
  ]
}