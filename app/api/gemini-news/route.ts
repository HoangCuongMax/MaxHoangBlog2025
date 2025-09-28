import { NextResponse } from 'next/server'
import { getBlogPosts } from '../../../lib/notion-api'

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function buildPrompt(kind: string, context: string) {
  const base = `You are an assistant generating concise, factual outputs based only on the provided blog context. Avoid inventing facts. Use a friendly, professional tone. Keep it under 180 words unless asked otherwise.`
  if (kind === 'who') {
    return `${base}\n\nTask: Who is Max?\nContext:\n${context}\n\nWrite a short bio summarizing who Max is, areas of focus, and notable themes across posts.`
  }
  if (kind === 'what') {
    return `${base}\n\nTask: What does Max do?\nContext:\n${context}\n\nDescribe Max's work, skills, and typical activities grounded in the posts and tags.`
  }
  return `${base}\n\nTask: What news?\nContext:\n${context}\n\nSummarize the most recent updates and themes. Prefer latest items by date if present.`
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 400 })
    }

    const { type } = await req.json().catch(() => ({ type: 'news' }))
    const kind = type === 'who' ? 'who' : type === 'what' ? 'what' : 'news'

    const posts = await getBlogPosts()
    // Build lightweight context from metadata only
    const lines = posts
      .slice(0, 15)
      .map(p => {
        const date = p.publishDate ? new Date(p.publishDate).toISOString().split('T')[0] : ''
        const tags = (p.tags || []).join(', ')
        return `- ${date} | ${p.title}${tags ? ` | tags: ${tags}` : ''}${p.excerpt ? `\n  excerpt: ${p.excerpt}` : ''}`
      })
      .join('\n')

    const prompt = buildPrompt(kind, lines || 'No posts available.')

    let response
    try {
      response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, topK: 40, topP: 0.95 },
        }),
        // Prevent long hanging requests
        // Note: Next fetch in server environment will time out based on platform
      })
    } catch (fetchErr: any) {
      console.error('Error calling Gemini API:', fetchErr)
      return NextResponse.json({ error: 'Failed to contact Gemini API', details: fetchErr?.message || String(fetchErr) }, { status: 502 })
    }

    try {
      if (!response.ok) {
        const txt = await response.text().catch(() => '')
        return NextResponse.json({ error: 'Gemini request failed', details: txt }, { status: 502 })
      }

      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n') || ''
      return NextResponse.json({ result: text })
    } catch (parseErr: any) {
      console.error('Error parsing Gemini response:', parseErr)
      return NextResponse.json({ error: 'Failed to parse Gemini response', details: parseErr?.message || String(parseErr) }, { status: 502 })
    }
  } catch (e) {
    console.error('Unexpected error in gemini route:', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
