'use client'

import { useEffect, useState } from 'react'
import { useTOC } from './toc-context'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function FloatingTOC({ leftOffsetClass = 'left-8' }: { leftOffsetClass?: string }) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [showSuggestion, setShowSuggestion] = useState<boolean>(true)
  const { isMinimized, setIsMinimized, setHasTOC } = useTOC()

  useEffect(() => {
    // Extract TOC from Notion content - try both TOC block and direct headings
    const extractTOC = () => {
      // First try: Look for existing Notion TOC block
      const tocContainer = document.querySelector('.notion-table-of-contents')
      if (tocContainer) {
        const tocLinks = tocContainer.querySelectorAll('.notion-table-of-contents-item')
        const items: TOCItem[] = []

        tocLinks.forEach((link) => {
          const href = link.getAttribute('href')
          const textElement = link.querySelector('.notion-table-of-contents-item-body')

          if (href && textElement) {
            const id = href.replace('#', '')
            const text = textElement.textContent || ''
            const marginLeft = textElement.getAttribute('style')?.match(/margin-left:\s*(\d+)px/)?.[1] || '0'
            const level = Math.floor(parseInt(marginLeft) / 24) // Notion uses 24px per level

            items.push({ id, text, level })
          }
        })

        if (items.length > 0) return items
      }

      // Second try: Extract from actual headings in the content (react-notion-x)
      // Try multiple selectors to catch different Notion heading structures
      const selectors = [
        // Standard heading tags with IDs
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
        // Notion-specific selectors
        '.notion-header[id], .notion-sub_header[id], .notion-sub_sub_header[id]',
        // React-notion-x selectors
        '.notion-h1[id], .notion-h2[id], .notion-h3[id]',
        // Block-based selectors
        '[data-block-id*=""] h1, [data-block-id*=""] h2, [data-block-id*=""] h3',
        // Broad selector for any element that looks like a heading
        '.notion-page-content h1, .notion-page-content h2, .notion-page-content h3'
      ]

      let headings: Element[] = []
      for (const selector of selectors) {
        const found = document.querySelectorAll(selector)
        if (found.length > 0) {
          headings = Array.from(found)
          break
        }
      }

      // Fallback: try to find ANY heading-like elements
      if (headings.length === 0) {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings = Array.from(allHeadings)
      }

      const items: TOCItem[] = []
      const seenIds = new Set<string>()

      headings.forEach((heading, index) => {
        let id = heading.id
        const text = heading.textContent?.trim() || ''

        // Generate an ID if the heading doesn't have one
        if (!id && text) {
          id = `toc-heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
          heading.id = id
        }

        if (id && text && !seenIds.has(id)) {
          seenIds.add(id)
          // Determine level from tag name
          let level = 0
          switch (heading.tagName.toLowerCase()) {
            case 'h1': level = 0; break
            case 'h2': level = 1; break
            case 'h3': level = 2; break
            case 'h4': level = 3; break
            case 'h5': level = 4; break
            case 'h6': level = 5; break
          }

          items.push({ id, text, level })
        }
      })

      return items
    }

    // Try multiple times to extract TOC as Notion content loads
    let attempts = 0
    const maxAttempts = 20 // Increased attempts

    const attemptExtraction = () => {
      const items = extractTOC()

      if (items.length > 0) {
        setTocItems(items)
        setHasTOC(true)
        return
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(attemptExtraction, 1000)
      } else {
        setHasTOC(false)
      }
    }

    // Start extraction after longer initial delay
    setTimeout(attemptExtraction, 2000)
  }, [])

  useEffect(() => {
    // Track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0 
      }
    )

    // Observe all headings (only real ones, not debug items)
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [tocItems])

  // Stop suggestion animation after 10 seconds or when user interacts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestion(false)
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Don't render if no TOC items
  if (tocItems.length === 0) return null

  return (
    <div className={`hidden xl:block fixed ${leftOffsetClass} top-32 z-10 transition-all duration-300 ${
      isMinimized ? `w-12 ${showSuggestion ? 'animate-pulse' : ''}` : 'w-72'
    }`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header with minimize/expand button */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
          {!isMinimized && (
            <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
              Contents
            </h3>
          )}
          <button
            onClick={() => {
              setIsMinimized(!isMinimized)
              setShowSuggestion(false) // Stop animation when user interacts
            }}
            className={`p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-all duration-300 ${
              isMinimized && showSuggestion ? 'animate-bounce' : ''
            }`}
            title={isMinimized ? 'Expand table of contents' : 'Minimize table of contents'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* TOC Content */}
        {!isMinimized && (
          <div className="p-3 max-h-80 overflow-y-auto">
            <nav className="space-y-1.5">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`block w-full text-left text-xs transition-colors hover:text-blue-600 py-1 px-1 rounded ${
                    activeId === item.id
                      ? 'text-blue-600 font-medium bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{
                    paddingLeft: `${Math.min(item.level * 12, 24) + 4}px`,
                  }}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Minimized indicator with animation */}
        {isMinimized && (
          <div className="p-2 flex justify-center">
            <div className={`w-2 h-2 bg-blue-500 rounded-full ${
              showSuggestion ? 'animate-ping' : ''
            }`}></div>
          </div>
        )}
      </div>
    </div>
  )
}
