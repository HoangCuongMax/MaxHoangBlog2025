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
    <section className="py-20 md:py-32 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Talks & Presentations</h2>
          <p className="text-xl text-gray-600 mb-2">I share ideas on how AI, creativity, and technology can empower everyday people.</p>
          <p className="text-lg text-gray-500">Invited AI Speaker at RIMPA Annual Events & Startup September NT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {talks.map((talk) => (
            <div key={talk.id} className="group">
              {/* Video Embed */}
              <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-black">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[rgb(216,0,92)] transition-colors">
                {talk.title}
              </h3>
              <p className="text-gray-600">{talk.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-lg text-gray-700 mb-4">
            Want to work together on a speaking opportunity or collaboration?
          </p>
          <a
            href="mailto:hoangngoccuong1414@gmail.com"
            className="inline-block px-8 py-3 bg-[rgb(51,51,116)] text-white font-semibold hover:bg-[rgb(41,41,96)] transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
