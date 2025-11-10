import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
  fullscreen?: boolean
  noBoxStyling?: boolean
}

export default function PageContainer({ children, className = '', fullscreen = false, noBoxStyling = false }: PageContainerProps) {
  if (fullscreen) {
    // Fullscreen layout for blog - with new design system
    return (
      <div className={`min-h-screen page-container pt-20 bg-gradient-to-b from-gray-900 to-gray-800 ${className}`}>
        <div className="w-full px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-6 xl:px-8 xl:pt-16 xl:pb-8">
          {children}
        </div>
      </div>
    )
  }

  if (noBoxStyling) {
    // Transparent background pages without box styling - with new design system
    return (
      <div className={`min-h-screen page-container pt-20 bg-gradient-to-b from-gray-900 to-gray-800 ${className}`}>
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-6 md:text-[1.2em] text-white">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen page-container pt-20 bg-gradient-to-b from-gray-900 to-gray-800 ${className}`}>
      {/* Mobile: dark background with modern styling */}
      <div className="max-w-6xl mx-auto px-3 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-12 md:text-[1.2em]">
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-white border-opacity-10 p-6 sm:p-8 lg:p-10 text-white">
          {children}
        </div>
      </div>
    </div>
  )
}
