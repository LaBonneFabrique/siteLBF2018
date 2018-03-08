import gql from 'graphql-tag'

export const LES_TAGS = gql`
query lesTags{allTags{id nom}}
`

export const SAVE_TAGS = gql`
mutation saveTags($nom: String!) {
  createTag(nom: $nom) {
      id
  }
}
`
