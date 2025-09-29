import { getBlogPosts, getBlogPost } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import TimelineTwoPaneClient from '../../components/timeline-two-pane-client'

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
      <PageContainer fullscreen={true}>
        <style>{`@media (min-width:1024px){footer{padding-left:340px}} .page-container > div{padding:0!important}`}</style>
        <TimelineTwoPaneClient itemsWithContent={itemsWithContent as any} useGallery={false} showTOC={true} />
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
