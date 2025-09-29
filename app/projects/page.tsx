import { getPageByKeyWithMetadata } from '../../lib/notion-api'
import NotionPage from '../../components/notion-page'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import NotionLinkInterceptor from '../../components/notion-link-interceptor'
import PageCoverHeader from '../../components/page-cover-header'
import { Metadata } from 'next'
import { TOCProvider } from '../../components/toc-context'
import FloatingTOC from '../../components/floating-toc'
import ResponsiveContentWrapper from '../../components/responsive-content-wrapper'

export default async function Projects() {
  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('projects')

    return (
      <>
        <PageCoverHeader metadata={metadata} />

        <PageContainer noBoxStyling={true}>
          <TOCProvider>
            <FloatingTOC leftOffsetClass="left-0" topClass="top-0" />
            <div className="transition-all duration-300 ease-in-out">
              <ResponsiveContentWrapper>
                <NotionPage recordMap={recordMap} />
                <NotionLinkInterceptor />
              </ResponsiveContentWrapper>
            </div>
          </TOCProvider>
        </PageContainer>
      </>
    )
  } catch (error) {
    console.error('Error loading projects page:', error)
    return (
      <PageContainer noBoxStyling={true}>
        <ErrorFallback title="Projects" />
      </PageContainer>
    )
  }
}

// Generate dynamic metadata from Notion
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { metadata } = await getPageByKeyWithMetadata('projects')

    return {
      title: metadata?.title || 'Projects - Max Hoang',
      description: 'Explore Max Hoang\'s projects and portfolio',
      openGraph: {
        title: metadata?.title || 'Projects - Max Hoang',
        description: 'Explore Max Hoang\'s projects and portfolio',
        images: metadata?.cover ? [metadata.cover] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Projects - Max Hoang',
      description: 'Explore Max Hoang\'s projects and portfolio',
    }
  }
}
