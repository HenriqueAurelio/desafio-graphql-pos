import { ApolloClient, InMemoryCache, Observable } from '@apollo/client/core'
import { ApolloLink } from '@apollo/client/link'
import { HttpLink } from '@apollo/client/link/http'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000'}/graphql`,
  credentials: 'include',
})

const errorLink = new ApolloLink((operation, forward) =>
  new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (response) => {
        const isAuthError = response.errors?.some((e) =>
          e.message.toLowerCase().includes('não autenticado') ||
          e.message.toLowerCase().includes('unauthenticated'),
        )
        if (isAuthError) {
          window.dispatchEvent(new Event('auth-error'))
        }
        observer.next(response)
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    })
    return () => sub.unsubscribe()
  }),
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})
