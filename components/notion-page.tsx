'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Import react-notion-x components and styles
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

const NotionRenderer = dynamic(() =>
  import('react-notion-x').then(m => m.NotionRenderer),
  { ssr: false }
)

// Enable proper code block rendering
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(m => m.Code),
  { ssr: false }
)

interface NotionPageProps {
  recordMap: any
  rootPageId?: string
}

export default function NotionPage({ recordMap, rootPageId }: NotionPageProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !recordMap) {
    return null // Instant loading - no spinner
  }

  return (
    <div className="notion-page-container">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        rootPageId={rootPageId}
        previewImages={true}
        components={{
          Code,
        }}
      />
    </div>
  )
}
