import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: "ASL Translation System",
    description: "An AI tool that translates American Sign Language using computer vision. Won the Coding Challenge and contributed to the NT Digital Excellence Award at CDU IT Code Fair.",
    tags: ["Computer Vision", "AI", "Deep Learning"],
    icon: "👁️"
  },
  {
    id: 2,
    title: "GreenLedger AI",
    description: "A carbon tracking solution to measure and reduce the footprint of information management, winner of the $10,000 RIMPA Global Hackathon 2025.",
    tags: ["Sustainability", "AI", "Web App"],
    icon: "🌱"
  },
  {
    id: 3,
    title: "AI-Integrated WebGIS",
    description: "An AI-powered WebGIS platform combining mapping, spatial data, and GPT-based reporting for civil and environmental use cases.",
    tags: ["GIS", "AI", "Mapping"],
    icon: "🗺️"
  },
  {
    id: 4,
    title: "Kriol–English Translator",
    description: "A translation tool using NLP to support Kriol–English language understanding and preservation.",
    tags: ["NLP", "Translation", "Language"],
    icon: "🗣️"
  }
]

export default function HomeProjects() {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Featured Projects</h2>
          <p className="text-2xl text-gray-700 font-semibold">AI, web, and innovation projects I've built</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="p-10 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-[rgb(216,0,92)] hover:shadow-xl transition-all"
            >
              <div className="text-6xl mb-6">{project.icon}</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{project.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link href="/projects" className="text-[rgb(216,0,92)] font-bold text-lg hover:text-[rgb(196,0,72)] transition-colors">
                View Project →
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/projects"
            className="inline-block px-10 py-4 bg-[rgb(51,51,116)] text-white font-bold hover:bg-[rgb(41,41,96)] transition-colors text-lg"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
