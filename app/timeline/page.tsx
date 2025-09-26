import { getTimelineItems, getTimelineItemContent } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import TimelineClient from '../../components/timeline-client'
import ErrorFallback from '../../components/error-fallback'

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
      <PageContainer fullscreen={true}>
        <TimelineClient itemsWithContent={itemsWithContent} />
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
