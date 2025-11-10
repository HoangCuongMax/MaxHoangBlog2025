import HomeHero from '../components/home-hero'
import HomeAbout from '../components/home-about'
import HomeProjects from '../components/home-projects'
import HomeTalks from '../components/home-talks'
import HomeBlogPreview from '../components/home-blog-preview'
import HomeLinktree from '../components/home-linktree'
import HomeContact from '../components/home-contact'
import { Metadata } from 'next'

export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeAbout />
      <HomeProjects />
      <HomeTalks />
      <HomeBlogPreview />
      <HomeLinktree />
      <HomeContact />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Max Hoang - AI Enthusiast, Web Developer & Storyteller',
  description: 'Personal brand site of Max Hoang. AI engineer, web developer, and storyteller based in Darwin, NT. Building AI and web solutions that connect people, ideas, and technology.',
  keywords: ['Max Hoang', 'AI Engineer', 'Web Developer', 'Darwin', 'AI Projects', 'Web Development', 'Storytelling'],
  authors: [{ name: 'Max Hoang' }],
  openGraph: {
    title: 'Max Hoang - AI Enthusiast, Web Developer & Storyteller',
    description: 'Personal brand site of Max Hoang. AI engineer, web developer, and storyteller.',
    type: 'website',
    url: 'https://maxhoang.com.au',
  },
}
