import gql from 'graphql-tag'

export const LISTE_ATELIERS = gql`
query listeAteliers {
  allActivites (filter: {type: Ateliers}) {
    id
    titreActivite
    description
    lieuActivite
    illustration
    publie
    prix
    dates
    inscriptions {
      id
    }
  }
}
`

export const QUERY_ALL_ACTIVITES_ASC = gql`
query listeActivites($aujourdhui: DateTime!) {
  allActivites(orderBy: dateDebut_ASC, filter: {dateDebut_gte: $aujourdhui}) {
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
export const QUERY_ACTIVITES_PUBLIEES_ASC = gql`
query listeActivites($aujourdhui: DateTime!) {
  allActivites(orderBy: dateDebut_ASC, filter: {publie: true, dateDebut_gte: $aujourdhui}) {
    id
    titreActivite
    checkInscription
    description
    section
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
      profils {
        id
      }
    }
  }
}
`

export const ARCHIVES_DESC = gql`
query listeActivites($aujourdhui: DateTime!) {
  allActivites(orderBy: dateDebut_DESC, filter: {publie: true, dateDebut_lte: $aujourdhui}) {
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
