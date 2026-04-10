import { gql } from '@apollo/client/core'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions {
    listTransactions {
      id
      name
      amount
      type
      date
      categoryId
    }
  }
`

export const LIST_TRANSACTIONS_PAGINATED = gql`
  query ListTransactionsPaginated($filter: ListTransactionsFilterInput!, $pagination: PaginationInput!) {
    listTransactionsPaginated(filter: $filter, pagination: $pagination) {
      data {
        id
        name
        amount
        type
        date
        categoryId
      }
      total
      page
      pageSize
      totalPages
    }
  }
`
