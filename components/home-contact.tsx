'use client'

import { useState } from 'react'

export default function HomeContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Let's Collaborate</h2>
          <p className="text-2xl text-gray-300 font-semibold leading-relaxed">
            Curious about AI, web development, or creative digital projects? I'm open to collaborations, speaking, and project opportunities in AI, data, and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-bold mb-3">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white bg-opacity-10 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)] text-base"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-3">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white bg-opacity-10 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)] text-base"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-3">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-6 py-4 bg-white bg-opacity-10 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)] text-base"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-[rgb(216,0,92)] text-white font-bold hover:bg-[rgb(196,0,72)] transition-colors text-lg rounded-lg"
            >
              {submitted ? '✓ Message Sent!' : 'Send Message'}
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-8">Quick Contact Options</h3>
              
              <div className="space-y-5">
                <a
                  href="mailto:hoangngoccuong1414@gmail.com"
                  className="block p-6 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors border border-white border-opacity-20"
                >
                  <p className="text-sm opacity-80 font-semibold">Email</p>
                  <p className="font-bold text-lg mt-2">hoangngoccuong1414@gmail.com</p>
                </a>

                <a
                  href="https://www.linkedin.com/in/hoangngoccuong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors border border-white border-opacity-20"
                >
                  <p className="text-sm opacity-80 font-semibold">LinkedIn</p>
                  <p className="font-bold text-lg mt-2">Connect on LinkedIn</p>
                </a>

                <a
                  href="https://wa.me/61405272278"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors border border-white border-opacity-20"
                >
                  <p className="text-sm opacity-80 font-semibold">WhatsApp</p>
                  <p className="font-bold text-lg mt-2">Chat on WhatsApp</p>
                </a>
              </div>
            </div>

            <div className="p-6 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
              <p className="text-base opacity-90 leading-relaxed">
                Response time: Usually within 24-48 hours. I check messages regularly and love hearing about new projects and collaborations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
