'use client'

import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="relative w-full pt-16 md:pt-0 md:min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left - Content */}
        <div className="px-4 sm:px-6 lg:px-12 py-12 md:py-0 z-10">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Hi, I'm <span className="text-[rgb(216,0,92)]">Max Hoang</span>.
            </h1>

            <p className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
              AI Enthusiast • Web Developer • Storyteller
            </p>

            <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-300">
              I build AI, web, and app solutions that connect people, ideas, and technology — from computer vision and translation tools to AI-powered websites and chatbots.
            </p>

            {/* Achievement Badges */}
            <div className="space-y-3 mb-10">
              <div className="flex items-start gap-3 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <span className="text-2xl flex-shrink-0">🏆</span>
                <div>
                  <p className="font-semibold text-white">NT Digital Excellence Awards 2025</p>
                  <p className="text-sm text-gray-300">Winner</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <span className="text-2xl flex-shrink-0">💰</span>
                <div>
                  <p className="font-semibold text-white">RIMPA Global Hackathon 2025</p>
                  <p className="text-sm text-gray-300">$10k Prize Winner</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <span className="text-2xl flex-shrink-0">🏅</span>
                <div>
                  <p className="font-semibold text-white">CDU IT Code Fair 2025</p>
                  <p className="text-sm text-gray-300">Won 5 of 6 Challenges</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-block px-10 py-4 bg-[rgb(216,0,92)] text-white font-bold hover:bg-[rgb(196,0,72)] transition-all transform hover:scale-105 text-center text-xl"
              >
                View My Projects
              </Link>
              <a
                href="https://www.youtube.com/@maxhoang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white font-bold hover:bg-opacity-30 transition-all text-center text-xl"
              >
                Watch My Talks
              </a>
            </div>
          </div>
        </div>

        {/* Right - Hero Image */}
        <div className="relative h-96 md:h-screen md:min-h-screen overflow-hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Ffc6ddaf3050c46418cb5202daca39019?format=webp&width=800"
            alt="Max Hoang Speaking"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
