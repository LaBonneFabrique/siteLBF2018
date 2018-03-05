import { LocalStorage } from 'quasar'
import { SIGNUP, AUTHENTIFICATION, FIND_USER_ROLE, MAJ_USER_PROFIL } from '../constants/userAuth'

export var authMixins = {
  methods: {
    isLoggedIn () {
      return LocalStorage.has('token')
    },
    loggedInUser () {
      return LocalStorage.get.item('idUser')
    },
    userRoles () {
      return this.$apollo.query({
        query: FIND_USER_ROLE,
        fetchPolicy: 'network-only',
        variables: {
          id: LocalStorage.get.item('idUser')
        }
      })
    },
    login (email, pwd) {
      return this.$apollo.mutate({
        mutation: AUTHENTIFICATION,
        variables: {
          email: email,
          password: pwd
        }
      }).then((data) => {
        LocalStorage.set('idUser', data.data.authenticateUser.id)
        LocalStorage.set('token', data.data.authenticateUser.token)
      }).catch((error) => {
        console.log(error)
        throw error
      })
    },
    signup (email, pwd, nom, prenom) {
      let profil = [{
        nom,
        prenom,
        email
      }]
      return this.$apollo.mutate({
        mutation: SIGNUP,
        variables: {
          email: email,
          password: pwd
        }
      }).then((data) => {
        LocalStorage.set('idUser', data.data.signupUser.id)
        LocalStorage.set('token', data.data.signupUser.token)
        LocalStorage.set('roles', ['Utilisateur'])
        this.$apollo.mutate({
          mutation: MAJ_USER_PROFIL,
          variables: {
            id: data.data.signupUser.id,
            profil: profil,
            role: ['Utilisateur']
          }
        })
      })
    },
    logout (cb) {
      LocalStorage.remove('token')
      LocalStorage.remove('idUSer')
      if (cb) cb()
    },
    isAdmin () {
      if (!LocalStorage.has('roles')) {
        LocalStorage.clear()
        return false
      }
      let roles = LocalStorage.get.item('roles')
      if (roles.indexOf('Admin') >= 0) {
        return true
      } else {
        return false
      }
    }
  }
}
