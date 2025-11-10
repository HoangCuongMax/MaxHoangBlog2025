'use client'

import Link from 'next/link'

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
  return (
    <>
      {/* Top Banner */}
      <div className="bg-[rgb(216,0,92)] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <a
            href="https://analytics-au.clickdimensions.com/cn/afgz8/StudyNTMarketingLists"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
          >
            Sign up to our newsletter
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l4 4m0 0l4-4m-4 4v12" />
            </svg>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        role="navigation"
        aria-labelledby="main-nav-title"
        className="bg-[rgb(51,51,116)]"
      >
        <h2 id="main-nav-title" className="sr-only">
          Main navigation
        </h2>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ul className="flex flex-wrap items-center justify-end gap-6 py-4">
            {/* Navigation Links */}
            {siteNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-bold text-white transition-all duration-300 ease-in-out hover:opacity-80"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* CTA Buttons */}
            <li>
              <a
                href="https://www.maxhoang.com.au/contact"
                className="font-bold text-white transition-all duration-300 ease-in-out hover:opacity-80"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/maxhoangau/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-[rgb(216,0,92)] px-6 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:opacity-90"
              >
                LinkedIn
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.292-1.194-2.292-1.195 0-1.38.932-1.38 1.892v4.578H8.456V9.359h2.514v1.007h.035c.35-.66 1.205-1.357 2.477-1.357 2.651 0 3.14 1.745 3.14 4.018v4.368zM4.462 7.859c-.645 0-1.162-.525-1.162-1.174 0-.649.517-1.174 1.162-1.174.646 0 1.163.525 1.163 1.174 0 .649-.517 1.174-1.163 1.174zm.992 8.479H3.468V9.359h2.016v6.979zM17.388 0H.612A.612.612 0 000 .612v18.776c0 .338.273.612.612.612h16.776c.338 0 .612-.274.612-.612V.612A.612.612 0 0017.388 0z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
