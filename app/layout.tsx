import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/Footer'
import ContactPopup from '../components/contact-popup'

// Force dynamic rendering for the entire application
export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maxhoang.com.au'),
  title: {
    default: 'Max Hoang - Personal Website | AI & Web Development',
    template: '%s | Max Hoang'
  },
  description: 'Personal website of Max Hoang, AI and Web Development student at Charles Darwin University. Explore my projects, study journal, and insights on technology.',
  keywords: ['Max Hoang', 'AI', 'Artificial Intelligence', 'Web Development', 'Next.js', 'React', 'TypeScript', 'Charles Darwin University', 'CDU', 'Portfolio', 'Blog'],
  authors: [{ name: 'Max Hoang', url: 'https://www.maxhoang.com.au' }],
  creator: 'Max Hoang',
  publisher: 'Max Hoang',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.maxhoang.com.au',
    siteName: 'Max Hoang - Personal Website',
    title: 'Max Hoang - AI & Web Development Student',
    description: 'Personal website of Max Hoang, AI and Web Development student at Charles Darwin University. Explore my projects, study journal, and insights on technology.',
    images: [
      {
        url: 'https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=1200',
        width: 1200,
        height: 630,
        alt: 'Max Hoang - AI & Web Development Student',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Hoang - AI & Web Development Student',
    description: 'Personal website of Max Hoang, AI and Web Development student at Charles Darwin University.',
    creator: '@maxhoang', // Update with your actual Twitter handle
    images: ['https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=1200'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Add your Google Search Console verification code
    yandex: '', // Add if needed
    yahoo: '', // Add if needed
  },
  alternates: {
    canonical: 'https://www.maxhoang.com.au',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {Navigation ? <Navigation /> : (console.error('Navigation component is undefined'), null)}
        <main className="pt-24 flex-grow" role="main">
          {children}
        </main>
        {Footer ? <Footer /> : (console.error('Footer component is undefined'), null)}
        {ContactPopup ? <ContactPopup /> : (console.error('ContactPopup component is undefined'), null)}
      </body>
    </html>
  )
}
