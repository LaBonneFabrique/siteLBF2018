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
                   <q-item @click.native="$router.push('modifierNews/'+activite.id)" v-close-overlay>
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
    <h4 class="q-my-sm">Les dernières infos</h4>
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
                   <q-item @click.native="$router.push('modifierNews/'+activite.id)" v-close-overlay>
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
// import { EFFACE_ACTIVITE, UPDATE_ACTIVITE_PUBLIE, UPDATE_ACTIVITE_SEQUENCE } from '../../constants/activitesGraphQL-2'
import {LISTE_NEWS, EFFACE_NEWS, UPDATE_NEWS_PUBLIE} from '../../graphQL/news'
import {GET_ILLU_BY_ID} from '../../constants/illustrationsGraphQL'
// import {DELETE_EVENT, UPDATE_EVENT} from '../../graphQL/googleAgendaGraphQL'
import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})
// const today = new Date()

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
      query: LISTE_NEWS,
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
          if (listeUnique.indexOf(activite.idCycle) < 0) {
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
            listeUnique += activite.idCycle
            this.etatPublication = activite.publie
            await this.$apollo.query({
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
            })
            let atelier = {
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
            }
            if (activite.publie) {
              this.activites.push(atelier)
            } else {
              console.log('bi !', activite.id)
              this.ateliersNonPublies.push(atelier)
            }
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
        console.log(listeActivitesCycle)
        Object.assign(this.listeActivitesCycle, listeActivitesCycle)
        console.log(this.listeActivitesCycle)
      }
    }
  },
  methods: {
    effacerActivite: function (idNews, index) {
      this.menuCarte[index] = false
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette info ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffacerActivite(idNews)
      }).catch(() => {
      })
    },
    processEffacerActivite: function (idNews) {
      this.$apollo.mutate({
        mutation: EFFACE_NEWS,
        variables: {
          id: idNews
        }
      }).then((result) => {
        this.$apollo.queries.allActivites.refetch()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'L\'info a été effacé avec succès.'
        })
      })
    },
    togglePublication: function (idNews, newPublication) {
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
      this.$apollo.mutate({
        mutation: UPDATE_NEWS_PUBLIE,
        variables: {
          id: idNews,
          publie: newPublication
        }
      }).then((result) => {
        this.$q.loading.hide()
        this.$apollo.queries.allActivites.refetch()
        this.$q.notify({
          type: 'positive',
          timeout: 2500,
          message: 'La publication a été modifiée avec succès.'
        })
      }).catch((error) => {
        this.$q.loading.hide()
        console.log(error)
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
