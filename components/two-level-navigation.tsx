'use client'

import Link from 'next/link'
import { useState } from 'react'

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Talks', href: '/talks' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function TwoLevelNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav
      role="navigation"
      aria-labelledby="main-nav-title"
      className="fixed top-0 z-50 w-full bg-black bg-opacity-20 backdrop-blur-sm"
    >
      <h2 id="main-nav-title" className="sr-only">
        Main navigation
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            Max Hoang
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10 flex-1 ml-16">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white font-semibold hover:text-gray-300 transition-colors text-lg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side - LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/hoangngoccuong/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-8 py-3 bg-[rgb(216,0,92)] text-white font-bold hover:bg-[rgb(196,0,72)] transition-colors text-lg"
          >
            LinkedIn
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white border-opacity-20 bg-black bg-opacity-40">
            <ul className="space-y-2 py-4">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-white border-opacity-20">
                <a
                  href="https://www.linkedin.com/in/hoangngoccuong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 bg-[rgb(216,0,92)] text-white font-bold hover:bg-[rgb(196,0,72)] rounded-lg transition-colors text-center text-lg"
                >
                  Connect on LinkedIn
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
