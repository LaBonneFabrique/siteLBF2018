<template>
  <q-page style="padding-left: 20px">
      <h4 class="q-my-sm">En attente de validation</h4>
          <q-card v-for="(activite, index) in ateliersNonPublies" inline style="width: 250px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" class="shadow-1">
      <q-card-media>
        <img height="150" width="250" :src="activite.image" />
      </q-card-media>
      <q-card-title style="padding: 0px; margin-top: 0px; margin-right: 10px; margin-left: 10px;">
        <div style="font-size: medium; font-variant: small-caps; padding: 0px; margin: 0px"><b>{{activite.titre.length > 25 ? activite.titre.substring(0, 22)+'...' : activite.titre}} </b></div>
        <q-icon name="fa-ellipsis-v" color="amber-8" slot="right" size="20px">
              <q-popover touch-position style="padding: 10px" class="shadow-3">
                <q-list link dense no-border>
                  <q-item @click.native="effacerActivite(activite.id, index)" v-close-overlay>
                     <q-item-side icon="fa-trash" />
                     <q-item-main>
                       Effacer
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
                   <q-item v-if="activite.publie" @click.native="togglePublication(activite.id, !activite.publie)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Mode brouillon
                     </q-item-main>
                   </q-item>
                   <q-item v-else @click.native=" togglePublication(activite.id, !activite.publie)" v-close-overlay>
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
        <vue-markdown :source="activite.description"></vue-markdown>
      </q-card-main>
    </q-card>
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
                  <q-item @click.native="effacerActivite(activite.id, index)" v-close-overlay>
                     <q-item-side icon="fa-trash" />
                     <q-item-main>
                       Effacer
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
                   <q-item v-if="activite.publie" @click.native="togglePublication(activite.id, !activite.publie)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Mode brouillon
                     </q-item-main>
                   </q-item>
                   <q-item v-else @click.native="togglePublication(activite.id, !activite.publie)" v-close-overlay>
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
        <vue-markdown :source="activite.description"></vue-markdown>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'

// import {EFFACE_CRENEAU, EFFACE_PRIX, UPDATE_ACTIVITE_PUBLIE, UPDATE_CRENEAU_IDGOOGLEEVENT} from '../constants/activitesGraphQL'
// import { UPDATE_ACTIVITE_SEQUENCE } from '../../constants/activitesGraphQL-2'
import { UPDATE_ACTIVITE_PUBLIE, EFFACE_ACTIVITE } from '../../graphQL/activitesAdmin'
import {LISTE_ATELIERS} from '../../graphQL/ateliers'
// import {GET_ILLU_BY_ID} from '../../constants/illustrationsGraphQL'
import {DELETE_EVENT, UPDATE_EVENT} from '../../graphQL/googleAgendaGraphQL'
import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})
// const today = new Date()

import VueMarkdown from 'vue-markdown'
import { traitementDateMixins } from '../../utils/traitementDate'
import { traitementAgendaMixins } from '../../utils/traitementAgenda'

