import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.maxhoang.com.au'

  // Static pages that will always be available
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/study-journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Try to get dynamic content, but don't fail the build if it's not available
  try {
    // Import here to avoid webpack issues during build
    const { getBlogPosts } = await import('../lib/notion-api')
    const posts = await getBlogPosts()

    // Blog posts
    const blogPages = posts
      .filter(post => post.status === 'published')
      .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: post.isFeatured ? 0.9 : 0.8,
      }))

    return [
      ...staticPages,
      ...blogPages,
    ]
  } catch (error) {
    console.warn('Could not fetch dynamic content for sitemap, using static pages only:', error)

    // Return static pages only if dynamic content fails
    return staticPages
  }
}
