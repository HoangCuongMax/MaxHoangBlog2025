'use client'

interface ErrorFallbackProps {
  title: string
  message?: string
}

export default function ErrorFallback({ 
  title, 
  message = "Sorry, we're having trouble loading the content from Notion." 
}: ErrorFallbackProps) {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
        {message}
      </p>
      <p className="text-sm text-gray-500">
        Please check the Notion page permissions and try again.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
