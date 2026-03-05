'use client'


interface HeroSectionProps {
  homepageContent: any
}

export default function HeroSection({ homepageContent }: HeroSectionProps) {
  const title = (homepageContent as any)?.heroTitle || (homepageContent as any)?.title || 'Meridian'
  const subtitle = (homepageContent as any)?.heroSubtitle || 'Where Ideas Converge'

  return (
    <section className="relative overflow-hidden py-36 md:py-52">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=2000&q=80&fit=crop"
          alt="Magazine layout desk"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/80 to-primary-950" />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display text-7xl md:text-9xl font-bold tracking-tight text-white leading-[0.85] mb-6">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  )
}
