<template>

    <q-layout
    ref="layout"
    :view="layoutStoreDashboard.view"
    :left-breakpoint="layoutStoreDashboard.leftBreakpoint"
    :right-breakpoint="layoutStoreDashboard.rightBreakpoint"
    :reveal="layoutStoreDashboard.reveal"
    :header-class="{'no-shadow': true}"
  >

  <q-layout-header reveal class="no-shadow">
      <q-toolbar color="amber-8" inverted class="no-shadow">
        <img
          src="~assets/logoLBFpetit.png"
          style="margin-rigt: 10px;"
        />
    <q-toolbar-title>
      Tableau de bord de la famille {{profileData.profil[0].nom}}
    </q-toolbar-title>
    <q-btn flat v-if="!estIdentifie" color="amber-8" @click="openMenuIdentification()">
      <q-icon name="fas fa-sign-in-alt" style="margin-right: 5px"/> S'identifier
      <q-popover ref="menuIdentification" style="padding: 20px" v-model="menuIdentification" @show="$refs.initialEmail.focus()">
        <h5 style="margin: 0px">Adresse mail</h5>
        <hr />
        <q-input @keydown="keyDown($event)" ref="initialEmail" type="email" float-label="adresse mail" v-model="email" @input="$v.email.$touch" :error="$v.email.$error" />
        <span v-if="!$v.email.email">L'adresse entrée n'est pas valide</span>
        <!-- <q-input type="password" float-label = "mot de passe" v-model="password" /> -->
        <q-btn flat inverted color="amber-8" @click="menuIdentification = false">Annuler</q-btn>
        <q-btn flat inverted color="light-green-8" @click="verifMail()">Envoyer</q-btn>
      </q-popover>
    </q-btn>
    <q-btn
      flat
      v-if="estIdentifie"
      @click="menuGauche = false"
      >
      <q-icon name="fa-ellipsis-v" />
               <q-popover v-model="menuGauche" touch-position style="padding: 10px" class="shadow-3">
                 <q-list link dense no-border>
                   <q-item @click.native="menuGauche = false, $router.push({ name: 'accueil'})">
                     <q-item-side icon="fa-home" />
                     <q-item-main>
                       Accueil
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="menuGauche = false, $router.push({ name: 'Tableau de bord', params: { userId: loggedInUser() }})">
                     <q-item-side icon="fas fa-tachometer-alt" />
                     <q-item-main>
                       Tableau de bord
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="menuGauche = false, $router.push({ name: 'accueilAdmin' })" v-if="isAdmin()">
                     <q-item-side icon="fas fa-unlock-alt" />
                     <q-item-main>
                       Administration
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="menuGauche = false, deconnexion()">
                     <q-item-side icon="fas fa-sign-out-alt" />
                     <q-item-main>
                       Deconnexion
                     </q-item-main>
                   </q-item>
                 </q-list>
        </q-popover>
    </q-btn>

  </q-toolbar>
  </q-layout-header>
    <q-layout-drawer side="left" v-model="leftDrawerOpen" content-class="no-shadow colonneGauche">
    <!-- drawer content -->
    <q-list link dense no-border>
      <q-item class="colonneGaucheListe" :to="{name:'Tableau de bord'}" exact>
            Général
      </q-item>
      <q-item class="colonneGaucheListe" v-for="m in profileData.profil" :key = "m.id" :to="{name: 'Page adherent', params: {userId: userId, membreId: m.id}}">
          <img :src="avatar(m.id)" width="40" style="margin-right: 5px"/>
            {{m.prenom}}
      </q-item>
      <q-item class="colonneGaucheListe" :to="{name: 'accueil'}" exact>
        Retour au site
      </q-item>
    </q-list>
  </q-layout-drawer>

<q-page-container>
      <router-view :key="$route.fullPath" />
</q-page-container>

<q-modal v-model="modalConnexion" :content-css="{padding: '20px'}" minimized @show="$refs.password.focus()">
  <h5 style="margin: 0px">Votre mot de passe</h5>
  <p></p>
  <q-input ref="password" type="password" float-label = "mot de passe" v-model="password" @keydown="keyDown($event)"/>
  <div><q-btn flat inverted size="sm" label="Mot de passe oublié ?" class="float-right" @click="oublieMDP()"></q-btn></div>
  <div class="float-right"><q-btn flat inverted color="amber-8" @click="modalConnexion = false">Annuler</q-btn>
  <q-btn flat inverted color="light-green-8" @click="connexion()">Connexion</q-btn></div>
</q-modal>
<q-modal v-model="modalInscription" :content-css="{padding: '20px'}" minimized @show="$refs.nom.focus()">
  <h5 style="margin: 0px">Formulaire d'inscription</h5>
  <p>Bienvenue sur le site de la Bonne Fabrique</p>
    <q-input @keydown="keyDown($event)" ref="nom" float-label="Nom" v-model="nom" @input="$v.nom.$touch" :error="$v.nom.error" />
    <span v-if="!$v.nom.required">Votre nom est requis.</span>
    <q-input @keydown="keyDown($event)" float-label="Prénom" v-model="prenom" @input="$v.prenom.$touch" :error="$v.prenom.error" />
    <span v-if="!$v.prenom.required">Votre prénom est requis.</span>
    <q-input @keydown="keyDown($event)" type="password" float-label = "mot de passe" v-model="password" @input="$v.password.$touch" :error="$v.password.$error"/>
    <span v-if="!$v.password.required">Le mot de passe est requis</span>
    <span v-if="!$v.password.minLength">Minimum 6 caractères de long</span>
    <q-input @keydown="keyDown($event)" type="password" float-label = "confirmer le mode passe" v-model="repeatPassword" @input="$v.repeatPassword.$touch" :error="$v.repeatPassword.$error"/>
    <span v-if="!$v.repeatPassword.sameAsPassword">Les mots de passe ne correspondent pas.</span><br />
    <q-btn flat inverted color="amber-8" @click="modalInscription = false">Annuler</q-btn>
    <q-btn flat inverted color="light-green-8" @click="inscription()" :disable="$v.nom.$error || $v.prenom.$error || $v.email.$error || $v.password.$error || $v.password.$error || $v.repeatPassword.$error">S'enregistrer</q-btn>
