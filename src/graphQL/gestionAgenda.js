import gql from 'graphql-tag'

export const ADD_AGENDA = gql`
query addEve($dataEvents: [Json!]) {addAgenda(dataEvents: $dataEvents) {
    retour
}
}
`

export const REMOVE_AGENDA = gql`
query remoevEve($uids: [String!]) {removeAgenda(uids: $uids) {retour}}
`
