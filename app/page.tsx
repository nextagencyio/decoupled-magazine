import { headers } from 'next/headers'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_ALL_POSTS, transformPost } from '@/lib/queries'
import { PostCard } from './components/PostCard'
import { SetupGuide } from './components/SetupGuide'
import { AlmostThere } from './components/AlmostThere'
import Header from './components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, Lock, Unlock } from 'lucide-react'
import { isDemoMode, getMockPosts } from '@/lib/demo-mode'

// Check which env vars are missing
function getMissingEnvVars(): { drupal: string[]; stripe: string[] } {
  const drupal: string[] = []
  const stripe: string[] = []

  if (!process.env.DRUPAL_BASE_URL) drupal.push('DRUPAL_BASE_URL')
  if (!process.env.DRUPAL_CLIENT_ID) drupal.push('DRUPAL_CLIENT_ID')
  if (!process.env.DRUPAL_CLIENT_SECRET) drupal.push('DRUPAL_CLIENT_SECRET')
  if (!process.env.STRIPE_SECRET_KEY) stripe.push('STRIPE_SECRET_KEY')
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) stripe.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  if (!process.env.STRIPE_PRICE_ID) stripe.push('STRIPE_PRICE_ID')

  return { drupal, stripe }
}

export default async function HomePage() {
  let posts: any[] = []
  let error: string | null = null

  // Demo mode: use mock posts
  if (isDemoMode()) {
    posts = getMockPosts()
  } else {
    const missing = getMissingEnvVars()

    // Show full setup guide if Drupal is not configured
    if (missing.drupal.length > 0) {
      return <SetupGuide missingEnvVars={[...missing.drupal, ...missing.stripe]} />
    }

    // Show "Almost There" if Drupal is configured but Stripe keys are missing
    if (missing.stripe.length > 0) {
      return <AlmostThere missingStripeVars={missing.stripe} />
    }

    const requestHeaders = await headers()
    const client = getServerApolloClient(requestHeaders)

    try {
      const { data } = await client.query({
        query: GET_ALL_POSTS,
      })

      posts = (data?.nodeArticles?.nodes || [])
        .map(transformPost)
        .filter(Boolean)
    } catch (e: any) {
      console.error('Failed to fetch posts:', e)
      error = e.message
    }
  }

  const featuredPosts = posts.filter(p => p.featured)
  const leadPost = featuredPosts[0] || posts[0]
  const secondaryFeatured = featuredPosts[1] || posts[1]
  const otherPosts = posts.filter(p => p !== leadPost && p !== secondaryFeatured)

  return (
    <div className="min-h-screen bg-primary-950">
      <Header />

      {/* Full-bleed hero with lead article */}
      {leadPost && (
        <section className="relative min-h-[85vh] flex items-end">
          {/* Background image */}
          <div className="absolute inset-0">
            {leadPost.image ? (
              <Image
                src={leadPost.image.url}
                alt={leadPost.image.alt}
                fill
                className="object-cover"
                priority
                unoptimized={leadPost.image.url.includes('unsplash.com')}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/70 to-primary-950/20" />
          </div>

          {/* Hero content */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-48 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-primary-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Featured
                </span>
                <span className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {leadPost.readTime}
                </span>
              </div>
              <Link href={`/posts/${leadPost.slug}`} className="group">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight group-hover:text-primary-300 transition-colors">
                  {leadPost.title}
                </h1>
              </Link>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl leading-relaxed">
                {leadPost.excerpt.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex items-center gap-4">
                {leadPost.author && (
                  <div className="flex items-center gap-3">
                    {leadPost.author.avatar && (
                      <Image
                        src={leadPost.author.avatar.url}
                        alt={leadPost.author.name}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-white/20"
                        unoptimized={leadPost.author.avatar.url.includes('unsplash.com')}
                      />
                    )}
                    <span className="text-gray-200 font-medium">{leadPost.author.name}</span>
                  </div>
                )}
                <Link
                  href={`/posts/${leadPost.slug}`}
                  className="ml-auto inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Secondary featured + description strip */}
      <section className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {/* Magazine description */}
            <div className="py-10 md:pr-10">
              <h2 className="text-2xl font-bold text-white mb-3">Meridian Magazine</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                At the intersection of culture, technology, and design. We publish original reporting,
                essays, and visual storytelling for curious minds who want to understand the forces
                shaping our world.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-white font-bold text-lg">2.1M</span>
                  <span className="text-gray-500 ml-1.5">Monthly Readers</span>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <span className="text-white font-bold text-lg">85K+</span>
                  <span className="text-gray-500 ml-1.5">Subscribers</span>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <span className="text-white font-bold text-lg">120+</span>
                  <span className="text-gray-500 ml-1.5">Contributors</span>
                </div>
              </div>
            </div>

            {/* Secondary featured article */}
            {secondaryFeatured && (
              <Link href={`/posts/${secondaryFeatured.slug}`} className="group py-10 md:pl-10 flex gap-5">
                {secondaryFeatured.image && (
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={secondaryFeatured.image.url}
                      alt={secondaryFeatured.image.alt}
                      fill
                      className="object-cover"
                      unoptimized={secondaryFeatured.image.url.includes('unsplash.com')}
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Editor&apos;s Pick
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                    {secondaryFeatured.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{secondaryFeatured.author?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{secondaryFeatured.readTime}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">Failed to load posts: {error}</p>
          </div>
        </div>
      )}

      {/* Latest articles grid */}
      {otherPosts.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
              <Link
                href="/news"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Read Without Limits</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Meridian subscribers get unlimited access to all articles, exclusive longform features,
            and our weekly digital edition delivered to their inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-lg shadow-primary-500/25"
            >
              Start Your Subscription
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium transition-colors"
            >
              Read Free Articles
            </Link>
          </div>
        </div>
      </section>

      {posts.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No posts yet. Import sample content with:
          </p>
          <code className="text-primary-400 text-sm mt-2 block">
            npm run setup-content
          </code>
        </div>
      )}
    </div>
  )
}
