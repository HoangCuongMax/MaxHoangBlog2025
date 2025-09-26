import { NextResponse } from 'next/server'
import { getBlogPosts, getStudyJournalPosts, getTimelineItems } from '../../../lib/notion-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase().trim()

    if (!q) {
      return NextResponse.json({ results: [] })
    }

    const [blogs, studies, timelines] = await Promise.all([
      getBlogPosts().catch(() => []),
      getStudyJournalPosts().catch(() => [] as any[]),
      getTimelineItems().catch(() => [] as any[]),
    ])

    const results: Array<{ title: string; url: string; type: string; excerpt?: string; date?: string }> = []

    for (const p of blogs || []) {
      const hay = `${p.title} ${p.excerpt || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
      if (hay.includes(q)) {
        results.push({ title: p.title, url: `/blog/${p.slug || p.id}`, type: 'Blog', excerpt: p.excerpt, date: p.publishDate })
      }
    }

    for (const s of studies || []) {
      const hay = `${s.title} ${s.excerpt || ''} ${(s.tags || []).join(' ')}`.toLowerCase()
      if (hay.includes(q)) {
        results.push({ title: s.title, url: `/study-journal/${s.slug || s.id}`, type: 'Study Journal', excerpt: s.excerpt, date: s.publishedDate })
      }
    }

    for (const t of timelines || []) {
      const hay = `${t.title} ${t.description || ''} ${(t.tags || []).join(' ')}`.toLowerCase()
      if (hay.includes(q)) {
        results.push({ title: t.title, url: `/timeline/${t.id}`, type: 'Timeline', excerpt: t.description, date: t.date })
      }
    }

    // Simple sort: newest first when date available, otherwise by title
    results.sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : 0
      const db = b.date ? Date.parse(b.date) : 0
      if (da !== db) return db - da
      return a.title.localeCompare(b.title)
    })

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ results: [] }, { status: 200 })
  }
}
