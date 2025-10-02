import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { generateSlug } from './seo-utils'

// Initialize the official Notion API client with your token
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// Keep the unofficial client for page rendering only
const notionUnofficial = new NotionAPI()

// Page IDs extracted from the URLs
export const PAGE_IDS = {
  home: '23f792d80ba380189a58c946bdcad944',
  projects: '23f792d80ba380a2a8ddd56aee32216a',
  contact: '237792d80ba38002b795d261ca17b305'
}

// Database IDs (cleaned format without dashes)
export const DATABASE_IDS = {
  blog: '237792d80ba38063ac29cc15fe37ffbb',
  timeline: '22b792d80ba3808db9e9c129d735ef7b',
  studyJournal: '250792d80ba380aa81c7d0b21421c830', // New Study Journal database
  aiGuide: '27d792d80ba380e59c2af084b131dbc7',
  events: '252792d80ba38097a898f3d9cae0ad95'
}

// Events interface
export interface Event {
  id: string
  title: string
  description?: string
  date?: string
  endDate?: string
  location?: string
  category?: string
  tags?: string[]
  status?: string
  coverImage?: string
  isFeatured?: boolean
  url?: string
  isUpcoming?: boolean
  icon?: string
  content?: any
  startDate?: string
  progress?: number
}

// Blog post interface
export interface BlogPost {
  id: string
  title: string
  excerpt?: string
  publishDate?: string
  slug?: string
  seoSlug?: string
  tags?: string[]
  status?: string
  coverImage?: string
  isFeatured?: boolean
  readTime?: string
  url?: string
  password?: string
}

// Timeline item interface
export interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  category?: string
  tags?: string[]
  content?: any
  coverImage?: string
  url?: string
  isFeatured?: boolean
}

// Study Journal post interface (similar to BlogPost)
export interface StudyJournalPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  publishedDate?: string
  lastEditedDate?: string
  tags?: string[]
  category?: string
  status?: string
  isFeatured?: boolean
  readingTime?: string
  authors?: string[]
  password?: string
}



