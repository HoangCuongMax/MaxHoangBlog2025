import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Max Hoang (Cuong Hoang)',
  description: 'Professional resume of Max Hoang (Cuong Hoang) - AI & Python Developer specializing in OpenAI API Integration, Machine Learning, and Web Development.',
  keywords: 'Max Hoang, Cuong Hoang, AI Developer, Python Developer, OpenAI API, Machine Learning, Web Development, Resume, CV',
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Full width two-column layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left Sidebar - Contact Info & Skills */}
        <div className="lg:w-1/3 bg-slate-700 text-white p-6 lg:p-8 pt-20 lg:pt-24">

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-lg">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1/2 Graham St, Stuart Park, NT 0820, Australia.</p>
              <p>+61405272278 (Work)</p>
              <p>hoangngoccuong1414@gmail.com</p>
              <a href="https://www.linkedin.com/in/maxhoangau/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 block">
                www.linkedin.com/in/maxhoangau (LinkedIn)
              </a>
              <p>maxhoang.com.au (Blog)</p>
            </div>
          </div>

          {/* Top Skills */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-lg">Top Skills</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Artificial Intelligence (AI)</p>
              <p>Python (Programming Language)</p>
              <p>Casino Operations</p>
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-lg">Languages</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>English (Full Professional)</p>
              <p>Vietnamese (Native or Bilingual)</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-lg">Certifications</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <p className="font-medium">Foundations of Digital Marketing and E-commerce by Google</p>
              </div>
              <div>
                <p className="font-medium">Attract and Engage Customers with Digital Marketing by Google</p>
              </div>
              <div>
                <p className="font-medium">Advanced diploma in multimedia</p>
              </div>
              <div>
                <p className="font-medium">Get Started with Figma</p>
              </div>
            </div>
          </div>

          {/* Publications */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-lg">Publications</h3>
            <div className="text-sm text-gray-300">
              <p className="font-medium">Philinter Education Center 2017 Brochure</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-medium transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-6 space-y-2">
            <Link 
              href="/projects"
              className="w-full border border-white hover:bg-white hover:text-slate-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View Projects
            </Link>
            <a 
              href="https://github.com/maxhoangau" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full border border-white hover:bg-white hover:text-slate-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:w-2/3 p-6 lg:p-8 pt-20 lg:pt-24">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Cuong Hoang
            </h1>
            <p className="text-xl lg:text-2xl text-blue-600 font-medium mb-4">
              AI & Python Developer | OpenAI API Integration
            </p>
            <p className="text-lg text-gray-600">
              Darwin City, Northern Territory, Australia
            </p>
          </div>

          {/* Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                As a <strong>Master of Information Technology (Artificial Intelligence)</strong> student at Charles Darwin University, 
                I'm passionate about using AI to solve real-world problems, particularly in the areas of geospatial data, 
                infrastructure, and community-focused innovation.
              </p>
              <p>
                With a background in design, marketing, and web development, I bring a creative yet analytical approach to 
                every project I take on. My current focus is building AI-powered platforms that help people interact with 
                complex data more intuitively—combining technologies like computer vision, natural language processing, and 
                geospatial analysis.
              </p>
              <p>
                I'm actively engaged in projects that bridge academic research with practical outcomes, contributing to 
                smarter tools that support regional development and digital transformation. My goal is to create ethical, 
                scalable, and accessible AI solutions that make a meaningful impact, especially for under-resourced or 
                remote communities.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
            
            {/* Mindil Beach Casino Resort */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Dealer Inspector</h3>
                  <p className="text-lg text-blue-600 font-medium">Mindil Beach Casino Resort</p>
                </div>
                <div className="text-sm text-gray-600 mt-2 lg:mt-0 lg:text-right lg:ml-4">
                  <p className="font-bold">February 2024 - Present (1 year 7 months)</p>
                  <p>Darwin City, Northern Territory, Australia</p>
                </div>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>- Supervised casino table games to ensure all dealers adhered strictly to gaming regulations, operational procedures, and company standards, maintaining the integrity and fairness of all games.</li>
                <li>- Monitored game flow, player conduct, and dealer performance to prevent rule violations, cheating, or security issues, intervening promptly as needed to resolve disputes or irregularities.</li>
                <li>- Inspected cards, chips, dice, and other gaming equipment before and during play to guarantee they were in optimal condition and compliant with casino policies.</li>
                <li>- Provided guidance and orientation to players regarding game rules, procedures, and casino policies, ensuring a positive and engaging gaming experience.</li>
                <li>- Ensured accurate handling of cash and chip transactions, including payouts, collections, fills, and color changes, while maintaining meticulous records of all bets and outcomes.</li>
              </ul>
            </div>

            {/* Philinter Education Center */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Graphic Designer and Marketing Officer</h3>
                  <p className="text-lg text-blue-600 font-medium">Philinter Education Center</p>
                </div>
                <div className="text-sm text-gray-600 mt-2 lg:mt-0 lg:text-right lg:ml-4">
                  <p className="font-bold">October 2015 - January 2019 (3 years 4 months)</p>
                  <p>Cebu, Central Visayas, Philippines</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Portfolio examples of design and marketing work available upon request</p>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>- Created and executed marketing campaigns for multiple divisions of Philinter Education Center.</li>
                <li>- Designed collateral for print and digital marketing campaigns, including newspaper adverts, flyers, and social media graphics.</li>
                <li>- Maintained and updated the company website and social media profiles.</li>
                <li>- Generated monthly marketing reports on social media and marketing activities.</li>
                <li>- Assisted in writing media releases and creating video content for social media platforms.</li>
              </ul>
            </div>

            {/* West Green Design */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Marketing Coordinator, West Green Design Corporation</h3>
                  <p className="text-lg text-blue-600 font-medium">West Green Design | Landscape Architecture</p>
                </div>
                <div className="text-sm text-gray-600 mt-2 lg:mt-0 lg:text-right lg:ml-4">
                  <p className="font-bold">August 2013 - September 2015 (2 years 2 months)</p>
                  <p>Lê Đức Thọ, Mỹ Đình 2, Từ Liêm, Hanoi, Vietnam</p>
                </div>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>- First staff member and Graphic Designer at West Green Design Inc, a Canada-based landscape company operating in Vietnam.</li>
                <li>- Designed the company's logo, branding kits, website, and profiles, establishing the company's brand image from the start.</li>
                <li>- Utilized Adobe InDesign to create and present landscape project design ideas to investors.</li>
                <li>- Managed company photography, brochure printing, and social media presence.</li>
                <li>- Played a crucial role in building the company's brand and image from inception, contributing to its growth to over 200 staff members.</li>
                <li>- Contributed significantly to the company's evolution into one of Vietnam's most renowned landscape companies.</li>
              </ul>
            </div>

            {/* Pixelz Inc */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Photo Editor</h3>
                  <p className="text-lg text-blue-600 font-medium">Pixelz Inc</p>
                </div>
                <div className="text-sm text-gray-600 mt-2 lg:mt-0 lg:text-right lg:ml-4">
                  <p className="font-bold">August 2011 - May 2013 (1 year 10 months)</p>
                  <p>Phòng 409, toà nhà Toyota Mỹ Đình, số 15A Phạm Hùng Hanoi, Vietnam</p>
                </div>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>- Expert photo editor with experience working for leading online retailers like Amazon and eBay.</li>
                <li>- Proficient in improving the visual appeal of various products, including jewelry, furniture, machinery, and clothes.</li>
                <li>- Demonstrated ability to meet stringent deadlines while upholding high-quality standards.</li>
                <li>- A valuable asset to organizations aiming to enhance the visual appeal of their products and services.</li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
            
            <div className="space-y-4">
              {/* Charles Darwin University */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Charles Darwin University</h3>
                <p className="text-blue-600 font-medium">Master's degree, Master of Information Technology (Artificial Intelligence) · (2025 - 2027)</p>
              </div>

              {/* University of Greenwich */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">University of Greenwich</h3>
                <p className="text-blue-600 font-medium">Bachelor of Business Administration - BBA, Marketing · (2017 - 2019)</p>
              </div>

              {/* Arena Animation */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Arena Animation</h3>
                <p className="text-blue-600 font-medium">Associate's Degree, Graphic Design · (2013 - 2015)</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
