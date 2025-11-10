'use client'

import Link from 'next/link'

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Talks', href: '/talks' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function TwoLevelNavigation() {
  return (
    <nav
      role="navigation"
      aria-labelledby="main-nav-title"
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <h2 id="main-nav-title" className="sr-only">
        Main navigation
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[rgb(51,51,116)] hover:opacity-80 transition-opacity"
          >
            Max Hoang
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 flex-1 ml-12">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium text-gray-700 hover:text-[rgb(51,51,116)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/hoangngoccuong/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-6 py-2 bg-[rgb(216,0,92)] text-white font-semibold hover:bg-[rgb(196,0,72)] transition-colors"
          >
            Connect on LinkedIn
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
