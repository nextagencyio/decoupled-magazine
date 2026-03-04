'use client'


interface HeroSectionProps {
  homepageContent: any
}

export default function HeroSection({ homepageContent }: HeroSectionProps) {
  const title = (homepageContent as any)?.heroTitle || (homepageContent as any)?.title || 'Clear Thinking. Clean Execution.'
  const subtitle = (homepageContent as any)?.heroSubtitle || ''

  return (
    <section className="bg-white py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight text-primary-950 leading-[0.9]">{title}</h1>
        {subtitle && <p className="text-lg text-primary-400 mt-8 max-w-xl">{subtitle}</p>}
      </div>
    </section>
  )
}
