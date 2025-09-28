"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { TimelineItem } from '../lib/notion-api'
import PhotoGallerySlider from './photo-gallery-slider'

interface TimelineTwoPaneClientProps {
  itemsWithContent: (TimelineItem & { recordMap?: any })[]
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

export default function TimelineTwoPaneClient({ itemsWithContent }: TimelineTwoPaneClientProps) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(itemsWithContent[0]?.id || '')

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
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Timeline</h1>
        <p className="text-sm text-gray-600">A chronological journey through my experiences, achievements, and milestones</p>
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-xl p-3 sm:p-4">
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

          <nav className="space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left rounded-lg border transition-colors p-2.5 flex gap-3 items-start hover:border-gray-300 ${
                  (selected?.id === item.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
                aria-current={selected?.id === item.id ? 'page' : undefined}
              >
                {/* Cover thumbnail */}
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage} alt={item.title} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{item.title}</div>
                  {item.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  {item.date && (
                    <div className="text-[11px] text-gray-500 mt-1">{formatDate(item.date)}</div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main preview */}
        <section>
          {selected && (
            <article className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-2xl overflow-hidden">
              {/* Cover / gallery */}
              {images.length > 0 ? (
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
                <div className="flex items-center gap-3">
                  <Link href={`/timeline/${selected.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Read full post
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  )
}
