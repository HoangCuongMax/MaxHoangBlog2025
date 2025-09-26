'use client'

import { useState, useEffect } from 'react'

interface TimelineCardSliderProps {
  images: string[]
  title: string
  maxImages?: number
}

export default function TimelineCardSlider({ images, title, maxImages = 5 }: TimelineCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Limit images to show
  const displayImages = images.slice(0, maxImages)
  
  useEffect(() => {
    if (displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length)
      }, 3000) // Auto-advance every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [displayImages.length])

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="aspect-video w-full overflow-hidden relative group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Navigation Dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows - Only visible on hover */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => goToImage((currentIndex - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => goToImage((currentIndex + 1) % displayImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Multiple Images Indicator */}
        {displayImages.length > maxImages && (
          <div className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            +{images.length - maxImages} more
          </div>
        )}
      </div>
    </div>
  )
}
