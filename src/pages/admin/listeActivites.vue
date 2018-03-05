<template>
  <q-page >
        <q-btn
      flat
      color="primary"
      @click="$router.push({name:'ajoutActivite'})"
      class="col-md-4"
      label = "Ajouter une activité"
      >
      </q-btn><br />
    <q-card v-for="(activite, index) in activites" inline style="width: 350px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" >
      <q-item>
        <q-item-side>
          <q-checkbox
            v-model='activite.publie'
            unchecked-icon="far fa-square"
            checked-icon="far fa-check-square"
            @input="togglePublication(activite.idCycle, activite.publie)">
            <q-tooltip anchor="center right" self="center left">publier/dépublier</q-tooltip>
          </q-checkbox>
        </q-item-side>
        <q-item-main>
          <q-item-tile v-if="activite.publie" label>Publié</q-item-tile>
          <q-item-tile v-else label>Non publié</q-item-tile>
        </q-item-main>
        <q-item-side>
          <q-btn
          flat
          inverted
          color="amber-8"
          @click="menuCarte[index] = true"
          >
            <q-tooltip anchor="center right" self="center left">Actions</q-tooltip>
            <q-icon name="fa-ellipsis-v" />
              <q-popover v-model = "menuCarte[index]" touch-position style="padding: 10px" class="shadow-3">
                <q-list link dense no-border>
                  <q-item @click.native="effacerActivite(activite.idCycle, index)" v-close-overlay>
                     <q-item-side icon="fa-trash" />
                     <q-item-main>
                       Effacer
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('dupliquerAtelier/'+activite.idCycle)" v-close-overlay>
                     <q-item-side icon="fa-copy" />
                     <q-item-main>
                       Dupliquer
                     </q-item-main>
                   </q-item>
                   <q-item @click.native="$router.push('modifierAtelier/'+activite.idCycle)" v-close-overlay>
                     <q-item-side icon="fa-edit" />
                     <q-item-main>
                       Modifier
                     </q-item-main>
                   </q-item>
                   <q-item v-if="activite.publie" @click.native="togglePublication(activite.idCycle, !activite.publie)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Mode brouillon
                     </q-item-main>
                   </q-item>
                   <q-item v-else @click.native=" togglePublication(activite.idCycle, !activite.publie)" v-close-overlay>
                     <q-item-side icon="fa-paste" />
                     <q-item-main>
                       Publier
                     </q-item-main>
                   </q-item>
                </q-list>
              </q-popover>
          </q-btn>
        </q-item-side>
      </q-item>
      <q-card-media>
        <img height="150" width="350" :src="activite.image" />
      </q-card-media>
      <q-card-title style="padding: 5px; margin-top: 5px">
        {{activite.titre}}
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
import { QUERY_ALL_ACTIVITES, EFFACE_ACTIVITE, UPDATE_ACTIVITE_PUBLIE, UPDATE_ACTIVITE_SEQUENCE } from '../../constants/activitesGraphQL-2'
import {GET_ILLU_BY_ID} from '../../constants/illustrationsGraphQL'
import {DELETE_EVENT, UPDATE_EVENT} from '../../constants/googleAgendaGraphQL'
import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})

import VueMarkdown from 'vue-markdown'

