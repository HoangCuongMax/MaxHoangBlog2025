'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TOCContextType {
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
  hasTOC: boolean
  setHasTOC: (hasTOC: boolean) => void
}

const TOCContext = createContext<TOCContextType | undefined>(undefined)

export function TOCProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState<boolean>(true)
  const [hasTOC, setHasTOC] = useState<boolean>(false)

  return (
    <TOCContext.Provider value={{ isMinimized, setIsMinimized, hasTOC, setHasTOC }}>
      {children}
    </TOCContext.Provider>
  )
}

export function useTOC() {
  const context = useContext(TOCContext)
  if (context === undefined) {
    throw new Error('useTOC must be used within a TOCProvider')
  }
  return context
}
