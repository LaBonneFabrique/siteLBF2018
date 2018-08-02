import gql from 'graphql-tag'

export const SAVE_ABONNEMENT = gql`
mutation nouvelAbonnement($email: String!, $nom: String!, $prenom: String!, $abonnement: [String!]!){createAbonne(email: $email, nom: $nom, prenom: $prenom, abonnement: $abonnement){id}}
`

export const LOAD_ABONNEMENTS = gql`
query lesAbonnements($email: String!){
    allAbonnes(filter: {email: $email}) {
      id
      email
      nom
      prenom
      abonnement
    }
}
`

export const EFFACER_ABONNEMENTS = gql`
mutation effacerAbonnements($id: ID!) {
  deleteAbonne(id: $id) {id}
}
`

export const MAJ_ABONNEMENTS = gql`
mutation majAbonnements($id: ID!, $email: String!, $nom: String!, $prenom: String!, $abonnement: [String!]!){
  updateAbonne(id: $id, email: $email, nom: $nom, prenom: $prenom, abonnement: $abonnement) {
    id
  }
}
`

export const TOUS_ABONNES = gql`
query tousAbonnes{
  allAbonnes {
    id
    email
    prenom
    abonnement
  }
}
`

export const SAVE_MAIL_DIFFUSION = gql`
mutation saveMailDiffusion($titre: String!, $texte: String!, $conclusion: String!, $estEnvoye: Boolean!, $listesDiffusion: [String!]!, $mailHtml: String!) {
  createDiffusionEmail(titre: $titre, texte: $texte, conclusion: $conclusion, estEnvoye: $estEnvoye, listesDiffusion: $listesDiffusion, mailHtml: $mailHtml) {
    id
  }
}
`

export const CONNECT_ACTIVITE_DIFFUSION = gql`
mutation connectActiviteMailDiffusion($aId: ID!, $mId: ID!) {
  addToActivitesDiffusion(
    diffusionEmailsDiffusionEmailId: $mId
    activitesActiviteId: $aId
  ) {
    activitesActivite {
      id
    }
    diffusionEmailsDiffusionEmail {
      id
    }
  }
}
`

export const GET_MAILDIFFUSION_BY_ID = gql`
query leMailDiffusion($id: ID!) {
  allDiffusionEmails(filter: {id: $id}) {
    titre
    texte
    conclusion
    estEnvoye
    listesDiffusion
    activites {
      id
      lieuActivite
      titreActivite
      illustration
      prix
      description
      section
      dates
      dateDebut
    }
  }
}
`

export const GET_MAILDIFFUSION_HTML_BY_ID = gql`
query htmlLettreDiffusion($id: ID!) {
  allDiffusionEmails(filter: {id: $id}) {
    id
    mailHtml
  }
}
`

export const DELETE_MAILDIFFUSION = gql`
mutation deleteMailDiffusion($id: ID!) {
  deleteDiffusionEmail(id: $id) {
    id
  }
}
`

export const LISTE_LETTRES = gql`
query listeLettres {
  allDiffusionEmails(orderBy: updatedAt_DESC) {
    id
    titre
    estEnvoye
    listesDiffusion
  }
}
`
