import { getPageByKeyWithMetadata } from '../../lib/notion-api'
import NotionPage from '../../components/notion-page'
import ErrorFallback from '../../components/error-fallback'
import NotionLinkInterceptor from '../../components/notion-link-interceptor'
import { Metadata } from 'next'

export default async function Projects() {
  const images = [
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F6cd5e091233448d3ab5388c2d048a726?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fd47f99eee28b40cea5e616fc0deb4fc2?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F4cbaa28b66ba4de5a5bbc6e5200024fa?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F02d010dfdc1a45feace9f9dea6588ae7?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F043efaae18c844c4807d24cbc5918080?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fb9c8719931b244fca8e8945056cabcf0?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Ffbb6c9b75c434277a255692cf13c866b?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fc7ef0918c2c14197a631b96be941550f?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fac635501401445e0a55d7578a5757e56?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fb46f58f3884c401c996d4d0fec397a00?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F4a7186eb92b349b0ad9468d44b21d719?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F99107ffeb7ba4d60867cfebdcdfec8fc?format=webp&width=800',
  ]

  try {
    const { recordMap, metadata } = await getPageByKeyWithMetadata('projects')

    return (
      <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        {/* Scrolling Photo Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="scroll-flow-container w-full h-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full" style={{ gridAutoRows: 'minmax(200px, 1fr)' }}>
              {images.map((img, i) => (
                <div key={`first-${i}`} className="overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full" style={{ gridAutoRows: 'minmax(200px, 1fr)' }}>
              {images.map((img, i) => (
                <div key={`second-${i}`} className="overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Content Box */}
        <div className="relative w-full max-w-4xl z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 text-center drop-shadow-lg">
            My 100 Checklists
          </h1>
          <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 lg:p-12">
            <div suppressHydrationWarning>
              <NotionPage recordMap={recordMap} />
            </div>
            <NotionLinkInterceptor />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading projects page:', error)
    return (
      <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        {/* Scrolling Photo Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="scroll-flow-container w-full h-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full" style={{ gridAutoRows: 'minmax(200px, 1fr)' }}>
              {images.map((img, i) => (
                <div key={`first-${i}`} className="overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full" style={{ gridAutoRows: 'minmax(200px, 1fr)' }}>
              {images.map((img, i) => (
                <div key={`second-${i}`} className="overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Content Box */}
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 sm:p-10 z-10">
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
