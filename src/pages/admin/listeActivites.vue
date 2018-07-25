<template>
  <q-page style="padding-left: 20px">
        <h4 class="q-my-sm">Les prochains ateliers</h4>
    <q-card v-for="(activite, index) in activites" inline style="width: 250px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" class="shadow-1">
      <q-card-media>
        <img height="150" width="250" :src="activite.image" />
      </q-card-media>
      <q-card-title style="padding: 0px; margin-top: 0px; margin-right: 10px; margin-left: 10px;">
        <div style="font-size: medium; font-variant: small-caps; padding: 0px; margin: 0px"><b>{{activite.titre.length > 25 ? activite.titre.substring(0, 22)+'...' : activite.titre}} </b></div>
        <q-icon name="fa-ellipsis-v" color="amber-8" slot="right" size="20px">
              <q-popover touch-position style="padding: 10px" class="shadow-3">
                <q-list link dense no-border>
                  <q-item @click.native="effacerActivite(activite.id, index, activite.inscriptions.length)" v-close-overlay v-if="activite.inscriptions.length === 0">
                     <q-item-side icon="fa-trash" />
                     <q-item-main>Supprimer
                     </q-item-main>
                   </q-item>
                    <q-item @click.native="$router.push({ name: 'listeInscrits', params: { idAtelier: activite.id }})" v-close-overlay>
                     <q-item-side icon="fas fa-users"></q-item-side>
                     <q-item-main>
                       {{activite.inscriptions.length}} inscrits
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push({ name: 'bilanAtelier', params: { idAtelier: activite.id }})" v-close-overlay>
                     <q-item-side icon="fas fa-flag-checkered"></q-item-side>
                     <q-item-main>
                       Bilan de l'atelier
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('dupliquerAtelier/'+activite.id)" v-close-overlay>
                     <q-item-side icon="fa-copy" />
                     <q-item-main>
                       Dupliquer
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('modifierAtelier/'+activite.id)" v-close-overlay>
                     <q-item-side icon="fa-edit" />
                     <q-item-main>
                       Modifier
                     </q-item-main>
                   </q-item>
                   <q-item v-if="activite.publie && activite.inscriptions.length === 0" @click.native="togglePublication(activite.id, !activite.publie, activite.inscriptions.length)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Mode brouillon
                     </q-item-main>
                   </q-item>
                   <q-item v-else-if="!activite.publie" @click.native="togglePublication(activite.id, !activite.publie, activite.inscriptions.length)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Publier
                     </q-item-main>
                   </q-item>
                </q-list>
              </q-popover>
          </q-icon>
      </q-card-title>
      <q-card-main>
        <div v-html="parseMarkdown(activite.description)"></div>
      </q-card-main>
    </q-card>
      <h4 class="q-my-sm" v-if="ateliersNonPublies.length > 0">En attente de validation</h4>
          <q-card v-for="(activite, index) in ateliersNonPublies" inline style="width: 250px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" class="shadow-1">
      <q-card-media>
        <img height="150" width="250" :src="activite.image" />
      </q-card-media>
      <q-card-title style="padding: 0px; margin-top: 0px; margin-right: 10px; margin-left: 10px;">
        <div style="font-size: medium; font-variant: small-caps; padding: 0px; margin: 0px"><b>{{activite.titre.length > 25 ? activite.titre.substring(0, 22)+'...' : activite.titre}} </b></div>
        <q-icon name="fa-ellipsis-v" color="amber-8" slot="right" size="20px">
              <q-popover touch-position style="padding: 10px" class="shadow-3">
                <q-list link dense no-border>
                  <q-item @click.native="effacerActivite(activite.id, index, activite.inscriptions.length)" v-close-overlay  v-if="activite.inscriptions.length === 0">
                     <q-item-side icon="fa-trash" />
                     <q-item-main>
                       Supprimer
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push({ name: 'listeInscrits', params: { atelierId: activite.id }})" v-close-overlay disabled="activite.inscriptions.length === 0">
                     <q-item-side icon="fas fa-users"></q-item-side>
                     <q-item-main>
                       Les inscrits
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('dupliquerAtelier/'+activite.id)" v-close-overlay>
                     <q-item-side icon="fa-copy" />
                     <q-item-main>
                       Dupliquer
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('modifierAtelier/'+activite.id)" v-close-overlay>
                     <q-item-side icon="fa-edit" />
                     <q-item-main>
                       Modifier
                     </q-item-main>
                   </q-item>
                   <q-item v-if="activite.publie && activite.inscriptions.length === 0" @click.native="togglePublication(activite.id, !activite.publie, activite.inscriptions.length)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Mode brouillon
                     </q-item-main>
                   </q-item>
                   <q-item v-else @click.native=" togglePublication(activite.id, !activite.publie, activite.inscriptions.length)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Publier
                     </q-item-main>
                   </q-item>
                </q-list>
              </q-popover>
          </q-icon>
      </q-card-title>
      <q-card-main>
        <div v-html="parseMarkdown(activite.description)"></div>
      </q-card-main>
    </q-card>
    <h4 class="q-my-sm" v-if="lesArchives.length > 0">Archives</h4>
    <q-card v-for="activite in lesArchives" inline style="width: 250px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" class="shadow-1">
      <q-card-media>
        <img :src="urlImage(activite.illustration,250,150,100,'', 'lfill')">
      </q-card-media>
      <q-card-title style="padding: 0px; margin-top: 0px; margin-right: 10px; margin-left: 10px;">
        <div style="font-size: medium; font-variant: small-caps; padding: 0px; margin: 0px"><b>{{activite.titreActivite}} </b></div>
        <q-icon name="fa-ellipsis-v" color="amber-8" slot="right" size="20px">
              <q-popover touch-position style="padding: 10px" class="shadow-3">
                <q-list link dense no-border>
                    <q-item @click.native="$router.push({ name: 'listeInscrits', params: { idAtelier: activite.id }})" v-close-overlay>
                     <q-item-side icon="fas fa-users"></q-item-side>
                     <q-item-main>
                       {{activite.inscriptions.length}} inscrits
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push({ name: 'bilanAtelier', params: { idAtelier: activite.id }})" v-close-overlay>
                     <q-item-side icon="fas fa-flag-checkered"></q-item-side>
                     <q-item-main>
                       Bilan de l'atelier
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('dupliquerAtelier/'+activite.id)" v-close-overlay>
                     <q-item-side icon="fa-copy" />
                     <q-item-main>
                       Dupliquer
                     </q-item-main>
                   </q-item>
                </q-list>
              </q-popover>
          </q-icon>
      </q-card-title>
      <q-card-main>
        <div v-html="parseMarkdown(activite.description)"></div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import {
  QSpinnerGears,
  date
} from 'quasar'

