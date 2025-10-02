import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume (Removed)',
  description: 'Resume page has been removed.'
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Resume</h1>
        <p className="text-gray-600">This resume page has been removed.</p>
      </div>
    </div>
  )
}
