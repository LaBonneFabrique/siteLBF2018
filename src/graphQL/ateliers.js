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
  }
}
`
