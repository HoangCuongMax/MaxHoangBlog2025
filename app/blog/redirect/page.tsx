import { redirectToSeoUrl } from '../../../lib/blog-actions'
import { redirect } from 'next/navigation'

interface BlogRedirectProps {
  searchParams: {
    id?: string
  }
}

export default async function BlogRedirect({ searchParams }: BlogRedirectProps) {
  const uuid = searchParams.id

  if (!uuid) {
    redirect('/blog')
  }

  // This will handle the redirect server-side
  await redirectToSeoUrl(uuid)

  // This return should never be reached due to redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to the latest URL...</p>
      </div>
    </div>
  )
}
