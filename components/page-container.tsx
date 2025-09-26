import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
  fullscreen?: boolean
  noBoxStyling?: boolean
}

export default function PageContainer({ children, className = '', fullscreen = false, noBoxStyling = false }: PageContainerProps) {
  if (fullscreen) {
    // Fullscreen layout for blog
    return (
      <div className={`min-h-screen page-container ${className}`}>
        <div className="w-full px-3 pt-2 pb-3 sm:px-4 sm:pt-4 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-6 xl:px-8 xl:pt-8 xl:pb-8">
          {children}
        </div>
      </div>
    )
  }

  if (noBoxStyling) {
    // Transparent background pages without box styling
    return (
      <div className={`min-h-screen page-container ${className}`}>
        <div className="max-w-6xl mx-auto px-4 pt-2 pb-3 sm:px-6 sm:pt-4 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-6 md:text-[1.2em]">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen page-container ${className}`}>
      {/* Mobile: no background, minimal padding */}
      <div className="max-w-6xl mx-auto px-3 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 lg:px-8 lg:pt-12 lg:pb-12 md:text-[1.2em]">
        <div className="bg-transparent rounded-none md:rounded-2xl shadow-none md:shadow-lg border-none md:border md:border-gray-200/50 p-3 sm:p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
