import { gql } from '@apollo/client/core'

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      title
      description
      color
      icon
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      id
      title
      description
      color
      icon
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`
