import gql from 'graphql-tag'

export const DEMINER_HTML = gql`
mutation sanitizer($texte: String!) {
    sanitize(texte: $texte) {
        sanitized
    }
}
`
