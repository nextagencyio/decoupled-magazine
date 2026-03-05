'use client'


interface HeroSectionProps {
  homepageContent: any
}

export default function HeroSection({ homepageContent }: HeroSectionProps) {
  const title = (homepageContent as any)?.heroTitle || (homepageContent as any)?.title || 'Clear Thinking. Clean Execution.'
  const subtitle = (homepageContent as any)?.heroSubtitle || ''

  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=2000&q=80&fit=crop"
          alt="Magazine layout desk"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/80 to-primary-800/65" />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.9]">{title}</h1>
        {subtitle && <p className="text-lg text-primary-100 mt-8 max-w-xl">{subtitle}</p>}
      </div>
    </section>
  )
}