export default {
  name: 'ListeAteliers',
  mixins: [traitementDateMixins, traitementAgendaMixins],
  components: {
    QSpinnerGears,
    VueMarkdown
  },
  data () {
    return {
      loadingActivites: 0,
      activites: [],
      listeActivitesCycle: [],
      ateliersNonPublies: [],
      etatPublication: false,
      illustrations: []
    }
  },
  mounted: function () {
    this.$q.loading.hide()
  },
  apollo: {
    allActivites: {
      query: LISTE_ATELIERS,
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
        var listeActivitesCycle = []
        this.listeActivitesCycle = []
        this.activites = []
        this.ateliersNonPublies = []
        var listeUnique = ''
        let imageIllu = ''
        result.data.allActivites.forEach(async (activite, index) => {
          if (listeUnique.indexOf(activite.id) < 0) {
            listeActivitesCycle[activite.id] = {
              aId: activite.id,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dates: activite.dates
            }
            listeUnique += activite.idCycle
            this.etatPublication = activite.publie
            imageIllu = cl.url(activite.illustration, { width: 250, height: 150, crop: 'fill', gravity: 'auto' })
            /* await this.$apollo.query({
              query: GET_ILLU_BY_ID,
              fetchPolicy: 'network-only',
              variables: {
                id: activite.illustration
              }
            }).then((data) => {
              const illustration = data.data.allActivitesIllustrations[0]
              if (illustration) {
                imageIllu = cl.url(illustration.idImage + '.' + illustration.format, { width: 250, height: 150, crop: 'fill', gravity: 'auto' })
              } else {
                imageIllu = cl.url('logoLBFmoyen_p1zcu0.png', { width: 250, height: 150, crop: 'fill', gravity: 'auto' })
              }
            }).catch((error) => {
              console.log(error)
            }) */
            let atelier = {
              id: activite.id,
              publie: activite.publie,
              lieu: activite.lieuActivite,
              prix: activite.prix,
              titre: activite.titreActivite,
              description: activite.description,
              image: imageIllu
            }
            if (activite.publie) {
              this.activites.push(atelier)
            } else {
              this.ateliersNonPublies.push(atelier)
            }
          } else {
            listeActivitesCycle[activite.id].push({
              aId: activite.id,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dates: activite.dates
            })
          }
        })
        console.log(listeActivitesCycle)
        Object.assign(this.listeActivitesCycle, listeActivitesCycle)
        console.log(this.listeActivitesCycle)
      }
    }
  },
  methods: {
    effacerActivite: function (id, index) {
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
    effacerEventGCalendar: function (idEventGCalendar) {
      return this.$apollo.query({
        query: DELETE_EVENT,
        variables: {
          eventId: idEventGCalendar
        }
      }).then((data) => {
      }).catch((error) => {
        console.log('erreur: %s', error)
      })
    },
    ajouterEventGCalendar: function (laDate, summary, location, description, status) {
      const eventDataGoogle = {
        summary: summary,
        location: location,
        description: description,
        start: {dateTime: this.ajusteDate(laDate.date, laDate.horaire.min)},
        end: {dateTime: this.ajusteDate(laDate.date, laDate.horaire.max)},
        status: status,
        sequence: laDate.sequenceEvent
      }
      return this.$apollo.query({
        query: UPDATE_EVENT,
        variables: {
          eventId: laDate.idGoogleEvent,
          dataEvent: eventDataGoogle
        }
      }).then((data) => {
      }).catch((error) => {
        console.log('erreur', error)
      })
    },
    togglePublication: function (id, newPublication) {
      console.log(newPublication)
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
      this.listeActivitesCycle[id].dates.forEach((laDate, index) => {
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
        // lesDates.push({date: laDate.date, horaire: laDate.horaire, uid: this.generateId(), status: newPublication ? 'CONFIRMED' : 'TENTATIVE'})
        /* if (newPublication) {
          promises.push(this.ajouterEventGCalendar(laDate, this.listeActivitesCycle[id].summary, this.listeActivitesCycle[id].location, this.listeActivitesCycle[id].description, 'confirmed'))
        } else {
          promises.push(this.ajouterEventGCalendar(laDate, this.listeActivitesCycle[id].summary, this.listeActivitesCycle[id].location, this.listeActivitesCycle[id].description, 'cancelled'))
        } */
      })
      this.effaceEventFromAgenda(datesAEffacer)
      this.addAgenda(this.listeActivitesCycle[id].summary, this.listeActivitesCycle[id].location, datesForAgenda)
      promises.push(
        this.$apollo.mutate({
          mutation: UPDATE_ACTIVITE_PUBLIE,
          variables: {
            id: this.listeActivitesCycle[id].aId,
            publie: newPublication,
            dates: datesForSave
          }
        }).catch((error) => {
          this.$q.loading.hide()
          console.log(error)
        })
      )
      /* this.listeActivitesCycle[id].forEach((item) => {
        promises.push(
          this.$apollo.mutate({
            mutation: UPDATE_ACTIVITE_PUBLIE,
            variables: {
              id: item.aId,
              publie: newPublication
            }
          }).catch((error) => {
            this.$q.loading.hide()
            console.log(error)
          })
        )
        console.log('update google')
        if (newPublication) {
          promises.push(this.ajouterEventGCalendar(item, 'confirmed'))
        } else {
          promises.push(this.ajouterEventGCalendar(item, 'cancelled'))
        }
        console.log('update sequence')
        promises.push(this.updateSequence(item.aId, item.sequence))
      }) */
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
