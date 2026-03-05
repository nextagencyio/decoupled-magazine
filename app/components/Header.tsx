'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { Menu, X } from 'lucide-react'

const navigationItems = [
  { name: 'Culture', href: '/news' },
  { name: 'Technology', href: '/news' },
  { name: 'Science', href: '/news' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bannerHeight, setBannerHeight] = useState(0)

  useEffect(() => {
    const banner = document.querySelector('[class*="bg-amber-500"]') as HTMLElement | null
    if (banner) {
      const update = () => setBannerHeight(banner.offsetHeight)
      update()
      const observer = new MutationObserver(update)
      observer.observe(banner, { attributes: true, childList: true, subtree: true })
      window.addEventListener('resize', update)
      return () => { observer.disconnect(); window.removeEventListener('resize', update) }
    }
  }, [])

  const getActiveTab = () => {
    if (pathname === '/') return 'Home'
    for (const item of navigationItems) {
      if (item.href !== '/' && pathname.startsWith(item.href)) return item.name
    }
    return null
  }

  const activeTab = getActiveTab()

  return (
    <header className="fixed left-0 right-0 z-50 bg-primary-950/80 backdrop-blur-md border-b border-gray-800/50" style={{ top: bannerHeight }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-white hover:text-primary-400 transition-colors duration-200">Meridian</Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href} className={clsx('text-sm transition-colors duration-200', activeTab === item.name ? 'text-primary-400' : 'text-gray-400 hover:text-white')}>
                {item.name}
              </Link>
            ))}
          </nav>
          <button type="button" className="md:hidden inline-flex items-center justify-center p-1 text-gray-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className={clsx('text-sm transition-colors duration-200', activeTab === item.name ? 'text-primary-400' : 'text-gray-400 hover:text-white')}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
