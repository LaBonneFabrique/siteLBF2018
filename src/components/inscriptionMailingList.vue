<template>
  <div>
    <h6 style="margin: 0px; margin-bottom: 5px" v-if="idAbonnement === ''">Inscriptions à notre lettre d'informations</h6>
    <h6 v-else style="margin: 0px; margin-bottom: 5px">Vos abonnements en cours</h6>
        <hr />
        <p v-if="dejaAbonne">Vous êtes déjà abonné, en voici les détails.</p>
        <p v-if="mML && idAbonnement === ''">Il n'y a pas d'abonnement à cette adresse mail. Vous pouvez vous abonner ci-dessous</p>
        <p v-if="idAbonnement === ''">Nous avons besoin de quelques informations. Vous pourrez accéder à vos abonnements à nos mailing liste grâce au lien en bas de chaque mail et par votre tableau de bord si vous êtes inscrit sur ce site.</p>
        <p v-else>Vous pouvez mettre à jour vos abonnements. Le bouton <q-icon name="far fa-trash-alt" color="atelier" size="16px" /> vous permet d'effacer toutes vos inscriptions.</p>
        <q-field
        icon-color="primary"
  icon="far fa-user-circle">
          <q-input placeholder="nom" v-model="nomML" class="q-mb-sm" color="primary"/>
          <q-input placeholder="prénom" v-model="prenomML" class="q-mb-sm" />
        </q-field>
      <q-field
        icon-color="tertiary"
        icon="fas fa-at">
            <q-input placeholder="email" v-model="emailML" />
      </q-field>
    <q-field
    class="q-mt-lg"
        icon-color="atelier"
        label="Abonnements"
        icon="fas fa-list">
          </q-field><hr />
          <div class="q-mt-md">
            <q-toggle v-for="abonnement in abonnements" :key="abonnement" v-model="selection" :val="abonnement" :label="abonnement" class="q-mr-md"/>
          </div>
          <div class="piedInscription">
            <q-icon name="fas fa-times" color="secondary" size="32px" class="iconPied" @click.native="$router.push({name: 'accueil'})" />
            <q-icon name="far fa-trash-alt" color="atelier" size="32px" class="iconPied" @click.native="effaceAbonnement()" v-if="idAbonnement !== ''" />
            <q-icon name="far fa-save" color="primary" size="32px" class="iconPied" @click.native="newAbonnement()"/>
          </div>
  </div>
</template>

<script>
import {SAVE_ABONNEMENT, LOAD_ABONNEMENTS, EFFACER_ABONNEMENTS, MAJ_ABONNEMENTS} from '../graphQL/mailingList'
import {
  QSpinnerGears
} from 'quasar'
import {abonnements} from '../constants/listeMailing'

export default {
  // name: 'ComponentName',
  props: {
    mML: String,
    effacerAbonnement: Boolean
  },
  data () {
    return {
      emailML: '',
      nomML: '',
      prenomML: '',
      abonnements: abonnements,
      selection: [],
      idAbonnement: '',
      dejaAbonne: false,
      maj: false
    }
  },
  mounted () {
    if (this.mML) {
      // this.emailVerif = this.emailVerif.replace('*point*', '.')
      this.maj = true
      let queryEmail = decodeURI(this.mML).replace('*point*', '.')
      console.log('queryEmail', queryEmail)
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Récupération de vos abonnements',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.query({
        query: LOAD_ABONNEMENTS,
        variables: {
          email: queryEmail
        }
      }).then((retour) => {
        this.$q.loading.hide()
        if (retour.data.allAbonnes.length > 0) {
          let data = retour.data.allAbonnes[0]
          this.idAbonnement = data.id
          this.emailML = data.email
          this.nomML = data.nom
          this.prenomML = data.prenom
          this.selection = data.abonnement
          if (this.effacerAbonnement) {
            this.processEffaceAbonnement()
          }
        } else {
          this.emailML = ''
          this.nomML = ''
          this.prenomML = ''
          this.selection = []
          this.idAbonnement = ''
        }
      }).catch((error) => console.log(error))
    }
  },
  methods: {
    newAbonnement () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Enregistrement de vos préférences',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      if (this.maj) {
        this.$apollo.mutate({
          mutation: MAJ_ABONNEMENTS,
          variables: {
            id: this.idAbonnement,
            nom: this.nomML,
            prenom: this.prenomML,
            email: this.emailML,
            abonnement: this.selection
          }
        }).then((retour) => {
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Abonnements modifiés avec succès.',
            timeout: 2500,
            type: 'positive'
          })
        }).catch((error) => console.log(error))
      } else {
        this.$apollo.query({
          query: LOAD_ABONNEMENTS,
          variables: {
            email: this.emailML
          }
        }).then((retour) => {
          if (retour.data.allAbonnes.length > 0 && !this.maj) {
            this.$q.notify({
              message: 'Un abonné existe déjà avec cette adresse mail.',
              timeout: 2500,
              type: 'warning'
            })
            this.$q.loading.hide()
            this.dejaAbonne = true
            let data = retour.data.allAbonnes[0]
            this.idAbonnement = data.id
            this.emailML = data.email
            this.nomML = data.nom
            this.prenomML = data.prenom
            this.selection = data.abonnement
            this.maj = true
          } else {
            this.$apollo.mutate({
              mutation: SAVE_ABONNEMENT,
              variables: {
                nom: this.nomML,
                prenom: this.prenomML,
                email: this.emailML,
                abonnement: this.selection
              }
            }).then((retour) => {
              this.$q.loading.hide()
              this.$q.notify({
                message: 'Abonnements sauvés avec succès.',
                timeout: 2500,
                type: 'positive'
              })
              // this.$eventBus.$emit('finML')
              this.$router.push({name: 'accueil'})
            }).catch((error) => console.log(error))
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    effaceAbonnement () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer vos abonnements ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffaceAbonnement()
      }).catch(() => {
      })
    },
    processEffaceAbonnement () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Vos abonnements vont être annulés',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: EFFACER_ABONNEMENTS,
        variables: {
          id: this.idAbonnement
        }
      }).then((retour) => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Abonnements effacés avec succès.',
          timeout: 2500,
          type: 'positive'
        })
        this.$router.push({name: 'accueil'})
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.text-atelier
  color: $atelier

.piedInscription
  margin-top: 10px
  text-align: right

.iconPied
  margin-left: 10px
  &:hover
    cursor: pointer

</style>
