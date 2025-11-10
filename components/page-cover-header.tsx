import { PageMetadata } from '../lib/notion-api'
import Link from 'next/link'

interface PageCoverHeaderProps {
  metadata: PageMetadata | null
}

export default function PageCoverHeader({ metadata }: PageCoverHeaderProps) {
  if (!metadata?.cover) {
    return null
  }

  return (
    <div className="relative w-full h-64 sm:h-96 md:h-[28rem] mb-4 sm:mb-6 md:mb-8 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${metadata.cover})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          👋 Hi, I'm Max Hoang
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          AI Enthusiast • Web Developer • Storyteller
        </p>

        <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Building smarter tools that connect people, ideas, and technology.
        </p>

        <p className="text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
          🏆 Winner of NT Digital Excellence Awards 2025, RIMPA Global Hackathon 2025, and CDU IT Code Fair 2025.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-block rounded bg-[rgb(216,0,92)] hover:bg-[rgb(196,0,72)] px-6 sm:px-8 py-2 sm:py-3 font-bold text-white transition-colors duration-300"
          >
            View My Work
          </Link>
          <a
            href="https://www.maxhoang.com.au/blog"
            className="inline-block rounded border-2 border-white hover:bg-white hover:text-[rgb(51,51,116)] px-6 sm:px-8 py-2 sm:py-3 font-bold text-white transition-colors duration-300"
          >
            Watch My Talks
          </a>
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border-2 border-white hover:bg-white hover:text-[rgb(51,51,116)] px-6 sm:px-8 py-2 sm:py-3 font-bold text-white transition-colors duration-300"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
