import { getTimelineItems, getTimelineItemContent } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import TimelineClient from '../../components/timeline-client'
import ErrorFallback from '../../components/error-fallback'
import TimelineSidebar from '../../components/timeline-sidebar'

export const dynamic = 'force-dynamic'

export default async function Timeline() {
  try {
    const items = await getTimelineItems()

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
          <aside className="hidden md:block fixed left-0 top-24 h-[calc(100vh-6rem)] w-[300px] overflow-y-auto bg-white border-r border-gray-200">
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
