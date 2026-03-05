/**
 * Demo Mode Module
 *
 * This file contains ALL demo/mock mode functionality.
 * To remove demo mode from a real project:
 * 1. Delete this file (lib/demo-mode.ts)
 * 2. Delete the data/mock/ directory
 * 3. Delete app/components/DemoModeBanner.tsx
 * 4. Remove DemoModeBanner from app/layout.tsx
 * 5. Remove the demo mode check from app/api/graphql/route.ts
 */

import homepageData from '@/data/mock/homepage.json'
import articlesData from '@/data/mock/articles.json'
import columnsData from '@/data/mock/columns.json'
import contributorsData from '@/data/mock/contributors.json'
import routesData from '@/data/mock/routes.json'

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
}

const mockDataMap: Record<string, any> = {
  'homepage.json': homepageData,
  'articles.json': articlesData,
  'columns.json': columnsData,
  'contributors.json': contributorsData,
  'routes.json': routesData,
}

function loadMockData(filename: string): any {
  return mockDataMap[filename] || null
}

export function handleMockQuery(body: string): any {
  try {
    const { query, variables } = JSON.parse(body)

    if (variables?.path) {
      const routePath = variables.path
      const routes = loadMockData('routes.json')
      if (routes && routes[routePath]) {
        return routes[routePath]
      }
    }

    if (query.includes('GetHomepageData') || query.includes('nodeHomepages')) {
      return loadMockData('homepage.json')
    }

    if (query.includes('GetArticles') || query.includes('nodeArticles')) {
      return loadMockData('articles.json')
    }

    if (query.includes('GetColumns') || query.includes('nodeColumns')) {
      return loadMockData('columns.json')
    }

    if (query.includes('GetContributors') || query.includes('nodeContributors')) {
      return loadMockData('contributors.json')
    }

    return { data: {} }
  } catch (error) {
    console.error('Mock query error:', error)
    return { data: {}, errors: [{ message: 'Mock data error' }] }
  }
}

// Auto-generated helper exports for custom app files

export function getMockPosts(): any[] {
  const nodes = articlesData?.data?.nodeArticles?.nodes || []

  return nodes.map((node: any) => {
    const slug = node.path?.replace(/^\/articles\//, '') || node.id
    const publishedAt = node.created?.time
      || (node.publishDate?.timestamp
        ? new Date(node.publishDate.timestamp * 1000).toISOString()
        : new Date().toISOString())

    return {
      id: node.id,
      title: node.title,
      slug,
      excerpt: node.body?.summary || '',
      body: node.body?.processed || '',
      publishedAt,
      readTime: node.readTime || '5 min read',
      featured: node.featured ?? false,
      image: node.image ? {
        url: node.image.url,
        alt: node.image.alt || node.title,
        width: node.image.width || 1200,
        height: node.image.height || 630,
      } : undefined,
      author: {
        name: node.authorName || 'Meridian Editorial',
        avatar: node.authorAvatar ? {
          url: node.authorAvatar.url,
          alt: node.authorAvatar.alt || node.authorName,
        } : undefined,
      },
    }
  })
}
