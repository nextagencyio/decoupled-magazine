'use client'


interface StatsSectionProps {
  homepageContent: any
}

export default function StatsSection({ homepageContent }: StatsSectionProps) {
  const stats = (homepageContent as any)?.stats || (homepageContent as any)?.statsItems || []
  if (!stats || stats.length === 0) return null

  return (
    <section className="bg-primary-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-wrap items-center justify-start gap-x-2 text-sm text-gray-400">
            {stats.map((stat: any, i: number) => (
              <span key={stat.id || i} className="flex items-center gap-x-2">
                {i > 0 && <span className="text-gray-700">/</span>}
                <span className="font-display font-bold text-white">{stat.value || stat.statValue || stat.number}</span>
                <span>{stat.label || stat.statLabel || stat.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
