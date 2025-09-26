'use client'

interface YouTubeEmbedProps {
  videoId: string
  title: string
  className?: string
  aspectRatio?: 'video' | '4/3' | 'square'
}

export default function YouTubeEmbed({ 
  videoId, 
  title, 
  className = '',
  aspectRatio = 'video'
}: YouTubeEmbedProps) {
  const aspectRatioClass = {
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    square: 'aspect-square'
  }[aspectRatio]

  return (
    <div className={`relative overflow-hidden rounded-lg ${aspectRatioClass} ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  )
}
