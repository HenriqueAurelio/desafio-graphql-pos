import { gql } from '@apollo/client/core'

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategory {
      id
      title
      description
      color
      icon
    }
  }
`
