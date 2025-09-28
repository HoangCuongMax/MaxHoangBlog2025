"use client"

import { useState } from 'react'
import supabase from '../../../lib/supabase-client'
import PageContainer from '../../../components/page-container'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/account/profile')
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm">No account? <a href="/account/signup" className="text-blue-600 underline">Sign up</a></p>
    </PageContainer>
  )
}
