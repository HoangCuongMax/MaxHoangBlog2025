import dynamicImport from 'next/dynamic'
import { getTimelineItems, getTimelineItemContent, getNotionPage, DATABASE_IDS } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import TimelineClient from '../../components/timeline-client'
import ErrorFallback from '../../components/error-fallback'
import TimelineSidebar from '../../components/timeline-sidebar'
const NotionPage = dynamicImport(() => import('../../components/notion-page'), { ssr: false })

export const dynamic = 'force-dynamic'

export default async function Timeline() {
  try {
    const items = await getTimelineItems()

    // Fallback: if no items (official API unavailable), render the Notion database page directly
    if (!items || items.length === 0) {
      try {
        const recordMap = await getNotionPage(DATABASE_IDS.timeline)
        return (
          <PageContainer noBoxStyling={true} maxWidthClass="max-w-5xl">
            <div className="mb-4 lg:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Timeline</h1>
              <p className="text-sm text-gray-600 mt-1">Rendered directly from Notion.</p>
            </div>
            <NotionPage recordMap={recordMap} />
          </PageContainer>
        )
      } catch (e) {
        console.error('Timeline fallback failed:', e)
      }
    }

    // Load content for each timeline item
    const itemsWithContent = await Promise.all(
      items.map(async (item) => {
        try {
          const recordMap = await getTimelineItemContent(item.id)
          return { ...item, recordMap }
        } catch (error) {
          console.error(`Error loading content for ${item.id}:`, error)
          return { ...item, recordMap: null }
        }
      })
    )

    return (
      <PageContainer noBoxStyling={true} maxWidthClass="max-w-none">
        <div className="relative">
          <aside className="hidden md:block fixed left-0 top-0 h-screen w-[300px] overflow-y-auto bg-white border-r border-gray-200 z-40">
            <TimelineSidebar items={itemsWithContent} />
          </aside>

          <article className="min-w-0 mx-auto w-full md:pl-[320px] pr-6">
            <TimelineClient itemsWithContent={itemsWithContent} />
          </article>
        </div>
      </PageContainer>
    )
  } catch (error) {
    console.error('Error loading timeline page:', error)
    return (
      <PageContainer>
        <ErrorFallback
          title="Timeline"
          message="Sorry, we're having trouble loading the timeline from Notion."
        />
      </PageContainer>
    )
  }
}

export const metadata = {
  title: 'Timeline - Max Hoang',
  description: 'A chronological journey through Max Hoang\'s experiences, achievements, and milestones.',
}
