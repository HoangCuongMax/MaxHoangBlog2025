'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface LegacyUrlNoticeProps {
  currentPost?: {
    slug: string
    title: string
  }
}

export default function LegacyUrlNotice({ currentPost }: LegacyUrlNoticeProps) {
  const [showNotice, setShowNotice] = useState(false)
  const params = useParams()
  const router = useRouter()
  
  const isUuid = typeof params.slug === 'string' && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug)

  useEffect(() => {
    if (isUuid && currentPost && currentPost.slug !== params.slug) {
      setShowNotice(true)
    }
  }, [isUuid, currentPost, params.slug])

  if (!showNotice || !currentPost) return null

  const handleUpdateUrl = () => {
    router.replace(`/blog/${currentPost.slug}`)
    setShowNotice(false)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            You're viewing a legacy URL
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              This post is now available at a more user-friendly URL. 
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleUpdateUrl}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Update URL
              </button>
              <Link
                href={`/blog/${currentPost.slug}`}
                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Copy New URL
              </Link>
              <button
                onClick={() => setShowNotice(false)}
                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium text-blue-700 hover:text-blue-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
