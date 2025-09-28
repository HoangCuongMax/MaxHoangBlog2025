import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { generateSlug } from './seo-utils'

// Initialize the official Notion API client with your token
const hasOfficialToken = Boolean(process.env.NOTION_TOKEN && process.env.NOTION_TOKEN.startsWith('secret_'))
if (!hasOfficialToken) {
  console.warn('NOTION_TOKEN missing or not an integration token (expected to start with "secret_"). Official Notion API calls will be skipped.')
}
const notion = new Client({
  auth: hasOfficialToken ? process.env.NOTION_TOKEN : undefined,
})

// Keep the unofficial client for page rendering only (optionally with auth for private pages)
const notionUnofficial = new NotionAPI({
  authToken: process.env.NOTION_AUTH_TOKEN || undefined,
  activeUser: process.env.NOTION_ACTIVE_USER || undefined,
})

// Helper to allow overriding IDs via environment variables
const envOr = (key: string, fallback: string) => {
  const v = process.env[key]
  return v && v.trim().length > 0 ? v : fallback
}

// Page IDs extracted from the URLs (overridable via env)
export const PAGE_IDS = {
  home: envOr('NOTION_PAGE_HOME', '23f792d80ba380189a58c946bdcad944'),
  projects: envOr('NOTION_PAGE_PROJECTS', '23f792d80ba380a2a8ddd56aee32216a'),
  contact: envOr('NOTION_PAGE_CONTACT', '237792d80ba38002b795d261ca17b305'),
  aiGuide: envOr('NOTION_PAGE_AI_GUIDE', '27a792d80ba38094ae60c555dd2f4c1e'),
  dailyJournal: envOr('NOTION_PAGE_DAILY_JOURNAL', '27c792d80ba380d0b6c6d79cb8a235a5')
}

// Database IDs (overridable via env)
export const DATABASE_IDS = {
  blog: envOr('NOTION_DB_BLOG', '237792d80ba38063ac29cc15fe37ffbb'),
  timeline: envOr('NOTION_DB_TIMELINE', '22b792d80ba3808db9e9c129d735ef7b'),
  studyJournal: envOr('NOTION_DB_STUDY_JOURNAL', '250792d80ba380aa81c7d0b21421c830'),
  events: envOr('NOTION_DB_EVENTS', '252792d80ba38097a898f3d9cae0ad95')
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
  content?: any // For Notion page content
  startDate?: string
  progress?: number // Calculated progress between start and end dates
}


// Function to get blog posts using official Notion API
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!hasOfficialToken) return []
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

