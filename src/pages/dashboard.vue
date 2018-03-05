<template>
  <q-tabs inverted no-pane-border>
      <q-tab default slot="title" name="general" label="général"/>
      <q-tab v-for="m in profileData.profil" :label="m.prenom" :name="m.prenom" slot="title" :key = "m.id" />
  <q-tab-pane name="general" style="margin-top: 0px">
    <q-card inline class="carte">
      <q-card-title>
        <q-icon name="fas fa-address-card" style="margin-right: 10px"/>
          Généralité
      </q-card-title>
      <q-card-main class="corps">
        <div class="row">
        <q-field
          label="Quotient familial"
          :labelWidth="8"
          class="col-8">
          <q-input type="number" v-model="profileData.qf" @blur="majUser('qf')"/>
        </q-field>
        <q-icon name="fas fa-question-circle" class="col-3 offset-1 justify-start" size="24px">
                  <q-tooltip anchor="bottom middle" self="top middle">
        <q-list dense no-border>
        <q-item>
          Nos prix sont modulés par le quotient :
        </q-item>
        <q-item>
          1 &lt; QF &lt; 600 : -60%
        </q-item>
        <q-item>601 &lt; QF &lt; 900 : -40%</q-item>
        <q-item>901 &lt; QF &lt; 1200 : -20%</q-item>
        <q-item>1201 &lt; QF &lt; 1500 : -10%</q-item>
        <q-item>
          QF &gt; 1501 : plein tarif
        </q-item>
        </q-list>
        </q-tooltip>
        </q-icon>
        </div>
        <q-btn flat inverted icon="fas fa-key" label="Modifier le mot de passe" style="margin-top: 20px" @click="modalModifierMDP = true"></q-btn>
      </q-card-main>
    </q-card>
<q-modal v-model="modalModifierMDP" :content-css="{padding: '15px'}">
  <h5 style="margin: 0px">Modifier votre mot de passe</h5>
    <q-input
      type="password"
      float-label = "Votre mot de passe"
      v-model="ancienMDP"
      @input="$v.ancienMDP.$touch"
      :error="$v.ancienMDP.$error"
      />
    <div v-if="!$v.ancienMDP.required">Mot de passe requis</div>
    <q-input
        type="password"
        float-label = "Le nouveau mot de passe"
        v-model="newPassword"
        @input="$v.newPassword.$touch"
        :error="$v.newPassword.$error"
      />
      <div v-if="!$v.newPassword.required">Mot de passe requis</div>
      <div v-if="!$v.newPassword.minLength">Minimum 6 caractères de long</div>
      <q-input
        type="password"
        float-label = "Répéter le mot de passe"
        v-model="repeatNewPassword"
        @input="$v.repeatNewPassword.$touch"
        :error="$v.repeatNewPassword.$error"
      />
      <div v-if="!$v.repeatNewPassword.sameAsPassword">Les mots de passe ne correspondent pas.</div>
      <q-btn flat inverted label="Modifier le mot de passe" @click="modifierMDP()" style="margin-top: 20px" />
