'use client'

import Link from 'next/link'
import type { Event } from '../lib/notion-api'
import EventCard from './event-card'

interface EventsListProps {
  events: Event[]
  title?: string
  showUpcomingOnly?: boolean
  limit?: number
}

export default function EventsList({ 
  events, 
  title = "Events", 
  showUpcomingOnly = false,
  limit 
}: EventsListProps) {
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
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-xl">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showUpcomingOnly ? 'No upcoming events' : 'No events found'}
          </h3>
          <p className="text-gray-600">
            {showUpcomingOnly ? 'Check back soon for new events!' : 'Events will appear here when available.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {events.length > (limit || events.length) && (
          <Link 
            href="/events" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all ({events.length})
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
