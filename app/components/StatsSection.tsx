'use client'


interface StatsSectionProps {
  homepageContent: any
}

export default function StatsSection({ homepageContent }: StatsSectionProps) {
  const stats = (homepageContent as any)?.stats || (homepageContent as any)?.statsItems || []
  if (!stats || stats.length === 0) return null

  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-primary-200 py-8">
          <div className="flex flex-wrap items-center justify-start gap-x-2 text-sm text-primary-400">
            {stats.map((stat: any, i: number) => (
              <span key={stat.id || i} className="flex items-center gap-x-2">
                {i > 0 && <span className="text-primary-300">/</span>}
                <span className="font-display font-bold text-primary-900">{stat.value || stat.statValue}</span>
                <span>{stat.label || stat.statLabel || stat.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
