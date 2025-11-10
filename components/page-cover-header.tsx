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
    <div className="relative w-full h-64 sm:h-96 md:h-[28rem] mb-4 sm:mb-6 md:mb-8 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 mt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${metadata.cover})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          👋 Hi, I'm Max Hoang
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-gray-100">
          AI Enthusiast • Web Developer • Storyteller
        </p>

        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
          Building smarter tools that connect people, ideas, and technology.
        </p>

        <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-300">
          🏆 Winner of NT Digital Excellence Awards 2025, RIMPA Global Hackathon 2025, and CDU IT Code Fair 2025.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-block px-10 py-4 bg-[rgb(216,0,92)] hover:bg-[rgb(196,0,72)] font-bold text-white text-lg transition-all transform hover:scale-105"
          >
            View My Work
          </Link>
          <a
            href="https://www.maxhoang.com.au/blog"
            className="inline-block px-10 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white font-bold text-white text-lg hover:bg-opacity-30 transition-all"
          >
            Watch My Talks
          </a>
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white font-bold text-white text-lg hover:bg-opacity-30 transition-all"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
