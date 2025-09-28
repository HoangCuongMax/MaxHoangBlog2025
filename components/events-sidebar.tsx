'use client'

import Link from 'next/link'
import type { Event } from '../lib/notion-api'
import EventCard from './event-card'

interface EventsSidebarProps {
  events: Event[]
  title?: string
  showUpcomingOnly?: boolean
  limit?: number
}

export default function EventsSidebar({ 
  events, 
  title = "Events", 
  showUpcomingOnly = false,
  limit 
}: EventsSidebarProps) {
  // Filter events based on criteria
  let filteredEvents = events
  if (showUpcomingOnly) {
    filteredEvents = events.filter(event => event.isUpcoming)
  }

  // Apply limit if specified
  if (limit) {
    filteredEvents = filteredEvents.slice(0, limit)
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            {showUpcomingOnly ? 'No upcoming events' : 'No events'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {events.length > (limit || events.length) && (
          <Link 
            href="/events" 
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <EventCard event={event} compact={true} />
          </div>
        ))}
      </div>
    </div>
  )
}
