'use client'

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { BlogPost } from '../lib/notion-api'

interface RelatedPostsPopupProps {
  relatedPosts: BlogPost[]
  currentPostId: string
}

export default function RelatedPostsPopup({ relatedPosts, currentPostId }: RelatedPostsPopupProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Check if user is near the bottom (within 200px)
      const nearBottom = scrollTop + windowHeight >= documentHeight - 200

      setIsAtBottom(nearBottom)

      // Show popup when near bottom, hide when scrolling back up
      if (nearBottom && !showPopup) {
        setTimeout(() => setShowPopup(true), 500) // Small delay for better UX
      } else if (!nearBottom && showPopup) {
        setShowPopup(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showPopup, isMounted])

  // Filter out current post and limit to 3
  const filteredPosts = relatedPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3)

  // Don't render on server or if not mounted
  if (!isMounted || !showPopup || filteredPosts.length === 0) return null

  return (
    <div className={`fixed bottom-4 left-4 z-40 transition-all duration-300 ${showPopup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Related Posts</h3>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close related posts"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex gap-3">
                {post.coverImage && (
                  <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex items-center gap-1.5">
                    {post.password && post.password.trim() !== '' && (
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {post.title}
                  </h4>
                  {post.publishDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.publishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Posts →
          </Link>
        </div>
      </div>
    </div>
  )
}
