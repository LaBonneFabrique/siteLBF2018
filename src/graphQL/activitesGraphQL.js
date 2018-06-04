import gql from 'graphql-tag'

export const QUERY_ALL_ACTIVITES = gql`
query listeActivites {
  allActivites {
    id
    titreActivite
    description
    checkInscription
    checkInscriptionCycle
    illustration
    publie
    dates
    dateDebut
    prix {
      id
    }
    inscriptions {
      id
      membreId
      atelierId
    }
    nbMaxTotalParticipants
  }
}
`

export const QUERY_ALL_ACTIVITES_ASC = gql`
query listeActivites {
  allActivites(orderBy: dateDebut_ASC, filter: {publie: true}) {
    id
    titreActivite
    description
    section
    checkInscription
    lieuActivite
    illustration
    publie
    prix
    dates
    dateDebut
    maxParticipants
    type
  }
}
`
