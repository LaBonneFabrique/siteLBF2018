import gql from 'graphql-tag'

export const QUERY_ACTIVITE_BY_ID = gql`
query singleActivite($id: ID!) {
  allActivites(filter: {id: $id}) {
    id
    idCycle
    titreActivite
    section
    checkInscription
    checkInscriptionCycle
    lieuActivite
    description
    illustration
    prix
    publie
    dates
    dateDebut
    maxParticipants
    inscriptions {
      id
      participant
      mail
      dateUID
    }
  }
}
`

export const UPDATE_ACTIVITE = gql`
mutation modifieActivite(
  $id: ID!,
  $titreActivite: String!,
  $section: String!,
  $checkInscription: Boolean!,
  $checkInscriptionCycle: Boolean,
  $lieuActivite: String!,
  $description: String!,
  $illustration: String!,
  $prix: [Json!]!,
  $publie: Boolean!,
  $dates: [Json!],
  $maxParticipants: Int!
  $dateDebut: DateTime
  )
  {
    updateActivite(
      id: $id,
      titreActivite: $titreActivite,
      section: $section,
      checkInscription: $checkInscription,
      checkInscriptionCycle: $checkInscriptionCycle,
      lieuActivite: $lieuActivite,
      description: $description,
      illustration: $illustration,
      prix: $prix,
      publie: $publie,
      dates: $dates,
      maxParticipants: $maxParticipants,
      dateDebut: $dateDebut
    ) 
  {
   id
 }
}
`

export const ADD_ACTIVITE = gql`
mutation ajoutActivite(
  $titreActivite: String!,
  $section: String!,
  $checkInscription: Boolean!,
  $checkInscriptionCycle: Boolean,
  $lieuActivite: String!,
  $description: String!,
  $illustration: String!,
  $prix: [Json!]!,
  $publie: Boolean!,
  $dates: [Json!],
  $type: Types!,
  $maxParticipants: Int!,
  $dateDebut: DateTime
) 
{
  createActivite(
    titreActivite: $titreActivite,
    section: $section,
    checkInscription: $checkInscription,
    checkInscriptionCycle: $checkInscriptionCycle,
    lieuActivite: $lieuActivite,
    description: $description,
    illustration: $illustration,
    prix: $prix,
    publie: $publie,
    dates: $dates,
    type: $type,
    maxParticipants: $maxParticipants,
    dateDebut: $dateDebut
  ) {
    id
  }
}
`

export const UPDATE_ACTIVITE_PUBLIE = gql`
mutation modifieActivite($id: ID!, $publie: Boolean!, $dates: [Json!]) {
 updateActivite(id: $id, publie: $publie, dates: $dates) {
   id
 }
}
`

export const EFFACE_ACTIVITE = gql`
mutation effaceActivite($id: ID!) {
  deleteActivite(id:$id) {
    id
  }
}
`