export default {
  name: 'ListeAteliers',
  components: {
    QSpinnerGears,
    VueMarkdown
  },
  data () {
    return {
      loadingActivites: 0,
      activites: [],
      listeActivitesCycle: [],
      etatPublication: false,
      illustrations: [],
      menuCarte: []
    }
  },
  mounted: function () {
    this.$q.loading.hide()
  },
  apollo: {
    allActivites: {
      query: QUERY_ALL_ACTIVITES,
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
        var activites = []
        var listeActivitesCycle = []
        this.listeActivitesCycle = []
        this.activites = []
        var listeUnique = ''
        let indice = 0
        result.data.allActivites.forEach((activite, index) => {
          if (listeUnique.indexOf(activite.idCycle) < 0) {
            this.menuCarte.push(false)
            listeUnique += activite.idCycle
            listeActivitesCycle[activite.idCycle] = [{
              aId: activite.id,
              gId: activite.idGoogleEvent,
              sequence: activite.sequenceEvent,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dateDebut: activite.dateDebut,
              dateFin: activite.dateFin
            }]
            this.etatPublication = activite.publie
            this.$apollo.query({
              query: GET_ILLU_BY_ID,
              variables: {
                id: activite.illustration
              }
            }).then((data) => {
              const illustration = data.data.allActivitesIllustrations[0]
              let imageIllu = ''
              if (illustration) {
                imageIllu = cl.url(illustration.idImage + '.' + illustration.format, { width: 350, height: 150, crop: 'fill', gravity: 'auto' })
              } else {
                imageIllu = cl.url('logoLBFmoyen_p1zcu0.png', { width: 350, height: 150, crop: 'fill', gravity: 'auto' })
              }
              this.$set(this.activites, indice, {
                id: activite.id,
                idCycle: activite.idCycle,
                publie: activite.publie,
                lieu: activite.lieuActivite,
                prix: activite.prix,
                titre: activite.titreActivite,
                description: activite.description,
                image: imageIllu,
                idGoogleEvent: activite.idGoogleEvent,
                sequenceEvent: activite.sequenceEvent
              })
              indice += 1
            }).catch((error) => {
              console.log(error)
            })
          } else {
            listeActivitesCycle[activite.idCycle].push({
              aId: activite.id,
              gId: activite.idGoogleEvent,
              sequence: activite.sequenceEvent,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dateDebut: activite.dateDebut,
              dateFin: activite.dateFin
            })
          }
        })
        Object.assign(this.activites, activites)
        Object.assign(this.listeActivitesCycle, listeActivitesCycle)
      }
    }
  },
  methods: {
    effacerActivite: function (idCycle, index) {
      this.menuCarte[index] = false
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette activité ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffacerActivite(idCycle)
      }).catch(() => {
      })
    },
    processEffacerActivite: function (idCycle) {
      console.log('le cycle', this.listeActivitesCycle[idCycle])
      let promises = []
      this.listeActivitesCycle[idCycle].forEach((activite) => {
        promises.push(this.effacerEventGCalendar(activite.gId))
        promises.push(
          this.$apollo.mutate({
            mutation: EFFACE_ACTIVITE,
            variables: {
              id: activite.aId
            }
          })
        )
      })
      Promise.all(promises).then((data) => {
        this.$apollo.queries.allActivites.refetch()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'L\'atelier a été effacé avec succès.'
        })
      })
    },
    effacerEventGCalendar: function (idEventGCalendar) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Mise à jour du calendrier Google',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      return this.$apollo.query({
        query: DELETE_EVENT,
        variables: {
          eventId: idEventGCalendar
        }
      }).then((data) => {
        this.$q.loading.hide()
      }).catch((error) => {
        console.log('erreur: %s', error)
      })
    },
    ajouterEventGCalendar: function (activite, status) {
      const newSequence = activite.sequence + 1
      const eventDataGoogle = {
        summary: activite.summary,
        location: activite.location,
        description: activite.description,
        start: {dateTime: activite.dateDebut},
        end: {dateTime: activite.dateFin},
        status: status,
        sequence: newSequence
      }
      return this.$apollo.query({
        query: UPDATE_EVENT,
        variables: {
          eventId: activite.gId,
          dataEvent: eventDataGoogle
        }
      }).then((data) => {
      }).catch((error) => {
        console.log('erreur', error)
      })
    },
    togglePublication: function (idCycle, newPublication) {
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
      let promises = []
      this.listeActivitesCycle[idCycle].forEach((item) => {
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
      })
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
    updateSequence: function (aId, sequence) {
      const newSequence = sequence + 1
      return this.$apollo.mutate({
        mutation: UPDATE_ACTIVITE_SEQUENCE,
        variables: {
          id: aId,
          sequenceEvent: newSequence
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