// Function to get blog posts using official Notion API
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const databaseId = DATABASE_IDS.blog

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Last Edited',
          direction: 'descending'
        }
      ]
    })

    const posts: BlogPost[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        // Extract title (use "Name" as it's the title field in this database)
        let title = 'Untitled'
        const titleProp = page.properties.Name
        if (titleProp && titleProp.type === 'title' && titleProp.title.length > 0) {
          title = titleProp.title.map((t: any) => t.plain_text).join('')
        }

        // Extract excerpt/description
        let excerpt = ''
        const excerptProp = page.properties.Description
        if (excerptProp && excerptProp.type === 'rich_text' && excerptProp.rich_text.length > 0) {
          excerpt = excerptProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract publish date (use "Published" date field)
        let publishDate = ''
        const dateProp = page.properties.Published
        if (dateProp && dateProp.type === 'date' && dateProp.date) {
          publishDate = dateProp.date.start
        }

        // Extract tags
        let tags: string[] = []
        const tagsProp = page.properties.Tags
        if (tagsProp && tagsProp.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
          tags = tagsProp.multi_select.map((tag: any) => tag.name)
        }

        // Extract category
        const categoryProp = page.properties.Category
        if (categoryProp && categoryProp.type === 'select' && categoryProp.select && 'name' in categoryProp.select) {
          tags.push(categoryProp.select.name)
        }

        // Extract status
        let status = 'published'
        const statusProp = page.properties.Status
        if (statusProp && statusProp.type === 'select' && statusProp.select && 'name' in statusProp.select) {
          status = statusProp.select.name
        }

        // Extract featured status
        let isFeatured = false
        const featuredProp = page.properties.Featured
        if (featuredProp && featuredProp.type === 'checkbox') {
          isFeatured = Boolean(featuredProp.checkbox)
        }

        // Extract password
        let password = ''
        const passwordProp = page.properties.Password || page.properties.password
        if (passwordProp && passwordProp.type === 'rich_text' && passwordProp.rich_text.length > 0) {
          password = passwordProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract cover image
        let coverImage = ''
        if ('cover' in page && page.cover && page.cover !== null) {
          const pageCover = page.cover as any
          if (pageCover.type === 'external') {
            coverImage = pageCover.external.url
          } else if (pageCover.type === 'file') {
            coverImage = pageCover.file.url
          }
        }

        // Calculate read time based on excerpt length
        const readTime = excerpt ? `${Math.max(1, Math.ceil(excerpt.length / 200))} min read` : '2 min read'

        // Get page URL
        const url = (page as any).url || `https://notion.so/${page.id.replace(/-/g, '')}`

        // Generate SEO-friendly slug
        const seoSlug = generateSlug(title)

        posts.push({
          id: page.id,
          title,
          excerpt,
          publishDate,
          slug: seoSlug || page.id, // Fallback to ID if slug generation fails
          seoSlug: seoSlug,
          tags,
          status,
          coverImage,
          isFeatured,
          readTime,
          url,
          password
        })
      }
    }

    return posts

  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Function to get AI Guide posts using official Notion API
export async function getAiGuidePosts(): Promise<BlogPost[]> {
  try {
    const databaseId = DATABASE_IDS.aiGuide

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Last Edited',
          direction: 'descending'
        }
      ]
    })

    const posts: BlogPost[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        // Title
        let title = 'Untitled'
        const titleProp: any = (page as any).properties['Name'] || (page as any).properties['Title']
        if (titleProp && titleProp.type === 'title' && Array.isArray(titleProp.title) && titleProp.title.length > 0) {
          title = titleProp.title.map((t: any) => t.plain_text).join('')
        }

        // Excerpt/Description
        let excerpt = ''
        const excerptProp: any = (page as any).properties['Description'] || (page as any).properties['Excerpt'] || (page as any).properties['Summary']
        if (excerptProp && excerptProp.type === 'rich_text' && Array.isArray(excerptProp.rich_text) && excerptProp.rich_text.length > 0) {
          excerpt = excerptProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Publish date
        let publishDate = ''
        const dateProp: any = (page as any).properties['Published'] || (page as any).properties['Date'] || (page as any).properties['Created']
        if (dateProp && dateProp.type === 'date' && dateProp.date) {
          publishDate = dateProp.date.start
        }

        // Tags
        let tags: string[] = []
        const tagsProp: any = (page as any).properties['Tags']
        if (tagsProp && tagsProp.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
          tags = tagsProp.multi_select.map((tag: any) => tag.name)
        }

        // Category
        const categoryProp: any = (page as any).properties['Category'] || (page as any).properties['Type']
        if (categoryProp && categoryProp.type === 'select' && categoryProp.select && 'name' in categoryProp.select) {
          tags.push(categoryProp.select.name)
        }

        // Status
        let status = 'published'
        const statusProp: any = (page as any).properties['Status']
        if (statusProp && statusProp.type === 'select' && statusProp.select && 'name' in statusProp.select) {
          status = statusProp.select.name
        }

        // Featured
        let isFeatured = false
        const featuredProp: any = (page as any).properties['Featured']
        if (featuredProp && featuredProp.type === 'checkbox') {
          isFeatured = Boolean(featuredProp.checkbox)
        }

        // Password
        let password = ''
        const passwordProp: any = (page as any).properties['Password'] || (page as any).properties['password']
        if (passwordProp && passwordProp.type === 'rich_text' && Array.isArray(passwordProp.rich_text) && passwordProp.rich_text.length > 0) {
          password = passwordProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Cover image
        let coverImage = ''
        if ('cover' in page && (page as any).cover) {
          const pageCover: any = (page as any).cover
          if (pageCover.type === 'external') {
            coverImage = pageCover.external.url
          } else if (pageCover.type === 'file') {
            coverImage = pageCover.file.url
          }
        }

        // Read time
        const readTime = excerpt ? `${Math.max(1, Math.ceil(excerpt.length / 200))} min read` : '2 min read'

        // URL
        const url = (page as any).url || `https://notion.so/${(page as any).id.replace(/-/g, '')}`

        // Slug
        const seoSlug = generateSlug(title)

        posts.push({
          id: (page as any).id,
          title,
          excerpt,
          publishDate,
          slug: seoSlug || (page as any).id,
          seoSlug,
          tags,
          status,
          coverImage,
          isFeatured,
          readTime,
          url,
          password
        })
      }
    }

    return posts
  } catch (error) {
    console.error('Error fetching AI Guide posts:', error)
    return []
  }
}

