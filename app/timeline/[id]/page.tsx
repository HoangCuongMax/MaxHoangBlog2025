import { getTimelineItems, getTimelineItemContent } from '../../../lib/notion-api'
import PageContainer from '../../../components/page-container'
import NotionPage from '../../../components/notion-page'
import Link from 'next/link'
import { generateMetaTags } from '../../../lib/seo-utils'
import ErrorFallback from '../../../components/error-fallback'
import PhotoGallerySlider from '../../../components/photo-gallery-slider'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface TimelineDetailPageProps {
  params: {
    id: string
  }
}

export default async function TimelineDetailPage({ params }: TimelineDetailPageProps) {
  try {
    // Get all timeline items
    const timelineItems = await getTimelineItems()
    
    // Find the specific timeline item
    const timelineItem = timelineItems.find(item => item.id === params.id)

    if (!timelineItem) {
      throw new Error(`Timeline item not found for id: ${params.id}`)
    }

    // Get the timeline item content
    const recordMap = await getTimelineItemContent(timelineItem.id)

    // Extract images from Notion content with captions
    const extractImagesFromRecordMap = (recordMap: any): Array<{url: string, caption?: string}> => {
      if (!recordMap?.block) return []

      const images: Array<{url: string, caption?: string}> = []
      const blocks = Object.values(recordMap.block)

      blocks.forEach((block: any) => {
        const blockData = block?.value

        // Handle different image block types
        if (blockData?.type === 'image') {
          let imageUrl = ''
          let caption = ''

          // Extract caption from image block
          if (blockData?.properties?.caption?.[0]?.[0]) {
            caption = blockData.properties.caption[0][0]
          }

          // Check all possible image URL locations (ordered by frequency)
          // Format.display_source is the most common
          if (blockData?.format?.display_source) {
            imageUrl = blockData.format.display_source
          }
          // Properties.source for external images
          else if (blockData?.properties?.source?.[0]?.[0]) {
            imageUrl = blockData.properties.source[0][0]
          }
          // Properties.url for some image types
          else if (blockData?.properties?.url?.[0]?.[0]) {
            imageUrl = blockData.properties.url[0][0]
          }
          // Direct display_source property
          else if (blockData?.display_source) {
            imageUrl = blockData.display_source
          }
          // For file uploads - check properties.title first element
          else if (blockData?.properties?.title?.[0]?.[0]) {
            const titleContent = blockData.properties.title[0][0]
            if (typeof titleContent === 'string' && (titleContent.startsWith('http') || titleContent.startsWith('https'))) {
              imageUrl = titleContent
            }
          }
          // Check if there's a file property with URL
          else if (blockData?.file?.url) {
            imageUrl = blockData.file.url
          }
          // Check for external property
          else if (blockData?.external?.url) {
            imageUrl = blockData.external.url
          }

          // Convert Notion attachment URLs to proper CDN URLs
          if (imageUrl) {
            if (imageUrl.startsWith('attachment:')) {
              // Extract the file ID and filename from attachment URL
              const attachmentMatch = imageUrl.match(/attachment:([a-f0-9-]+):(.+)/)
              if (attachmentMatch) {
                const [, fileId, filename] = attachmentMatch
                // Convert to Notion CDN URL
                imageUrl = `https://www.notion.so/image/${encodeURIComponent(`https://s3-us-west-2.amazonaws.com/secure.notion-static.com/${fileId}/${filename}`)}?table=block&id=${blockData.id}&cache=v2`
              }
            }

            // Add valid image URLs with captions
            if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
              images.push({ url: imageUrl, caption: caption || undefined })
            }
          }
        }

        // Also check for gallery blocks which contain multiple images
        else if (blockData?.type === 'gallery') {
          if (blockData?.content && Array.isArray(blockData.content)) {
            blockData.content.forEach((imageId: string) => {
              const imageBlock = recordMap.block?.[imageId]?.value
              if (imageBlock?.type === 'image') {
                let galleryImageUrl = ''
                let galleryCaption = ''

                // Extract caption from gallery image block
                if (imageBlock?.properties?.caption?.[0]?.[0]) {
                  galleryCaption = imageBlock.properties.caption[0][0]
                }

                if (imageBlock?.format?.display_source) {
                  galleryImageUrl = imageBlock.format.display_source
                } else if (imageBlock?.properties?.source?.[0]?.[0]) {
                  galleryImageUrl = imageBlock.properties.source[0][0]
                } else if (imageBlock?.properties?.url?.[0]?.[0]) {
                  galleryImageUrl = imageBlock.properties.url[0][0]
                } else if (imageBlock?.file?.url) {
                  galleryImageUrl = imageBlock.file.url
                } else if (imageBlock?.external?.url) {
                  galleryImageUrl = imageBlock.external.url
                }

                if (galleryImageUrl && (galleryImageUrl.startsWith('http') || galleryImageUrl.startsWith('https'))) {
                  images.push({ url: galleryImageUrl, caption: galleryCaption || undefined })
                }
              }
            })
          }
        }
      })

      return images
    }

    const extractedImages = extractImagesFromRecordMap(recordMap)

    const formatDate = (dateString: string) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    }

    return (
      <PageContainer noBoxStyling={true}>
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/timeline" className="hover:text-gray-700">Timeline</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{timelineItem.title}</span>
        </nav>

        {/* Photo Gallery - 90% width of viewport if there are images */}
        {extractedImages.length > 0 ? (
          <div className="mb-8 relative left-1/2 transform -translate-x-1/2 w-[90vw] max-w-none">
            <PhotoGallerySlider
              images={extractedImages}
              title={timelineItem.title}
              isFullScreen={true}
            />
          </div>
        ) : (
          /* Timeline Post Header - Only show if no gallery */
          <header className="mb-8">
            {/* Featured Badge */}
            {timelineItem.isFeatured && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                  ⭐ Featured
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {timelineItem.title}
            </h1>

            {/* Cover Image */}
            {timelineItem.coverImage && (
              <div className="w-full mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={timelineItem.coverImage}
                  alt={timelineItem.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
              {timelineItem.date && (
                <span>
                  {formatDate(timelineItem.date)}
                </span>
              )}
              {timelineItem.category && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {timelineItem.category}
                </span>
              )}
              {timelineItem.tags && timelineItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {timelineItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {timelineItem.description && (
              <div className="text-lg text-gray-600 mb-8">
                {timelineItem.description}
              </div>
            )}
          </header>
        )}

        {/* Title and Meta for Gallery Posts */}
        {extractedImages.length > 0 && (
          <div className="mb-8">
            {/* Featured Badge */}
            {timelineItem.isFeatured && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                  ⭐ Featured
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {timelineItem.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              {timelineItem.date && (
                <span>
                  {formatDate(timelineItem.date)}
                </span>
              )}
              {timelineItem.category && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {timelineItem.category}
                </span>
              )}
              {timelineItem.tags && timelineItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {timelineItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {timelineItem.description && (
              <div className="text-lg text-gray-600 mb-8">
                {timelineItem.description}
              </div>
            )}
          </div>
        )}

        {/* Timeline Content */}
        <article className={`notion-content ${extractedImages.length > 0 ? 'has-gallery' : ''}`}>
          <NotionPage recordMap={recordMap} />
        </article>

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link
            href="/timeline"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Timeline
          </Link>
        </div>
      </PageContainer>
    )
  } catch (error) {
    console.error('Error loading timeline item:', error)
    return (
      <PageContainer>
        <div className="mb-8">
          <Link 
            href="/timeline"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
          >
            <svg 
              className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Timeline
          </Link>
        </div>
        
        <ErrorFallback 
          title="Timeline Item Not Found" 
          message="Sorry, we couldn't find this timeline item or there was an error loading it from Notion."
        />
      </PageContainer>
    )
  }
}

// Skip static generation due to Notion API
export async function generateStaticParams() {
  return []
}

// Generate metadata for each timeline item
export async function generateMetadata({ params }: TimelineDetailPageProps) {
  try {
    const timelineItems = await getTimelineItems()
    const item = timelineItems.find(item => item.id === params.id)

    if (!item) {
      return {
        title: 'Timeline Item Not Found - Max Hoang',
        description: 'The requested timeline item could not be found.',
        robots: 'noindex, nofollow',
      }
    }

    const baseUrl = 'https://www.maxhoang.com.au'
    const itemUrl = `${baseUrl}/timeline/${item.id}`

    const metaTags = generateMetaTags({
      title: `${item.title} - Max Hoang Timeline`,
      description: item.description || `Timeline item: ${item.title}`,
      url: itemUrl,
      image: item.coverImage,
      type: 'article',
      publishedTime: item.date,
      modifiedTime: item.date,
      tags: item.tags,
      author: 'Max Hoang',
      section: 'Timeline'
    })

    return {
      ...metaTags,
      canonical: itemUrl,
    }
  } catch (error) {
    return {
      title: 'Timeline Item - Max Hoang',
      description: 'Timeline item by Max Hoang',
      robots: 'noindex, nofollow',
    }
  }
}
