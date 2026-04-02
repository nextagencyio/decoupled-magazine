/**
 * Drupal client singleton using decoupled-client.
 *
 * Usage:
 *   import { getClient } from '@/lib/drupal-client'
 *   const client = getClient()
 *   const page = await client.getEntryByPath('/about')
 */

import { createClient } from 'decoupled-client'
import type { TypedClient } from '@/schema/client'
import { isDemoMode, handleMockQuery } from './demo-mode'

let _client: TypedClient | null = null
let _mockClient: TypedClient | null = null

function createMockTypedClient(): TypedClient {
  if (_mockClient) return _mockClient

  _mockClient = {
    async getEntries() { return [] },
    async getEntry() { return null },
    async getEntryByPath(path) {
      // For homepage, return the first homepage node from mock data
      if (!path || path === '/') {
        const result = handleMockQuery(JSON.stringify({
          query: 'GetHomepageData nodeHomepages',
          variables: {}
        }))
        return result?.data?.nodeHomepages?.nodes?.[0] || null
      }
      // For other paths, try route lookup
      const result = handleMockQuery(JSON.stringify({
        query: 'route',
        variables: { path }
      }))
      return result?.data?.route?.entity || null
    },
    async raw(query, variables) {
      return handleMockQuery(JSON.stringify({ query: typeof query === 'string' ? query : '', variables }))
    },
  } as TypedClient

  return _mockClient
}

export function getClient(): TypedClient {
  if (isDemoMode()) {
    return createMockTypedClient()
  }

  if (_client) return _client

  let createTypedClient: ((base: any) => TypedClient) | null = null
  try {
    createTypedClient = require('@/schema/client').createTypedClient
  } catch {
    // schema/client.ts not generated yet
  }

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  const clientId = process.env.DRUPAL_CLIENT_ID
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error('Missing Drupal credentials. Set NEXT_PUBLIC_DRUPAL_BASE_URL, DRUPAL_CLIENT_ID, DRUPAL_CLIENT_SECRET.')
  }

  const base = createClient({
    baseUrl,
    clientId,
    clientSecret,
    fetch: ((input: RequestInfo | URL, init?: RequestInit) =>
      globalThis.fetch(input, {
        ...init,
        next: { tags: ['drupal'] },
      } as RequestInit)) as typeof globalThis.fetch,
  })

  if (createTypedClient) {
    _client = createTypedClient(base)
  } else {
    _client = {
      async getEntries() { return [] },
      async getEntry() { return null },
      async getEntryByPath(path) {
        return base.queryByPath(path, `
          query ($path: String!) {
            route(path: $path) {
              ... on RouteInternal {
                entity { ... on NodePage { __typename id title path body { processed } } }
              }
            }
          }
        `)
      },
      async raw(query, variables) { return base.query(query, variables) },
    } as TypedClient
  }

  return _client
}
