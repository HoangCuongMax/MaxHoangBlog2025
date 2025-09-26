import { TimelineItem } from '../lib/notion-api'
import dynamic from 'next/dynamic'
const NotionPage = dynamic(() => import('./notion-page'), { ssr: false })
import Link from 'next/link'
import TimelineCardSlider from './timeline-card-slider'

interface TimelineCardServerProps {
  item: TimelineItem & { recordMap?: any }
  index: number
}

export default function TimelineCardServer({ item, index }: TimelineCardServerProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Extract images from Notion content for timeline card slider
  const extractImagesFromRecordMap = (recordMap: any): string[] => {
    if (!recordMap?.block) return []

    const images: string[] = []
    const blocks = Object.values(recordMap.block)

    blocks.forEach((block: any) => {
      const blockData = block?.value

      // Handle different image block types
      if (blockData?.type === 'image') {
        let imageUrl = ''

        // Check all possible image URL locations
        if (blockData?.format?.display_source) {
          imageUrl = blockData.format.display_source
        }
        else if (blockData?.properties?.source?.[0]?.[0]) {
          imageUrl = blockData.properties.source[0][0]
        }
        else if (blockData?.properties?.url?.[0]?.[0]) {
          imageUrl = blockData.properties.url[0][0]
        }
        else if (blockData?.display_source) {
          imageUrl = blockData.display_source
        }

        // Convert Notion attachment URLs to proper CDN URLs
        if (imageUrl) {
          if (imageUrl.startsWith('attachment:')) {
            const attachmentMatch = imageUrl.match(/attachment:([a-f0-9-]+):(.+)/)
            if (attachmentMatch) {
              const [, fileId, filename] = attachmentMatch
              imageUrl = `https://www.notion.so/image/${encodeURIComponent(`https://s3-us-west-2.amazonaws.com/secure.notion-static.com/${fileId}/${filename}`)}?table=block&id=${blockData.id}&cache=v2`
            }
          }

          if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
            images.push(imageUrl)
          }
        }
      }
    })

    return images
  }

  const extractedImages = extractImagesFromRecordMap(item.recordMap)
  const hasMultipleImages = extractedImages.length > 1

  // Check if the recordMap has actual meaningful content
  const hasActualContent = () => {
    if (!item.recordMap) return false

    const blocks = item.recordMap.block || {}
    const blockValues = Object.values(blocks)

    // Look for blocks with actual content (more permissive)
    for (const block of blockValues) {
      const blockData = (block as any)?.value

      // Check for text blocks with content
      if (blockData?.type === 'text' && blockData?.properties?.title) {
        const textContent = blockData.properties.title
          .map((item: any) => item[0])
          .join('')
          .trim()
        if (textContent && textContent.length > 10) { // At least 10 characters
          return true
        }
      }

      // Check for other meaningful content types
      if (blockData?.type && ['bulleted_list', 'numbered_list', 'header', 'sub_header', 'sub_sub_header', 'quote', 'code', 'image', 'video', 'divider'].includes(blockData.type)) {
        return true
      }

      // Check for any block with properties (likely has content)
      if (blockData?.type && blockData?.type !== 'page' && blockData?.properties && Object.keys(blockData.properties).length > 0) {
        return true
      }
    }

    return false
  }

  return (
    <div className="timeline-card">
      {/* Content Card */}
      <div className={`rounded-none shadow-none border-none overflow-hidden transition-none relative ${
        item.isFeatured
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50'
          : 'bg-white'
      }`}>
        {/* Featured Badge - Top of Card */}
        {item.isFeatured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              ⭐ Featured
            </span>
          </div>
        )}
        {/* Cover Image or Image Slider */}
        {hasMultipleImages ? (
          <div className="relative">
            <TimelineCardSlider
              images={extractedImages}
              title={item.title}
              maxImages={5}
            />
            {/* Date Overlay - Bottom of Slider */}
            {item.date && (
              <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4">
                <div className="bg-white/90 backdrop-blur-sm px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg">
                  <time className="text-xs lg:text-sm font-bold text-gray-900">
                    {formatDate(item.date)}
                  </time>
                </div>
              </div>
            )}
          </div>
        ) : item.coverImage && item.coverImage.startsWith('http') ? (
          <div className="aspect-video w-full overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Date Overlay - Bottom of Cover Photo */}
            {item.date && (
              <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4">
                <div className="bg-white/90 backdrop-blur-sm px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg">
                  <time className="text-xs lg:text-sm font-bold text-gray-900">
                    {formatDate(item.date)}
                  </time>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Header */}
        <div className="p-4 lg:p-4">
          <div className="mb-3">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 leading-tight">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                {item.description}
              </p>
            )}
            {/* Date for items without cover image */}
            {item.date && !item.coverImage && (
              <time className="inline-block text-sm lg:text-base text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-full mt-3">
                {formatDate(item.date)}
              </time>
            )}
          </div>
          
          {/* Category and Tags */}
          {(item.category || (item.tags && item.tags.length > 0)) && (
            <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
              {item.category && (
                <span className="inline-block px-3 py-1.5 text-xs lg:text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                  {item.category}
                </span>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-block px-2.5 py-1 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="inline-block px-2.5 py-1 text-xs lg:text-sm bg-gray-200 text-gray-500 rounded-full">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Read More Button - Show for posts with content OR multiple images */}
        {(item.recordMap && hasActualContent()) || hasMultipleImages ? (
          <div className="p-4 lg:p-4">
            <Link
              href={`/timeline/${item.id}`}
              className="inline-flex items-center px-4 py-2.5 lg:py-2 text-sm lg:text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group w-full justify-center lg:w-auto lg:justify-start"
            >
              <span>{hasMultipleImages ? 'View Photo Gallery' : 'Read Full Post'}</span>
              <svg
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : null}

        {/* No additional description section - description is already shown in header */}
      </div>
    </div>
  )
}
