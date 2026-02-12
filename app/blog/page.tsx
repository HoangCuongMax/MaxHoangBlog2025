import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { getBlogPosts, getFirstImageUrlFromPage, getNotionPage, DATABASE_IDS } from '../../lib/notion-api'
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

export default async function Blog({ searchParams }: { searchParams: SearchParams }) {
  try {
    const posts = await getBlogPosts()

    // Fallback: if official API is unavailable or returns nothing, render the Notion database page directly
    if (!posts || posts.length === 0) {
      try {
        const recordMap = await getNotionPage(DATABASE_IDS.blog)
        return (
          <PageContainer noBoxStyling={true} maxWidthClass="max-w-5xl">
            <div className="mb-4 lg:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog</h1>
              <p className="text-sm text-gray-600 mt-1">Rendered directly from Notion.</p>
            </div>
            <NotionPage recordMap={recordMap} />
          </PageContainer>
        )
      } catch (e) {
        console.error('Blog fallback failed:', e)
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

    // Build simple category list from tags
    const allTags = Array.from(
      new Set(
        posts.flatMap(p => (p.tags || []).map(t => t.trim()).filter(Boolean))
      )
    ).sort((a, b) => a.localeCompare(b))

    const activeTag = (searchParams?.tag || '').trim()
    const filtered = activeTag ? posts.filter(p => (p.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase())) : posts
    const sorted = [...filtered].sort((a, b) => Number(b?.isFeatured ? 1 : 0) - Number(a?.isFeatured ? 1 : 0))

    // Pre-compute effective image for each post (cover -> first image in content -> placeholder)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-600 mt-1">Flat, clean, fast. Full-width layout.</p>
          </div>

          {/* Simple category filter */}
          {allTags.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                <Link
                  href="/blog"
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!activeTag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All
                </Link>
                {allTags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${activeTag.toLowerCase() === tag.toLowerCase() ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured section */}
          {sorted.some(p => p.isFeatured) && (
            <section className="mb-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Blogs</h2>
              </div>
              <div className="space-y-6">
                {sorted.filter(p => p.isFeatured).map(post => (
                  <article key={post.id} className="group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition">
                    <div className="grid md:grid-cols-2">
                      <div className="relative aspect-[16/9] md:aspect-auto md:h-full bg-gray-100">
                        <span className="sr-only">Cover image</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageById.get(post.id) as string}
                          alt={post.title}
                          className="w-full h-full object-cover md:h-full"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute top-2 left-2 z-10 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          ⭐ Featured
                        </span>
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col">
                        {post.tags && post.tags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {post.tags.slice(0,3).map((tag, i) => (
                              <span key={i} className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{tag}</span>
                            ))}
                          </div>
                        )}
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                          <Link href={`/blog/${post.seoSlug || post.slug}`} className="hover:underline underline-offset-2">
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 mt-3 line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="mt-4 text-sm text-gray-500">{formatDate(post.publishDate)}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Posts grid - flat, with hover highlight */}
          {sorted.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles</h3>
              <p className="text-gray-600">Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sorted.filter(p => !p.isFeatured).map((post) => (
                <article
                  key={post.id}
                  className={`group transition-colors duration-200 rounded-lg -m-2 p-2 hover:bg-gray-50`}
                >
                  {/* Feature image or fallback */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
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
                    <Link href={`/blog/${post.seoSlug || post.slug}`} className="underline-offset-2 group-hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                  )}

                  {/* Meta */}
                  <div className="mt-3 text-xs text-gray-500">{formatDate(post.publishDate)}</div>
                </article>
              ))}
            </div>
          )}
        </div>
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
