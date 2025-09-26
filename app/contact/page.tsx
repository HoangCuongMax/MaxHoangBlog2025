import { getPageByKeyWithMetadata } from '../../lib/notion-api'
import NotionPage from '../../components/notion-page'
import PageContainer from '../../components/page-container'
import ErrorFallback from '../../components/error-fallback'
import NotionLinkInterceptor from '../../components/notion-link-interceptor'
import PageCoverHeader from '../../components/page-cover-header'
import ContactForm from './contact-form'
import { Metadata } from 'next'

export default async function Contact() {
  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('contact')

    return (
      <>
        <PageCoverHeader metadata={metadata} />

        <PageContainer noBoxStyling={true}>
          <NotionPage recordMap={recordMap} />
          <NotionLinkInterceptor />
          
          {/* Tally Form Section */}
          <div className="mt-16 mb-8">
            <ContactForm />
          </div>
        </PageContainer>
      </>
    )
  } catch (error) {
    console.error('Error loading contact page:', error)
    return (
      <PageContainer noBoxStyling={true}>
        <ErrorFallback title="Contact" />
        
        {/* Fallback Tally Form */}
        <div className="mt-16 mb-8">
          <ContactForm />
        </div>
      </PageContainer>
    )
  }
}

// Generate dynamic metadata from Notion
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { metadata } = await getPageByKeyWithMetadata('contact')

    return {
      title: metadata?.title || 'Contact - Max Hoang',
      description: 'Get in touch with Max Hoang',
      openGraph: {
        title: metadata?.title || 'Contact - Max Hoang',
        description: 'Get in touch with Max Hoang',
        images: metadata?.cover ? [metadata.cover] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Contact - Max Hoang',
      description: 'Get in touch with Max Hoang',
    }
  }
}