// Function to get timeline items using official Notion API
export async function getTimelineItems(): Promise<TimelineItem[]> {
  try {
    if (!hasOfficialToken) return []
    const databaseId = DATABASE_IDS.timeline

    let response
    try {
      response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          {
            property: 'Date',
            direction: 'descending'
          }
        ]
      })
    } catch (e) {
      // Fallback if 'Date' property doesn't exist or sort fails
      response = await notion.databases.query({ database_id: databaseId })
    }

    const items: TimelineItem[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        // Extract title (find any title prop)
        let title = 'Untitled'
        const titleProp = Object.values(page.properties).find((p: any) => p?.type === 'title') as any
        if (titleProp?.title?.length) {
          title = titleProp.title.map((t: any) => t.plain_text).join('')
        }

        // Extract description (first rich_text)
        let description = ''
        const descProp = Object.values(page.properties).find((p: any) => p?.type === 'rich_text') as any
        if (descProp?.rich_text?.length) {
          description = descProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract date (first date prop)
        let date = ''
        const dateProp = Object.values(page.properties).find((p: any) => p?.type === 'date' && p?.date) as any
        if (dateProp?.date) {
          date = dateProp.date.start
        }

        // Extract category (first select)
        let category = ''
        const categoryProp = Object.values(page.properties).find((p: any) => p?.type === 'select' && p?.select) as any
        if (categoryProp?.select?.name) {
          category = categoryProp.select.name
        }

        // Extract tags (first multi_select)
        let tags: string[] = []
        const tagsProp = Object.values(page.properties).find((p: any) => p?.type === 'multi_select' && Array.isArray(p?.multi_select)) as any
        if (tagsProp?.multi_select) {
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
    if (!hasOfficialToken) return []
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
    if (!hasOfficialToken) return null
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

// Function to get events using official Notion API
export async function getEvents(): Promise<Event[]> {
  try {
    if (!hasOfficialToken) return []
    const databaseId = DATABASE_IDS.events

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'ascending'
        }
      ]
    })

    const events: Event[] = []

    for (const page of response.results) {
      if ('properties' in page) {
        // Extract title
        let title = 'Untitled Event'
        const titleProp = page.properties.Name || page.properties.Title
        if (titleProp && titleProp.type === 'title' && titleProp.title.length > 0) {
          title = titleProp.title.map((t: any) => t.plain_text).join('')
        }

        // Extract description
        let description = ''
        const descProp = page.properties.Description || page.properties.Summary
        if (descProp && descProp.type === 'rich_text' && descProp.rich_text.length > 0) {
          description = descProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract start date and end date
        let date = ''
        let endDate = ''
        let startDate = ''
        const dateProp = page.properties.Date || page.properties.StartDate
        if (dateProp && dateProp.type === 'date' && dateProp.date) {
          date = dateProp.date.start
          startDate = dateProp.date.start
          if (dateProp.date.end) {
            endDate = dateProp.date.end
          }
        }

        // Also check for separate EndDate property
        const endDateProp = page.properties.EndDate
        if (endDateProp && endDateProp.type === 'date' && endDateProp.date) {
          endDate = endDateProp.date.start
        }

        // Extract location
        let location = ''
        const locationProp = page.properties.Location
        if (locationProp && locationProp.type === 'rich_text' && locationProp.rich_text.length > 0) {
          location = locationProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Extract category
        let category = ''
        const categoryProp = page.properties.Category || page.properties.Type
        if (categoryProp && categoryProp.type === 'select' && categoryProp.select) {
          category = categoryProp.select.name
        }

        // Extract tags
        let tags: string[] = []
        const tagsProp = page.properties.Tags
        if (tagsProp && tagsProp.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
          tags = tagsProp.multi_select.map((tag: any) => tag.name)
        }

        // Extract status
        let status = 'published'
        const statusProp = page.properties.Status
        if (statusProp && statusProp.type === 'select' && statusProp.select) {
          status = statusProp.select.name
        }

        // Extract featured status
        let isFeatured = false
        const featuredProp = page.properties.Featured
        if (featuredProp && featuredProp.type === 'checkbox') {
          isFeatured = featuredProp.checkbox
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

        // Extract URL
        let url = ''
        const urlProp = page.properties.URL || page.properties.Link
        if (urlProp && urlProp.type === 'url' && urlProp.url) {
          url = urlProp.url
        }

        // Extract icon
        let icon = ''
        const iconProp = page.properties.Icon
        if (iconProp && iconProp.type === 'rich_text' && iconProp.rich_text.length > 0) {
          icon = iconProp.rich_text.map((t: any) => t.plain_text).join('')
        }

        // Also check for page icon
        if (!icon && 'icon' in page && page.icon) {
          const pageIcon = page.icon as any
          if (pageIcon.type === 'emoji') {
            icon = pageIcon.emoji
          } else if (pageIcon.type === 'external') {
            icon = pageIcon.external.url
          } else if (pageIcon.type === 'file') {
            icon = pageIcon.file.url
          }
        }

        // Calculate progress if both start and end dates exist
        let progress = 0
        if (startDate && endDate) {
          const start = new Date(startDate)
          const end = new Date(endDate)
          const now = new Date()

          if (now >= start && now <= end) {
            const total = end.getTime() - start.getTime()
            const elapsed = now.getTime() - start.getTime()
            progress = Math.round((elapsed / total) * 100)
          } else if (now > end) {
            progress = 100
          }
        }

        // Determine if event is upcoming
        const isUpcoming = date ? new Date(date) > new Date() : false

        events.push({
          id: page.id,
          title,
          description,
          date,
          endDate,
          location,
          category,
          tags,
          status,
          coverImage,
          isFeatured,
          url,
          isUpcoming,
          icon,
          startDate,
          progress
        })
      }
    }

    return events

  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Function to get event content
export async function getEventContent(eventId: string) {
  try {
    const recordMap = await notionUnofficial.getPage(eventId)
    return recordMap
  } catch (error) {
    console.error('Error fetching event content:', error)
    throw error
  }
}
