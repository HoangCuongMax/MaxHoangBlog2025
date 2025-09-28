import { getPageByKeyWithMetadata } from '../../lib/notion-api'
import dynamicImport from 'next/dynamic'
const NotionPage = dynamicImport(() => import('../../components/notion-page'), { ssr: false })
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import NotionLinkInterceptor from '../../components/notion-link-interceptor'
import PageCoverHeader from '../../components/page-cover-header'
import AiGuideToc from '../../components/ai-guide-toc'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

function extractHeadings(recordMap: any): Array<{ id: string; text: string; level: number }> {
  const out: Array<{ id: string; text: string; level: number }> = []
  try {
    const blocks = recordMap?.block || {}
    for (const id of Object.keys(blocks)) {
      const value = (blocks as any)[id]?.value || (blocks as any)[id]
      if (!value) continue
      const type = value.type
      let level = 0
      if (type === 'header') level = 1
      else if (type === 'sub_header') level = 2
      else if (type === 'sub_sub_header') level = 3
      else continue
      const titleArr = value?.properties?.title || []
      const text = Array.isArray(titleArr) ? titleArr.map((t: any) => (Array.isArray(t) ? t[0] : '')).join('') : ''
      if (text) out.push({ id, text, level })
    }
  } catch {}
  return out
}

export default async function Projects() {
  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('projects')
    const headings = extractHeadings(recordMap)

    return (
      <>
        <PageCoverHeader metadata={metadata} />

        <PageContainer noBoxStyling={true} maxWidthClass="max-w-none">
          <div className="book-layout">
            <div className="grid grid-cols-1 md:grid-cols-[300px,1fr,300px] gap-6">
              <aside className="md:sticky md:top-24 h-max md:self-start col-start-1">
                <AiGuideToc headings={headings} />
              </aside>

              <article className="min-w-0 content-article col-start-2 justify-self-center mx-auto">
                <NotionPage recordMap={recordMap} />
                <NotionLinkInterceptor />
              </article>

              <div className="hidden md:block col-start-3" />
            </div>
          </div>
        </PageContainer>
      </>
    )
  } catch (error) {
    console.error('Error loading projects page:', error)
    return (
      <PageContainer noBoxStyling={true}>
        <ErrorFallback title="Projects" />
      </PageContainer>
    )
  }
}

// Generate dynamic metadata from Notion
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { metadata } = await getPageByKeyWithMetadata('projects')

    return {
      title: metadata?.title || 'Projects - Max Hoang',
      description: 'Explore Max Hoang\'s projects and portfolio',
      openGraph: {
        title: metadata?.title || 'Projects - Max Hoang',
        description: 'Explore Max Hoang\'s projects and portfolio',
        images: metadata?.cover ? [metadata.cover] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Projects - Max Hoang',
      description: 'Explore Max Hoang\'s projects and portfolio',
    }
  }
}
