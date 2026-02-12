"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PageContainer from '../../../components/page-container'
import supabase from '../../../lib/supabase-client'

export const dynamic = 'force-dynamic'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (res.error) { setError(res.error.message); return }
    router.push('/account/profile')
  }

  return (
    <PageContainer>
      <div className="max-w-md">
        <div className="inline-flex rounded-full border border-gray-200 p-1 mb-6 bg-white">
          <button onClick={()=>setMode('signin')} className={`px-4 py-2 rounded-full text-sm ${mode==='signin'?'bg-gray-900 text-white':'text-gray-700'}`}>Sign in</button>
          <button onClick={()=>setMode('signup')} className={`px-4 py-2 rounded-full text-sm ${mode==='signup'?'bg-gray-900 text-white':'text-gray-700'}`}>Sign up</button>
        </div>
        <h1 className="text-2xl font-bold mb-4">{mode==='signin' ? 'Sign in' : 'Create account'}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
          <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">{loading ? (mode==='signin'?'Signing in…':'Creating…') : (mode==='signin'?'Sign in':'Sign up')}</button>
        </form>
      </div>
    </PageContainer>
  )
}
