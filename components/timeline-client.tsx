'use client'

import { useState, useMemo } from 'react'
import { TimelineItem } from '../lib/notion-api'
import TimelineCardServer from './timeline-card-server'
import TimelineFilter from './timeline-filter'

interface TimelineClientProps {
  itemsWithContent: (TimelineItem & { recordMap?: any })[]
}

export default function TimelineClient({ itemsWithContent }: TimelineClientProps) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  // Filter timeline items based on selected year and month
  const filteredItems = useMemo(() => {
    if (!selectedYear && !selectedMonth) {
      return itemsWithContent
    }

    return itemsWithContent.filter(item => {
      if (!item.date) return false
      
      const date = new Date(item.date)
      if (isNaN(date.getTime())) return false
      
      const itemYear = date.getFullYear().toString()
      const itemMonth = `${itemYear}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      // Check year filter
      if (selectedYear && itemYear !== selectedYear) {
        return false
      }
      
      // Check month filter
      if (selectedMonth && itemMonth !== selectedMonth) {
        return false
      }
      
      return true
    })
  }, [itemsWithContent, selectedYear, selectedMonth])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Timeline
        </h1>
        <p className="text-sm text-gray-600">
          A chronological journey through my experiences, achievements, and milestones
        </p>
      </div>

      {/* Filters */}
      <TimelineFilter
        items={itemsWithContent}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      {/* Timeline Items */}
      {filteredItems.length > 0 ? (
        <div className="timeline-masonry">
          {filteredItems.map((item, index) => (
            <div id={item.id} key={item.id} className="timeline-masonry-item scroll-mt-24">
              <TimelineCardServer item={item} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {(selectedYear || selectedMonth) ? 'No items found' : 'No timeline items yet'}
          </h3>
          <p className="text-gray-600">
            {(selectedYear || selectedMonth) 
              ? 'Try adjusting your filters to see more timeline items.'
              : 'Check back soon for new updates!'
            }
          </p>
          {(selectedYear || selectedMonth) && (
            <button
              onClick={() => {
                setSelectedYear(null)
                setSelectedMonth(null)
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
