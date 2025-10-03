import Link from 'next/link'

interface LinkItem {
  href: string
  label: string
  external?: boolean
}

interface ProfileLinktreeProps {
  avatarUrl?: string
  name?: string
  title?: string
  intro?: string
  links?: LinkItem[]
}

export default function ProfileLinktree({
  avatarUrl = 'https://cdn.builder.io/api/v1/image/assets%2F177dbc27b0d5446d94f5f3c432862cca%2Fd534d74ce56142f9ac8e2a37b53a75e6?format=webp&width=800',
  name = 'Max Hoang',
  title = 'AI Engineer & Full-Stack Developer',
  intro = 'Building practical AI and web systems. Sharing real-world experiments and learnings.',
  links = [
    { href: '/study-journal', label: 'Study Journal' },
    { href: '/blog/ai-guide', label: 'AI Guide' },
    { href: 'https://kriol.maxhoang.com.au/', label: 'Kriol Translation App', external: true },
  ],
}: ProfileLinktreeProps) {
  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[28px] border border-black/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="md:flex md:items-stretch">
            {/* Left panel */}
            <div className="md:w-5/12 px-6 pt-8 pb-6 text-center md:text-left md:pt-10 md:pb-10 md:px-8 bg-gradient-to-b from-slate-900/70 to-slate-800/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt={name} className="mx-auto md:mx-0 w-24 h-24 rounded-full ring-4 ring-white/20 object-cover" />
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {name.toLowerCase()}
              </h1>
              <p className="mt-2 text-sm text-slate-200">{title}</p>
              <p className="mt-1 text-xs text-slate-300/90">{intro}</p>

              <div className="mt-4 flex items-center justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/in/maxhoangau/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700"
                >
                  Connect with me on Linkedin
                </a>
              </div>

              {/* Social icons */}
              <div className="mt-5 flex items-center gap-3 justify-center md:justify-start">
                <a href="https://www.linkedin.com/in/maxhoangau/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.1c.6-1.1 2.1-2.2 4.3-2.2 4.6 0 5.4 3 5.4 6.9V24h-5V15.6c0-2 0-4.6-2.8-4.6-2.8 0-3.2 2.2-3.2 4.4V24H7.5V8z" />
                  </svg>
                </a>
                <a href="https://github.com/HoangCuongMax" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current"><path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.648.5.5 5.648.5 12A11.5 11.5 0 008.356 23.1c.6.11.82-.256.82-.572 0-.282-.01-1.028-.016-2.018-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.757-1.334-1.757-1.09-.744.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.072 1.837 2.812 1.307 3.496.999.108-.777.42-1.307.763-1.607-2.664-.303-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 016.006 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.625-5.48 5.921.432.372.817 1.103.817 2.223 0 1.604-.015 2.896-.015 3.293 0 .318.216.69.826.572A11.503 11.503 0 0023.5 12c0-6.352-5.148-11.5-11.5-11.5z"/></svg>
                </a>
                <a href="mailto:hoangngoccuong1414@gmail.com" aria-label="Email" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5l-9.75 6.75L2.25 7.5m19.5 0A2.25 2.25 0 0021.75 5.25H2.25A2.25 2.25 0 000 7.5v9A2.25 2.25 0 002.25 18.75h19.5A2.25 2.25 0 0024 16.5v-9z" />
                  </svg>
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current"><path d="M19.11 17.13c-.28-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.28-.7.88-.85 1.06-.16.18-.31.2-.58.07-.28-.14-1.18-.43-2.24-1.37-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.31.41-.47.14-.16.18-.28.28-.47.09-.18.05-.35-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46-.16 0-.35-.02-.53-.02-.18 0-.5.07-.76.35-.25.28-.98.96-.98 2.34 0 1.39 1 2.72 1.14 2.9.14.18 1.95 2.99 4.73 4.19.66.28 1.18.45 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.62-.66 1.85-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.53-.32z"/><path d="M26.72 5.26C23.99 2.52 20.17 1 16.13 1 7.92 1 1.21 7.71 1.21 15.92c0 2.56.67 5.06 1.95 7.25L1 31l7.99-2.1c2.14 1.17 4.56 1.79 7.06 1.79 8.21 0 14.92-6.71 14.92-14.92 0-3.97-1.55-7.71-4.25-10.51zm-10.6 23.87c-2.29 0-4.52-.61-6.47-1.76l-.46-.27-4.74 1.25 1.26-4.62-.3-.47a13.232 13.232 0 01-2.02-7.03C3.4 9.06 9.28 3.17 16.13 3.17c3.48 0 6.75 1.36 9.21 3.83 2.46 2.47 3.82 5.74 3.82 9.22 0 7.87-6.41 14.32-13.04 14.91-.45.04-.89.06-1.34.06z"/></svg>
                </a>
              </div>
            </div>

            {/* Right panel */}
            <div className="md:w-7/12 px-4 pb-8 md:py-10 md:px-8">
              {/* Highlighted primary CTA */}
              <div className="mb-4">
                <Link href="/projects" className="w-full inline-flex items-center justify-center h-14 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow hover:opacity-95">
                  My 100 Check List
                </Link>
              </div>
              <ul className="space-y-3">
                {links.map((l) => {
                  const Button = l.external ? 'a' : (Link as any)
                  const props: any = l.external ? { href: l.href, target: '_blank', rel: 'noopener noreferrer' } : { href: l.href }
                  return (
                    <li key={l.href}>
                      <Button
                        {...props}
                        className="w-full inline-flex items-center justify-center h-14 rounded-full bg-white/80 hover:bg-white border border-black/10 text-zinc-900 font-medium backdrop-blur transition-colors shadow-sm"
                      >
                        {l.label}
                      </Button>
                    </li>
                  )
                })}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
