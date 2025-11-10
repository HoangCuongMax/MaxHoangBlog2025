'use client'

import { useMemo, useState } from 'react'
import type { TimelineItem } from '../lib/notion-api'
import NotionPage from './notion-page'

interface TimelineTwoPaneClientProps {
  itemsWithContent: (TimelineItem & { recordMap?: any })[]
  useGallery?: boolean
  showTOC?: boolean
}

export default function TimelineTwoPaneClient({ itemsWithContent, useGallery = true, showTOC = false }: TimelineTwoPaneClientProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allCategories = useMemo(() => {
    const s = new Set<string>()
    for (const i of itemsWithContent) {
      if (i.category) s.add(String(i.category))
      for (const t of i.tags || []) s.add(String(t))
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [itemsWithContent])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return itemsWithContent.filter(i => {
      if (activeFilter) {
        const tags = new Set([...(i.tags || []), i.category || ''].map(v => String(v).toLowerCase()).filter(Boolean))
        if (!tags.has(activeFilter.toLowerCase())) return false
      }
      if (!q) return true
      const hay = `${i.title} ${i.description || ''} ${(i.tags || []).join(' ')} ${i.category || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [itemsWithContent, query, activeFilter])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    } catch {
      return ''
    }
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })
    } catch {
      return ''
    }
  }

  const selected = selectedId ? itemsWithContent.find(i => i.id === selectedId) : null

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
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-4">
        <div className="flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search timeline..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
            className="group text-left bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all hover:border-[rgb(216,0,92)] cursor-pointer"
          >
            {/* Cover Image */}
            {item.coverImage && (
              <div className="relative w-full aspect-[1920/1024] overflow-hidden bg-gray-100">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                />
                {item.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-yellow-900">⭐ Featured</span>
                  </div>
                )}
              </div>
            )}

            {/* Date/Time Stamp Box */}
            <div className="bg-gradient-to-r from-[rgb(216,0,92)] to-pink-600 text-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{formatDate(item.date)}</div>
                  {item.date && (
                    <div className="text-xs opacity-90">{formatTime(item.date)}</div>
                  )}
                </div>
                {item.category && (
                  <span className="text-xs font-medium bg-white bg-opacity-20 px-2.5 py-1 rounded-full">{item.category}</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[rgb(216,0,92)] transition-colors line-clamp-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs font-medium text-gray-500">+{item.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500">View Details →</div>
            </div>
          </button>
        ))}
      </div>

      {/* Detailed View - Expanded Article */}
      {selected && (
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-200 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              {selected.isFeatured && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">⭐ Featured</span>
                </div>
              )}
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{selected.title}</h2>
              {selected.date && (
                <div className="flex items-center gap-4 text-lg text-gray-600">
                  <span className="font-semibold">{formatDate(selected.date)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{formatTime(selected.date)}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Cover Image */}
          {selected.coverImage && (
            <div className="mb-8 -mx-8 md:-mx-12">
              <img
                src={selected.coverImage}
                alt={selected.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {selected.description && (
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {selected.description}
            </p>
          )}

          {/* Tags */}
          {selected.tags && selected.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {selected.tags.map((tag, i) => (
                <span key={i} className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Full Content */}
          {selected.recordMap ? (
            <article suppressHydrationWarning className="prose prose-lg max-w-none text-gray-700">
              <NotionPage recordMap={selected.recordMap} />
            </article>
          ) : (
            <div className="text-gray-500">No additional content available.</div>
          )}
        </div>
      )}
    </div>
  )
}
