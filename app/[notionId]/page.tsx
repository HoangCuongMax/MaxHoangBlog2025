import { getNotionPage, getBlogPosts } from '../../lib/notion-api'
import dynamicImport from 'next/dynamic'
const NotionPage = dynamicImport(() => import('../../components/notion-page'), { ssr: false })
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface NotionPageProps {
  params: {
    notionId: string
  }
  searchParams: {
    from?: string
  }
}

// Helper function to validate Notion page ID format
function isValidNotionId(id: string): boolean {
  // Notion page IDs are 32-character hex strings
  const notionIdRegex = /^[a-f0-9]{32}$/i
  return notionIdRegex.test(id.replace(/-/g, ''))
}

// Helper function to determine context from referrer or searchParams
function getPageContext(from?: string): { name: string; path: string } | null {
  if (!from) return null

  const contextMap = {
    '/projects': { name: 'Projects', path: '/projects' },
    '/timeline': { name: 'Timeline', path: '/timeline' },
    '/blog': { name: 'Blog', path: '/blog' },
    '/contact': { name: 'Contact', path: '/contact' }
  }

  for (const [path, context] of Object.entries(contextMap)) {
    if (from.includes(path)) {
      return context
    }
  }

  return null
}

export default async function DynamicNotionPage({ params, searchParams }: NotionPageProps) {
  const { notionId } = params
  const { from } = searchParams

  // Validate Notion ID format
  if (!isValidNotionId(notionId)) {
    notFound()
  }

  try {
    // Fetch the Notion page content
    const recordMap = await getNotionPage(notionId)
    
    if (!recordMap) {
      notFound()
    }

    // Get context information
    const context = getPageContext(from)
    
    // Extract page title from recordMap if available
    const pageTitle = getPageTitle(recordMap, notionId)

    return (
      <PageContainer noBoxStyling={true}>
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            {context && (
              <>
                <li>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link href={context.path} className="hover:text-blue-600 transition-colors">
                    {context.name}
                  </Link>
                </li>
              </>
            )}
            <li>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {pageTitle}
            </li>
          </ol>
        </nav>

        {/* Back Navigation */}
        {context && (
          <div className="mb-6">
            <Link
              href={context.path}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
            >
              <svg
                className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {context.name}
            </Link>
          </div>
        )}

        {/* Notion Page Content */}
        <div className="notion-page-wrapper">
          <NotionPage recordMap={recordMap} />
        </div>


        {/* Footer Navigation */}
        {context && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <Link
                href={context.path}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View All {context.name} Content
              </Link>
            </div>
          </div>
        )}
      </PageContainer>
    )
  } catch (error) {
    console.error(`Error loading Notion page ${notionId}:`, error)
    
    return (
      <PageContainer noBoxStyling={true}>
        {/* Error State with Context */}
        {getPageContext(from) && (
          <div className="mb-6">
            <Link
              href={getPageContext(from)!.path}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
            >
              <svg
                className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {getPageContext(from)!.name}
            </Link>
          </div>
        )}
        
        <ErrorFallback 
          title="Page Not Found" 
          message="Sorry, we couldn't find this page or there was an error loading it from Notion."
        />
      </PageContainer>
    )
  }
}

// Helper function to extract page title from Notion recordMap
function getPageTitle(recordMap: any, fallbackId: string): string {
  try {
    const pageId = Object.keys(recordMap.block)[0]
    const page = recordMap.block[pageId]?.value
    
    if (page?.properties?.title) {
      return page.properties.title.map((t: any) => t[0]).join('')
    }
    
    // Fallback to a clean version of the ID
    return `Page ${fallbackId.slice(0, 8)}...`
  } catch {
    return `Page ${fallbackId.slice(0, 8)}...`
  }
}

// Generate metadata for the page
export async function generateMetadata({ params, searchParams }: NotionPageProps) {
  const { notionId } = params
  const { from } = searchParams

  if (!isValidNotionId(notionId)) {
    return {
      title: 'Page Not Found - Max Hoang',
      description: 'The requested page could not be found.',
      robots: 'noindex, nofollow',
    }
  }

  try {
    const recordMap = await getNotionPage(notionId)
    const pageTitle = getPageTitle(recordMap, notionId)
    const context = getPageContext(from)
    
    const title = context 
      ? `${pageTitle} - ${context.name} - Max Hoang`
      : `${pageTitle} - Max Hoang`

    return {
      title,
      description: `${pageTitle} from Max Hoang's personal website`,
      openGraph: {
        title,
        description: `${pageTitle} from Max Hoang's personal website`,
        url: `https://www.maxhoang.com.au/${notionId}`,
        type: 'article',
      },
      twitter: {
        card: 'summary',
        title,
        description: `${pageTitle} from Max Hoang's personal website`,
      },
    }
  } catch (error) {
    return {
      title: 'Page - Max Hoang',
      description: 'Content from Max Hoang\'s personal website',
      robots: 'noindex, nofollow',
    }
  }
}

// Force dynamic rendering for these pages
export const dynamic = 'force-dynamic'
