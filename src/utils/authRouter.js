import { LocalStorage, Cookies } from 'quasar'
import { FIND_USER_ROLE2 } from '../graphQL/userAuth'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import { graphCoolURI } from '../constants/graphCoolURI'
const httpLink = new HttpLink({ uri: graphCoolURI })

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

export default {
  loggedIn () {
    return !!Cookies.has('token')
  },
  loggedInUser () {
    return Cookies.get('token')
  },
  hasLoggedUser () {
    return !!LocalStorage.has('idUser')
  },
  userRoles (id) {
    return apolloProvider.defaultClient.query({
      query: FIND_USER_ROLE2,
      fetchPolicy: 'network-only',
      variables: {
        id: id
      }
    })
  },
  async isAdmin () {
    let leRetour = false
    if (this.loggedIn()) {
      let id = await Cookies.get('token')
      await this.userRoles(id).then((retour) => {
        if (retour.data.allUsers[0].role.indexOf('Admin') >= 0) {
          leRetour = true
        }
      })
    }
    return leRetour
  }
}
