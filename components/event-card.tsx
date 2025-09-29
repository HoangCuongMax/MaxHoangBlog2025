'use client'

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Event } from '../lib/notion-api'

interface EventCardProps {
  event: Event
  compact?: boolean
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  const [showContent, setShowContent] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      })
    } catch (error) {
      return ''
    }
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''

      // Use a more consistent format to avoid hydration issues
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')

      return `${displayHours}:${displayMinutes} ${ampm}`
    } catch (error) {
      return ''
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'postponed':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <>
      <div className={`group transition-all duration-200 ${compact ? 'p-3' : 'p-4'}`}>
        {/* Event Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Event Icon/Date */}
          <div className="flex-shrink-0">
            {event.icon ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
                {event.icon.startsWith('http') ? (
                  <img src={event.icon} alt="Event icon" className="w-8 h-8 rounded" />
                ) : (
                  <span className="text-2xl">{event.icon}</span>
                )}
              </div>
            ) : event.date ? (
              <div className={`text-center p-2 rounded-lg border ${
                event.isUpcoming 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                <div className="text-xs font-medium uppercase tracking-wide">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-sm font-bold">
                  {new Date(event.date).getDate()}
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors ${
                  compact ? 'text-sm' : 'text-base'
                }`}>
                  {event.title}
                </h3>
                
                {/* Status Badge */}
                {event.status && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    {event.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        Featured
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className={`text-gray-600 mb-2 ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
                {event.description}
              </p>
            )}

            {/* Progress Bar for ongoing events */}
            {event.startDate && event.endDate && event.progress !== undefined && event.progress > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{event.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(event.progress)}`}
                    style={{ width: `${Math.min(event.progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>{formatDate(event.startDate)}</span>
                  <span>{formatDate(event.endDate)}</span>
                </div>
              </div>
            )}

            {/* Event Meta Information */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
              {event.date && isClient && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(event.date)}
                  {event.endDate && event.endDate !== event.date && (
                    <span> - {formatTime(event.endDate)}</span>
                  )}
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-1 truncate">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {/* Tags and Category */}
            {(event.category || (event.tags && event.tags.length > 0)) && (
              <div className="flex flex-wrap gap-1 mb-3">
                {event.category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-md border border-blue-200">
                    {event.category}
                  </span>
                )}
                {event.tags && event.tags.slice(0, compact ? 1 : 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
                {event.tags && event.tags.length > (compact ? 1 : 2) && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded-md border border-gray-200">
                    +{event.tags.length - (compact ? 1 : 2)}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {event.url && (
                <Link
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                >
                  Learn More
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
              
              {/* Read More button for content */}
              <button
                onClick={() => setShowContent(true)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
              >
                Read More
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {event.coverImage && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Content Modal */}
      {showContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setShowContent(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
              <button
                onClick={() => setShowContent(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {event.description ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  {event.date && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.date)}{isClient && ` at ${formatTime(event.date)}`}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No additional content available for this event.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
