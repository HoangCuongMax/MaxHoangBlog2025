import Link from 'next/link'
import { getBlogPosts } from '../lib/notion-api'

export default async function HomeBlogPreview() {
  try {
    const allPosts = await getBlogPosts()
    const posts = allPosts.slice(0, 6)
    
    return (
      <section className="py-24 md:py-40 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Latest from the Blog</h2>
            <p className="text-2xl text-gray-700 font-semibold">Thoughts on AI, web development, and building in public</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[rgb(216,0,92)] hover:shadow-xl transition-all"
              >
                {post.coverImage && (
                  <div className="w-full h-56 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-300">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 text-base mb-6 line-clamp-2 leading-relaxed">
                    {post.excerpt || ''}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : ''}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[rgb(216,0,92)] font-bold hover:text-[rgb(196,0,72)] transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-block px-10 py-4 bg-[rgb(51,51,116)] text-white font-bold hover:bg-[rgb(41,41,96)] transition-colors text-lg"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading blog posts for preview:', error)
    return (
      <section className="py-24 md:py-40 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Latest from the Blog</h2>
          <p className="text-2xl text-gray-700 font-semibold mb-12">Check out my latest articles on AI, web development, and more.</p>
          <Link
            href="/blog"
            className="inline-block px-10 py-4 bg-[rgb(51,51,116)] text-white font-bold hover:bg-[rgb(41,41,96)] transition-colors text-lg"
          >
            View All Posts
          </Link>
        </div>
      </section>
    )
  }
}
