const talks = [
  {
    id: 1,
    title: "Learning in the Age of AI",
    youtubeId: "s_4MyCWTuIE",
    description: "Exploring how AI is transforming education and learning"
  },
  {
    id: 2,
    title: "Startup September Pitch – AI Business Idea",
    youtubeId: "HnEfQIkdr4s",
    description: "Pitching an innovative AI business idea"
  }
]

export default function HomeTalks() {
  return (
    <section className="py-24 md:py-40 bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Talks & Presentations</h2>
          <p className="text-2xl text-gray-300 font-semibold mb-3">I share ideas on how AI, creativity, and technology can empower everyday people.</p>
          <p className="text-xl text-gray-400">Invited AI Speaker at RIMPA Annual Events & Startup September NT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {talks.map((talk) => (
            <div key={talk.id} className="group">
              {/* Video Embed */}
              <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow bg-black border-2 border-white border-opacity-20">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${talk.youtubeId}`}
                  title={talk.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Title & Description */}
              <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-[rgb(216,0,92)] transition-colors">
                {talk.title}
              </h3>
              <p className="text-lg text-gray-300">{talk.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center p-12 bg-gradient-to-r from-[rgb(51,51,116)] to-[rgb(41,41,96)] rounded-2xl border border-white border-opacity-20">
          <p className="text-2xl text-white mb-8 font-semibold">
            Want to work together on a speaking opportunity or collaboration?
          </p>
          <a
            href="mailto:hoangngoccuong1414@gmail.com"
            className="inline-block px-10 py-4 bg-[rgb(216,0,92)] text-white font-bold hover:bg-[rgb(196,0,72)] transition-colors text-lg"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
