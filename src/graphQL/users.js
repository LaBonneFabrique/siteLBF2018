import gql from 'graphql-tag'

export const LISTE_ADHERENTS = gql`
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
