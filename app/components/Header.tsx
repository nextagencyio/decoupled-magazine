'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { Menu, X } from 'lucide-react'

const navigationItems = [
  { name: 'Work', href: '/projects' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getActiveTab = () => {
    if (pathname === '/') return 'Home'
    for (const item of navigationItems) {
      if (item.href !== '/' && pathname.startsWith(item.href)) return item.name
    }
    return null
  }

  const activeTab = getActiveTab()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-primary-900 hover:text-accent-500 transition-colors duration-200">Studio Desk</Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href} className={clsx('text-sm transition-colors duration-200', activeTab === item.name ? 'text-accent-500' : 'text-primary-500 hover:text-primary-900')}>
                {item.name}
              </Link>
            ))}
          </nav>
          <button type="button" className="md:hidden inline-flex items-center justify-center p-1 text-primary-500 hover:text-primary-900 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className={clsx('text-sm transition-colors duration-200', activeTab === item.name ? 'text-accent-500' : 'text-primary-500 hover:text-primary-900')}>
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
