import { getPageByKeyWithMetadata } from '../lib/notion-api'
import dynamic from 'next/dynamic'
const NotionPage = dynamic(() => import('../components/notion-page'), { ssr: false })
import PageContainer from '../components/page-container'
import ErrorFallback from '../components/error-fallback'
const NotionLinkInterceptor = dynamic(() => import('../components/notion-link-interceptor'), { ssr: false })
import PageCoverHeader from '../components/page-cover-header'
import ProfileLinktree from '../components/profile-linktree'
import AmbassadorProgramSection from '../components/ambassador-program-section'
import { Metadata } from 'next'

export default async function Home() {
  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('home')

    return (
      <>
        <PageCoverHeader metadata={metadata} />
        <div className="mt-4 sm:mt-6 md:mt-8">
          <ProfileLinktree />
        </div>
        <PageContainer noBoxStyling={true}>
          <div suppressHydrationWarning>
            <NotionPage recordMap={recordMap} />
          </div>
          <NotionLinkInterceptor />
        </PageContainer>
      </>
    )
  } catch (error) {
    console.error('Error loading home page:', error)
    return (
      <PageContainer noBoxStyling={true}>
        <ErrorFallback title="Welcome to Max Hoang's Website" />
      </PageContainer>
    )
  }
}

// Generate dynamic metadata from Notion
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { metadata } = await getPageByKeyWithMetadata('home')

    return {
      title: metadata?.title || 'Max Hoang - Personal Website',
      description: 'Welcome to Max Hoang\'s personal website',
      openGraph: {
        title: metadata?.title || 'Max Hoang - Personal Website',
        description: 'Welcome to Max Hoang\'s personal website',
        images: metadata?.cover ? [metadata.cover] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Max Hoang - Personal Website',
      description: 'Welcome to Max Hoang\'s personal website',
    }
  }
}
