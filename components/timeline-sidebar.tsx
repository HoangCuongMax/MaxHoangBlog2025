import { TimelineItem } from '../lib/notion-api'

interface TimelineSidebarProps {
  items: (TimelineItem & { recordMap?: any })[]
}

export default function TimelineSidebar({ items }: TimelineSidebarProps) {
  if (!items || items.length === 0) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="px-3 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">Posts</div>
        <div className="p-3 text-sm text-gray-500">No timeline items yet</div>
      </div>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">Posts</div>
      <div className="p-3">
        <nav>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)} className="block group">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 leading-snug">
                    {item.title}
                  </div>
                  {item.description ? (
                    <div className="text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis">
                      {item.description}
                    </div>
                  ) : null}
                  <div className="text-[11px] text-gray-400 mt-1">{formatDate(item.date)}</div>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