</q-modal>
        <q-card inline class="carte">
        <q-card-title>
          <q-icon name="fa-users" style="margin-right: 10px"/>Membres de la famille
        </q-card-title>

        <q-card-main class="corps">
          <q-list no-border>
            <q-item dense style="padding: 0px" v-for="(m, index) in profileData.profil" :key="m.id">
              <q-item-side class="bouton"><q-btn icon="fas fa-edit" flat inverted size="md" dense @click="majMembre(index)"/><q-btn v-if="index > 0" icon="fa-trash" flat inverted size="md" dense @click="effacerMembre(m.id)"/></q-item-side>
              <q-item-main>{{m.prenom}}</q-item-main>
              <q-item-side>{{age(m.dateNaissance)}}</q-item-side>
            </q-item>
          </q-list>
        </q-card-main>
        <q-card-separator />
    <q-card-actions align="end">
      <q-btn flat inverted @click="ajoutMembre = true">
        <q-icon name="fa-plus" style="margin-right: 10px" />
        Ajouter un membre</q-btn>
    </q-card-actions>
    </q-card>
    <q-modal v-model="ajoutMembre" :content-css="{padding: '15px'}">
      <h5>Ajouter un membre</h5>
      <q-input float-label="Prénom" v-model="membre.prenom" @blur="$v.membre.prenom.$touch" :error="$v.membre.prenom.$error"/>
      <span v-if="!$v.membre.prenom.required">Un prénom est requis</span>
      <q-input float-label="Nom" v-model="membre.nom"  @blur="$v.membre.nom.$touch" :error="$v.membre.nom.$error" placeholder="Gigi"/>
      <span v-if="!$v.membre.nom.required">Un nom est requis</span>
      <q-input float-label="Adresse mail" v-model="membre.email" />
      <q-input float-label="Date de naissance (si enfant)" placeholder="jj/mm/aaaa" v-model="membre.dateNaissance" @blur="$v.membre.dateNaissance.$touch" :error="$v.membre.dateNaissance.$error"/>
      <span v-if="!$v.membre.dateNaissance.isValideDate">mauvais format</span>
      <div class="row justify-end">
        <q-btn color="amber-8" flat inverted @click="ajoutMembre = false">Annuler</q-btn>
        <q-btn v-if="membre.id" color="primary" flat inverted @click="ajouterMembre(membre.id)">Modifier</q-btn>
        <q-btn v-else color="primary" flat inverted @click="ajouterMembre()">Ajouter</q-btn>
      </div>
    </q-modal>
            <q-card inline class="carte">
      <q-card-title>
        <q-icon name="fa-exclamation" style="margin-right: 10px"/>
          Zone de danger
      </q-card-title>

        <q-card-main class="corps">
        Les actions de ce cadre sont irréversibles.
        </q-card-main>
        <q-card-separator />
    <q-card-actions align="end">
      <q-btn flat @click="effacerCompte()" color="negative" icon="fa-warning">
        Effacer le compte</q-btn>
    </q-card-actions>
    </q-card>

  </q-tab-pane>
  <q-tab-pane v-for="m in profileData.profil" :name="m.prenom" :key = "m.id">
    <img :src="avatar(m.id)" width="150px" class="shadow-2"/>
    <q-card inline style="width: 400px">
      <q-card-title>
        Badges <q-btn flat inverted ><q-icon name="fa-question-circle-o" size="24px" /></q-btn>
      </q-card-title>
    </q-card>
    <q-card inline style="width: 400px">
      <q-card-title>
        Ateliers
      </q-card-title>
    </q-card>
  </q-tab-pane>
  </q-tabs>
</template>

<script>
import {
  QSpinnerGears,
  date
} from 'quasar'

import { authMixins } from '../utils/auth.js'
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
import { FIND_USER_BY_ID, ADD_MEMBRE, CONNECT_MEMBRE, EFFACE_MEMBRE, MAJ_MEMBRE, MAJ_USER_QF, EFFACER_USER, CHECK_MDP, UPDATE_MDP } from '../constants/userAuth'

const isValideDate = value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value)
}

