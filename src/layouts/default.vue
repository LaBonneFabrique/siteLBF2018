<template>

    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    :header-class="{'no-shadow': true}"
  >
  <q-layout-header class="no-shadow">
      <q-toolbar color="amber-8" inverted class="no-shadow">
        <img
          src="~assets/logoLBFpetit.png"
          style="margin-rigt: 10px;"
        />
    <q-toolbar-title>
    </q-toolbar-title>
    <q-btn
        flat inverted dense
        color="primary"
        label="filtrer"
        icon="fas fa-filter"
        class="lt-md"
        @click="changeMenuFiltre"
        >
    </q-btn>
        <menuNavigation></menuNavigation>

  </q-toolbar>
  </q-layout-header>
  <q-layout-drawer side="left" v-model="menuLayout" :content-class="['no-shadow', 'menuCadre', 'no-margin', 'no-padding']" :breakpoint="768">
      <div class="menuFiltreTitre">Filtrer par section</div>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuCowork', {'coworkActive': testFiltre('LespaceCoworking')}]" >
        <a @click="toggleFiltres('LespaceCoworking')">
      <use xlink:href="/statics/iconsLBF/coworking.svg#LespaceCoworking"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuLBF', {'lbfActive': testFiltre('LaBonneFabrique')}]" >
        <a @click="toggleFiltres('LaBonneFabrique')">
      <use xlink:href="/statics/iconsLBF/bonnefabrique.svg#LaBonneFabrique"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuBrasserie', {'brasserieActive': testFiltre('LaBrasserie')}]" >
        <a @click="toggleFiltres('LaBrasserie')">
      <use xlink:href="/statics/iconsLBF/brasserie.svg#LaBrasserie"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuJardin', {'jardinActive': testFiltre('JardinPartage')}]" >
        <a @click="toggleFiltres('JardinPartage')">
      <use xlink:href="/statics/iconsLBF/jardin.svg#JardinPartage"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuAtelier', {'atelierActive': testFiltre('Latelier')}]" >
        <a @click="toggleFiltres('Latelier')">
      <use xlink:href="/statics/iconsLBF/atelier.svg#Latelier"/>
        </a>
      </svg>
  </q-layout-drawer>
<q-page-container>
  <q-page>
      <router-view :key="$route.fullPath" :userData="userData" :mailVerifInscription="mailVerifInscription"/>
  </q-page>
</q-page-container>
<!-- les modals -->
<q-modal
  v-model="menuFiltre"
  position="left"
  :content-css="{height: '460px'}"
  >
  <q-btn
  flat inverted
  class="float-right"
  icon="fas fa-times"
  @click="menuFiltre=false"
  />
      <div class="menuFiltreTitre">Filtrer par section</div>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuCowork', {'coworkActive': testFiltre('LespaceCoworking')}]" >
        <a @click="toggleFiltres('LespaceCoworking')">
      <use xlink:href="/statics/iconsLBF/coworking.svg#LespaceCoworking"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuLBF', {'lbfActive': testFiltre('LaBonneFabrique')}]" >
        <a @click="toggleFiltres('LaBonneFabrique')">
      <use xlink:href="/statics/iconsLBF/bonnefabrique.svg#LaBonneFabrique"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuBrasserie', {'brasserieActive': testFiltre('LaBrasserie')}]" >
        <a @click="toggleFiltres('LaBrasserie')">
      <use xlink:href="/statics/iconsLBF/brasserie.svg#LaBrasserie"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuJardin', {'jardinActive': testFiltre('JardinPartage')}]" >
        <a @click="toggleFiltres('JardinPartage')">
      <use xlink:href="/statics/iconsLBF/jardin.svg#JardinPartage"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuAtelier', {'atelierActive': testFiltre('Latelier')}]" >
        <a @click="toggleFiltres('Latelier')">
      <use xlink:href="/statics/iconsLBF/atelier.svg#Latelier"/>
        </a>
      </svg>
</q-modal>

  </q-layout>
</template>

<script>
import {
  QSpinnerCircles,
  date
} from 'quasar'
const { addToDate } = date
import layoutStore from '../constants/layoutStore'
import { authMixins } from '../utils/auth'
import { validationMixin } from 'vuelidate'
import { avatarMixin } from '../utils/avatar'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import {FIND_USER_BY_EMAIL, RESET_MDP_TOKEN} from '../graphQL/userAuth'
import { mailMixins } from '../utils/envoiMail'
import menuNavigation from '../components/menuNavigation'

