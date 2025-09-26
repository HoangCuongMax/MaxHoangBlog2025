'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function ContactForm() {
  useEffect(() => {
    // Load Tally embeds after component mounts
    const loadTallyEmbeds = () => {
      if (typeof window !== 'undefined' && (window as any).Tally) {
        (window as any).Tally.loadEmbeds()
      } else {
        // Fallback for manual iframe src loading
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((iframe: any) => {
          iframe.src = iframe.dataset.tallySrc
        })
      }
    }

    // Small delay to ensure script is loaded
    const timer = setTimeout(loadTallyEmbeds, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Load Tally script */}
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).Tally) {
            (window as any).Tally.loadEmbeds()
          }
        }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Send Me a Message
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use the form below to get in touch directly. I'll respond as soon as possible.
          </p>
        </div>

        {/* Tally Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <iframe
            data-tally-src="https://tally.so/embed/w2WKke?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Contact form"
            className="w-full min-h-[400px]"
            style={{height: 'auto'}}
          />
        </div>
      </div>
    </>
  )
}
