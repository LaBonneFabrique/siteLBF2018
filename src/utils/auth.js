import { Cookies } from 'quasar'
import { SIGNUP, AUTHENTIFICATION, FIND_USER_ROLE, MAJ_USER_PROFIL, FIND_COMPLETE_USER_BY_ID } from '../graphQL/userAuth'

export var authMixins = {
  methods: {
    isLoggedIn () {
      return Cookies.has('token')
      // return LocalStorage.has('token')
    },
    loggedInUser () {
      return Cookies.get('token')
    },
    userRoles (id) {
      return this.$apollo.query({
        query: FIND_USER_ROLE,
        fetchPolicy: 'network-only',
        variables: {
          id: id
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
      })
    },
    getUserInfo (id) {
      return this.$apollo.query({
        query: FIND_COMPLETE_USER_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          id: id
        }
      })
    },
    async commitUser () {
      let zeUser = await this.getUser()
      this.$store.user = Object.assign({}, zeUser)
    },
    async getUser () {
      let userLeData = {id: await this.$q.cookies.get('token')}
      await this.getUserInfo(userLeData.id).then((retour) => {
        userLeData.profil = retour.data.allUsers[0].profil
        userLeData.email = retour.data.allUsers[0].email
        userLeData.qf = retour.data.allUsers[0].qf
        userLeData.isAdmin = retour.data.allUsers[0].role.indexOf('Admin') >= 0
      }).catch((error) => console.log('erreur of getUserInfo', error))
      return userLeData
    },
    async signup (email, pwd, nom, prenom) {
      let id = 'bibi'
      let profil = [{
        nom,
        prenom,
        email
      }]
      await this.$apollo.mutate({
        mutation: SIGNUP,
        variables: {
          email: email,
          password: pwd
        }
      }).then((data) => {
        id = data.data.signupUser.id
        this.$apollo.mutate({
          mutation: MAJ_USER_PROFIL,
          variables: {
            id: data.data.signupUser.id,
            profil: profil,
            role: ['Utilisateur']
          }
        }).then()
      })
      return id
    },
    logout (cb) {
      this.$q.cookies.remove('token')
      if (cb) cb()
    },
    getMail (profil) {
      return profil[0].email
    }
  }
}
