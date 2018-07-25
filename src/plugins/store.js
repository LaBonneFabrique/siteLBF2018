// import something here
import VueStash from 'vue-stash'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueStash)
  app.data = {
    store: {
      user: {
        id: 'huhu',
        email: 'bob@bobby.fr',
        qf: 3000,
        isAdmin: false,
        profil: []
      },
      estIdentifie: false
    }
  }
}
