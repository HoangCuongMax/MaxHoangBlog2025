"use client"

"use client"

import { useState } from 'react'

type Tab = 'news' | 'who' | 'what'

export default function WhatsNews() {
  const [tab, setTab] = useState<Tab>('news')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState('')

  const run = async (t: Tab) => {
    setTab(t)
    setLoading(true)
    setError(null)
    setResult('')
    try {
      const res = await fetch('/api/gemini-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: t }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to generate')
      setResult(data.result || '')
    } catch (e: any) {
      setError(e.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full mt-6 sm:mt-8 md:mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-2xl bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">What News?</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => run('news')} className={`px-3 py-1.5 text-sm rounded-md border ${tab==='news' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>What news</button>
              <button onClick={() => run('who')} className={`px-3 py-1.5 text-sm rounded-md border ${tab==='who' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Who is Max</button>
              <button onClick={() => run('what')} className={`px-3 py-1.5 text-sm rounded-md border ${tab==='what' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>What does Max do</button>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            {loading && (
              <div className="text-sm text-gray-500">Generating…</div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {!loading && !error && result && (
              <div className="prose prose-sm sm:prose max-w-none">
                {result.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            {!loading && !error && !result && (
              <div className="text-sm text-gray-500">Choose an option above to generate content from your blog.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
