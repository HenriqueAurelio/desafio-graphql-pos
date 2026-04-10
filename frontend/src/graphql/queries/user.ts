import { gql } from '@apollo/client/core'

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`
