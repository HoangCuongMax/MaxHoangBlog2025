'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function NotionLinkInterceptor() {
  const pathname = usePathname()

  useEffect(() => {
    // Function to intercept Notion page links and add context
    const interceptLinks = () => {
      const links = document.querySelectorAll('a[href*="/"]')
      
      links.forEach((link) => {
        const href = link.getAttribute('href')
        if (!href) return

        // Check if it's a Notion page ID (32-character hex)
        const notionIdRegex = /^\/[a-f0-9]{32}$/i
        
        if (notionIdRegex.test(href)) {
          // Add current page context as query parameter
          const newHref = `${href}?from=${encodeURIComponent(pathname)}`
          link.setAttribute('href', newHref)
        }
      })
    }

    // Run initially
    interceptLinks()

    // Set up observer for dynamic content
    const observer = new MutationObserver(() => {
      interceptLinks()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [pathname])

  return null
}
