import { PageMetadata } from '../lib/notion-api'

interface PageCoverHeaderProps {
  metadata: PageMetadata | null
}

export default function PageCoverHeader({ metadata }: PageCoverHeaderProps) {
  if (!metadata?.cover) {
    return null
  }

  return (
    <div className="relative w-full h-64 sm:h-96 md:h-[28rem] mb-4 sm:mb-6 md:mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${metadata.cover})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 text-white">
            {metadata.icon && (
              <div className="text-3xl sm:text-4xl md:text-5xl">
                {metadata.icon.startsWith('http') ? (
                  <img
                    src={metadata.icon}
                    alt="Page icon"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg"
                  />
                ) : (
                  <span>{metadata.icon}</span>
                )}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              {metadata.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
