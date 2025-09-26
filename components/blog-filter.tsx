'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { BlogPost } from '../lib/notion-api'
import BlogCard from './blog-card'

interface BlogFilterProps {
  posts: BlogPost[]
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts based on active filter and search query
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by tag/category
    if (activeFilter === 'featured') {
      filtered = filtered.filter(post => post.isFeatured)
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(post => 
        post.tags?.some(tag => tag.toLowerCase() === activeFilter.toLowerCase())
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [posts, activeFilter, searchQuery])

  const featuredPosts = filteredPosts.filter(post => post.isFeatured)
  const regularPosts = filteredPosts.filter(post => !post.isFeatured)

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full sm:w-64 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <span className="flex items-center gap-2">
              {activeFilter === 'all' && (
                <>
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H5m14 8H5m14-4H5" />
                  </svg>
                  All Posts ({posts.length})
                </>
              )}
              {activeFilter === 'featured' && (
                <>
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured ({posts.filter(p => p.isFeatured).length})
                </>
              )}
              {activeFilter !== 'all' && activeFilter !== 'featured' && (
                <>
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {activeFilter} ({posts.filter(post =>
                    post.tags?.some(postTag => postTag.toLowerCase() === activeFilter.toLowerCase())
                  ).length})
                </>
              )}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {/* All Posts Option */}
              <button
                onClick={() => {
                  setActiveFilter('all')
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeFilter === 'all' ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' : 'text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H5m14 8H5m14-4H5" />
                </svg>
                <span>All Posts ({posts.length})</span>
                {activeFilter === 'all' && (
                  <svg className="w-4 h-4 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Featured Option */}
              {posts.some(post => post.isFeatured) && (
                <button
                  onClick={() => {
                    setActiveFilter('featured')
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    activeFilter === 'featured' ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500' : 'text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>Featured ({posts.filter(p => p.isFeatured).length})</span>
                  {activeFilter === 'featured' && (
                    <svg className="w-4 h-4 text-yellow-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}

              {/* Divider */}
              {allTags.length > 0 && (
                <div className="border-t border-gray-200 my-1"></div>
              )}

              {/* Tag Options */}
              {allTags.map(tag => {
                const tagCount = posts.filter(post =>
                  post.tags?.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
                ).length

                return (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveFilter(tag)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                      activeFilter === tag ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{tag} ({tagCount})</span>
                    {activeFilter === tag && (
                      <svg className="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} articles
            {searchQuery && (
              <span className="ml-2">
                for "<span className="font-medium text-gray-900">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Results */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-8">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Featured Articles</h2>
                </div>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="transform transition-all hover:scale-[1.02]">
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H5m14 8H5m14-4H5" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">
                    {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
                  </h2>
                </div>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <div key={post.id} className="transform transition-all hover:scale-[1.02]">
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setActiveFilter('all')
              setSearchQuery('')
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
