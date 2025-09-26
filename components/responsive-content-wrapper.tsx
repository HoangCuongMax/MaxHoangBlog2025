'use client'

import { ReactNode } from 'react'
import { useTOC } from './toc-context'

interface ResponsiveContentWrapperProps {
  children: ReactNode
}

export default function ResponsiveContentWrapper({ children }: ResponsiveContentWrapperProps) {
  const { isMinimized, hasTOC } = useTOC()

  return (
    <div className={`transition-all duration-300 ${
      !hasTOC
        ? 'xl:mx-auto xl:max-w-4xl' // When no TOC, center content with max width
        : isMinimized
        ? 'xl:ml-8 xl:mr-8' // When minimized, balanced margins for proper centering
        : 'xl:ml-80 xl:mr-4'  // When expanded, left margin for TOC space
    }`}>
      {children}
    </div>
  )
}
