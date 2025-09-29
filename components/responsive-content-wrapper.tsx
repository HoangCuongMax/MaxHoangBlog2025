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
        ? 'xl:mx-auto xl:max-w-[1200px]'
        : isMinimized
        ? 'xl:ml-8 xl:mr-8 xl:max-w-[1200px]'
        : 'xl:ml-80 xl:mr-4 xl:max-w-[1200px]'
    }`}>
      {children}
    </div>
  )
}