// Function to get events using official Notion API
export async function getEvents(): Promise<Event[]> {
  try {
    // Events DB removed during cleanup; return empty list to avoid runtime errors
    return []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Function to get event content
export async function getEventContent(eventId: string) {
  try {
    // Stub: return empty object for event content
    return {}
  } catch (error) {
    console.error('Error fetching event content:', error)
    throw error
  }
}

// Function to get timeline items using official Notion API
export async function getTimelineItems(): Promise<TimelineItem[]> {
  try {
    const databaseId = DATABASE_IDS.timeline

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })

    const items: TimelineItem[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        // Extract title
        let title = 'Untitled'
        const titleProp = page.properties.Title
        if (titleProp && titleProp.type === 'title' && titleProp.title.length > 0) {
          title = titleProp.title.map((t: any) => t.plain_text).join('')
        }

        // Extract description
        let description = ''
        const descProp = page.properties.Description
        if (descProp && descProp.type === 'rich_text' && descProp.rich_text.length > 0) {
          description = descProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract date
        let date = ''
        const dateProp = page.properties.Date
        if (dateProp && dateProp.type === 'date' && dateProp.date) {
          date = dateProp.date.start
        }

        // Extract category
        let category = ''
        const categoryProp = page.properties.Category
        if (categoryProp && categoryProp.type === 'select' && categoryProp.select && 'name' in categoryProp.select) {
          category = categoryProp.select.name
        }

        // Extract tags
        let tags: string[] = []
        const tagsProp = page.properties.Tags
        if (tagsProp && tagsProp.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
          tags = tagsProp.multi_select.map((tag: any) => tag.name)
        }

        // Extract featured status
        let isFeatured = false
        const featuredProp = page.properties.Featured || page.properties.featured
        if (featuredProp && featuredProp.type === 'checkbox') {
          isFeatured = Boolean(featuredProp.checkbox)
        }

        // Extract cover image
        let coverImage = ''
        if ('cover' in page && page.cover && page.cover !== null) {
          const pageCover = page.cover as any
          if (pageCover.type === 'external') {
            coverImage = pageCover.external.url
          } else if (pageCover.type === 'file') {
            coverImage = pageCover.file.url
          }
        }

        // Get page URL
        const url = (page as any).url || `https://notion.so/${page.id.replace(/-/g, '')}`

        items.push({
          id: page.id,
          title,
          description,
          date,
          category,
          tags,
          coverImage,
          url,
          content: page,
          isFeatured
        })
      }
    }

    return items

  } catch (error) {
    console.error('Error fetching timeline items:', error)
    return []
  }
}

// Function to get timeline item content
export async function getTimelineItemContent(itemId: string) {
  try {
    const recordMap = await notionUnofficial.getPage(itemId)
    return recordMap
  } catch (error) {
    console.error('Error fetching timeline item:', error)
    throw error
  }
}

// Function to get a single blog post
export async function getBlogPost(postId: string) {
  try {
    const recordMap = await notionUnofficial.getPage(postId)
    return recordMap
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }
}

// Function to get a Notion page using unofficial API (for page rendering)
export async function getNotionPage(pageId: string) {
  try {
    const recordMap = await notionUnofficial.getPage(pageId)
    return recordMap
  } catch (error) {
    console.error('Error fetching Notion page:', error)
    throw error
  }
}

