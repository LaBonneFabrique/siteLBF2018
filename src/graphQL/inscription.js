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

export const CONNECT_ACTIVITE_INSCRIPTION = gql`
mutation connectActiviteInscription($aId: ID!, $iId: ID!) {
  addToInscriptionsActivites(
    inscriptionsInscriptionId: $iId
    activiteActiviteId: $aId
  ) {
    activiteActivite {
      id
    }
    inscriptionsInscription {
      id
    }
  }
}
`

export const AJOUT_INSCRIPTION_UID = gql`
mutation addInscription($participant: String!, $mail: String!, $dateUID: String!) {
  createInscription(
  participant: $participant
  mail: $mail
  dateUID: $dateUID
  ) {
    id
  }
}
`

export const AJOUT_INSCRIPTION_NO_UID = gql`
mutation addInscription($participant: String!, $mail: String!) {
  createInscription(
  participant: $participant
  mail: $mail
  ) {
    id
  }
}
`
