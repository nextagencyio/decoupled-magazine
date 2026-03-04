'use client'

import Link from 'next/link'
import Header from './Header'
import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import CTASection from './CTASection'
import ErrorBoundary from './ErrorBoundary'

interface HomepageRendererProps {
  homepageContent: any
}

export default function HomepageRenderer({ homepageContent }: HomepageRendererProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ErrorBoundary><HeroSection homepageContent={homepageContent} /></ErrorBoundary>
      <ErrorBoundary><StatsSection homepageContent={homepageContent} /></ErrorBoundary>
      <ErrorBoundary><CTASection homepageContent={homepageContent} /></ErrorBoundary>

      <footer className="bg-white border-t border-primary-200 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-primary-500">
          <p>&copy; {new Date().getFullYear()} Studio Desk. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-primary-900 transition-colors">About</Link>
            <Link href="/services" className="hover:text-primary-900 transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-primary-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
