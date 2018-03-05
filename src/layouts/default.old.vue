<template>

    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    :header-class="{'no-shadow': true}"
  >
  <q-layout-header reveal class="no-shadow">
      <q-toolbar color="amber-8" inverted class="no-shadow">
    <q-toolbar-title></q-toolbar-title>
    <q-btn flat v-if="!estIdentifie" color="light-green-8" @click="menuInscription = true">
      <q-icon name="fa-user-plus"  style="margin-right: 5px"/> S'inscrire
      <q-popover ref="menuInscription" style="padding: 20px" v-model="menuInscription">
        <h5 style="margin: 0px">Formulaire d'inscription</h5>
        <hr />
        <q-input float-label="Nom" v-model="nom" @input="$v.nom.$touch" :error="$v.nom.error" />
        <span v-if="!$v.nom.required">Votre nom est requis.</span>
        <q-input float-label="Prénom" v-model="prenom" @input="$v.prenom.$touch" :error="$v.prenom.error" />
        <span v-if="!$v.prenom.required">Votre prénom est requis.</span>
        <q-input type="email" float-label="adresse mail" v-model="email" @input="$v.email.$touch" :error="$v.email.$error || $v.emailUnique.$error" @blur="$v.emailUnique.$touch" />
        <span v-if="!$v.email.email">L'adresse entrée n'est pas valide</span><span v-if="!$v.email.required">L'adresse mail est requise</span>
        <span v-if="!$v.emailUnique.isUnique">Cette adresse est déjà enregistrée dans notre base.</span>
        <q-input type="password" float-label = "mot de passe" v-model="password" @input="$v.password.$touch" :error="$v.password.$error"/>
        <span v-if="!$v.password.required">Le mot de passe est requis</span>
        <span v-if="!$v.password.minLength">Minimum 6 caractères de long</span>
        <q-input type="password" float-label = "confirmer le mode passe" v-model="repeatPassword" @input="$v.repeatPassword.$touch" :error="$v.repeatPassword.$error"/>
        <span v-if="!$v.repeatPassword.sameAsPassword">Les mots de passe ne correspondent pas.</span><br />
        <q-btn flat inverted color="amber-8" @click="menuInscription = false">Annuler</q-btn>
        <q-btn flat inverted color="light-green-8" @click="inscription()" :disable="!$v.nom.required || !$v.prenom.required || !$v.email.email || !$v.password.required || !$v.password.minLength || !$v.repeatPassword.sameAsPassword">S'enregistrer</q-btn>
      </q-popover>
    </q-btn>
    <q-btn flat v-if="!estIdentifie" color="amber-8" @click=" menuIdentification = true">
      <q-icon name="fas fa-sign-in-alt" style="margin-right: 5px"/> S'identifier
      <q-popover ref="menuIdentification" style="padding: 20px" v-model="menuIdentification">
        <h5 style="margin: 0px">Connexion</h5>
        <hr />
        <q-input type="email" float-label="adresse mail" v-model="email" />
        <q-input type="password" float-label = "mot de passe" v-model="password" />
        <q-btn flat inverted color="amber-8" @click="menuIdentification = false">Annuler</q-btn>
        <q-btn flat inverted color="light-green-8" @click="connexion()">Connexion</q-btn>
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
                   <q-item @click.native="menuGauche = false, $router.push({ name: 'listeUsers' })">
                     <q-item-side icon="fa-users" />
                     <q-item-main>
                       Liste des adhérents
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
<q-page-container>
  <q-page>
      <router-view :key="$route.fullPath" />
  </q-page>
</q-page-container>

  </q-layout>

</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QPopover,
  QModal,
  Notify,
  QInput,
  QSpinnerCircles
} from 'quasar'
import layoutStore from '../constants/layoutStore'
import { authMixins } from '../utils/auth.js'
import { validationMixin } from 'vuelidate'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import {FIND_EMAIL} from '../constants/userAuth'

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
  mixins: [authMixins, validationMixin],
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QPopover,
    QModal,
    QInput
  },
  created () {
    this.$eventBus.$on('logginState', this.updateEstIdentifie)
  },
  beforeDestroy () {
    this.$eventBus.$off('logginState', this.updateEstIdentifie)
  },
  data () {
    return {
      layoutStore,
      estIdentifie: this.$q.localStorage.has('token'),
      email: '',
      password: '',
      repeatPassword: '',
      nom: '',
      prenom: '',
      menuGauche: false,
      menuInscription: false,
      menuIdentification: false
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
    // this.$watch('estIdentifie', () => {console.log('change !'); return this.isLoggedIn()})
  },
  methods: {
    inscription: async function () {
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Enregistrement dans la base en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.signup(this.email, this.password, this.nom, this.prenom)
      this.$q.loading.hide()
      this.estIdentifie = this.$q.localStorage.has('token')
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
    },
    connexion: function () {
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'vérification des données utilisateur...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.login(this.email, this.password).then((data) => {
        this.$q.loading.hide()
        this.estIdentifie = this.$q.localStorage.has('token')
        this.$eventBus.$emit('logginState')
        // this.$router.go()
      }).catch((error) => {
        this.$q.loading.hide()
        if (error.message.search('password') > 0) {
          Notify.create({
            type: 'negative',
            timeout: 2500,
            message: 'Ce n\'est pas le bon mot de passe'
          })
        }
        if (error.message.search('mail') > 0) {
          Notify.create({
            type: 'negative',
            timeout: 2500,
            message: 'Cette adresse mail n\'a pas été trouvée dans la base'
          })
        }
      })
    },
    deconnexion: function () {
      this.logout()
      this.estIdentifie = this.$q.localStorage.has('token')
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      this.$router.push({name: 'accueil'})
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.$q.localStorage.has('token'))
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
