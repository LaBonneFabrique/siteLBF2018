import gql from 'graphql-tag'

export const SAVE_NEWS = gql`
mutation ajoutNews(
  $titreActivite: String!,
  $section: String!,
  $dateDebut: DateTime!,
  $description: String!,
  $illustration: String!,
  $publie: Boolean!,
  $tags: [Json!],
  $type: Types!
) 
{
  createActivite(
    titreActivite: $titreActivite,
    section: $section,
    description: $description,
    illustration: $illustration,
    publie: $publie,
    tags: $tags,
    type: $type,
    dateDebut: $dateDebut
  ) {
    id
  }
}
`

export const READ_NEWS = gql`
query lireNews($id:ID!) {
    allActivites(filter: {id: $id}) {
      titreActivite,
      section,
      description,
      illustration,
      publie,
      tags
    }
}
`

export const UPDATE_NEWS = gql`
mutation modifieNews(
  $id: ID!,
  $titreActivite: String!,
  $section: String!,
  $dateDebut: DateTime!,
  $description: String!,
  $illustration: String!,
  $publie: Boolean!,
  $tags: [Json!],
  $type: Types!
) 
{
  updateActivite(
    id: $id
    titreActivite: $titreActivite,
    section: $section,
    description: $description,
    illustration: $illustration,
    publie: $publie,
    tags: $tags,
    type: $type,
    dateDebut: $dateDebut
  ) {
    id
  }
}
`

export const LISTE_NEWS = gql`
query listeAteliersNonPublies {
  allActivites (filter: {type: Infos}) {
    id
    idCycle
    titreActivite
    description
    lieuActivite
    illustration
    publie
    prix
    dateDebut
    dateFin
    idGoogleEvent
    sequenceEvent
  }
}
`

export const EFFACE_NEWS = gql`
mutation effaceNews($id: ID!) {
  deleteActivite(id:$id) {
    id
  }
}
`

export const UPDATE_NEWS_PUBLIE = gql`
mutation modifieNews($id: ID!, $publie: Boolean!) {
 updateActivite(id: $id, publie: $publie) {
   id
 }
}
`
