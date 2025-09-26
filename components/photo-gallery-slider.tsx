'use client'

import { useState, useEffect } from 'react'

interface PhotoGallerySliderProps {
  images: Array<{url: string, caption?: string}>
  title?: string
  isFullScreen?: boolean
}

export default function PhotoGallerySlider({ images, title, isFullScreen = false }: PhotoGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullScreenMode, setIsFullScreenMode] = useState(false)

  useEffect(() => {
    if (images.length > 0) {
      setIsLoaded(true)
    }
  }, [images])

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreenMode(!!document.fullscreenElement)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreenMode) {
        setIsFullScreenMode(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullScreenMode])

  // Lock body scroll when in fullscreen mode
  useEffect(() => {
    if (isFullScreenMode) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFullScreenMode])

  const toggleFullScreen = async () => {
    // Check if Fullscreen API is available and allowed
    const isFullscreenSupported =
      'requestFullscreen' in document.documentElement &&
      document.fullscreenEnabled !== false

    if (!isFullscreenSupported) {
      // Use fallback fullscreen mode
      setIsFullScreenMode(!isFullScreenMode)
      return
    }

    const galleryElement = document.getElementById('photo-gallery-container')
    if (!galleryElement) return

    try {
      if (!document.fullscreenElement) {
        await galleryElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen API not available, using fallback mode:', error)
      // Fallback to our own fullscreen implementation
      setIsFullScreenMode(!isFullScreenMode)
    }
  }

  if (!images || images.length === 0) return null

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={`w-full ${isFullScreen ? 'mb-8' : 'mb-8'}`}>
      <div
        id="photo-gallery-container"
        className={`${
          isFullScreenMode
            ? 'fixed inset-0 z-[9999] bg-black w-screen h-screen overflow-hidden'
            : 'relative overflow-hidden shadow-2xl'
        } ${
          !isFullScreenMode && isFullScreen
            ? 'bg-black/5 backdrop-blur-sm rounded-none'
            : !isFullScreenMode
              ? 'bg-black/5 backdrop-blur-sm rounded-xl'
              : ''
        }`}
      >
        {/* Main Image Display */}
        <div className={`relative ${
          isFullScreenMode
            ? 'w-screen h-screen bg-black flex items-center justify-center overflow-hidden'
            : 'overflow-hidden'
        } ${
          !isFullScreenMode && isFullScreen
            ? 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
            : !isFullScreenMode
              ? 'aspect-video md:aspect-[16/10] lg:aspect-[2/1]'
              : ''
        }`}>
          {isLoaded && (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentIndex].url}
                alt={`${title || 'Timeline photo'} ${currentIndex + 1}`}
                className={`transition-opacity duration-300 ${
                  isFullScreenMode
                    ? 'max-w-[100vw] max-h-[100vh] object-contain'
                    : 'w-full h-full object-contain'
                }`}
              />

              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-3">
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullScreen}
                  className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20 group"
                  aria-label={isFullScreenMode ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullScreenMode ? (
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>

                {/* Image Counter */}
                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              {/* Caption */}
              {images[currentIndex].caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-md text-white px-6 py-3 rounded-xl border border-white/10">
                  <p className="text-sm leading-relaxed font-medium">{images[currentIndex].caption}</p>
                </div>
              )}

              {/* Directional Indicators - Only show if more than 1 image */}
              {images.length > 1 && (
                <>
                  {/* Left indicator */}
                  {currentIndex > 0 && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-white p-2 rounded-full animate-pulse border border-white/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  )}

                  {/* Right indicator */}
                  {currentIndex < images.length - 1 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-white p-2 rounded-full animate-pulse border border-white/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Navigation Arrows - Only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/95 backdrop-blur-md text-gray-800 p-4 rounded-full transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6 transition-all duration-300 group-hover:-translate-x-1 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/95 backdrop-blur-md text-gray-800 p-4 rounded-full transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation - Only show if more than 1 image and not in fullscreen */}
        {images.length > 1 && !isFullScreenMode && (
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-white/30">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Info */}
      {images.length > 1 && !isFullScreenMode && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            {images.length} photos • Click thumbnails or use arrows to navigate
          </p>
        </div>
      )}
    </div>
  )
}
