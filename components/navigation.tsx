"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

const siteNav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/study-journal', label: 'Study Journal' },
  { href: '/projects', label: 'Check List' },
  { href: '/blog/ai-guide', label: 'AI Guide' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      if (y < lastScrollY || y < 10) setIsVisible(true)
      else if (y > lastScrollY && y > 100) setIsVisible(false)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navColor = 'text-zinc-700'

  return (
    <nav className={`fixed left-0 right-0 z-[10000] transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} aria-label="Main navigation" style={{ top: '0' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pt-2 sm:pt-3 relative">
          {/* Pill container - bigger x2 */}
          <div className="bg-white/95 supports-[backdrop-filter]:bg-white/80 border border-gray-200 shadow-sm rounded-full h-20 flex items-center px-3 sm:px-5 backdrop-blur">
            {/* Brand: text only */}
            <Link href="/" className="flex items-center gap-2 shrink-0 px-2" aria-label="Home">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">Max Hoang</span>
            </Link>

            {/* Desktop menu */}
            <ul className={`hidden md:flex items-center gap-8 text-base ${navColor} ml-4`}> 
              {siteNav.map((item: any) => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="hover:text-zinc-900 transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              <a
                aria-label="LinkedIn profile"
                href="https://www.linkedin.com/in/maxhoangau/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-[rgb(30,41,59)] text-white font-semibold hover:opacity-90"
              >
                LinkedIn +
              </a>
            </div>

            {/* Mobile actions */}
            <div className="ml-auto md:hidden flex items-center gap-2">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(v => !v)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-gray-200 text-zinc-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown panel */}
          {mobileOpen && (
            <div className="absolute left-0 right-0 mt-2 md:hidden">
              <div className="mx-auto max-w-7xl px-2">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <ul className="py-2">
                    {siteNav.map((item: any) => (
                      <li key={item.href}>
                        {item.external ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base text-zinc-700 hover:bg-gray-50">
                            {item.label}
                          </a>
                        ) : (
                          <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base text-zinc-700 hover:bg-gray-50">
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 pb-4">
                    <a
                      href="https://www.linkedin.com/in/maxhoangau/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center h-11 px-5 rounded-full bg-[rgb(30,41,59)] text-white font-semibold hover:opacity-90"
                    >
                      LinkedIn +
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
