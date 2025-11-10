'use client'

import Link from 'next/link'

export default function HomeHero() {
  const images = [
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fd47f99eee28b40cea5e616fc0deb4fc2?format=webp&width=800',
      alt: 'Max Speaking at Event',
      position: 'absolute top-0 left-0 w-72 h-80 md:w-80 md:h-96 z-30',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F4cbaa28b66ba4de5a5bbc6e5200024fa?format=webp&width=800',
      alt: 'Max at Conference',
      position: 'absolute top-20 right-0 w-64 h-72 md:w-72 md:h-80 z-20 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F02d010dfdc1a45feace9f9dea6588ae7?format=webp&width=800',
      alt: 'Max with VR Headset',
      position: 'absolute top-32 left-48 w-60 h-72 md:w-64 md:h-80 z-25 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F043efaae18c844c4807d24cbc5918080?format=webp&width=800',
      alt: 'Max at Code Fair',
      position: 'absolute top-48 right-40 w-56 h-64 md:w-60 md:h-72 z-15 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fb9c8719931b244fca8e8945056cabcf0?format=webp&width=800',
      alt: 'Max at Event',
      position: 'absolute top-64 left-20 w-64 h-72 md:w-72 md:h-80 z-22 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Ffbb6c9b75c434277a255692cf13c866b?format=webp&width=800',
      alt: 'Max Professional Photo',
      position: 'absolute bottom-20 right-16 w-60 h-72 md:w-64 md:h-80 z-18 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fc7ef0918c2c14197a631b96be941550f?format=webp&width=800',
      alt: 'Max Portrait',
      position: 'absolute bottom-32 left-56 w-56 h-68 md:w-60 md:h-72 z-12 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fac635501401445e0a55d7578a5757e56?format=webp&width=800',
      alt: 'Max on Stage',
      position: 'absolute bottom-0 right-96 w-52 h-64 md:w-56 md:h-64 z-16 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2Fb46f58f3884c401c996d4d0fec397a00?format=webp&width=800',
      alt: 'Max at Award Ceremony',
      position: 'absolute bottom-10 left-10 w-60 h-72 md:w-64 md:h-80 z-24 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F4a7186eb92b349b0ad9468d44b21d719?format=webp&width=800',
      alt: 'Max Professional Headshot',
      position: 'absolute top-80 right-48 w-56 h-64 md:w-60 md:h-72 z-14 hover:z-40 transition-all hover:scale-105',
    },
    {
      url: 'https://cdn.builder.io/api/v1/image/assets%2Fb646c680cb1245e8b61dacef2f73503f%2F99107ffeb7ba4d60867cfebdcdfec8fc?format=webp&width=800',
      alt: 'Max Speaking',
      position: 'absolute top-96 left-80 w-52 h-64 md:w-56 md:h-72 z-11 hover:z-40 transition-all hover:scale-105',
    },
  ]

  return (
    <section className="relative w-full pt-16 md:pt-0 md:min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center relative">
        {/* Left - Content (1/3) */}
        <div className="px-4 sm:px-6 lg:px-12 py-12 md:py-0 z-20 relative md:col-span-1">
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

        {/* Right - Photo Collage (Masonry) (2/3) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 overflow-hidden md:col-span-2">
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <div
                key={index}
                className={`${image.position} overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-20`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
