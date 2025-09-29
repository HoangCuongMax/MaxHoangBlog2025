'use client'

import { useMemo } from 'react'
import type { TimelineItem } from '../lib/notion-api'

interface TimelineFilterProps {
  items: TimelineItem[]
  selectedYear: string | null
  selectedMonth: string | null
  onYearChange: (year: string | null) => void
  onMonthChange: (month: string | null) => void
}

export default function TimelineFilter({
  items,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange
}: TimelineFilterProps) {
  // Extract unique years and months
  const { years, months } = useMemo(() => {
    const yearSet = new Set<string>()
    const monthSet = new Set<string>()

    items.forEach(item => {
      if (item.date) {
        const date = new Date(item.date)
        if (!isNaN(date.getTime())) {
          yearSet.add(date.getUTCFullYear().toString())
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthName = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
          monthSet.add(`${monthKey}|${monthName}`)
        }
      }
    })

    const sortedYears = Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a))
    const sortedMonths = Array.from(monthSet)
      .map(m => {
        const [key, name] = m.split('|')
        const [year, monthNum] = key.split('-')
        return { key, name, year, monthNum: parseInt(monthNum) }
      })
      .sort((a, b) => (parseInt(b.year) - parseInt(a.year)) || (b.monthNum - a.monthNum))

    return { years: sortedYears, months: sortedMonths }
  }, [items])

  const totalItems = items.filter(i => i.date && !isNaN(new Date(i.date).getTime())).length

  // One-line horizontal filter chips (scrollable)
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        {/* All */}
        <button
          onClick={() => { onYearChange(null); onMonthChange(null) }}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${(!selectedYear && !selectedMonth) ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label={`All (${totalItems})`}
          title={`All (${totalItems})`}
        >
          All ({totalItems})
        </button>

        {/* Years */}
        {years.map(year => (
          <button
            key={year}
            onClick={() => { onYearChange(year === selectedYear ? null : year); onMonthChange(null) }}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedYear === year ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {year}
          </button>
        ))}

        {/* Months (only show those that match selected year, or if no year selected show all months) */}
        {(selectedYear ? months.filter(m => m.year === selectedYear) : months).map(m => (
          <button
            key={m.key}
            onClick={() => {
              if (!selectedYear) onYearChange(m.year)
              onMonthChange(selectedMonth === m.key ? null : m.key)
            }}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedMonth === m.key ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title={`${m.name} ${m.year}`}
          >
            {m.name} {m.year}
          </button>
        ))}
      </div>
    </div>
  )
}
