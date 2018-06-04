import gql from 'graphql-tag'

export const AJOUT_INSCRIPTION = gql`
mutation ajoutInscription($atelierId: String!, $membreId: String!) {
    createInscription(membreId: $membreId, atelierId: $atelierId){id}
}
`

export const LISTE_INSCRIPTION = gql`
query listeInscription($membreId: String!) {allInscriptions(filter: {membreId: $membreId}) {
    id
    membreId
    atelierId
}}
`

export const LISTE_INSCRIPTION_BY_ATELIER = gql`
query listeInscription($atelierId: String!) {allInscriptions(filter: {atelierId: $atelierId}) {
    id
    membreId
    atelierId
}}
`

export const LES_INSCRIPTIONS = gql`
query lesInscriptions {allInscriptions {
   id
    membreId
    atelierId
}}
`

export const EFFACE_LISTE_INSCRIPTION = gql`
mutation effaceInscriptions($id: ID!) {deleteInscription(id: $id) {id}}
`

export const GET_INSCRIPTION_BY_MEMBRE = gql`
query listeInscriptionMembre ($mId: String!) {
  allInscriptions(filter: {membreId: $mId}) {
    id
    activite {
      id
      titreActivite
      section
      lieuActivite
      description
      illustration
      prix
      dateDebut
      dateFin
      tags
    }
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
