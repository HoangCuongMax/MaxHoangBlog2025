'use client'

import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hi, I'm <span className="text-[rgb(216,0,92)]">Max Hoang</span>.
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              AI enthusiast, web developer, and storyteller based in Darwin, Northern Territory.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              I build AI, web, and app solutions that connect people, ideas, and technology — from computer vision and translation tools to AI-powered websites and chatbots.
            </p>

            {/* Achievement Badges */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold text-gray-900">NT Digital Excellence Awards 2025</p>
                  <p className="text-sm text-gray-600">Winner</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">RIMPA Global Hackathon 2025</p>
                  <p className="text-sm text-gray-600">$10k Prize Winner</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl">🏅</span>
                <div>
                  <p className="font-semibold text-gray-900">CDU IT Code Fair 2025</p>
                  <p className="text-sm text-gray-600">Won 5 of 6 Challenges</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-block px-8 py-3 bg-[rgb(51,51,116)] text-white font-semibold hover:bg-[rgb(41,41,96)] transition-colors text-center"
              >
                View My Projects
              </Link>
              <a
                href="https://www.youtube.com/channel/UCx_your_channel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border-2 border-[rgb(51,51,116)] text-[rgb(51,51,116)] font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Watch My Talks
              </a>
            </div>
          </div>

          {/* Right - Profile Image */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-400 to-pink-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=600"
                alt="Max Hoang"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
