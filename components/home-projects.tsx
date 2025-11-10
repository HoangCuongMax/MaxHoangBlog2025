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
    <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600">AI, web, and innovation projects I've built</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{project.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="text-[rgb(216,0,92)] font-semibold hover:text-[rgb(196,0,72)] transition-colors">
                View Project →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/projects"
            className="inline-block px-8 py-3 bg-[rgb(51,51,116)] text-white font-semibold hover:bg-[rgb(41,41,96)] transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
