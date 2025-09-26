'use client'

import dynamic from 'next/dynamic'

// Dynamically import client components to avoid SSR issues
const LegacyUrlNotice = dynamic(() => import('./legacy-url-notice'), {
  ssr: false,
  loading: () => null
})

interface ClientLegacyUrlNoticeProps {
  currentPost?: {
    slug: string
    title: string
  }
}

export function ClientLegacyUrlNotice({ currentPost }: ClientLegacyUrlNoticeProps) {
  return <LegacyUrlNotice currentPost={currentPost} />
}
