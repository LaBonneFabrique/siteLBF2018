<template>
  <div>
    <q-btn
      icon="fas fa-search"
      v-if="$route.name === 'accueil'"
      flat
      color="tertiary"
      label="Vérifier vos incriptions"
      class="gt-md"
      @click="verifMailInscription()"
      >
    </q-btn>
      <q-btn-dropdown
      icon="fas fa-cogs"
      flat
      color="secondary"
      content-class="shadow-1"
      >
       <q-list link dense no-border>
         <q-item @click.native="$router.push({name: 'accueil'})" v-if="$route.name !== 'accueil'" v-close-overlay>
           <q-item-side icon="fas fa-home" color="primary"/>
           <q-item-main>
            Accueil
           </q-item-main>
         </q-item>
         <q-item @click.native="menuGauche = false; $router.push({ name: 'accueilAdmin' })" v-if="user.isAdmin" v-close-overlay>
           <q-item-side icon="fas fa-unlock-alt" color="secondary"/>
           <q-item-main>
             Administration
           </q-item-main>
         </q-item>
         <q-item class="lt-md" v-close-overlay @click.native="verifMailInscription()" v-if="$route.name === 'accueil'">
          <q-item-side icon="fas fa-search" color="tertiary"></q-item-side>
          <q-item-main>
            Vérifier vos inscriptions
          </q-item-main>
         </q-item>
         <q-item @click.native="$router.push({ name: 'Tableau de bord', params: { userId: user.id} })" v-if="estIdentifie" v-close-overlay>
           <q-item-side icon="fas fa-tachometer-alt" color="tertiary"/>
           <q-item-main>
             Tableau de bord
           </q-item-main>
         </q-item>
      <q-item @click.native="$router.push({ name: 'ajoutAtelier'})" v-if="user.isAdmin">
       <q-item-side icon="fas fa-cog"  color="atelier"/>
       <q-item-main>
         Ajouter un atelier
       </q-item-main>
     </q-item>
     <q-item v-if="user.isAdmin" v-close-overlay>
       <q-item-side icon="far fa-newspaper" color="rencontre" />
       <q-item-main>
         Ajouter une Info
       </q-item-main>
     </q-item>
         <q-item @click.native="deconnexion()" v-if="estIdentifie" v-close-overlay>
           <q-item-side icon="fas fa-sign-out-alt" color="autre"/>
           <q-item-main>
             Deconnexion
           </q-item-main>
         </q-item>
         <q-item @click.native="openMenuIdentification()" v-if="!estIdentifie" v-close-overlay>
           <q-item-side icon="fas fa-sign-in-alt" color="autre" />
           <q-item-main>
             S'identifier
           </q-item-main>
         </q-item>
       </q-list>
    </q-btn-dropdown>
  <!-- les modals -->
<q-modal v-model="menuIdentification" :content-css="{padding: '20px', 'max-width': '380px'}" minimized @show="$refs.initialEmail.focus()">
    <h5 style="margin: 0px">Adresse mail</h5>
    <hr />
    <p>Merci d'entrer votre adresse mail. Si vous n'êtes pas encore inscrit, vous serez conduit à un formulaire d'inscription.</p>
    <q-input
      @keydown="keyDown($event)"
      ref="initialEmail"
      type="email"
      float-label="adresse mail"
      v-model="email"
      @input="$v.email.$touch"
      :error="$v.email.$error" />
    <div v-if="!$v.email.email">L'adresse entrée n'est pas valide</div>
    <q-btn flat inverted color="amber-8" @click="menuIdentification = false">Annuler</q-btn>
    <q-btn flat inverted color="light-green-8" @click="verifMail()">Envoyer</q-btn>
</q-modal>
<q-modal v-model="modalConnexion" :content-css="{padding: '20px', 'max-width': '380px'}" minimized @show="$refs.password.focus()">
  <h5 style="margin: 0px">Votre mot de passe</h5>
  <p></p>
  <q-input ref="password" type="password" float-label = "mot de passe" v-model="password" @keydown="keyDown($event)"/>
  <div><q-btn flat inverted size="sm" label="Mot de passe oublié ?" class="float-right" @click="oublieMDP()"></q-btn></div>
  <div class="float-right"><q-btn flat inverted color="amber-8" @click="modalConnexion = false">Annuler</q-btn>
  <q-btn flat inverted color="light-green-8" @click="connexion()">Connexion</q-btn></div>