</q-modal>

  </q-layout>
</template>

<script>
import {
  QSpinnerCircles,
  date
} from 'quasar'
const { addToDate } = date
import layoutStoreDashboard from '../constants/layoutStoreDashboard'
import { authMixins } from '../utils/auth'
import { validationMixin } from 'vuelidate'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import {FIND_EMAIL, RESET_MDP_TOKEN, FIND_USER_BY_ID} from '../graphQL/userAuth'
import { mailMixins } from '../utils/envoiMail'

async function isUnique () {
  let retour = true
  console.log(this.email)
  await this.$apollo.query({
    query: FIND_EMAIL,
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
  mixins: [authMixins, validationMixin, mailMixins],
  components: {
  },
  created () {
    this.$eventBus.$on('logginState', this.updateEstIdentifie)
  },
  beforeDestroy () {
    this.$eventBus.$off('logginState', this.updateEstIdentifie)
  },
  data () {
    return {
      layoutStoreDashboard,
      estIdentifie: this.$q.localStorage.has('token'),
      email: '',
      password: '',
      repeatPassword: '',
      nom: '',
      prenom: '',
      menuGauche: false,
      menuInscription: false,
      menuIdentification: false,
      modalInscription: false,
      modalConnexion: false,
      prenomRecoverMDP: '',
      leftDrawerOpen: true,
      userId: this.$q.localStorage.get.item('idUser'),
      profileData: {}
    }
  },
  apollo: {
    allUsers: {
      query: FIND_USER_BY_ID,
      variables () {
        return {
          id: this.userId
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingUser',
      watchLoading (isLoading, countModifier) {
        this.loadingUser = isLoading
        if (isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerCircles,
            message: 'Chargement des données',
            messageColor: 'white',
            spinnerSize: 150, // in pixels
            spinnerColor: 'white',
            customClass: 'bg-test'
          })
        } else {
          this.$q.loading.hide()
        }
      },
      result (result) {
        this.profileData = Object.assign({}, result.data.allUsers[0])
        this.profileData.profil = Object.assign({}, result.data.allUsers[0].profil)
        console.log(result)
      }
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
  mounted () {
    this.estIdentifie = this.$q.localStorage.has('token')
  },
  methods: {
    inscription: async function () {
      let nomCap = this.nom.charAt(0).toUpperCase() + this.nom.slice(1)
      let prenomCap = this.prenom.charAt(0).toUpperCase() + this.prenom.slice(1)
      this.modalInscription = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Enregistrement dans la base en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.signup(this.email, this.password, nomCap, prenomCap)
      this.$q.loading.hide()
      this.estIdentifie = this.$q.localStorage.has('token')
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
    },
    async connexion () {
      this.modalConnexion = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'vérification des données utilisateur...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.login(this.email, this.password).then((data) => {
        this.userRoles().then((result) => {
          this.$q.localStorage.set('roles', result.data.allUsers[0].role)
          this.$q.loading.hide()
          this.estIdentifie = this.$q.localStorage.has('token')
          this.$eventBus.$emit('logginState')
          this.$q.notify({
            type: 'positive',
            timeout: 2500,
            message: 'Vous êtes maintenant connecté.'
          })
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        this.$q.loading.hide()
        if (error.message.search('password') > 0) {
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Ce n\'est pas le bon mot de passe'
          })
        }
        if (error.message.search('mail') > 0) {
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Cette adresse mail n\'a pas été trouvée dans la base'
          })
        }
      })
    },
    deconnexion: function () {
      this.$q.localStorage.clear()
      // console.log(this.$q.localStorage.has('token'), this.$q.localStorage.has('idUser'))
      this.estIdentifie = this.$q.localStorage.has('token')
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      this.$router.push({name: 'accueil'})
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.$q.localStorage.has('token'))
    },
    verifMail: async function () {
      this.menuIdentification = false
      let inscription = true
      await this.$apollo.query({
        query: FIND_EMAIL,
        fetchPolicy: 'network-only',
        variables: {
          email: this.email
        }
      }).then((data) => {
        if (data.data.allUsers.length > 0) {
          inscription = false
          this.prenomRecoverMDP = data.data.allUsers[0].profil[0].prenom
        }
      })
      if (inscription) {
        this.modalInscription = true
      } else {
        this.modalConnexion = true
      }
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
        query: FIND_EMAIL,
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
      this.$refs.initialEmail.focus()
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
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/150/' + mId + '.png'
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.colonneGauche
  width: 200px

.colonneGaucheListe
  text-align: center
  margin-bottom: 5px
  padding: 7px 15px !important

.router-link-active
  background-color: $coworkingTransparent !important
</style>
