import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Block Google from indexing the API backend specifically
    },
    sitemap: 'https://ai-resume-builder-amaan-alys-projects.vercel.app/sitemap.xml',
  }
}
