import { getStudyJournalPosts, getStudyJournalPostContent } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import TimelineTwoPaneClient from '../../components/timeline-two-pane-client'

// Revalidate every hour
export const revalidate = 3600

type SearchParams = { tag?: string }

export default async function StudyJournal({ searchParams }: { searchParams: SearchParams }) {
  try {
    const posts = await getStudyJournalPosts()

    const activeTag = (searchParams?.tag || '').trim()
    const filtered = activeTag
      ? posts.filter(p => {
          const tags = new Set([...(p.tags || []), ((p as any).category || '')].map(t => String(t).toLowerCase()))
          return tags.has(activeTag.toLowerCase())
        })
      : posts

    const itemsWithContent = await Promise.all(
      filtered.map(async (p) => {
        const recordMap = await getStudyJournalPostContent(p.id).catch(() => null)
        return {
          id: p.id,
          title: p.title,
          description: p.excerpt || '',
          date: p.publishedDate || '',
          category: (p as any).category || undefined,
          tags: p.tags || [],
          coverImage: p.coverImage || '',
          isFeatured: Boolean(p.isFeatured),
          recordMap
        }
      })
    )

    return (
      <PageContainer fullscreen={true}>
        <style>{`@media (min-width:1024px){footer{padding-left:340px}}`}</style>
        <TimelineTwoPaneClient itemsWithContent={itemsWithContent as any} />
      </PageContainer>
    )
  } catch (error) {
    console.error('Error loading study journal page:', error)
    return (
      <PageContainer>
        <ErrorFallback 
          title="Study Journal" 
          message="Sorry, we're having trouble loading the study journal posts from Notion." 
        />
      </PageContainer>
    )
  }
}

export const metadata = {
  title: 'Study Journal - Max Hoang',
  description: "Educational content, learning notes, and insights from Max Hoang's continuous journey of knowledge discovery.",
}
