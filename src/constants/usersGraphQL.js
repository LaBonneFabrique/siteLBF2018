import gql from 'graphql-tag'

export const LISTE_USERS = gql`
query listUsers{allProfils 
{
  id
  nom
  prenom
  email
  user {
    id
    email
    qf
    role
  }
}}
`

export const LISTE_ADHERENT = gql`
query listeAdherents{allUsers
{
 id
 role
 profil {
   id
   nom
   prenom
   email
 }
}
}
`
