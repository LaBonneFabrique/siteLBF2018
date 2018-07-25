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
query listeActivites($aujourdhui: DateTime!) {
  allActivites(orderBy: dateDebut_ASC, filter: {publie: true, dateDebut_gte: $aujourdhui}) {
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
    inscriptions {
      id
      mail
      participant
      dateUID
    }
  }
}
`

export const QUERY_ACTIVITE_BY_ID = gql`
query uneActivite($id: ID!) {
  allActivites(filter: {id: $id}) {
    id
    titreActivite
    section
    lieuActivite
    description
    illustration
    prix
    publie
    dates
    inscriptions {
      id
      dateUID
      participant
      mail
      profils {
        id
      }
    }
  }
}
`
