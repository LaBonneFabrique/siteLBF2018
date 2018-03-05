<template>
  <q-page padding class="taillePage">
    <div v-if="estTropTard">
    <h5 style="margin: 0px">Le lien n'est plus valide</h5>
    <p>Le délai pour utiliser ce lien est dépassé.</p>
    <q-btn label="renvoyer le lien" flat inverted @click="renvoiLien()"></q-btn>
    </div>
    <div v-if="!estValide">
      <h5 style="margin: 0px">Le lien n'est pas valide</h5>
      <p>Il semble avoir un problème avec cette adresse.</p>
      <q-btn flat inverted @click="$router.push({name:'accueil'})">Retourner à l'accueil</q-btn>
    </div>
    <div v-if="estValide && !estTropTard">
      <h5 style="margin: 0px">Nouveau mot de passe</h5>
    <q-input
        type="password"
        float-label = "Nouveau mot de passe"
        v-model="newPassword"
        @input="$v.newPassword.$touch"
        :error="$v.newPassword.$error"
      />
      <div v-if="!$v.newPassword.minLength">Minimum 6 caractères de long</div>
      <q-input
        type="password"
        float-label = "Répéter le mot de passe"
        v-model="repeatNewPassword"
        @input="$v.repeatNewPassword.$touch"
        :error="$v.repeatNewPassword.$error"
      />
      <div v-if="!$v.repeatNewPassword.sameAsPassword">Les mots de passe ne correspondent pas.</div>
      <q-btn label="Modifier le mot de passe" @click="modifierMDP()"/>
      </div>
  </q-page>
</template>

<script>
import {QSpinnerGears, date} from 'quasar'
const { addToDate } = date
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'
import { VERIF_TOKEN, EFFACE_TOKEN, RESET_MDP_TOKEN, FIND_USER_BY_ID_EMAIL, UPDATE_MDP } from '../constants/userAuth'
import { mailMixins } from '../utils/envoiMail'

export default {
  // name: 'PageName',
  mixins: [validationMixin, mailMixins],
  props: {
    uId: String,
    tId: String
  },
  data () {
    return {
      newPassword: '',
      repeatNewPassword: '',
      estValide: true,
      estTropTard: false
    }
  },
  mounted () {
    // console.log(this.uId, this.tId)
  },
  apollo: {
    allResetMDPs: {
      query: VERIF_TOKEN,
      variables () {
        return {
          userId: this.uId,
          tokenId: this.tId
        }
      },
      watchLoading (isLoading, countModifier) {
        if (isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Vérification de la validité de la demande...',
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
        console.log(result.data.allResetMDPs)
        if (result.data.allResetMDPs.length === 0) {
          this.estValide = false
          // this.effaceResetToken()
        } else {
          let validite = new Date(result.data.allResetMDPs[0].validity).getTime()
          let timeStamp = Date.now()
          let diff = validite - timeStamp
          console.log(diff)
          if (diff < 0) {
            this.estTropTard = true
            // this.effaceResetToken()
          }
        }
      }
    }
  },
  validations: {
    newPassword: {
      required,
      minLength: minLength(6)
    },
    repeatNewPassword: {
      sameAsPassword: sameAs('newPassword')
    }
  },
  methods: {
    effaceResetToken () {
      this.$apollo.mutate({
        mutation: EFFACE_TOKEN,
        variables: {
          id: this.tId
        }
      }).then((data) => {
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    },
    async renvoiLien () {
      this.effaceResetToken()
      let validite = addToDate(new Date(), { minutes: 20 })
      let email = ''
      let newTokenId = ''
      let prenom = ''
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Génération d\'un nouveau lien...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      console.log('paf')
      await this.$apollo.query({
        query: FIND_USER_BY_ID_EMAIL,
        variables: {
          id: this.uId
        }
      }).then((result) => {
        console.log(result)
        email = result.data.allUsers[0].email
        prenom = result.data.allUsers[0].profil[0].prenom
      }).catch((error) => {
        console.log(error)
      })
      console.log('puf')
      await this.$apollo.mutate({
        mutation: RESET_MDP_TOKEN,
        variables: {
          userId: this.uId,
          validity: validite
        }
      }).then((result) => {
        console.log(result.data)
        newTokenId = result.data.createResetMDP.id
      })
      this.envoiMailMDP(email, prenom, this.uId, newTokenId).then((result) => {
        this.$q.loading.hide()
        if (result.data.sendMailgunEmail.success) {
          this.$q.notify({
            type: 'positive',
            timeout: 2500,
            message: 'Les instructions pour modifier votre mot de passe vous ont été envoyées.'
          })
        }
        this.$router.push({name: 'accueil'})
      }).catch((error) => {
        console.log(error)
        this.$q.loading.hide()
        this.$q.notify({
          type: 'negative',
          timeout: 2500,
          message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
        })
      })
    },
    async modifierMDP () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Modification du mot de passe...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: UPDATE_MDP,
        variables: {
          id: this.uId,
          password: this.newPassword
        }
      }).then((result) => {
        this.$q.loading.hide()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'Le mot de passe a été modifié avec succès.'
        })
        this.effaceResetToken()
        this.$q.localStorage.set('idUser', result.data.majpw.id)
        this.$q.localStorage.set('token', result.data.majpw.token)
        this.$eventBus.$emit('logginState')
        this.$router.push({name: 'accueil'})
      }).catch((error) => {
        console.log(error)
        this.$q.loading.hide()
        this.$q.notify({
          type: 'negative',
          timeout: 2500,
          message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
        })
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.taillePage
  width: 400px

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
