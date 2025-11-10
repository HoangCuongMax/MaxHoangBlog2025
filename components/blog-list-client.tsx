'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import NotionPage from './notion-page'

interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  tags: string[]
  coverImage: string
  isFeatured: boolean
  recordMap?: any
}

interface BlogListClientProps {
  itemsWithContent: BlogPost[]
}

export default function BlogListClient({ itemsWithContent }: BlogListClientProps) {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    itemsWithContent.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [itemsWithContent])

  const filteredPosts = useMemo(() => {
    let results = itemsWithContent

    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    if (selectedTag) {
      results = results.filter(post => post.tags.includes(selectedTag))
    }

    return results
  }, [itemsWithContent, query, selectedTag])

  const selectedPost = selectedId ? itemsWithContent.find(p => p.id === selectedId) : null

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    } catch {
      return ''
    }
  }

  if (!itemsWithContent?.length) {
    return (
      <div className="text-center py-12 text-white">
        <h2 className="text-2xl font-bold mb-2">No blog posts yet</h2>
        <p className="text-gray-300">Check back soon for new articles!</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:gap-4">
        <div className="flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedId(selectedId === post.id ? null : post.id)}
            className="group text-left bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all hover:border-[rgb(216,0,92)] cursor-pointer"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {post.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-yellow-900">⭐ Featured</span>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {post.isFeatured && !post.coverImage && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⭐ Featured</span>
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[rgb(216,0,92)] transition-colors line-clamp-2">
                {post.title}
              </h3>

              {post.description && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {post.description}
                </p>
              )}

              {/* Date */}
              {post.date && (
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  {formatDate(post.date)}
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs font-medium text-gray-500">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500 font-medium">Read Article →</div>
            </div>
          </button>
        ))}
      </div>

      {/* Article Detail View */}
      {selectedPost && (
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-200 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              {selectedPost.isFeatured && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">⭐ Featured</span>
                </div>
              )}
              <h2 className="text-4xl font-bold text-gray-900 mb-3">{selectedPost.title}</h2>
              {selectedPost.date && (
                <p className="text-gray-600 font-medium">{formatDate(selectedPost.date)}</p>
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
          {selectedPost.coverImage && (
            <div className="mb-8 -mx-8 md:-mx-12">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {selectedPost.description && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
              {selectedPost.description}
            </p>
          )}

          {/* Tags */}
          {selectedPost.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Full Content */}
          {selectedPost.recordMap ? (
            <article suppressHydrationWarning className="prose prose-lg max-w-none text-gray-700">
              <NotionPage recordMap={selectedPost.recordMap} />
            </article>
          ) : (
            <div className="text-gray-500">No additional content available.</div>
          )}
        </div>
      )}
    </div>
  )
}
