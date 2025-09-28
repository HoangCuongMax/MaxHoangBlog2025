"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabase-client'

interface UserInfo { id: string; email: string | null }

export default function AuthMenu() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) setUser(data.user ? { id: data.user.id, email: data.user.email } : null)
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const signOut = async () => { await supabase.auth.signOut() }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <Link href="/account/profile" className="text-zinc-700 hover:text-zinc-900">{user.email || 'Profile'}</Link>
          <button onClick={signOut} className="h-11 px-4 rounded-full border border-gray-200 text-zinc-700 hover:bg-gray-50">Sign out</button>
        </>
      ) : (
        <Link href="/account/auth" className="inline-flex items-center h-11 pt-[10px] pb-0 px-5 rounded-full bg-[rgb(30,41,59)] text-white font-semibold hover:opacity-90">Sign in / up</Link>
      )}
    </div>
  )
}
