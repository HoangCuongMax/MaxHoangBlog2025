'use client'

import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="relative w-full pt-16 md:pt-0 md:min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center relative">
        {/* Left - Content */}
        <div className="px-4 sm:px-6 lg:px-12 py-12 md:py-0 z-20 relative">
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

        {/* Right - Photo Collage (Masonry) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 overflow-hidden">
          <div className="relative w-full h-full">
            {/* Photo 1 - Main speaking photo (top left, largest) */}
            <div className="absolute top-0 left-0 w-80 h-96 md:w-96 md:h-[28rem] overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20 z-30">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Ffc6ddaf3050c46418cb5202daca39019?format=webp&width=600"
                alt="Max Speaking"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 2 - Professional headshot (top right, offset) */}
            <div className="absolute top-16 right-0 w-64 h-80 md:w-72 md:h-96 overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20 z-20 hover:z-40 transition-all hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                alt="Professional Headshot"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 3 - Action photo (middle, overlapping) */}
            <div className="absolute top-64 right-20 w-56 h-72 md:w-64 md:h-80 overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20 z-25 hover:z-40 transition-all hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80"
                alt="Working on Project"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 4 - Collaboration photo (bottom left) */}
            <div className="absolute bottom-20 left-10 w-52 h-64 md:w-60 md:h-72 overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20 z-15 hover:z-40 transition-all hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80"
                alt="Team Collaboration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 5 - Presentation (bottom right) */}
            <div className="absolute bottom-0 right-32 w-56 h-72 md:w-64 md:h-80 overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20 z-10 hover:z-40 transition-all hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80"
                alt="Presentation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
