import dynamicImport from 'next/dynamic'
import Link from 'next/link'
import { Metadata } from 'next'
import PageContainer from '../../components/page-container'
import { getNotionPage, PAGE_IDS } from '../../lib/notion-api'
import AiGuideToc from '../../components/ai-guide-toc'

const NotionPage = dynamicImport(() => import('../../components/notion-page'), { ssr: false })

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

export default async function AiGuidePage() {
  const pageId = PAGE_IDS.aiGuide
  const recordMap = await getNotionPage(pageId)

  const headings = extractHeadings(recordMap)

  const pageTitle = (() => {
    try {
      const firstId = Object.keys(recordMap.block)[0]
      const page = recordMap.block[firstId]?.value
      if (page?.properties?.title) return page.properties.title.map((t: any) => t[0]).join('')
    } catch {}
    return 'AI Guide'
  })()

  return (
    <PageContainer noBoxStyling={true} maxWidthClass="max-w-none">
      <div className="book-layout relative">
        <aside className="hidden md:block fixed left-0 top-24 h-[calc(100vh-6rem)] w-[300px] overflow-y-auto bg-white border-r border-gray-200">
          <AiGuideToc headings={headings} bare />
        </aside>

        <article className="min-w-0 content-article mx-auto md:pl-[320px] pr-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          <div className="notion-content w-full">
            <NotionPage recordMap={recordMap} />
          </div>
        </article>
      </div>
    </PageContainer>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const recordMap = await getNotionPage(PAGE_IDS.aiGuide)
    let title = 'AI Guide'
    try {
      const firstId = Object.keys(recordMap.block)[0]
      const page = recordMap.block[firstId]?.value
      if (page?.properties?.title) title = page.properties.title.map((t: any) => t[0]).join('')
    } catch {}
    return {
      title,
      description: `${title} - Book style guide from Notion`,
      openGraph: { title, description: `${title} - Book style guide from Notion` }
    }
  } catch {
    return { title: 'AI Guide', description: 'Book style guide from Notion' }
  }
}