async function isUnique () {
  let retour = true
  console.log(this.email)
  await this.$apollo.query({
    query: FIND_USER_BY_EMAIL,
    fetchPolicy: 'network-only',
    variables: {
      email: this.email
    }
  }).then((data) => {
    console.log(data)
    if (data.data.allUsers.length > 0) retour = false
  })
  return retour
}

export default {
  mixins: [authMixins, validationMixin, mailMixins, avatarMixin],
  components: {
    menuNavigation
  },
  created () {
    this.$eventBus.$on('finVerif', () => {
      console.log('reset')
      this.mailVerifInscription = ''
    })
    this.$eventBus.$on('majUserData', (userLeData) => {
      this.userData = Object.assign({}, userLeData)
    })
    this.$eventBus.$on('majMailVerif', (majMailVerifInscription) => {
      this.mailVerifInscription = majMailVerifInscription
    })
  },
  beforeDestroy () {
    this.$eventBus.$off('finVerif')
    this.$eventBus.$off('majUserData')
    this.$eventBus.$off('majMailVerif')
  },
  data () {
    return {
      layoutStore,
      estIdentifie: this.isLoggedIn(),
      email: '',
      emailInscription: '',
      password: '',
      repeatPassword: '',
      nom: '',
      prenom: '',
      menuGauche: false,
      menuInscription: false,
      menuIdentification: false,
      modalInscription: false,
      modalConnexion: false,
      menuInscriptionAtelier: false,
      prenomRecoverMDP: '',
      menuLayout: true,
      listeFiltres: [],
      listeTypes: ['Ateliers', 'Infos', 'PetitesAnnonces'],
      menuFiltre: false,
      modalRechercheInscriptions: false,
      estAdmin: false,
      userData: {
        id: '',
        isAdmin: false,
        profil: []
      },
      mailVerifInscription: ''
    }
  },
  validations: {
    nom: {
      required
    },
    prenom: {
      required
    },
    email: {
      required,
      email
    },
    emailUnique: {
      isUnique
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  async mounted () {
    console.log('env', process.env.PROD)
    this.estIdentifie = this.isLoggedIn()
    // await this.getUser()
    // console.log(this.userData, this.estAdmin)
  },
  methods: {
    emitListeType () {
      console.log('pof, emit')
      if (this.listeTypes.length === 0) {
        this.listeTypes = ['Ateliers', 'Infos', 'PetitesAnnonces']
      }
      this.$eventBus.$emit('filtreTypes', this.listeTypes)
    },
    testFiltre (filtre) {
      return (this.listeFiltres.indexOf(filtre) >= 0 || this.listeFiltres.length === 0)
    },
    toggleFiltres (filtre) {
      let index = this.listeFiltres.indexOf(filtre)
      if (index < 0) {
        this.listeFiltres.push(filtre)
        if (this.listeFiltres.length === 5) {
          this.listeFiltres = []
        }
      } else {
        this.listeFiltres.splice(index, 1)
      }
      console.log('les filtres', this.listeFiltres)
      this.$eventBus.$emit('filtreMenu', this.listeFiltres)
    },
    async oublieMDP () {
      this.modalConnexion = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Envoie d\'un mail de récupération de mot de passe en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let uId = ''
      await this.$apollo.query({
        query: FIND_USER_BY_EMAIL,
        variables: {
          email: this.email
        }
      }).then((result) => {
        uId = result.data.allUsers[0].id
      }).catch((error) => {
        console.log(error)
        this.$q.notify({
          type: 'negative',
          timeout: 2500,
          message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
        })
      })
      if (uId !== '') {
        console.log(uId)
        let validity = addToDate(new Date(), { minutes: 20 })
        let idToken = ''
        await this.$apollo.mutate({
          mutation: RESET_MDP_TOKEN,
          variables: {
            userId: uId,
            validity: validity
          }
        }).then((result) => {
          console.log(result.data.createResetMDP)
          idToken = result.data.createResetMDP.id
        })
        if (idToken !== '') {
          console.log(idToken)
          this.envoiMailMDP(this.email, this.prenomRecoverMDP, uId, idToken).then((result) => {
            this.$q.loading.hide()
            if (result.data.sendMailgunEmail.success) {
              this.$q.notify({
                type: 'positive',
                timeout: 2500,
                message: 'Les instructions pour modifier votre mot de passe vous ont été envoyées.'
              })
            }
          }).catch((error) => {
            console.log(error)
            this.$q.loading.hide()
            this.$q.notify({
              type: 'negative',
              timeout: 2500,
              message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
            })
          })
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Il y a eu un problème. Veuillez essayer à nouveau un peu plus tard'
          })
        }
      }
    },
    openMenuIdentification () {
      this.menuIdentification = true
      // this.$refs.initialEmail.focus()
    },
    keyDown (event) {
      if (event.keyCode === 13) {
        if (this.menuIdentification) {
          if (!this.$v.email.$error) this.verifMail()
        }
        if (this.modalConnexion) {
          this.connexion()
        }
        if (this.modalInscription) {
          if (!this.$v.nom.$error && !this.$v.prenom.$error && !this.$v.email.$error && !this.$v.password.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) this.inscription()
        }
      }
    },
    changeMenuFiltre () {
      this.menuFiltre = !this.menuFiltre
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.text-atelier
  color: $atelier

.text-rencontre
  color: $rencontre

.text-autre
  color: $autre

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.menuCadre
  float: left
  width: 150px
  height: 460px
  padding: 0px
  margin: 0px

.menuCategories
  position: relative
  width: 140px
  height: 80px
  left: 0px !important
  top: 3px

.menuTitreCategories
  position: relative
  width: 140px
  height: 15px
  top: 3px
  font-family: Roboto
  font-weight: 900
  font-size: 14px
  text-align: center
  font-variant: small-caps
  color: #5C5C5C
  margin-bottom: 6px

.menuListCategorie
  margin: 0px
  padding: 0px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 13px
  text-align: center !important
  text-transform: capitalize

.menuItemCategorie
  position: relative
  width: 140px
  height: 15px
  left: 10px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 13px
  text-align: center !important
  text-transform: capitalize
  margin: 0px
  margin-bottom: 5px

.menuFiltreTitre
  position: relative
  width: 130px
  height: 15px
  left: 5px
  top: 0px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: center
  font-variant: small-caps
  color: #5C5C5C

.menuCowork
  position: relative
  width: 80px
  height: 80px
  left: 10px
  top: 0px
.menuCowork a
  fill: rgba(75, 188, 196, 0.4)
.menuCowork a:hover
  fill: rgba(75, 188, 196, 0.6)
  cursor: pointer
.coworkActive a
  fill: rgba(75, 188, 196, 1)

.menuLBF
  position: relative
  width: 80px
  height: 80px
  left: 50px
  top: -22px
.menuLBF a
  fill: rgba(227, 46, 57, 0.4)
.menuLBF a:hover
  fill: rgba(227, 46, 57, 0.6)
  cursor: pointer
.lbfActive a
  fill: rgba(227, 46, 57, 1)

.menuBrasserie
  position: relative
  width: 80px
  height: 80px
  left: 10px
  top: -44px
.menuBrasserie a
  fill: rgba(252, 198, 45, 0.4)
.menuBrasserie a:hover
  fill: rgba(252, 198, 45, 0.6)
  cursor: pointer
.brasserieActive a
  fill: rgba(252, 198, 45, 1)

.menuJardin
  position: relative
  width: 80px
  height: 80px
  left: 50px
  top: -66px
.menuJardin a
  fill: rgba(147, 192, 33, 0.4)
.menuJardin a:hover
  fill: rgba(147, 192, 33, 0.6)
  cursor: pointer
.jardinActive a
  fill: rgba(147, 192, 33, 1)

.menuAtelier
  position: relative
  width: 80px
  height: 80px
  left: 10px
  top: -88px
.menuAtelier a
  fill: rgba(238, 115, 46, 0.4)
.menuAtelier a:hover
  fill: rgba(238, 115, 46, 0.6)
  cursor: pointer
.atelierActive a
  fill: rgba(238, 115, 46, 1)
  cursor: pointer

.typeAtelier:hover
  background-color: $coworking

p
  text-align: justify

.border
  border: 1px solid red
</style>