export default {
  props: {
    userId: String
  },
  mixins: [authMixins, validationMixin],
  components: {
  },
  created: function () {
    if (this.userId !== this.loggedInUser()) {
      this.$router.push({name: 'accueil'})
    }
  },
  data () {
    return {
      profileData: {
        email: '',
        qf: '',
        profil: []
      },
      ajoutMembre: false,
      membre: {nom: '', prenom: '', email: '', dateNaissance: ''},
      loadingUser: 0,
      estIdentifie: this.isLoggedIn(),
      modalModifierMDP: false,
      ancienMDP: '',
      newPassword: '',
      repeatNewPassword: ''
    }
  },
  validations: {
    ancienMDP: {
      required
    },
    newPassword: {
      required,
      minLength: minLength(6)
    },
    repeatNewPassword: {
      sameAsPassword: sameAs('newPassword')
    },
    membre: {
      prenom: {
        required
      },
      nom: {
        required
      },
      email: {
        email
      },
      dateNaissance: {
        isValideDate
      }
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
            spinner: QSpinnerGears,
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
        this.membre.nom = this.profileData.profil[0].nom
      }
    }
  },
  methods: {
    ajouterMembre: function (mId) {
      this.ajoutMembre = false
      if (mId) {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: 'Mise à jour de la base en cours...',
          messageColor: 'white',
          spinnerSize: 250, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        this.$apollo.mutate({
          mutation: MAJ_MEMBRE,
          variables: {
            id: this.membre.id,
            nom: this.membre.nom,
            prenom: this.membre.prenom,
            email: this.membre.email,
            dateNaissance: this.membre.dateNaissance
          }
        }).then((data) => {
          this.$q.loading.hide()
          this.$apollo.queries.allUsers.refetch()
        })
      } else {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: 'Enregistrement dans la base en cours...',
          messageColor: 'white',
          spinnerSize: 250, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        this.$apollo.mutate({
          mutation: ADD_MEMBRE,
          variables: {
            nom: this.membre.nom,
            prenom: this.membre.prenom,
            email: this.membre.email,
            dateNaissance: this.membre.dateNaissance
          }
        }).then((data) => {
          this.$q.loading.hide()
          const membreId = data.data.createProfil.id
          this.$apollo.mutate({
            mutation: CONNECT_MEMBRE,
            variables: {
              userId: this.userId,
              membreId: membreId
            }
          }).then((data) => {
            this.$apollo.queries.allUsers.refetch()
          })
        })
      }
      this.membre = {nom: '', prenom: '', email: '', dateNaissance: ''}
    },
    age: function (naissance) {
      if (naissance) {
        var dateNaissance = naissance.split('/')
        let cetteDate = date.buildDate({ year: dateNaissance[2], month: dateNaissance[1], date: dateNaissance[0] })
        let timeStamp = Date.now()

        let unit = 'months'
        return Math.floor((date.getDateDiff(timeStamp, cetteDate, unit)) / 12).toString() + ' ans'
      }
      return ''
    },
    effacerMembre: function (mId) {
      this.$apollo.mutate({
        mutation: EFFACE_MEMBRE,
        variables: {
          id: mId
        }
      }).then((data) => {
        this.$apollo.queries.allUsers.refetch()
      })
    },
    majMembre: function (index) {
      this.membre.nom = this.profileData.profil[index].nom
      this.membre.prenom = this.profileData.profil[index].prenom
      this.membre.email = this.profileData.profil[index].email
      this.membre.dateNaissance = this.profileData.profil[index].dateNaissance
      this.membre.id = this.profileData.profil[index].id
      this.ajoutMembre = true
    },
    majUser: function (type) {
      switch (type) {
        case 'qf': {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Mise à jour de la base en cours...',
            messageColor: 'white',
            spinnerSize: 250, // in pixels
            spinnerColor: 'white',
            customClass: 'bg-test'
          })
          this.$apollo.mutate({
            mutation: MAJ_USER_QF,
            variables: {
              id: this.userId,
              qf: this.profileData.qf
            }
          }).then((data) => {
            this.$q.loading.hide()
          })
        }
      }
    },
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/150/' + mId + '.png'
    },
    effacerCompte: function () {
      this.$q.dialog({
        title: 'Warning',
        message: 'Vous êtes sur le point d\'effacer votre compte. Merci de confirmer.',
        // optional; we want an "OK" button
        ok: 'Confirmer', // takes i18n value, or String for "OK" button label
        // optional; we want a "Cancel" button
        cancel: 'Annuler' // takes i18n value, or String for "Cancel" button label
      }).then(() => {
        this.effacerCompteAction()
      })
    },
    effacerCompteAction: function () {
      let promises = []
      let userId = this.loggedInUser()
      this.logout()
      this.$eventBus.$emit('logginState')
      for (let membre of this.allUsers[0].profil) {
        promises.push(
          this.$apollo.mutate({
            mutation: EFFACE_MEMBRE,
            variables: {
              id: membre.id
            }
          })
        )
      }
      promises.push(
        this.$apollo.mutate({
          mutation: EFFACER_USER,
          variables: {
            id: userId
          }
        })
      )
      Promise.all(promises).then((data) => {
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Compte effacé avec succès.'
        })
        this.$router.push({name: 'accueil'})
      })
    },
    async modifierMDP () {
      this.modalModifierMDP = false
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Modification du mot de passe en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.$apollo.mutate({
        mutation: CHECK_MDP,
        variables: {
          id: this.userId,
          password: this.ancienMDP
        }
      }).then((result) => {
        if (result.data.checkpw.checkPw) {
          this.$apollo.mutate({
            mutation: UPDATE_MDP,
            variables: {
              id: this.userId,
              password: this.newPassword
            }
          }).then((data) => {
            this.$q.loading.hide()
            this.$q.notify({
              type: 'positive',
              timeout: 2500,
              message: 'Le mot de passe a été modifié avec succès.'
            })
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
          })
        }
      }).catch((error) => { console.log(error) })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.carte
  width: 300px
  min-height: 240px
  margin: 10px

.corps
  min-height: 120px

.bouton
  width: 60px
</style>
