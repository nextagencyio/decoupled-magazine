'use client'

import Link from 'next/link'

interface CTASectionProps {
  homepageContent: any
}

export default function CTASection({ homepageContent }: CTASectionProps) {
  const title = (homepageContent as any)?.ctaTitle || 'Read Without Limits'
  const primaryLabel = (homepageContent as any)?.ctaPrimary || 'Start Your Subscription'

  return (
    <section className="bg-primary-950 py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-10">{title}</h2>
        <Link href="/news" className="inline-block bg-primary-500 hover:bg-primary-400 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-lg shadow-primary-500/25">{primaryLabel}</Link>
      </div>
    </section>
  )
}
