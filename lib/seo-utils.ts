// SEO utility functions for slug generation and meta optimization

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    // Remove emojis and special characters
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Replace spaces and special chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')

  // Intelligent truncation - don't break words
  if (slug.length > 80) {
    // Find the last hyphen before the 80 character limit
    const truncated = slug.substring(0, 80)
    const lastHyphen = truncated.lastIndexOf('-')

    if (lastHyphen > 50) { // Ensure we don't truncate too much
      slug = truncated.substring(0, lastHyphen)
    } else {
      slug = truncated.replace(/-$/, '')
    }
  }

  return slug
}

/**
 * Truncate text for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

/**
 * Extract keywords from text
 */
export function extractKeywords(title: string, excerpt?: string): string[] {
  const text = `${title} ${excerpt || ''}`.toLowerCase()
  
  // Common stop words to exclude
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'i', 'you', 'my', 'me', 'we', 'us'
  ])
  
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
  
  // Get unique words and return top 10
  const uniqueWords = [...new Set(words)]
  return uniqueWords.slice(0, 10)
}

/**
 * Generate comprehensive meta tags for a page
 */
export interface MetaConfig {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  section?: string
}

export function generateMetaTags(config: MetaConfig) {
  const keywords = extractKeywords(config.title, config.description)
  
  return {
    title: config.title,
    description: truncateDescription(config.description),
    keywords: keywords.join(', '),
    openGraph: {
      title: config.title,
      description: truncateDescription(config.description),
      url: config.url,
      type: config.type || 'website',
      images: config.image ? [{
        url: config.image,
        width: 1200,
        height: 630,
        alt: config.title,
      }] : [],
      siteName: 'Max Hoang',
      ...(config.type === 'article' && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
        authors: config.author ? [config.author] : ['Max Hoang'],
        section: config.section || 'Blog',
        tags: config.tags || [],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: truncateDescription(config.description),
      images: config.image ? [config.image] : [],
      creator: '@maxhoangau',
      site: '@maxhoangau',
    },
    other: {
      'article:author': config.author || 'Max Hoang',
      'article:published_time': config.publishedTime,
      'article:modified_time': config.modifiedTime,
      'article:section': config.section || 'Blog',
      'article:tag': config.tags?.join(', '),
    },
  }
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(config: MetaConfig & { 
  readTime?: string 
  wordCount?: number 
}) {
  const baseUrl = 'https://www.maxhoang.com.au'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.description,
    url: config.url,
    datePublished: config.publishedTime,
    dateModified: config.modifiedTime || config.publishedTime,
    author: {
      '@type': 'Person',
      name: config.author || 'Max Hoang',
      url: baseUrl,
      sameAs: [
        'https://www.linkedin.com/in/maxhoangau/',
        'https://github.com/HoangCuongMax'
      ]
    },
    publisher: {
      '@type': 'Person',
      name: 'Max Hoang',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=200',
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url
    },
    image: config.image ? {
      '@type': 'ImageObject',
      url: config.image,
      width: 1200,
      height: 630
    } : undefined,
    keywords: extractKeywords(config.title, config.description).join(', '),
    wordCount: config.wordCount,
    timeRequired: config.readTime,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      name: 'Max Hoang Blog',
      url: `${baseUrl}/blog`
    }
  }
}

/**
 * Generate website structured data
 */
export function generateWebsiteStructuredData() {
  const baseUrl = 'https://www.maxhoang.com.au'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Max Hoang',
    alternateName: 'Max Hoang - Personal Website',
    url: baseUrl,
    description: 'Personal website of Max Hoang featuring projects, blog, study journal, and professional information.',
    author: {
      '@type': 'Person',
      name: 'Max Hoang',
      url: baseUrl,
      jobTitle: 'AI & Technology Enthusiast',
      description: 'Master\'s student in Artificial Intelligence at Charles Darwin University, passionate about technology and web development.',
      sameAs: [
        'https://www.linkedin.com/in/maxhoangau/',
        'https://github.com/HoangCuongMax'
      ],
      image: 'https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=400'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Max Hoang',
      url: baseUrl
    }
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}
