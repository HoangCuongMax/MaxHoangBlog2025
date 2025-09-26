"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

const siteNav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/study-journal', label: 'AI Journal' },
  { href: '/ai-guide', label: 'AI Guide' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ title: string; url: string; type: string; excerpt?: string }>>([])
  const [loading, setLoading] = useState(false)
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
    let active = true
    const doSearch = async () => {
      if (!query.trim()) { setResults([]); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (active) setResults(data.results || [])
      } catch {
        if (active) setResults([])
      } finally {
        if (active) setLoading(false)
      }
    }
    const id = setTimeout(doSearch, 250)
    return () => { active = false; clearTimeout(id) }
  }, [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navColor = 'text-zinc-700'

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} aria-label="Main navigation" style={{ top: '0' }}>
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
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-zinc-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              <button
                aria-label="search-button"
                onClick={() => setSearchOpen(true)}
                title="Search (⌘K)"
                className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-gray-200 text-zinc-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
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
                aria-label="search-button"
                onClick={() => setSearchOpen(true)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-gray-200 text-zinc-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
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
                    {siteNav.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base text-zinc-700 hover:bg-gray-50">
                          {item.label}
                        </Link>
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

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl mx-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-zinc-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, timeline, study journal..."
                className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
              />
              <kbd className="text-xs text-zinc-500">Esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <div className="p-4 text-sm text-zinc-500">Searching…</div>
              ) : results.length === 0 ? (
                <div className="p-4 text-sm text-zinc-500">No results</div>
              ) : (
                results.map((r, i) => (
                  <Link key={i} href={r.url} onClick={() => setSearchOpen(false)} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.title}</div>
                    <div className="text-xs text-zinc-500">{r.type}{r.excerpt ? ' • ' + r.excerpt : ''}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
