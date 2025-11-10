import { getBlogPosts, getBlogPost } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import BlogListClient from '../../components/blog-list-client'

// Revalidate every hour
export const revalidate = 3600

type SearchParams = { tag?: string }

export default async function Blog({ searchParams }: { searchParams: SearchParams }) {
  try {
    const posts = await getBlogPosts()

    const activeTag = (searchParams?.tag || '').trim()
    const filtered = activeTag
      ? posts.filter(p => (p.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase()))
      : posts

    // Load Notion content for each post and map to TimelineTwoPaneClient shape
    const itemsWithContent = await Promise.all(
      filtered.map(async (p) => {
        const recordMap = await getBlogPost(p.id).catch(() => null)
        return {
          id: p.id,
          title: p.title,
          description: p.excerpt || '',
          date: p.publishDate || '',
          category: undefined,
          tags: p.tags || [],
          coverImage: p.coverImage || '',
          isFeatured: Boolean(p.isFeatured),
          recordMap
        }
      })
    )

    return (
      <PageContainer noBoxStyling={true}>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-12">Blog & Articles</h1>
        <BlogListClient itemsWithContent={itemsWithContent as any} />
      </PageContainer>
    )
  } catch (error) {
    console.error('Error loading blog page:', error)
    return (
      <PageContainer>
        <ErrorFallback 
          title="Blog" 
          message="Sorry, we're having trouble loading the blog posts from Notion." 
        />
      </PageContainer>
    )
  }
}

export const metadata = {
  title: 'Tech Blog - Max Hoang',
  description: 'Personal tech blog of Max Hoang featuring insights on web development, AI, and modern technology.',
}
