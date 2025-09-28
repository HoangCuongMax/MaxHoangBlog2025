"use client"

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import type { TimelineItem } from '../lib/notion-api'
import PhotoGallerySlider from './photo-gallery-slider'
import NotionPage from './notion-page'
import FloatingTOC from './floating-toc'
import { TOCProvider } from './toc-context'
import ResponsiveContentWrapper from './responsive-content-wrapper'

interface TimelineTwoPaneClientProps {
  itemsWithContent: (TimelineItem & { recordMap?: any })[]
  useGallery?: boolean
  showTOC?: boolean
}

// Extract images (url+caption) from a Notion recordMap
function extractImages(recordMap: any): Array<{ url: string; caption?: string }> {
  if (!recordMap?.block) return []
  const images: Array<{ url: string; caption?: string }> = []
  const blocks = Object.values(recordMap.block)

  blocks.forEach((b: any) => {
    const v = b?.value
    if (!v) return

    const pushImage = (url?: string, caption?: string) => {
      if (!url) return
      if (url.startsWith('attachment:')) {
        const m = url.match(/attachment:([a-f0-9-]+):(.+)/)
        if (m) {
          const [, fileId, filename] = m
          url = `https://www.notion.so/image/${encodeURIComponent(`https://s3-us-west-2.amazonaws.com/secure.notion-static.com/${fileId}/${filename}`)}?table=block&id=${v.id}&cache=v2`
        }
      }
      if (url && (url.startsWith('http') || url.startsWith('https'))) {
        images.push({ url, caption: caption || undefined })
      }
    }

    if (v.type === 'image') {
      const caption = v?.properties?.caption?.[0]?.[0]
      const url = v?.format?.display_source
        || v?.properties?.source?.[0]?.[0]
        || v?.properties?.url?.[0]?.[0]
        || v?.display_source
        || v?.file?.url
        || v?.external?.url
        || (typeof v?.properties?.title?.[0]?.[0] === 'string' ? v.properties.title[0][0] : '')
      pushImage(url, caption)
    }

    if (v.type === 'gallery' && Array.isArray(v?.content)) {
      v.content.forEach((id: string) => {
        const imgBlock = recordMap.block?.[id]?.value
        if (imgBlock?.type !== 'image') return
        const caption = imgBlock?.properties?.caption?.[0]?.[0]
        const url = imgBlock?.format?.display_source
          || imgBlock?.properties?.source?.[0]?.[0]
          || imgBlock?.properties?.url?.[0]?.[0]
          || imgBlock?.file?.url
          || imgBlock?.external?.url
        pushImage(url, caption)
      })
    }
  })

  return images
}

