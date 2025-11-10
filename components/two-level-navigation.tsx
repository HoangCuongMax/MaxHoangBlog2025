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
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <h2 id="main-nav-title" className="sr-only">
        Main navigation
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Max Hoang
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 flex-1 ml-12">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors text-sm"
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
            className="hidden sm:inline-block px-6 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors text-sm"
          >
            LinkedIn
          </a>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
          <div className="md:hidden pb-4 border-t border-gray-200">
            <ul className="space-y-2 py-4">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-200">
                <a
                  href="https://www.linkedin.com/in/hoangngoccuong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 rounded-lg transition-colors text-center"
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
