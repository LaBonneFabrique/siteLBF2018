import gql from 'graphql-tag'

export const LISTE_ATELIERS = gql`
query listeAteliers {
  allActivites (filter: {type: Ateliers}) {
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
