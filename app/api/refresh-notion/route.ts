import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST() {
  try {
    // Revalidate all Notion-related data
    revalidateTag('blog-posts')
    revalidateTag('timeline-items')
    revalidateTag('notion-pages')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notion data refreshed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error refreshing Notion data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to refresh Notion data' },
      { status: 500 }
    )
  }
}
