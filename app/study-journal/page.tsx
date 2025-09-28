import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { getStudyJournalPosts, getFirstImageUrlFromPage, getNotionPage, DATABASE_IDS } from '../../lib/notion-api'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
const NotionPage = dynamicImport(() => import('../../components/notion-page'), { ssr: false })

// Revalidate every hour
export const revalidate = 3600

function formatDate(dateString?: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

type SearchParams = { tag?: string }

export default async function StudyJournal({ searchParams }: { searchParams: SearchParams }) {
  try {
    const posts = await getStudyJournalPosts()

    // Fallback: render the Notion database page when no posts (official API unavailable)
    if (!posts || posts.length === 0) {
      try {
        const recordMap = await getNotionPage(DATABASE_IDS.studyJournal)
        return (
          <PageContainer noBoxStyling={true} maxWidthClass="max-w-5xl">
            <div className="mb-4 lg:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Study Journal</h1>
              <p className="text-sm text-gray-600 mt-1">Rendered directly from Notion.</p>
            </div>
            <NotionPage recordMap={recordMap} />
          </PageContainer>
        )
      } catch (e) {
        console.error('Study Journal fallback failed:', e)
      }
    }

    const placeholderFor = (title: string) => {
      const bg = 'eef2f7'
      const fg = '64748b'
      const text = encodeURIComponent((title || 'Post').slice(0, 1).toUpperCase())
      return `data:image/svg+xml;utf8,` +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>` +
            `<rect width='100%' height='100%' fill='#${bg}'/>` +
            `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='140' fill='#${fg}'>${text}</text>` +
          `</svg>`
        )
    }

    // Build simple category list from tags + category
    const allTags = Array.from(
      new Set(
        posts.flatMap(p => [
          ...(p.tags || []).map(t => t.trim()).filter(Boolean),
          (p as any).category ? String((p as any).category).trim() : ''
        ]).filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b))

    const activeTag = (searchParams?.tag || '').trim()
    const filtered = activeTag
      ? posts.filter(p => {
          const tags = new Set([...(p.tags || []), ((p as any).category || '')].map(t => String(t).toLowerCase()))
          return tags.has(activeTag.toLowerCase())
        })
      : posts

    const sorted = [...filtered].sort((a: any, b: any) => Number(b?.isFeatured ? 1 : 0) - Number(a?.isFeatured ? 1 : 0))

    const images = await Promise.all(
      sorted.map(async (p) => {
        const url = p.coverImage || (await getFirstImageUrlFromPage(p.id)) || placeholderFor(p.title)
        return { id: p.id, url }
      })
    )
    const imageById = new Map(images.map(i => [i.id, i.url]))

    return (
      <PageContainer fullscreen={true}>
        <div className="w-full">
          {/* Header */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Study Journal</h1>
            <p className="text-sm text-gray-600 mt-1">Educational content and learning insights.</p>
          </div>

          {/* Simple category filter */}
          {allTags.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                <Link
                  href="/study-journal"
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!activeTag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All
                </Link>
                {allTags.map(tag => (
                  <Link
                    key={tag}
                    href={`/study-journal?tag=${encodeURIComponent(tag)}`}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${activeTag.toLowerCase() === tag.toLowerCase() ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts grid - flat, with hover highlight */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries</h3>
              <p className="text-gray-600">Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sorted.map((post) => (
                <article key={post.id} className={`group transition-colors duration-200 rounded-lg -m-2 p-2 ${post.isFeatured ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-gray-50'}`}>
                  {/* Feature image or fallback */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {post.isFeatured && (
                      <span className="absolute top-2 left-2 z-10 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        ⭐ Featured
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageById.get(post.id) as string}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                    <Link href={`/study-journal/${post.slug}`} className="underline-offset-2 group-hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                  )}

                  {/* Meta */}
                  <div className="mt-3 text-xs text-gray-500">{formatDate(post.publishedDate)}</div>
                </article>
              ))}
            </div>
          )}
        </div>
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
