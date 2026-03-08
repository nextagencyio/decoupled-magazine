import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { isDemoMode, handleMockQuery } from './demo-mode'

function getServerBaseUrl(): string {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, '')
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  const port = process.env.PORT || '3000'
  const host = process.env.HOST || 'localhost'
  return `http://${host}:${port}`
}

function getGraphqlUri(): string {
  if (typeof window !== 'undefined') {
    return '/api/graphql'
  }
  return `${getServerBaseUrl()}/api/graphql`
}

async function fetchGraphql(
  uri: RequestInfo | URL,
  options?: RequestInit,
  withTags = false
): Promise<Response> {
  if (typeof window === 'undefined' && isDemoMode()) {
    const body = typeof options?.body === 'string' ? options.body : '{}'
    return new Response(JSON.stringify(handleMockQuery(body)), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (withTags) {
    return fetch(uri, { ...options, next: { tags: ['drupal'] } } as RequestInit)
  }

  return fetch(uri, options)
}

let browserClient: ApolloClient<any> | null = null

export function getServerApolloClient(requestHeaders: Headers): ApolloClient<any> {
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http'
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  const host = forwardedHost || requestHeaders.get('host') || 'localhost:3000'
  const origin = `${protocol}://${host}`

  const httpLink = createHttpLink({
    uri: `${origin}/api/graphql`,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })
}

const httpLink = createHttpLink({
  uri: getGraphqlUri(),
  fetch: (uri: RequestInfo | URL, options?: RequestInit) => fetchGraphql(uri, options),
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }
})

const client = typeof window !== 'undefined'
  ? (browserClient || (browserClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })))
  : new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })

export default client
