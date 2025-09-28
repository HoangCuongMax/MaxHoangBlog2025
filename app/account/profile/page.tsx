"use client"

import { useEffect, useState } from 'react'
import supabase from '../../../lib/supabase-client'
import PageContainer from '../../../components/page-container'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!data.user) { router.replace('/account/login'); return }
        setEmail(data.user.email)
        setLoading(false)
      } catch (e) {
        console.error('Error fetching user in profile:', e)
        router.replace('/account/login')
      }
    }
    load()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <PageContainer><div>Loading…</div></PageContainer>

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-gray-700 mb-6">Signed in as {email}</p>
      <button onClick={signOut} className="px-4 py-2 rounded bg-gray-800 text-white">Sign out</button>
    </PageContainer>
  )
}
