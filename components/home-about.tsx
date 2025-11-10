import Link from 'next/link'

export default function HomeAbout() {
  return (
    <section className="py-20 md:py-32 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Max</h2>
          <p className="text-xl text-gray-600">A bit of my story and what drives me</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">My Background</h3>
            <p className="text-gray-700 leading-relaxed">
              I grew up in Vietnam and now call the Northern Territory of Australia home, where I'm building a life with my wife and daughter.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">My Focus</h3>
            <p className="text-gray-700 leading-relaxed">
              My focus is on AI, web, and app development—creating tools that blend technology with everyday usefulness. I'm exploring AI-powered solutions for education, local businesses, and digital creativity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">My Path</h3>
            <p className="text-gray-700 leading-relaxed">
              I previously worked as a graphic designer and marketing professional, which gave me an eye for design and communication. I've since shifted into tech, building innovative projects.
            </p>
          </div>
        </div>

        <div className="p-8 bg-[rgb(51,51,116)] text-white rounded-xl">
          <p className="text-lg leading-relaxed mb-6">
            I'm studying for my Master of IT (Artificial Intelligence) at Charles Darwin University, where I join hackathons and challenges such as GOV Hack and CDU IT Code Fair.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-2 bg-[rgb(216,0,92)] hover:bg-[rgb(196,0,72)] transition-colors font-semibold"
          >
            Learn More About Me
          </Link>
        </div>
      </div>
    </section>
  )
}
