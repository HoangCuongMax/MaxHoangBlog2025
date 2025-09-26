'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function UnderCoverTOC() {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

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
      const headings = document.querySelectorAll('article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id], .notion-page-container h1[id], .notion-page-container h2[id], .notion-page-container h3[id], .notion-page-container h4[id], .notion-page-container h5[id], .notion-page-container h6[id], h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
      
      const items: TOCItem[] = []
      const seenIds = new Set<string>()

      headings.forEach((heading) => {
        const id = heading.id
        const text = heading.textContent?.trim() || ''
        
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
    const maxAttempts = 20

    const attemptExtraction = () => {
      const items = extractTOC()
      
      if (items.length > 0) {
        setTocItems(items)
        return
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(attemptExtraction, 1000)
      }
    }

    // Start extraction after initial delay
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

    // Observe all headings
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [tocItems])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Don't render if no TOC items
  if (tocItems.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
            Table of Contents
          </h3>
        </div>

        {/* TOC Content */}
        <div className="p-4">
          <nav className="space-y-2">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-blue-600 py-2 px-3 rounded ${
                  activeId === item.id
                    ? 'text-blue-600 font-medium bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  paddingLeft: `${Math.min(item.level * 16, 32) + 12}px`,
                }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
