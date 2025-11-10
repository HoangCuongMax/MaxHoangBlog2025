import Link from 'next/link'
import { getBlogPosts } from '../lib/notion-api'

export default async function HomeBlogPreview() {
  try {
    const allPosts = await getBlogPosts()
    const posts = allPosts.slice(0, 6) // Get first 6 posts
    
    return (
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Latest from the Blog</h2>
            <p className="text-xl text-gray-600">Thoughts on AI, web development, and building in public</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.coverImage && (
                  <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-300">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt || ''}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : ''}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[rgb(216,0,92)] font-semibold hover:text-[rgb(196,0,72)] transition-colors text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-block px-8 py-3 bg-[rgb(51,51,116)] text-white font-semibold hover:bg-[rgb(41,41,96)] transition-colors"
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
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from the Blog</h2>
          <p className="text-gray-600 mb-8">Check out my latest articles on AI, web development, and more.</p>
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-[rgb(51,51,116)] text-white font-semibold hover:bg-[rgb(41,41,96)] transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </section>
    )
  }
}
