import { LocalStorage } from 'quasar'

export default {
  loggedIn () {
    return !!LocalStorage.has('token')
  },
  loggedInUser () {
    return LocalStorage.get.item('idUser')
  },
  hasLoggedUser () {
    return !!LocalStorage.has('idUser')
  },
  isAdmin () {
    let roles = LocalStorage.get.item('roles')
    if (roles.indexOf('Admin') >= 0) {
      return true
    } else {
      return false
    }
  }
}
