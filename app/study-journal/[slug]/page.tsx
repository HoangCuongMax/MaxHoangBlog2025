import { getStudyJournalPosts, getStudyJournalPostContent } from '../../../lib/notion-api'
import PageContainer from '../../../components/page-container'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { generateMetaTags } from '../../../lib/seo-utils'
import ErrorFallback from '../../../components/error-fallback'
import { TOCProvider } from '../../../components/toc-context'

// Dynamically import client components with ssr: false to ensure they are treated as client boundaries
const NotionPage = dynamicImport(() => import('../../../components/notion-page').then(mod => mod.default), { ssr: false })
const PasswordProtectedBlogPost = dynamicImport(() => import('../../../components/password-protected-blog-post').then(mod => mod.default), { ssr: false })
const FloatingTOC = dynamicImport(() => import('../../../components/floating-toc').then(mod => mod.default), { ssr: false })
const ResponsiveContentWrapper = dynamicImport(() => import('../../../components/responsive-content-wrapper').then(mod => mod.default), { ssr: false })

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface StudyJournalPostPageProps {
  params: {
    slug: string
  }
}

export default async function StudyJournalPostPage({ params }: StudyJournalPostPageProps) {
  try {
    // Get all study journal posts
    const posts = await getStudyJournalPosts()
    
    // Find the specific post by slug
    const post = posts.find(p => p.slug === params.slug)

    if (!post) {
      throw new Error(`Study journal post not found for slug: ${params.slug}`)
    }

    // Get the post content
    const recordMap = await getStudyJournalPostContent(post.id)

    const formatDate = (dateString: string) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    }

    // Check if post is password protected
    if (post.password && post.password.trim() !== '') {
      return (
        <PasswordProtectedBlogPost post={post}>
          <article suppressHydrationWarning className="notion-content w-full mt-4 p-[25px]">
            <NotionPage recordMap={recordMap} />
          </article>
        </PasswordProtectedBlogPost>
      )
    }

    return (
      <>
        {/* Cover Photo - match blog layout (full width with overlay) */}
        {post && post.coverImage && (
          <div className="relative w-full h-[31.5rem] sm:h-[31.5rem] md:h-[33.8rem] lg:h-[40.3rem] mb-4 sm:mb-6 md:mb-8 -mt-20">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-1/2">
              <div className="max-w-6xl mx-auto">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl">
                  <div className="text-white">
                    {post.isFeatured && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {post.title}
                    </h1>
                    <nav className="mb-3 text-sm text-white/80">
                      <Link href="/" className="hover:text-white">Home</Link>
                      <span className="mx-2">/</span>
                      <Link href="/study-journal" className="hover:text-white">Study Journal</Link>
                      <span className="mx-2">/</span>
                      <span className="text-white">{post.title}</span>
                    </nav>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                      {post.publishedDate && (
                        <span>{formatDate(post.publishedDate)}</span>
                      )}
                      {post.category && (
                        <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-500/30 text-white rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="text-white/90">
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
                {/* Fallback header when no cover image */}
                {!post.coverImage && (
                  <header className="mb-8">
                    {post.isFeatured && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                      {post.title}
                    </h1>
                    <nav className="mb-3 text-sm text-gray-300">
                      <Link href="/" className="hover:text-white transition-colors">Home</Link>
                      <span className="mx-2">/</span>
                      <Link href="/study-journal" className="hover:text-white transition-colors">Study Journal</Link>
                      <span className="mx-2">/</span>
                      <span className="text-gray-100">{post.title}</span>
                    </nav>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                      {post.publishedDate && (
                        <span>{formatDate(post.publishedDate)}</span>
                      )}
                      {post.category && (
                        <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-500/30 text-blue-200 rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </header>
                )}

                {/* Content */}
                <article suppressHydrationWarning className="notion-content w-full mt-4">
                  <NotionPage recordMap={recordMap} />
                </article>

                {/* Back link */}
                <div className="mt-12 pt-6 border-t border-gray-100">
                  <Link href="/study-journal" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    ← Back to Study Journal
                  </Link>
                </div>
              </PageContainer>
            </ResponsiveContentWrapper>
          </div>
        </TOCProvider>
      </>
    )
  } catch (error) {
    console.error('Error loading study journal post:', error)
    return (
      <PageContainer>
        <div className="mb-8">
          <Link 
            href="/study-journal"
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
            Back to Study Journal
          </Link>
        </div>
        
        <ErrorFallback 
          title="Study Journal Post Not Found" 
          message="Sorry, we couldn't find this study journal post or there was an error loading it from Notion."
        />
      </PageContainer>
    )
  }
}

// Skip static generation due to Notion API
export async function generateStaticParams() {
  return []
}

// Generate metadata for each study journal post
export async function generateMetadata({ params }: StudyJournalPostPageProps) {
  try {
    const posts = await getStudyJournalPosts()
    const post = posts.find(p => p.slug === params.slug)

    if (!post) {
      return {
        title: 'Study Journal Post Not Found - Max Hoang',
        description: 'The requested study journal post could not be found.',
        robots: 'noindex, nofollow',
      }
    }

    const baseUrl = 'https://www.maxhoang.com.au'
    const postUrl = `${baseUrl}/study-journal/${post.slug}`

    const metaTags = generateMetaTags({
      title: `${post.title} - Max Hoang Study Journal`,
      description: post.excerpt || `Study journal entry: ${post.title}`,
      url: postUrl,
      image: post.coverImage,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.lastEditedDate,
      tags: post.tags,
      author: 'Max Hoang',
      section: 'Study Journal'
    })

    return {
      ...metaTags,
      canonical: postUrl,
    }
  } catch (error) {
    return {
      title: 'Study Journal - Max Hoang',
      description: 'Study journal by Max Hoang',
      robots: 'noindex, nofollow',
    }
  }
}
