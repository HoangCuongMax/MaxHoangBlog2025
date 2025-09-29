"use client"

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
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Build categories/tags list
  const allCategories = useMemo(() => {
    const s = new Set<string>()
    for (const i of itemsWithContent) {
      if (i.category) s.add(String(i.category))
      for (const t of i.tags || []) s.add(String(t))
    }
    return Array.from(s).sort((a,b)=>a.localeCompare(b))
  }, [itemsWithContent])

  // Filter by search query and category/tag
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return itemsWithContent.filter(i => {
      // category/tag filter
      if (activeFilter) {
        const tags = new Set([...(i.tags || []), i.category || ''].map(v => String(v).toLowerCase()).filter(Boolean))
        if (!tags.has(activeFilter.toLowerCase())) return false
      }
      if (!q) return true
      const hay = `${i.title} ${i.description || ''} ${(i.tags || []).join(' ')} ${i.category || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [itemsWithContent, query, activeFilter])

  // Ensure a valid selectedId after filtering
  useEffect(() => {
    if (!items.find(i => i.id === selectedId)) {
      setSelectedId(items[0]?.id || '')
    }
  }, [items, selectedId])

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

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
                    <p className="text-xs text-gray-600 line-clamp-1 mr-[-2px]">{item.description}</p>
                  )}
                  {item.date && (
                    <div className="text-[11px] text-gray-500 mt-1">{formatDate(item.date)}</div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile: collapsible posts panel */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm active:scale-[0.99] transition"
            aria-expanded={mobileOpen}
            aria-controls="mobile-posts-panel"
          >
            <span className="font-medium text-gray-700">{mobileOpen ? 'Hide posts' : 'Browse posts'}</span>
            <span className="text-sm text-gray-500">{items.length}</span>
          </button>

          {mobileOpen && (
            <aside id="mobile-posts-panel" className="mt-3 overflow-y-auto bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-xl p-3">
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

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <nav className="space-y-0 divide-y divide-gray-100">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedId(item.id); setMobileOpen(false) }}
                    className={`w-full text-left transition-colors p-3 flex gap-3 items-start hover:bg-gray-50 ${
                      (selected?.id === item.id) ? 'bg-blue-50/60 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                    }`}
                  >
                    {item.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverImage} alt={item.title} loading="lazy" className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-[15px] text-gray-900 truncate">{item.title}</div>
                      {item.description && (
                        <p className="text-xs text-gray-600 line-clamp-1 mr-[-2px]">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="text-[11px] text-gray-500 mt-1">{formatDate(item.date)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </aside>
          )}
        </div>

        {/* Main content area shifted right on desktop */}
        <section className="lg:pl-[340px]">
          {selected && (
            showTOC ? (
              <TOCProvider>
                <FloatingTOC key={selected?.id} leftOffsetClass="left-[320px]" topPx={navVisible ? 96 : 0} />
                <div className="pt-4 sm:pt-6 md:pt-8 lg:pt-10 transition-all duration-300 ease-in-out">
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