import { UPDATE_ACTIVITE_PUBLIE, EFFACE_ACTIVITE } from '../../graphQL/activitesAdmin'
import {QUERY_ALL_ACTIVITES_ASC, ARCHIVES_DESC} from '../../graphQL/ateliers'

// import cloudinary from 'cloudinary-core'
// var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})
// const today = new Date()

// import VueMarkdown from 'vue-markdown'
import { traitementDateMixins } from '../../utils/traitementDate'
import { traitementAgendaMixins } from '../../utils/traitementAgenda'
import { genURLImageMixins } from '../../utils/genURLImage'
import { parseMarkdownMixins } from '../../utils/parseMarkdown'

export default {
  name: 'ListeAteliers',
  mixins: [traitementDateMixins, traitementAgendaMixins, genURLImageMixins, parseMarkdownMixins],
  components: {
    QSpinnerGears
  },
  data () {
    return {
      loadingActivites: 0,
      activites: [],
      tableauActivite: [],
      ateliersNonPublies: [],
      etatPublication: false,
      illustrations: [],
      aujourdhui: date.formatDate(date.subtractFromDate(Date.now(), { days: 1 }), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      lesArchives: []
    }
  },
  mounted: function () {
    this.$q.loading.hide()
  },
  apollo: {
    allActivites: {
      query: QUERY_ALL_ACTIVITES_ASC,
      variables () {
        return {
          aujourdhui: this.aujourdhui
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingActivites = isLoading
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
        this.tableauActivite = []
        this.activites = []
        this.ateliersNonPublies = []
        let imageIllu = ''
        result.data.allActivites.forEach(async (activite, index) => {
          this.tableauActivite[activite.id] = {
            aId: activite.id,
            summary: activite.titreActivite,
            location: activite.lieuActivite,
            description: activite.description,
            dates: activite.dates
          }
          // imageIllu = cl.url(activite.illustration, { width: 250, height: 150, crop: 'fill', gravity: 'auto' })
          imageIllu = this.urlImage(activite.illustration, 250, 150, 100, '', 'fill')
          let atelier = {
            id: activite.id,
            publie: activite.publie,
            lieu: activite.lieuActivite,
            prix: activite.prix,
            titre: activite.titreActivite,
            description: activite.description,
            image: imageIllu,
            inscriptions: activite.inscriptions
          }
          if (activite.publie) {
            console.log('publié')
            this.activites.push(atelier)
          } else {
            console.log('pas publié')
            this.ateliersNonPublies.push(atelier)
          }
        })
      }
    },
    archives: {
      query: ARCHIVES_DESC,
      variables () {
        return {
          aujourdhui: this.aujourdhui
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingActivites = isLoading
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
      update (result) {
        this.lesArchives = []
        this.lesArchives = Object.assign([], result.allActivites)
        console.log('archives', this.lesArchives)
      }
    }
  },
  methods: {
    effacerActivite: function (id, index, nbInscrits) {
      if (nbInscrits > 0) {
        this.$q.notify({
          type: 'warning',
          timeout: 2500,
          message: 'Cette action n\'est pas possible : des inscriptions ont été enregistrées pour cet atelier.'
        })
        return
      }
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette activité ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffacerActivite(id)
      }).catch(() => {
      })
    },
    processEffacerActivite: function (id) {
      let promises = []
      let datesAEffacer = []
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Mise à jour de la base de données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.listeActivitesCycle[id].dates.forEach((laDate) => {
        // promises.push(this.effacerEventGCalendar(laDate.idGoogleEvent))
        laDate.horaires.forEach((horaire) => {
          datesAEffacer.push(horaire.uid)
        })
      })
      this.effaceEventFromAgenda(datesAEffacer)
      promises.push(
        this.$apollo.mutate({
          mutation: EFFACE_ACTIVITE,
          variables: {
            id: id
          }
        })
      )
      Promise.all(promises).then((data) => {
        this.$q.loading.hide()
        this.$apollo.queries.allActivites.refetch()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'L\'atelier a été effacé avec succès.'
        })
      })
    },
    togglePublication: function (id, newPublication, nbInscrits) {
      if (nbInscrits > 0) {
        this.$q.notify({
          type: 'warning',
          timeout: 2500,
          message: 'Cette action n\'est pas possible : des inscriptions ont été enregistrées pour cet atelier.'
        })
        return
      }
      var message = ''
      if (newPublication) {
        message = 'Publication en cours...'
      } else {
        message = 'Retour en mode brouillon...'
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: message,
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      // let lesDates = []
      let promises = []
      let datesAEffacer = []
      let datesForAgenda = []
      let datesForSave = []
      console.log('generation des dates')
      this.tableauActivite[id].dates.forEach((laDate, index) => {
        // const sequence = laDate.sequenceEvent + 1
        let horairesForSave = []
        laDate.horaires.forEach((horaire) => {
          datesAEffacer.push(horaire.uid)
          let uid = this.generateId()
          datesForAgenda.push({
            date: laDate.date,
            horaire: horaire.creneau,
            uid: uid,
            status: newPublication ? 'CONFIRMED' : 'TENTATIVE'
          })
          horairesForSave.push({
            creneau: horaire.creneau,
            uid: uid
          })
        })
        datesForSave.push({
          date: laDate.date,
          horaires: horairesForSave
        })
      })
      console.log('on efface from agenda')
      this.effaceEventFromAgenda(datesAEffacer)
      console.log('on ajoute to agenda')
      this.addAgenda(this.tableauActivite[id].summary, this.tableauActivite[id].location, datesForAgenda)
      promises.push(
        this.$apollo.mutate({
          mutation: UPDATE_ACTIVITE_PUBLIE,
          variables: {
            id: this.tableauActivite[id].aId,
            publie: newPublication,
            dates: datesForSave
          }
        }).catch((error) => {
          this.$q.loading.hide()
          console.log(error)
        })
      )
      Promise.all(promises).then((data) => {
        this.$q.loading.hide()
        this.$apollo.queries.allActivites.refetch()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'La publication a été modifiée avec succès.'
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    generateId: function () {
      // desired length of Id
      var idStrLen = 32
      // always start with a letter -- base 36 makes for a nice shortcut
      var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36)
      // add a timestamp in milliseconds (base 36 again) as the base
      idStr += (new Date()).getTime().toString(36)
      // similar to above, complete the Id using random, alphanumeric characters
      do {
        idStr += (Math.floor((Math.random() * 35))).toString(36)
      } while (idStr.length < idStrLen)
      return (idStr)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