</q-modal>
<q-modal v-model="modalInscription" :content-css="{padding: '20px', 'max-width': '380px'}" minimized @show="$refs.nom.focus()">
  <h5 style="margin: 0px">Formulaire d'inscription</h5>
  <hr />
  <p>Bienvenue sur le site de la Bonne Fabrique. Nous avons besoin de quelques informations pour vous enregistrer sur notre site.</p>
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
<q-modal v-model="modalRechercheInscriptions" :content-css="{padding: '20px', 'max-width': '380px'}" @show="$refs.verifEmail.focus()" minimized>
      <h5 style="margin: 0px">Adresse mail</h5>
      <hr />
      <p>Entrez votre adresse mail pour vérifier vos inscriptions en cours.</p>
      <q-input @keydown="keyDown($event)" ref="verifEmail" type="email" float-label="adresse mail" v-model="emailInscription" @input="$v.email.$touch" :error="$v.email.$error" />
      <span v-if="!$v.email.email">L'adresse entrée n'est pas valide</span>
      <q-btn flat v-close-overlay inverted color="amber-8" >Annuler</q-btn>
      <q-btn flat v-close-overlay inverted color="light-green-8" @click="envoieVerifMail()">Envoyer</q-btn>
    </q-modal>
  </div>
</template>

<script>
import {
  QSpinnerCircles,
  date
} from 'quasar'
const { addToDate } = date
import { authMixins } from '../utils/auth'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { mailMixins } from '../utils/envoiMail'
import {FIND_USER_BY_EMAIL, RESET_MDP_TOKEN} from '../graphQL/userAuth'

async function isUnique () {
  let retour = true
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
  // name: 'ComponentName',
  mixins: [authMixins, validationMixin, mailMixins],
  data () {
    return {
      mailVerifInscription: '',
      menuIdentification: false,
      modalConnexion: false,
      modalInscription: false,
      modalRechercheInscriptions: false,
      prenomRecoverMDP: '',
      emailInscription: '',
      repeatPassword: '',
      password: '',
      prenom: '',
      nom: '',
      email: ''
    }
  },
  store: {
    user: 'user',
    estIdentifie: 'estIdentifie'
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
    this.estIdentifie = await this.$q.cookies.has('token')
    if (this.estIdentifie) {
      let leUser = await this.getUser()
      this.user = Object.assign({}, leUser)
    } else {
      this.user = Object.assign({}, {
        id: 'hoho',
        email: 'bob@bluh.fr',
        qf: 3000,
        isAdmin: false,
        profil: []
      })
    }
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
      let zeId = await this.signup(this.email, this.password, nomCap, prenomCap)
      console.log('bu', zeId)
      this.$q.loading.hide()
      await this.$q.cookies.set('token', zeId, {expires: 300, secure: process.env.PROD, path: '/'})
      this.estIdentifie = true
      let theUser = await this.getUser()
      this.user = Object.assign({}, theUser)
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.$router.push({name: 'Tableau de bord', params: { userId: zeId }})
    },
    async connexion () {
      this.modalConnexion = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Vérification des données utilisateur...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.login(this.email, this.password).then(async (retour) => {
        this.user.id = retour.data.authenticateUser.id
        this.$q.cookies.set('token', this.user.id, {expires: 300, secure: process.env.PROD, path: '/'})
        this.estIdentifie = true
        let leUser = await this.getUser()
        this.user = Object.assign({}, leUser)
        this.$q.loading.hide()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'Vous êtes maintenant connecté.'
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
    deconnexion: async function () {
      this.user = Object.assign({}, {
        id: 'hoho',
        email: 'bob@bluh.fr',
        qf: 3000,
        isAdmin: false,
        profil: []
      })
      console.log('vire le cookies')
      await this.$q.cookies.remove('token', {path: '/'})
      this.emailInscription = ''
      this.idUser = ''
      this.estIdentifie = false
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      console.log('token', this.$q.cookies.has('token'))
      this.$router.push({name: 'accueil'})
      this.$q.notify({
        type: 'negative',
        timeout: 2500,
        message: 'Vous êtes maintenant déconnecté.'
      })
    },
    verifMailInscription () {
      if (this.estIdentifie) {
        console.log('verif identifié')
        this.mailVerifInscription = this.user.email
        this.$eventBus.$emit('majMailVerif', this.mailVerifInscription)
      } else {
        console.log('verif non identifié')
        this.mailVerifInscription = ''
        this.modalRechercheInscriptions = true
      }
    },
    verifMail: async function () {
      this.menuIdentification = false
      let inscription = true
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Recherche de l\'email dans la base...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.$apollo.query({
        query: FIND_USER_BY_EMAIL,
        fetchPolicy: 'network-only',
        variables: {
          email: this.email.toLowerCase()
        }
      }).then((data) => {
        this.$q.loading.hide()
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
    envoieVerifMail () {
      this.mailVerifInscription = this.emailInscription
      this.$eventBus.$emit('majMailVerif', this.mailVerifInscription)
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
    }
  }
}
</script>

<style>
</style>
