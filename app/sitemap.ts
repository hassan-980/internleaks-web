import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://internleaks.in',
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 1, 
    }
  ]
}