import Link from 'next/link'
import type { TimelineItem } from '../lib/notion-api'

interface TimelineCardProps {
  item: TimelineItem
  href?: string
}

export default function TimelineCard({ item, href }: TimelineCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  const link = href || `/timeline/${item.id}`

  return (
    <article className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      {item.coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.coverImage}
            alt={`Cover image for timeline item: ${item.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />

          {item.isFeatured && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-3 lg:p-5">
        {(item.tags && item.tags.length > 0) && (
          <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-2 lg:mb-3">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="inline-flex items-center px-2 lg:px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition-colors cursor-default">#{tag}</span>
            ))}
            {item.tags.length > 2 && (
              <span className="inline-flex items-center px-2 lg:px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-md">+{item.tags.length - 2}</span>
            )}
          </div>
        )}

        <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-1 lg:mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          <Link href={link} title={`Read: ${item.title}`} className="flex items-start gap-2">
            <span className="flex-1">{item.title}</span>
          </Link>
        </h2>

        {item.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">{item.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {item.date ? formatDate(item.date) : 'Recently'}
          </div>

          <Link href={link} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium group/link" title={`View: ${item.title}`}>
            View
            <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
