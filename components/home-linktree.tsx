'use client'

const links = [
  {
    label: "LinkedIn",
    description: "Let's connect and collaborate",
    href: "https://www.linkedin.com/in/hoangngoccuong/",
    icon: "💼",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    label: "GitHub",
    description: "View my code and AI projects",
    href: "https://github.com/HoangCuongMax",
    icon: "💻",
    color: "bg-gray-800 hover:bg-gray-900"
  },
  {
    label: "YouTube",
    description: "Watch my talks and content",
    href: "https://www.youtube.com/@maxhoang",
    icon: "🎥",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    label: "Blog",
    description: "Read my latest posts",
    href: "/blog",
    icon: "📝",
    color: "bg-purple-600 hover:bg-purple-700"
  },
  {
    label: "TikTok",
    description: "Short-form learning and life in Darwin",
    href: "https://www.tiktok.com/@maxhoang",
    icon: "🎵",
    color: "bg-black hover:bg-gray-900"
  },
  {
    label: "Instagram",
    description: "Daily life, creativity, and behind the scenes",
    href: "https://www.instagram.com/maxhoang",
    icon: "📸",
    color: "bg-pink-600 hover:bg-pink-700"
  },
  {
    label: "X (Twitter)",
    description: "Thoughts on AI, tech, and learning",
    href: "https://twitter.com/maxhoang",
    icon: "𝕏",
    color: "bg-gray-900 hover:bg-black"
  }
]

export default function HomeLinktree() {
  return (
    <section className="py-20 md:py-32 bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Find Me Online</h2>
          <p className="text-2xl text-gray-300 font-semibold">One place for all my links</p>
        </div>

        <div className="space-y-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`block p-6 rounded-2xl text-white font-bold transition-all transform hover:scale-102 ${link.color}`}
            >
              <div className="flex items-center gap-6">
                <span className="text-5xl flex-shrink-0">{link.icon}</span>
                <div className="text-left">
                  <p className="text-xl font-bold">{link.label}</p>
                  <p className="text-base opacity-90">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
