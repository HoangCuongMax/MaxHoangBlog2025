export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Introduction Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center mb-6">
            {/* Author Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-4 ring-blue-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=800"
                alt="Max Hoang"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Author Name & Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">Max Hoang</h3>
            <p className="text-gray-600 text-lg font-medium mb-3">AI Engineer & Full-Stack Developer</p>
            
            {/* Author Bio */}
            <p className="text-gray-600 max-w-2xl text-center leading-relaxed">
              Passionate about AI, web development, and creating innovative solutions.
              I share insights on technology trends, development practices, and my journey in the tech industry.
              Currently pursuing Master of Information Technology in Artificial Intelligence at Charles Darwin University.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-6 mb-8">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/hoangngoccuong/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-gray-100 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/HoangCuongMax" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-gray-100 hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/61405272278" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-gray-100 hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
              aria-label="WhatsApp Contact"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>


            {/* Email */}
            <a
              href="mailto:hoangngoccuong1414@gmail.com"
              className="group p-3 rounded-full bg-gray-100 hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Email Contact"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="text-center mb-8 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Subscribe to my weekly updates for the latest insights on AI, web development, and my journey.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            No spam, unsubscribe at any time
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-2">
            © {new Date().getFullYear()} Max Hoang. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with Next.js and react-notion-x
          </p>
        </div>
      </div>
    </footer>
  )
}
