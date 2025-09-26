'use client'

import { useMemo } from 'react'
import { BlogPost } from '../lib/notion-api'

interface BlogSidebarProps {
  posts: BlogPost[]
  activeFilter: string
  searchQuery: string
  onFilterChange: (filter: string) => void
  onSearchChange: (query: string) => void
}

export default function BlogSidebar({ 
  posts, 
  activeFilter, 
  searchQuery, 
  onFilterChange, 
  onSearchChange 
}: BlogSidebarProps) {
  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Get all unique categories for filtering
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    posts.forEach(post => {
      if (post.category && post.category.trim() !== '') {
        categories.add(post.category)
      }
    })
    return Array.from(categories).sort()
  }, [posts])

  const featuredCount = posts.filter(post => post.isFeatured).length

  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
      {/* Search Section */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 lg:py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Categories Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-4 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
          Categories
        </h3>
        
        <div className="space-y-1.5 lg:space-y-2">
          {/* All Posts */}
          <button
            onClick={() => onFilterChange('all')}
            className={`w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
              activeFilter === 'all'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium">All Posts</span>
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              activeFilter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }`}>
              {posts.length}
            </span>
          </button>

          {/* Featured Posts */}
          {featuredCount > 0 && (
            <button
              onClick={() => onFilterChange('featured')}
              className={`w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                activeFilter === 'featured'
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-medium">Featured</span>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                activeFilter === 'featured'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}>
                {featuredCount}
              </span>
            </button>
          )}

          {/* Divider */}
          {(allCategories.length > 0 || allTags.length > 0) && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Categories */}
          {allCategories.map(category => {
            const categoryCount = posts.filter(post =>
              post.category?.toLowerCase() === category.toLowerCase()
            ).length

            return (
              <button
                key={`category-${category}`}
                onClick={() => onFilterChange(category)}
                className={`w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  activeFilter === category
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-medium">{category}</span>
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  activeFilter === category
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {categoryCount}
                </span>
              </button>
            )
          })}

          {/* Tags */}
          {allTags.map(tag => {
            const tagCount = posts.filter(post =>
              post.tags?.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
            ).length

            return (
              <button
                key={`tag-${tag}`}
                onClick={() => onFilterChange(tag)}
                className={`w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  activeFilter === tag
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">{tag}</span>
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  activeFilter === tag
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {tagCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-4 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
          Blog Stats
        </h3>
        
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between text-sm lg:text-base">
            <span className="text-gray-600">Total Articles</span>
            <span className="font-semibold text-gray-900">{posts.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm lg:text-base">
            <span className="text-gray-600">Categories</span>
            <span className="font-semibold text-gray-900">{allCategories.length}</span>
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center justify-between text-sm lg:text-base">
              <span className="text-gray-600">Tags</span>
              <span className="font-semibold text-gray-900">{allTags.length}</span>
            </div>
          )}
          
          {featuredCount > 0 && (
            <div className="flex items-center justify-between text-sm lg:text-base">
              <span className="text-gray-600">Featured</span>
              <span className="font-semibold text-gray-900">{featuredCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
