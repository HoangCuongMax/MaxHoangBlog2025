'use client'

import Link from 'next/link'
import { useState } from 'react'

const mainNavItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Timeline',
    href: '/timeline',
  },
  {
    label: 'Study Journal',
    href: '/study-journal',
  },
  {
    label: 'Check List',
    href: '/projects',
  },
  {
    label: 'AI Guide',
    href: '/blog/ai-guide',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maxhoangau/',
    icon: 'in',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/HoangCuongMax',
    icon: 'gh',
  },
]

export default function SecondaryNavigation() {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  return (
    <nav
      role="navigation"
      aria-label="Secondary navigation"
      className="bg-white border-b border-gray-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Branding */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[rgb(51,51,116)] hover:opacity-80 transition-opacity"
            aria-label="Max Hoang Home"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <span className="hidden sm:inline">Max Hoang</span>
          </Link>

          {/* Main Navigation */}
          <ul className="hidden md:flex items-center justify-center gap-1 flex-1 ml-8">
            {mainNavItems.map((item) => (
              <li
                key={item.href}
                className="relative group"
                onMouseEnter={() => setHoveredMenu(item.href)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-4 font-bold text-[rgb(51,51,116)] hover:text-[rgb(216,0,92)] transition-colors duration-200 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden sm:flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(51,51,116)] text-white hover:bg-[rgb(216,0,92)] transition-colors duration-200"
                  aria-label={link.label}
                >
                  {link.icon === 'in' && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.292-1.194-2.292-1.195 0-1.38.932-1.38 1.892v4.578H8.456V9.359h2.514v1.007h.035c.35-.66 1.205-1.357 2.477-1.357 2.651 0 3.14 1.745 3.14 4.018v4.368zM4.462 7.859c-.645 0-1.162-.525-1.162-1.174 0-.649.517-1.174 1.162-1.174.646 0 1.163.525 1.163 1.174 0 .649-.517 1.174-1.163 1.174zm.992 8.479H3.468V9.359h2.016v6.979zM17.388 0H.612A.612.612 0 000 .612v18.776c0 .338.273.612.612.612h16.776c.338 0 .612-.274.612-.612V.612A.612.612 0 0017.388 0z" />
                    </svg>
                  )}
                  {link.icon === 'gh' && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.903-2.22-.253-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.54 9.54 0 012.502.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.191 20 14.433 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(51,51,116)] text-white hover:bg-[rgb(216,0,92)] transition-colors duration-200"
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