export default function TimelineTwoPaneClient({ itemsWithContent, useGallery = true, showTOC = false }: TimelineTwoPaneClientProps) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(itemsWithContent[0]?.id || '')
  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return itemsWithContent
    return itemsWithContent.filter(i => {
      const hay = `${i.title} ${i.description || ''} ${(i.tags || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [itemsWithContent, query])

  const selected = useMemo(() => itemsWithContent.find(i => i.id === selectedId) || itemsWithContent[0], [itemsWithContent, selectedId])
  const images = useMemo(() => (selected?.recordMap ? extractImages(selected.recordMap) : []), [selected])

  // Mirror Navigation visibility logic to adjust sidebar top offset
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      if (y < lastScrollY || y < 10) setNavVisible(true)
      else if (y > lastScrollY && y > 100) setNavVisible(false)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return ''
    }
  }

  if (!itemsWithContent || itemsWithContent.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No timeline items yet</h2>
        <p className="text-gray-600">Check back soon for new updates!</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Two-pane layout */}
      <div className="relative">
        {/* Fixed Sidebar on desktop */}
        <aside className="hidden lg:block fixed bottom-0 left-0 w-[320px] overflow-y-auto bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-r border-gray-200 p-3 sm:p-4" style={{ top: navVisible ? '6rem' : 0 }}>
          <div className="mb-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{items.length}</span>
            </div>
          </div>

          <nav className="space-y-0 divide-y divide-gray-100">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left transition-colors p-2 flex gap-2 items-start hover:bg-gray-50 ${
                  (selected?.id === item.id) ? 'bg-blue-50/60 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                }`}
                aria-current={selected?.id === item.id ? 'page' : undefined}
              >
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage} alt={item.title} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{item.title}</div>
                  {item.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                  )}
                  {item.date && (
                    <div className="text-[11px] text-gray-500 mt-1">{formatDate(item.date)}</div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile stacked sidebar */}
        <div className="lg:hidden mb-4">
          <aside className="overflow-y-auto bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-xl p-3 sm:p-4">
            <div className="mb-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{items.length}</span>
              </div>
            </div>

            <nav className="space-y-0 divide-y divide-gray-100">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left transition-colors p-2 flex gap-2 items-start hover:bg-gray-50 ${
                    (selected?.id === item.id) ? 'bg-blue-50/60 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                  }`}
                >
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImage} alt={item.title} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{item.title}</div>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                    )}
                    {item.date && (
                      <div className="text-[11px] text-gray-500 mt-1">{formatDate(item.date)}</div>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        </div>

        {/* Main content area shifted right on desktop */}
        <section className={`lg:pl-[340px] ${showTOC ? 'xl:pl-[660px]' : ''}`}>
          {selected && (
            showTOC ? (
              <TOCProvider>
                <FloatingTOC leftOffsetClass="left-[360px]" />
                <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32">
                  <ResponsiveContentWrapper>
                    <article className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-2xl overflow-hidden">
                      {/* Cover or gallery (optional) */}
                      {useGallery && images.length > 0 ? (
                        <PhotoGallerySlider images={images} title={selected.title} isFullScreen={false} />
                      ) : selected.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selected.coverImage} alt={selected.title} className="w-full h-auto object-cover" />
                      ) : null}

                      <div className="p-4 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
                        {selected.date && (
                          <div className="text-sm text-gray-500 mb-4">{formatDate(selected.date)}</div>
                        )}
                        {selected.description && (
                          <p className="text-gray-700 leading-relaxed mb-4">{selected.description}</p>
                        )}
                        {(selected.tags && selected.tags.length > 0) && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selected.tags.slice(0, 6).map((t, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">{t}</span>
                            ))}
                          </div>
                        )}
                        {selected.recordMap ? (
                          <article className={`mt-2 notion-content ${useGallery && images.length > 0 ? 'has-gallery' : ''}`}>
                            <NotionPage recordMap={selected.recordMap} />
                          </article>
                        ) : (
                          <div className="text-sm text-gray-500">No additional content available.</div>
                        )}
                      </div>
                    </article>
                  </ResponsiveContentWrapper>
                </div>
              </TOCProvider>
            ) : (
              <article className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-2xl overflow-hidden">
                {useGallery && images.length > 0 ? (
                  <PhotoGallerySlider images={images} title={selected.title} isFullScreen={false} />
                ) : selected.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.coverImage} alt={selected.title} className="w-full h-auto object-cover" />
                ) : null}

                <div className="p-4 sm:p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
                  {selected.date && (
                    <div className="text-sm text-gray-500 mb-4">{formatDate(selected.date)}</div>
                  )}
                  {selected.description && (
                    <p className="text-gray-700 leading-relaxed mb-4">{selected.description}</p>
                  )}
                  {(selected.tags && selected.tags.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selected.tags.slice(0, 6).map((t, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">{t}</span>
                      ))}
                    </div>
                  )}
                  {selected.recordMap ? (
                    <article className={`mt-2 notion-content ${useGallery && images.length > 0 ? 'has-gallery' : ''}`}>
                      <NotionPage recordMap={selected.recordMap} />
                    </article>
                  ) : (
                    <div className="text-sm text-gray-500">No additional content available.</div>
                  )}
                </div>
              </article>
            )
          )}
        </section>
      </div>
    </div>
  )
}
