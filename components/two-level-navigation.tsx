'use client'

import Link from 'next/link'
import { useState } from 'react'

const siteNav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/study-journal', label: 'Study Journal' },
  { href: '/projects', label: 'Check List' },
  { href: '/blog/ai-guide', label: 'AI Guide' },
  { href: '/contact', label: 'Contact' },
]

export default function TwoLevelNavigation() {
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [stakeholdersOpen, setStakeholdersOpen] = useState(false)

  return (
    <nav
      role="navigation"
      aria-labelledby="main-nav-title"
      className="bg-[rgb(51,51,116)]"
    >
      <h2 id="main-nav-title" className="sr-only">
        Main navigation
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-end gap-4 py-4">
          {/* Newsletter Button */}
          <li>
            <a
              target="_blank"
              href="https://analytics-au.clickdimensions.com/cn/afgz8/StudyNTMarketingLists"
              className="inline-block rounded bg-[rgb(216,0,92)] px-8 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-90"
            >
              Sign up to our newsletter
            </a>
          </li>

          {/* Navigation Links */}
          {siteNav.map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className="px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-80"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Contact Link */}
          <li>
            <a
              href="https://www.maxhoang.com.au/contact"
              className="px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-80"
            >
              Contact
            </a>
          </li>

          {/* LinkedIn CTA */}
          <li>
            <a
              href="https://www.linkedin.com/in/maxhoangau/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-[rgb(216,0,92)] px-8 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-90"
            >
              LinkedIn +
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
