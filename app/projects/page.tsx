import { getPageByKeyWithMetadata } from '../../lib/notion-api'
import NotionPage from '../../components/notion-page'
import ErrorFallback from '../../components/error-fallback'
import NotionLinkInterceptor from '../../components/notion-link-interceptor'
import { Metadata } from 'next'

export default async function Projects() {
  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('projects')

    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 sm:p-10 lg:p-12">
          <div suppressHydrationWarning>
            <NotionPage recordMap={recordMap} />
          </div>
          <NotionLinkInterceptor />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading projects page:', error)
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          <ErrorFallback title="100 Checklist" />
        </div>
      </div>
    )
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { metadata } = await getPageByKeyWithMetadata('projects')

    return {
      title: metadata?.title || '100 Checklist - Max Hoang',
      description: 'Max Hoang\'s 100 checklist',
      openGraph: {
        title: metadata?.title || '100 Checklist - Max Hoang',
        description: 'Max Hoang\'s 100 checklist',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: '100 Checklist - Max Hoang',
      description: 'Max Hoang\'s 100 checklist',
    }
  }
}
