'use server'

import { getBlogPosts } from './notion-api'
import { redirect } from 'next/navigation'

export async function redirectToSeoUrl(uuid: string) {
  if (!uuid) {
    redirect('/blog')
  }

  try {
    const posts = await getBlogPosts()
    const post = posts.find(p => p.id === uuid)
    
    if (post) {
      // Redirect to SEO-friendly URL
      redirect(`/blog/${post.slug}`)
    } else {
      // Post not found, redirect to blog
      redirect('/blog')
    }
  } catch (error) {
    console.error('Error finding post:', error)
    redirect('/blog')
  }
}
