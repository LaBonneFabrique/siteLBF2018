import gql from 'graphql-tag'

export const GET_BILAN = gql`
query illusBilan($idAtelier: String!) {
  allBilanAteliers(filter: {idAtelier: $idAtelier}) {
    bilan
    listeIllus
    id
    illuMail
  }
}
`

export const ADD_BILAN = gql`
mutation ajoutBilan($idAtelier: String!, $bilan: String!, $illuMail: String!, $listeIllus: [Json!]!) {
  createBilanAtelier(bilan: $bilan, listeIllus: $listeIllus, illuMail: $illuMail, idAtelier: $idAtelier) {id}
}
`

export const MAJ_BILAN = gql`
mutation majBilan($id: ID!, $idAtelier: String!, $bilan: String!, $illuMail: String!, $listeIllus: [Json!]!) {
  updateBilanAtelier(id: $id, bilan: $bilan, listeIllus: $listeIllus, illuMail: $illuMail, idAtelier: $idAtelier) {id}
}
`

export const DELETE_BILAN = gql`
mutation effaceBilan($id: ID!) {
  deleteBilanAtelier(id: $id) {id}
}
`
