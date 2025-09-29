'use client'

"use client"

import { useState, useMemo } from 'react'
import type { BlogPost } from '../lib/notion-api'
import BlogCard from './blog-card'
import BlogSidebar from './blog-sidebar'

interface BlogLayoutProps {
  posts: BlogPost[]
}

export default function BlogLayout({ posts }: BlogLayoutProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter posts based on active filter and search query
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by tag/category
    if (activeFilter === 'featured') {
      filtered = filtered.filter(post => post.isFeatured)
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(post =>
        // Check if filter matches category
        post.category?.toLowerCase() === activeFilter.toLowerCase() ||
        // Check if filter matches any tag
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span className="font-medium text-gray-700">
              {activeFilter === 'all' ? 'All Articles' :
               activeFilter === 'featured' ? 'Featured' : activeFilter}
            </span>
            {searchQuery && (
              <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                "{searchQuery}"
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{filteredPosts.length} posts</span>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Sidebar - Mobile: Collapsible, Desktop: Always visible */}
      <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
        <BlogSidebar
          posts={posts}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onFilterChange={(filter) => {
            setActiveFilter(filter)
            setSidebarOpen(false) // Close on mobile after selection
          }}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 max-w-[1024px] mx-auto flex flex-col">
        {/* Current Filter Info - Hidden on mobile when showing toggle */}
        <div className="mb-6 hidden lg:block">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {activeFilter === 'all' && 'All Articles'}
                {activeFilter === 'featured' && 'Featured Articles'}
                {activeFilter !== 'all' && activeFilter !== 'featured' && `${activeFilter} Articles`}
              </h2>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Showing {filteredPosts.length} of {posts.length} articles
                {searchQuery && (
                  <span className="ml-2">
                    for "<span className="font-medium text-gray-900">{searchQuery}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Clear Filters */}
            {(activeFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveFilter('all')
                  setSearchQuery('')
                }}
                className="inline-flex items-center px-3 lg:px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Posts Section - Show when there are featured posts in results and not filtering specifically for featured */}
            {featuredPosts.length > 0 && activeFilter !== 'featured' && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900">
                      Featured {searchQuery ? 'Search Results' : 'Articles'}
                    </h3>
                    {searchQuery && (
                      <span className="text-sm text-gray-500 bg-yellow-50 px-2 py-1 rounded-full">
                        {featuredPosts.length} found
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
                  {featuredPosts.map((post) => (
                    <div key={post.id} className="transform transition-all hover:scale-[1.02]">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts Section - Show when not specifically filtering for featured posts */}
            {regularPosts.length > 0 && activeFilter !== 'featured' && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H5m14 8H5m14-4H5" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900">
                      {searchQuery ? 'Regular Search Results' : (featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles')}
                    </h3>
                    {searchQuery && (
                      <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                        {regularPosts.length} found
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {regularPosts.map((post) => (
                    <div key={post.id} className="transform transition-all hover:scale-[1.02]">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Filter View - Show all featured posts when specifically filtering */}
            {activeFilter === 'featured' && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="transform transition-all hover:scale-[1.02]">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
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
    </div>
  )
}
