import Link from 'next/link'

export default function HomeAbout() {
  return (
    <section className="py-24 md:py-40 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">About Max</h2>
          <p className="text-2xl text-gray-300 font-semibold">A bit of my story and what drives me</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Card 1 */}
          <div className="p-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
            <h3 className="text-3xl font-bold text-white mb-6">My Background</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              I grew up in Vietnam and now call the Northern Territory of Australia home, where I'm building a life with my wife and daughter.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
            <h3 className="text-3xl font-bold text-white mb-6">My Focus</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              My focus is on AI, web, and app development—creating tools that blend technology with everyday usefulness. I'm exploring AI-powered solutions for education, local businesses, and digital creativity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
            <h3 className="text-3xl font-bold text-white mb-6">My Path</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              I previously worked as a graphic designer and marketing professional, which gave me an eye for design and communication. I've since shifted into tech, building innovative projects.
            </p>
          </div>
        </div>

        <div className="p-12 bg-gradient-to-r from-[rgb(51,51,116)] to-[rgb(41,41,96)] rounded-2xl border border-white border-opacity-20">
          <p className="text-2xl leading-relaxed text-white mb-8 font-semibold">
            I'm studying for my Master of IT (Artificial Intelligence) at Charles Darwin University, where I join hackathons and challenges such as GOV Hack and CDU IT Code Fair.
          </p>
          <Link
            href="/about"
            className="inline-block px-10 py-4 bg-[rgb(216,0,92)] hover:bg-[rgb(196,0,72)] transition-all font-bold text-white text-lg"
          >
            Learn More About Me
          </Link>
        </div>
      </div>
    </section>
  )
}
