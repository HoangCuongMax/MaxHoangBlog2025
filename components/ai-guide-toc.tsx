"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

export interface HeadingItem {
  id: string
  text: string
  level: number // 1,2,3
}

interface AiGuideTocProps {
  headings: HeadingItem[]
}

export default function AiGuideToc({ headings }: AiGuideTocProps) {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string>('')
  const observer = useRef<IntersectionObserver | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return headings
    return headings.filter(h => h.text.toLowerCase().includes(q))
  }, [headings, query])

  useEffect(() => {
    const ids = headings.map(h => h.id)
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    )

    elements.forEach(el => observer.current!.observe(el))
    return () => observer.current?.disconnect()
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) {
      // Fallback: try data-block-id selector from react-notion-x
      const dataEl = document.querySelector(`[data-block-id="${id}"]`) as HTMLElement | null
      if (!dataEl) return
      const y = dataEl.getBoundingClientRect().top + window.pageYOffset - 96
      window.scrollTo({ top: y, behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
      return
    }
    const y = el.getBoundingClientRect().top + window.pageYOffset - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="toc border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">Contents</div>
      <div className="p-3">
        <input
          type="search"
          placeholder="Type to search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter contents"
        />
        <nav className="mt-3">
          <ul className="space-y-1">
            {filtered.map(h => (
              <li key={h.id} className={h.level === 1 ? 'pl-1' : h.level === 2 ? 'pl-4' : 'pl-7'}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleClick(e, h.id)}
                  className={`block py-1 text-sm text-gray-700 hover:text-blue-700 underline-offset-2 ${activeId === h.id ? 'active' : ''}`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
