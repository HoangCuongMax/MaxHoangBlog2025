import dynamicImport from 'next/dynamic'
import { getBlogPost, getBlogPosts } from '../../../lib/notion-api'
import PageContainer from '../../../components/page-container'
import ErrorFallback from '../../../components/error-fallback'

// Force dynamic rendering to avoid SSR/SSG issues with Notion API
export const dynamic = 'force-dynamic'

const NotionPage = dynamicImport(() => import('../../../components/notion-page'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    </div>
  )
})

const RelatedPostsPopup = dynamicImport(() => import('../../../components/related-posts-popup'), {
  ssr: false
})

import Link from 'next/link'
import { generateMetaTags, generateArticleStructuredData, generateBreadcrumbStructuredData } from '../../../lib/seo-utils'
import { ClientLegacyUrlNotice } from '../../../components/client-components'
import PasswordProtectedBlogPost from '../../../components/password-protected-blog-post'
import FloatingTOC from '../../../components/floating-toc'
import { TOCProvider } from '../../../components/toc-context'
import ResponsiveContentWrapper from '../../../components/responsive-content-wrapper'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    // Get all posts first to find the current post
    const allPosts = await getBlogPosts()

    // Find current post details - check both slug and ID for backward compatibility
    const currentPost = allPosts.find(p => p.slug === params.slug || p.id === params.slug)

    if (!currentPost) {
      throw new Error(`Post not found for slug: ${params.slug}`)
    }

    // Get the blog post content using the actual Notion ID
    const recordMap = await getBlogPost(currentPost.id)

    // Get related posts (exclude current post)
    const relatedPosts = allPosts
      .filter(p => p.slug !== params.slug)
      .slice(0, 3)

    // Generate structured data
    const baseUrl = 'https://www.maxhoang.com.au'
    const articleUrl = `${baseUrl}/blog/${currentPost?.slug || params.slug}`

    const structuredData = currentPost ? generateArticleStructuredData({
      title: currentPost.title,
      description: currentPost.excerpt || '',
      url: articleUrl,
      image: currentPost.coverImage,
      publishedTime: currentPost.publishDate,
      modifiedTime: currentPost.publishDate,
      tags: currentPost.tags,
      readTime: currentPost.readTime,
      wordCount: currentPost.excerpt ? currentPost.excerpt.length * 5 : undefined, // Rough estimate
    }) : null

    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', url: baseUrl },
      { name: 'Blog', url: `${baseUrl}/blog` },
      { name: currentPost?.title || 'Blog Post', url: articleUrl }
    ])

    return (
      <>
        {/* Cover Photo - Outside All Containers for True Full Width */}
        {currentPost && currentPost.coverImage && (
          <div className="relative w-full h-[31.5rem] sm:h-[31.5rem] md:h-[33.8rem] lg:h-[40.3rem] mb-4 sm:mb-6 md:mb-8 -mt-20">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentPost.coverImage})` }}
            />
            {/* Dark transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-1/2">
              <div className="max-w-6xl mx-auto">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl">
                  <div className="text-white">
                    {/* Featured Badge */}
                    {currentPost.isFeatured && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {currentPost.title}
                    </h1>

                    {/* Breadcrumb under title */}
                    <nav className="mb-3 text-sm text-white/80">
                      <Link href="/" className="hover:text-white">Home</Link>
                      <span className="mx-2">/</span>
                      <Link href="/blog" className="hover:text-white">Blog</Link>
                      <span className="mx-2">/</span>
                      <span className="text-white">{currentPost.title}</span>
                    </nav>

                    {/* Meta Information under breadcrumb */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                      {currentPost.publishDate && (
                        <span>
                          {new Date(currentPost.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                          })}
                        </span>
                      )}
                      {currentPost.readTime && (
                        <span>{currentPost.readTime}</span>
                      )}
                      {currentPost.tags && currentPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentPost.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-white/90"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <TOCProvider>
        <FloatingTOC />
        <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32">
          <ResponsiveContentWrapper>
          <PageContainer noBoxStyling={true}>
            <style>{`.page-container > div{padding:0!important}`}</style>
        {/* Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />


        {/* Legacy URL Notice */}
        <ClientLegacyUrlNotice currentPost={currentPost ? { slug: currentPost.slug, title: currentPost.title } : undefined} />

        {/* Password Protection Wrapper */}
        <PasswordProtectedBlogPost post={currentPost}>

          {/* Post Header - Home Page Style */}
          {currentPost && (
            <>
              {/* No cover photo here - moved outside containers */}
              {!currentPost.coverImage && (
                <header className="mb-8">
                  {/* Featured Badge */}
                  {currentPost.isFeatured && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  {/* Fallback Title for posts without cover image */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {currentPost.title}
                  </h1>

                  {/* Breadcrumb under title for posts without cover */}
                  <nav className="mb-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/blog" className="hover:text-gray-700">Blog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{currentPost.title}</span>
                  </nav>

                  {/* Meta Information under breadcrumb for posts without cover */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                    {currentPost.publishDate && (
                      <span>
                        {new Date(currentPost.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                          })}
                      </span>
                    )}
                    {currentPost.readTime && (
                      <span>{currentPost.readTime}</span>
                    )}
                    {currentPost.tags && currentPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentPost.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </header>
              )}

            </>
          )}

          {/* Blog Post Content - Clean Notion Style - Match cover photo width */}
          <article className="notion-content w-full mt-4">
            <NotionPage recordMap={recordMap} />
          </article>

          {/* Related Posts - Simple List Style */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-medium text-gray-700 mb-6">Related Articles</h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="group">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        {post.password && post.password.trim() !== '' && (
                          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      {post.publishDate && (
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(post.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC'
                          })}
                        </p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Simple Back Link */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </PasswordProtectedBlogPost>
          </PageContainer>
          </ResponsiveContentWrapper>
        </div>

        {/* Related Posts Popup */}
        <RelatedPostsPopup
          relatedPosts={allPosts}
          currentPostId={currentPost.id}
        />
        </TOCProvider>
      </>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    return (
      <PageContainer>
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
          >
            <svg 
              className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
        
        <ErrorFallback 
          title="Blog Post Not Found" 
          message="Sorry, we couldn't find this blog post or there was an error loading it from Notion."
        />
      </PageContainer>
    )
  }
}

// Skip static generation due to Notion API complexity
export async function generateStaticParams() {
  return []
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const posts = await getBlogPosts()
    const post = posts.find(p => p.slug === params.slug || p.id === params.slug)

    if (!post) {
      return {
        title: 'Blog Post Not Found - Max Hoang',
        description: 'The requested blog post could not be found.',
        robots: 'noindex, nofollow',
      }
    }

    const baseUrl = 'https://www.maxhoang.com.au'
    const articleUrl = `${baseUrl}/blog/${post.slug}`

    const metaTags = generateMetaTags({
      title: `${post.title} - Max Hoang`,
      description: post.excerpt || `Read ${post.title} on Max Hoang's blog`,
      url: articleUrl,
      image: post.coverImage,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate,
      tags: post.tags,
      author: 'Max Hoang',
      section: 'Blog'
    })

    return {
      ...metaTags,
      canonical: articleUrl,
      alternates: {
        canonical: articleUrl,
      },
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      authors: [{ name: 'Max Hoang', url: baseUrl }],
      creator: 'Max Hoang',
      publisher: 'Max Hoang',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post - Max Hoang',
      description: 'Personal blog post by Max Hoang',
      robots: 'noindex, nofollow',
    }
  }
}
