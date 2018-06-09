import gql from 'graphql-tag'

export const RECHERCHE_MAIL = gql`
query rechercheMail($mail: String!) {allInscriptions(filter: {mail: $mail}){mail participant}}
`

export const AJOUT_INSCRIPTION = gql`
mutation ajoutInscription($id: ID!, $inscriptions: [ActiviteinscriptionsInscription!]) {
  updateActivite(
    id: $id
    inscriptions: $inscriptions
  ) {
    id
  }
}
`

export const EFFACE_INSCRIPTIONS = gql`
mutation effaceInscription ($id: ID!) {
  deleteInscription(id: $id) {
    id
  }
}
`