// Extract the first image URL from a Notion page using the unofficial API
export async function getFirstImageUrlFromPage(pageId: string): Promise<string | null> {
  try {
    const recordMap = await notionUnofficial.getPage(pageId)
    const blocks = recordMap?.block || {}
    for (const key of Object.keys(blocks)) {
      const block: any = (blocks as any)[key]?.value || (blocks as any)[key]
      if (!block) continue
      if (block.type === 'image') {
        const src = block?.properties?.source?.[0]?.[0]
        const display = block?.format?.display_source
        const url = display || src
        if (typeof url === 'string' && url.length > 0) return url
      }
      // Sometimes images are inside callouts or column blocks children; check children order
      const children = block?.content
      if (Array.isArray(children)) {
        for (const childId of children) {
          const child = (blocks as any)[childId]?.value || (blocks as any)[childId]
          if (child?.type === 'image') {
            const src = child?.properties?.source?.[0]?.[0]
            const display = child?.format?.display_source
            const url = display || src
            if (typeof url === 'string' && url.length > 0) return url
          }
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error extracting first image from page:', error)
    return null
  }
}

// Function to get study journal posts using official Notion API
export async function getStudyJournalPosts(): Promise<StudyJournalPost[]> {
  try {
    const databaseId = DATABASE_IDS.studyJournal

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Last Edited',
          direction: 'descending'
        }
      ]
    })

    const posts: StudyJournalPost[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        console.log('Study Blog Page Properties:', Object.keys(page.properties))
        console.log('Full page properties structure:', JSON.stringify(page.properties, null, 2))

        // Extract title (required field)
        let title = 'Untitled'
        const titleProperty = page.properties['Name'] || page.properties['Title']
        if (titleProperty && titleProperty.type === 'title' && titleProperty.title.length > 0) {
          title = titleProperty.title.map((t: any) => t.plain_text).join('')
        }

        // Extract excerpt/description
        let excerpt = ''
        const excerptProperty = page.properties['Excerpt'] || page.properties['Description'] || page.properties['Summary']
        if (excerptProperty && excerptProperty.type === 'rich_text' && excerptProperty.rich_text.length > 0) {
          excerpt = excerptProperty.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract tags
        let tags: string[] = []
        const tagsProperty = page.properties['Tags']
        if (tagsProperty && tagsProperty.type === 'multi_select') {
          tags = tagsProperty.multi_select.map((tag: any) => tag.name)
        }

        // Extract category
        let category = ''
        const categoryProperty = page.properties['Category'] || page.properties['Type']
        if (categoryProperty && categoryProperty.type === 'select' && categoryProperty.select) {
          category = categoryProperty.select.name
        }

        // Extract status
        let status = 'Published'
        const statusProperty = page.properties['Status']
        if (statusProperty && statusProperty.type === 'select' && statusProperty.select) {
          status = statusProperty.select.name
        }

        // Extract published date
        let publishedDate = ''
        const publishedProperty = page.properties['Published'] || page.properties['Date'] || page.properties['Created']
        if (publishedProperty && publishedProperty.type === 'date' && publishedProperty.date) {
          publishedDate = publishedProperty.date.start
        }

        // Extract featured status
        let isFeatured = false
        const featuredProperty = page.properties['Featured']
        if (featuredProperty && featuredProperty.type === 'checkbox') {
          isFeatured = featuredProperty.checkbox
        }

        // Extract password
        let password = ''
        const passwordProperty = page.properties['Password']
        if (passwordProperty && passwordProperty.type === 'rich_text' && passwordProperty.rich_text.length > 0) {
          password = passwordProperty.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract cover image
        let coverImage = ''
        if ('cover' in page && page.cover && page.cover !== null) {
          const pageCover = page.cover as any
          if (pageCover.type === 'external') {
            coverImage = pageCover.external.url
          } else if (pageCover.type === 'file') {
            coverImage = pageCover.file.url
          }
        }

        // Generate SEO-friendly slug
        const slug = generateSlug(title)

        // Get last edited date
        const lastEditedDate = (page as any).last_edited_time

        // Only include published posts (unless status filtering is needed)
        if (status === 'Published') {
          posts.push({
            id: page.id,
            title,
            slug,
            excerpt,
            coverImage,
            publishedDate,
            lastEditedDate,
            tags,
            category,
            status,
            isFeatured,
            password
          })
        }
      }
    }

    return posts

  } catch (error) {
    console.error('Error fetching study journal posts:', error)
    return []
  }
}

// Function to get a single study journal post content
export async function getStudyJournalPostContent(postId: string) {
  try {
    const recordMap = await notionUnofficial.getPage(postId)
    return recordMap
  } catch (error) {
    console.error('Error fetching study journal post content:', error)
    throw error
  }
}

// Page metadata interface
export interface PageMetadata {
  id: string
  title: string
  icon?: string
  cover?: string
}

// Function to get page metadata (title, icon, cover) using official API
export async function getPageMetadata(pageId: string): Promise<PageMetadata | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId })

    if (!('properties' in response)) {
      return null
    }

    // Extract title
    let title = 'Untitled'
    const titleProperty = Object.values(response.properties).find((prop: any) => prop.type === 'title')
    if (titleProperty && titleProperty.type === 'title' && titleProperty.title.length > 0) {
      title = titleProperty.title.map((t: any) => t.plain_text).join('')
    }

    // Extract icon
    let icon = ''
    if ('icon' in response && response.icon) {
      const pageIcon = response.icon as any
      if (pageIcon.type === 'emoji') {
        icon = pageIcon.emoji
      } else if (pageIcon.type === 'external') {
        icon = pageIcon.external.url
      } else if (pageIcon.type === 'file') {
        icon = pageIcon.file.url
      }
    }

    // Extract cover image
    let cover = ''
    if ('cover' in response && response.cover) {
      const pageCover = response.cover as any
      if (pageCover.type === 'external') {
        cover = pageCover.external.url
      } else if (pageCover.type === 'file') {
        cover = pageCover.file.url
      }
    }

    return {
      id: pageId,
      title,
      icon,
      cover
    }
  } catch (error) {
    console.error('Error fetching page metadata:', error)
    return null
  }
}

// Function to get page by key
export async function getPageByKey(key: keyof typeof PAGE_IDS) {
  const pageId = PAGE_IDS[key]
  return getNotionPage(pageId)
}

// Function to get page by key with metadata
export async function getPageByKeyWithMetadata(key: keyof typeof PAGE_IDS) {
  const pageId = PAGE_IDS[key]
  const [recordMap, metadata] = await Promise.all([
    getNotionPage(pageId),
    getPageMetadata(pageId)
  ])
  return { recordMap, metadata }
}
