import gql from 'graphql-tag'

export const SIGNUP = gql`
mutation ajoutUtilisateur($email:String!, $password: String!) {
  signupUser(email: $email, password: $password) {
    id
    token
  }
}
`

export const UPDATE_MDP = gql`
mutation majMDP($id: ID!, $password: String!) {
  majpw(id:$id, password: $password) {
    id
    token
  }
}
`

export const CHECK_MDP = gql`
mutation checkMDP($id: ID!, $password: String!) {
  checkpw(id: $id, password: $password) {
    checkPw
  }
}
`

export const LISTE_USERS = gql`
query listeUser{allUsers{id email password}}
`

export const AUTHENTIFICATION = gql`
mutation signin($email: String!, $password: String!) {
  authenticateUser(email: $email, password: $password) {
    id
    token
  }
}
`

export const FIND_USER_ROLE = gql`
query trouveUserRole($id: ID!) {
  allUsers(filter: {id: $id}) {
    role
  }
}
`

export const FIND_EMAIL = gql`
query trouveEmail($email: String!) {
  allUsers(filter: {email: $email}) {
    id
    profil {
      prenom
    }
  }
}
`

export const FIND_USER_BY_ID = gql`
query trouveUser($id: ID!) {
  allUsers(filter: {id: $id}) {
    id
    email
    qf
    role
    profil {
      id
      nom
      prenom
      email
      dateNaissance
      badges
    }
  }
}
`

export const FIND_USER_BY_ID_EMAIL = gql`
query trouveUserByMail($id: ID!) {
  allUsers(filter: {id: $id}) {
    id
    email
    profil {
      prenom
    }
  }
}
`

export const MAJ_USER_QF = gql`
mutation majUserQF($id: ID!, $qf: Int!) {
  updateUser(id: $id, qf: $qf) {id}
}
`

export const MAJ_USER_PROFIL = gql`
mutation majUserProfilRoles($id: ID!, $profil: [UserprofilProfil!]!, $role: [Roles!]) {
  updateUser(id: $id, profil: $profil, role: $role) {id}
}
`

export const ADD_MEMBRE = gql`
mutation ajoutMembre ($nom: String!, $prenom: String!, $email: String, $dateNaissance: String) {
  createProfil(nom: $nom, prenom: $prenom, email: $email, dateNaissance: $dateNaissance) {
    id
  }
}
`

export const MAJ_MEMBRE = gql`
mutation majMembre ($id: ID!, $nom: String!, $prenom: String!, $email: String, $dateNaissance: String) {
  updateProfil(id:$id, nom: $nom, prenom: $prenom, email: $email, dateNaissance: $dateNaissance) {
    id
  }
}
`

export const CONNECT_MEMBRE = gql`
mutation connexionMembre($userId: ID!, $membreId: ID!) { 
  addToProfilUsers(userUserId: $userId, profilProfilId: $membreId) {
    profilProfil {
      id
    }
    userUser {
      id
    }
  }
}
`

export const EFFACE_MEMBRE = gql`
mutation effacerMembre($id: ID!) {
  deleteProfil(id: $id){id}
}
`

export const MAJ_MEMBRE_ATELIERS = gql`
mutation majMembreAteliers ($membreId: ID!, $ateliers: [String!]!) {updateProfil(id: $membreId, ateliers: $ateliers) {id}}
`

export const EFFACER_USER = gql`
mutation effacerCompte($id: ID!) {
  deleteUser(id: $id) {
    id
  }
}
`

export const MAJ_MEMBRE_ROLE = gql`
mutation majMembre ($id: ID!, $role: [Roles!]) {
  updateUser(id:$id, role: $role) {
    id
  }
}
`

export const RESET_MDP_TOKEN = gql`
mutation creationToken(
    $userId: String!,
    $validity: DateTime!
  ) {
  createResetMDP(
    userId: $userId,
    validity: $validity
  ) {
    id
  }
}
`

export const VERIF_TOKEN = gql`
query recupID($userId: String!, $tokenId: ID!) {
  allResetMDPs(filter: {AND: [{userId: $userId}, {id: $tokenId}]}) {
    id
    validity
  }
}
`

export const EFFACE_TOKEN = gql`
mutation effaceToken($id: ID!) {
  deleteResetMDP(id: $id) {
    id
  }
}
`
