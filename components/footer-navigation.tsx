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

export default function FooterNavigation() {
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [stakeholdersOpen, setStakeholdersOpen] = useState(false)

  return (
    <nav
      role="navigation"
      aria-labelledby="site-add-menu"
      className="bg-[rgb(51,51,116)] py-6"
    >
      <h2 id="site-add-menu" className="sr-only">
        Site navigation menu
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-end gap-4">
          {/* Newsletter Button */}
          <li>
            <a
              target="_blank"
              href="https://analytics-au.clickdimensions.com/cn/afgz8/StudyNTMarketingLists"
              className="inline-block rounded bg-[rgb(216,0,92)] px-8 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-90"
            >
              Stay Updated
            </a>
          </li>

          {/* Regular Links */}
          {siteNav.map((item) => (
            <li key={item.href}>
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
              Get in Touch
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
