'use client'

import { useState } from 'react'

export default function HomeContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
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
    <section className="py-20 md:py-32 bg-gradient-to-br from-[rgb(51,51,116)] to-[rgb(41,41,96)] text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Collaborate</h2>
          <p className="text-xl text-white opacity-90">
            Curious about AI, web development, or creative digital projects? I'm open to collaborations, speaking, and project opportunities in AI, data, and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-[rgb(216,0,92)]"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-[rgb(216,0,92)] text-white font-semibold hover:bg-[rgb(196,0,72)] transition-colors"
            >
              {submitted ? '✓ Message Sent!' : 'Send Message'}
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Contact Options</h3>
              
              <div className="space-y-4">
                <a
                  href="mailto:hoangngoccuong1414@gmail.com"
                  className="block p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <p className="text-sm opacity-80">Email</p>
                  <p className="font-semibold">hoangngoccuong1414@gmail.com</p>
                </a>

                <a
                  href="https://www.linkedin.com/in/hoangngoccuong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <p className="text-sm opacity-80">LinkedIn</p>
                  <p className="font-semibold">Connect on LinkedIn</p>
                </a>

                <a
                  href="https://wa.me/61405272278"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <p className="text-sm opacity-80">WhatsApp</p>
                  <p className="font-semibold">Chat on WhatsApp</p>
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm opacity-80 leading-relaxed">
                Response time: Usually within 24-48 hours. I check messages regularly and love hearing about new projects and collaborations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
