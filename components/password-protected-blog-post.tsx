'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PasswordProtection from './password-protection'
import { BlogPost } from '../lib/notion-api'

interface PasswordProtectedBlogPostProps {
  post: BlogPost
  children: React.ReactNode
}

export default function PasswordProtectedBlogPost({ 
  post, 
  children 
}: PasswordProtectedBlogPostProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState('')

  // Check if post requires password
  const requiresPassword = post.password && post.password.trim() !== ''

  // Check if user has already unlocked this post (session storage)
  useEffect(() => {
    if (requiresPassword) {
      const unlockedPosts = JSON.parse(sessionStorage.getItem('unlockedPosts') || '{}')
      if (unlockedPosts[post.id]) {
        setIsUnlocked(true)
      }
    } else {
      setIsUnlocked(true)
    }
  }, [post.id, requiresPassword])

  const handleUnlock = async (inputPassword: string) => {
    setIsUnlocking(true)
    setError('')

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (inputPassword === post.password) {
      // Store unlocked state in session storage
      const unlockedPosts = JSON.parse(sessionStorage.getItem('unlockedPosts') || '{}')
      unlockedPosts[post.id] = true
      sessionStorage.setItem('unlockedPosts', JSON.stringify(unlockedPosts))
      
      setIsUnlocked(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
    }
    
    setIsUnlocking(false)
  }

  // If no password required or already unlocked, show content
  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: requiresPassword ? 0.5 : 0 // Add delay if unlocking animation played
        }}
      >
        {children}
      </motion.div>
    )
  }

  // Show password protection screen
  return (
    <PasswordProtection
      title={post.title}
      onUnlock={handleUnlock}
      isUnlocking={isUnlocking}
      error={error}
    />
  )
}
