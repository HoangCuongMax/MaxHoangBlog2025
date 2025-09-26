import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Metadata } from 'next'
import PageContainer from '../../components/page-container'
import { getNotionPage, PAGE_IDS } from '../../lib/notion-api'

const NotionPage = dynamic(() => import('../../components/notion-page'), { ssr: false })

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
    <PageContainer noBoxStyling={true} maxWidthClass="max-w-6xl">
      <div className="mb-6">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </li>
            <li className="text-gray-900 font-medium truncate">{pageTitle}</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
        <aside className="md:sticky md:top-24 h-max md:self-start">
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-3">
            <div className="px-2 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">Contents</div>
            <nav className="mt-2">
              <ul className="space-y-1">
                {headings.map(h => (
                  <li key={h.id} className={h.level === 1 ? 'pl-1' : h.level === 2 ? 'pl-4' : 'pl-7'}>
                    <a href={`#${h.id}`} className="block py-1 text-sm text-gray-700 hover:text-blue-700 underline-offset-2 hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
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
