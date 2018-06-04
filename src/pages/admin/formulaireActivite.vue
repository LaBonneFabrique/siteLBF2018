<template>
  <q-page class='formActivite'>
       <q-input
          v-model='dataEvent.titreActivite'
          placeholder='Une nouvelle activité'
          class="titreActivite"
          style="margin-bottom: 10px"
          />
       <div class='row'>
      <div class="col-sm-5">
      <q-select
          stack-label='Espace concerné'
          color='tertiary'
          inverted
          separator
          v-model='dataEvent.section'
          :options='listeSection'
          />
          <q-field
            icon="fas fa-globe"
            label="Lieu"
            labelWidth="2"
            style="margin-top: 10px"
            icon-color="tertiary"
          >
      <q-input v-model='dataEvent.lieuActivite' placeholder='La Bonne Fabrique'/>
      </q-field>
        <q-btn
          @click="modalIllustration = true"
          class="col-8 offset-2"
          color="tertiary"
          style="margin-top: 10px;margin-bottom: 10px;"
          label="Choisir une illustration"
          >
        </q-btn>
        <img
            height="150"
            width="150"
            :src="urlImage('logoLBFSeul_a1t4af.png',150,150,100,'', 'fill')"
            class="col-6 offset-3"
            style="border: 1px solid grey"
            @click="modalIllustration = true"
            v-if="dataEvent.illustration === ''"
            />
          <img
            height="150"
            width="150"
            :src="urlImage(dataEvent.illustration,150,150,100,'', 'fill')"
            class="col-6 offset-3"
            style="border: 1px solid grey"
            @click="modalIllustration = true"
            v-else
            />
        </div>
      <div class="col-sm-6 offset-sm-1">
        <q-field
          icon="fas fa-file-alt"
          label="Description"
          icon-color="tertiary"
          />
       <q-input
          type='textarea'
          v-model='dataEvent.description'
          placeholder='...'
          rows='14'></q-input>
           <!-- <q-editor v-model="dataEvent.description" /> -->
          <q-btn @click="modalEditeur = true" label="éditer avec aide au formatage" color="tertiary" style="margin-top: 20px;"></q-btn>
      </div>
    </div>
          <q-field
            icon="far fa-clock"
            label="Dates, horaires et nombre de participants"
            :label-width="11"
            style="margin-top: 10px"
            icon-color="primary"
            />
            <div class="row" style="margin-bottom: 10px; padding-top: 5px">
              <!-- <q-checkbox v-if="dataEvent.checkInscription" v-model='dataEvent.checkInscriptionCycle' label="Sur tout le cycle ?" style="margin-top: 5px" class="col-md-3 col-xs-5 offset-1"/> -->
            </div>
              <div class="row">
              <q-field
                icon="fa-users"
                :label-width="6"
                class="col-md-6 offset-1"
                label="Nb de participants"
                icon-color="primary"
              >
                <q-input v-model="maxParticipants" type="number" class="col-md-1"/>
              </q-field>
              <q-checkbox v-model='dataEvent.checkInscription' label="Sur Inscription ?" style="margin-top: 5px" class="col-md-3 col-xs-5 offset-1"/>
              </div>
              <q-field
                icon="fas fa-clock"
                :label-width="2"
                label="horaire"
                style="margin-top: 5px"
                class="col-md-8 offset-1"
                icon-color="primary"
                >
              </q-field>
              <div class="row">
                  <q-range
                    v-model="horaire"
                    :min="9"
                    :max="22"
                    :step="0.5"
                    snap
                    markers
                    label-always
                    :left-label-value="afficheHeure(horaire.min)"
                    :right-label-value="afficheHeure(horaire.max)"
                    class="offset-1 col-6"
                  />
                </div>
            <q-field
                icon="fa-calendar"
                :label-width="1"
                label="dates"
                class="col-md-10 offset-1"
                style="margin-bottom: 10px; margin-top: 10px"
                icon-color="primary"
                >
                <choix-dates :propDates="lesDates" v-on:remove="(val) => {removeHoraire(val)}" ></choix-dates>
            </q-field>
          <q-chip v-for="(laDate, index) in lesDates" :key="toTimeStamp(laDate.date)+'pr'" closable square color="primary" @hide="removeHoraire(index)" class="offset-1">
        {{toDateReadable(laDate.date)}}
      </q-chip>
          <q-field
      icon='fas fa-euro-sign'
      label="Prix"
      style="margin-top: 10px"
      icon-color="secondary"
      />
      <q-btn
        flat
        icon="fa-plus"
        color="secondary"
        style="margin-left: 40px; margin-top: 4px; margin-bottom: 4px"
        @click="ajoutPrix"
        class="col-md-3 col-xs-7"
        label = "Ajouter un prix"
        icon-color="tertiary">
      </q-btn>
      <div class="row">
        <div v-for="(pri, index) in dataEvent.prix"  class="col-sm-5 liste" :key="pri.prix+index">
          <div class="row">
            <q-field
                icon="fas fa-euro-sign"
                :label-width="1"
                class="col-8"
                icon-color="secondary"
                >
            <q-input v-model='pri.prix' type="number" placeholder='0' class="col-sm-1" />
            </q-field>
            <q-btn flat color="secondary" class="col-2 offset-2" @click="removePrix(index)">
                <q-tooltip color="amber-8">
                  Effacer ce prix
              </q-tooltip>
                <q-icon name="fa-trash" />
              </q-btn>
            </div>
            <q-field
                icon="far fa-edit"
                :label-width="1"
                style="margin-top: 5px"
                icon-color="secondary"
                >
            <q-input v-model='pri.description' placeholder='Description' class="col-sm-5" />
            </q-field>
            <q-field
                label="QF ?"
                :label-width="2"
                style="margin-top: 5px"
                icon-color="secondary"
                >
            <q-checkbox v-model='pri.qf' class="col-sm-1" color="secondary"/>
            </q-field>
          </div>
      </div>
            <!--<div class="row">
            <div  v-for="(creneau, index) in dataEvent.creneaux" class="col-sm-5 liste" :key="creneau.date+index">
            <div class="row">
              <q-field
                icon="fa-calendar"
                :label-width="1"
                class="col-8"
                >
                <q-datetime
                    v-model="creneau.date"
                    type="date"
                    format24h
                    float-label="Date"
                    format="DD MMMM YYYY"
                    :month-names="monthNames"
                    :day-names="dayNames"
                    monday-first
                    ok-label="valider"
                    cancel-label="annuler"
                    clear-label="effacer"
                    :min="aujourdhui"
                    />
              </q-field>
              <q-btn flat color="amber-14" class="col-2 offset-2" @click="removeHoraire(index)" v-if = "boutonPoubelleCreneau(index)">
                <q-tooltip color="amber-8">
                  Effacer cette date
              </q-tooltip>
                <q-icon name="fa-trash" />
              </q-btn>
            </div>
              <q-field
                icon="fas fa-clock"
                :label-width="1"
                style="margin-top: 5px"
                >
                <q-range
                    v-model="creneau.horaire"
                    :min="9"
                    :max="18"
                    :step="0.5"
                    snap
                    markers
                    label
                    :left-label-value="afficheHeure(creneau.horaire.min)"
                    :right-label-value="afficheHeure(creneau.horaire.max)"
                  />
              </q-field>
              <div class="row" v-if="dataEvent.checkInscription" style="margin-top: 5px">
              <q-field
                icon="fa-users"
                :label-width="1"
                class="col-md-4"
              >
                <q-input v-model="creneau.maxParticipants" type="number" />
              </q-field>

              </div>
            </div>
            </div> -->

         <div class="row" style="margin-bottom: 20px">
    <q-btn
          icon="fa-times"
          color="warning"
          class="col-sm-3"
          style="margin-top: 0px; padding: 10px"
          @click="$router.push({name: 'lesateliers'})"
          label = "Annuler"
          >
        </q-btn>
        <q-btn
          icon="far fa-save"
          color="secondary"
          class="col-sm-3 offset-sm-1"
          style="margin-top: 0px; padding: 10px"
          @click="sauvegardeActivite(false)"
          label = "Brouillon"
          >
        </q-btn>
        <q-btn
          v-if="!idAtelier"
          icon="fas fa-pen-square"
          color="primary"
          class="col-sm-4 offset-sm-1"
          style="margin-top: 0px; padding: 10px"
          @click="sauvegardeActivite(true)"
          label = "Créer et publier"
          >
        </q-btn>
        <q-btn
          v-if="!!idAtelier && !dupliquer"
          icon="fas fa-pen-square"
          color="primary"
          class="col-sm-4 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegardeActivite(true)"
          label ="Modifier et publier"
          >
        </q-btn>
        <q-btn
          v-if="!!idAtelier && dupliquer"
          icon="fas fa-pen-square"
          color="primary"
          class="col-sm-4 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegardeActivite(true)"
          label ="Dupliquer"
          >
        </q-btn>
        </div>
    <!-- modals -->
    <q-modal
      v-model="modalIllustration"
      :content-css= "{padding: '10px'}"
      >
         <q-field
        icon='fa-camera-retro'
        label='Illustration'
        :label-width="4"
       >
     <q-btn flat color="faded" icon="fa-undo" @click="resetChoixIllu" style="margin-top: -5px " ></q-btn>
    </q-field>
    <div class="row" style="margin-left: 30px;">
    <div v-for="illu in listeDesIllu" :key="illu.id">
      <img height="150" width="150" :src="urlImage(illu.imageId+'.'+illu.format,150,150,100,'', 'fill')" />
      <div class="row justify-end">
        <q-radio
          v-model="dataEvent.illustration"
          :val="nomIllustration(illu.imageId, illu.format)"
          unchecked-icon="far fa-square"
          checked-icon="far fa-check-square"
        />
        <q-btn flat color="warning" @click="effaceImageDialogue(illu.id, illu.imageId)" icon="fa-times">

        </q-btn>
      </div>
    </div>
      <div v-if="loadIllu" class="row items-center justify-center" id='illuProcessing'>
        <q-spinner-gears size="30px" color="primary"></q-spinner-gears>
        <div class="justify-center messageProcess">{{message}}</div>
    </div>
    <vue-dropzone
      ref='illustrationDropzone'
      id='illuDropzone'
      :options='dropzoneOptions'
      @vdropzone-sending='envoieImage'
      @vdropzone-success='envoieSucces'
      @vdropzone-upload-progress='envoieProgres'
      @vdropzone-processing='processFile'
      />
      </div>
      <q-btn
        flat
        color="primary"
        @click="modalIllustration = false"
      >
        Valider
      </q-btn>
    </q-modal>
    <q-modal
    v-model="modalEditeur"
    :content-css= "{padding: '10px', 'min-width': '75%'}"
    position="top"
    ref="modalEdit"
    >
      <q-field
          icon="fas fa-file-alt"
          label="Description"
          />
      <markdown-editor v-model="dataEvent.description"></markdown-editor>
      <q-btn
      label="Sauvegarder"
      color="primary"
      outline
      v-close-overlay
      style="margin: 20px"
      ></q-btn>
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import markdownEditor from '../../components/markdownEditor'
import choixDates from '../../components/choixDates'
import {DEMINER_HTML} from '../../graphQL/sanitize'
import {ADD_EVENT, UPDATE_EVENT, DELETE_EVENT} from '../../graphQL/googleAgendaGraphQL'
import { LISTE_ESPACEBF } from '../../constants/listeEnums'
import { GET_LISTE_ILLU_FILTRE_ESPACE, ADD_LISTE_ILLU, DELETE_ILLU_GRAPHQL, DELETE_ILLU } from '../../constants/illustrationsGraphQL'
import { QUERY_ACTIVITE_BY_ID, UPDATE_ACTIVITE, ADD_ACTIVITE } from '../../graphQL/activitesAdmin'
// import { ADD_AGENDA, REMOVE_AGENDA } from '../../graphQL/gestionAgenda'
import { genURLImageMixins } from '../../utils/genURLImage'
import { parseMarkdownMixins } from '../../utils/parseMarkdown'
import { traitementDateMixins } from '../../utils/traitementDate'
import { traitementAgendaMixins } from '../../utils/traitementAgenda'

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

let newDate = Date.now()

export default {
  mixins: [genURLImageMixins, parseMarkdownMixins, traitementDateMixins, traitementAgendaMixins],
  components: {
    vueDropzone: vue2Dropzone,
    markdownEditor: markdownEditor,
    choixDates: choixDates
  },
  props: {
    idAtelier: String,
    dupliquer: Boolean,
    type: String
  },
  data () {
    return {
      modalIllustration: false,
      modalEditeur: false,
      dataEvent: {},
      listeDesIllu: [],
      dropzoneOptions: {
        autoProcessQueue: true,
        uploadMultiple: false,
        acceptedFiles: '.jpg,.png,.jpeg,.gif',
        parallelUploads: 10,
        url: 'https://api.cloudinary.com/v1_1/la-bonne-fabrique/image/upload',
        dictDefaultMessage: '<i class=\'fa fa-plus fa-4x\'></i>',
        previewsContainer: false,
        resizeWidth: 1920,
        resizeHeight: 1920,
        resizeMethod: 'contain',
        resizeQuality: 0.9
      },
      loadIllu: 0,
      message: 'rien',
      selectionIllu: '',
      efface: false,
      listeSection: [],
      monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      rangeValues: {
        min: 10,
        max: 12
      },
      aujourdhui: newDate,
      horaire: {min: 9, max: 10},
      maxParticipants: 8,
      lesDates: []
    }
  },
  apollo: {
    allEnums: {
      query: LISTE_ESPACEBF,
      update (data) {
        let listeEnum = data.__type.enumValues
        this.listeSection = []
        listeEnum.forEach((valeurEnum) => {
          this.listeSection.push({label: valeurEnum.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(L)(e)/g, '$1\'$2').replace(/(L)(ate)/g, '$1\'$2').replace('Partage', 'partagé'), value: valeurEnum.name})
        })
      }
    },
    allActivitesIllustrations: {
      query: GET_LISTE_ILLU_FILTRE_ESPACE,
      variables () {
        return {
          espace: this.dataEvent.section
        }
      },
      loadingKey: 'loadIllu',
      fetchPolicy: 'network-only',
      watchLoading (isLoading, countModifier) {
        this.loadIllu = isLoading
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
      update (data) {
        this.listeDesIllu = []
        data.allActivitesIllustrations.forEach((image) => {
          this.listeDesIllu.push({id: image.id, imageId: image.idImage, format: image.format, checked: false, efface: false})
        })
      }
    },
    getActivite: {
      query: QUERY_ACTIVITE_BY_ID,
      variables () {
        return {
          id: this.idAtelier
        }
      },
      fetchPolicy: 'network-only',
      skip () {
        this.dataEvent = {
          titreActivite: '',
          section: 'LaBonneFabrique',
          checkInscription: false,
          checkInscriptionCycle: true,
          lieuActivite: 'La Bonne Fabrique',
          description: '',
          creneaux: [{date: newDate, horaire: {min: 14.5, max: 17.0}, dateDebut: newDate, dateFin: newDate, maxParticipants: 8}],
          illustration: '',
          prix: [{description: 'Adhérents', prix: 10, qf: true}, {description: 'Non adhérents', prix: 15, qf: false}],
          publie: false
        }
        return !this.idAtelier
      },
      update (data) {
        Object.assign(this.dataEvent, data.allActivites[0])
        this.maxParticipants = this.dataEvent.maxParticipants
        this.dataEvent.dates.forEach((laDate) => {
          this.horaire = laDate.horaire
          this.lesDates.push({
            date: laDate.date,
            horaire: this.horaire,
            uid: laDate.uid
          })
          /* if (laDate.idGoogleEvent) {
            this.lesDates.push({
              date: laDate.date,
              horaire: this.horaire,
              idGoogleEvent: laDate.idGoogleEvent,
              sequenceEvent: laDate.sequenceEvent
            })
          } else {
            this.lesDates.push({
              date: laDate.date,
              horaire: this.horaire
            })
          } */
        })
        this.dataEvent.prix = []
        data.allActivites[0].prix.forEach((prix) => {
          this.dataEvent.prix.push({id: prix.id, description: prix.description, prix: prix.prix, qf: prix.qf})
        })
        // this.dataEvent = data.allActivites[0]
      }
    }
  },
  methods: {
    resetChoixIllu: function () {
      this.dataEvent.illustration = ''
    },
    removeHoraire: function (index) {
      /* if (this.lesDates[index].idGoogleEvent) {
        this.effaceEventGoogleCalendar(this.lesDates[index].idGoogleEvent)
      } */
      console.log(this.lesDates[index])
      if (this.lesDates[index].uid) {
        console.log('boum, on efface !')
        this.effaceEventFromAgenda([this.lesDates[index].uid])
      }
      this.lesDates.splice(index, 1)
    },
    removePrix: function (index) {
      this.dataEvent.prix.splice(index, 1)
    },
    ajoutPrix: function () {
      this.dataEvent.prix.push({description: 'Nouveau prix', prix: 15, qf: false})
    },
    envoieImage: (file, xhr, formData) => {
      formData.append('file', file)
      formData.append('upload_preset', 'howigptf') // Replace the preset name with your own
      formData.append('api_key', '355229151489945') // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0)
    },
    envoieSucces (file, response) {
      this.message = 'Succès !'
      this.$apollo.mutate({
        mutation: ADD_LISTE_ILLU,
        variables: {
          idImage: response.public_id,
          format: response.format,
          espace: this.dataEvent.section
        },
        updateQueries: {
        }
      }).then((data) => {
        this.$apollo.queries.allActivitesIllustrations.refetch()
        this.loadIllu = false
      }).catch((error) => {
        // Error
        console.error(error)
      })
    },
    envoieProgres (file, progress, bytesSent) {
      this.message = 'Téléversement ' + progress.toFixed(2) + ' %'
    },
    processFile (file) {
      this.loadIllu = true
      this.message = 'Réduction à une taille raisonnable si besoin...'
    },
    effaceImage (id, imageId) {
      this.$apollo.query({
        query: DELETE_ILLU,
        variables: {
          imageId
        }
      }).then((data) => {
        this.$apollo.mutate({
          mutation: DELETE_ILLU_GRAPHQL,
          variables: {
            id
          }
        }).then((data) => {
          this.$apollo.queries.allActivitesIllustrations.refetch()
          this.$q.notify({
            timeout: 2500,
            type: 'positive',
            message: 'L\'image a été effacée avec succès.'
          })
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    effaceImageDialogue (id, imageId) {
      this.$q.dialog.create({
        title: 'Confirmer',
        message: 'Effacer cette image ?',
        buttons: [
          'Annuler',
          {
            label: 'Effacer',
            handler: () => {
              this.effaceImage(id, imageId)
            }
          }
        ]
      })
    },
    async sauvegardeActivite (publie) {
      let descriptionDemine = ''
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Mise à jour de la base',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })

      await this.$apollo.mutate({
        mutation: DEMINER_HTML,
        variables: {
          texte: this.dataEvent.description
        }
      }).then((result) => {
        descriptionDemine = result.data.sanitize.sanitized
      }).catch((error) => {
        console.log(error)
      })
      console.log('CREATE')
      let promises = []
      let dateAEffacer = []
      this.lesDates.forEach((laDate, index) => {
        this.lesDates[index].horaire = this.horaire
        if (laDate.uid) dateAEffacer.push(laDate.uid)
        this.lesDates[index].uid = this.generateId()
        this.lesDates[index].status = publie ? 'CONFIRMED' : 'TENTATIVE'
      })
      if (dateAEffacer.length > 0) this.effaceEventFromAgenda(dateAEffacer)
      this.addAgenda(this.dataEvent.titreActivite, this.dataEvent.lieuActivite, this.lesDates)
      /* if (publie) {
        await this.addActiviteToGCalendar('confirmed')
        this.addAgenda()
      }
      if (!publie) {
        // await this.effaceEventGoogleCalendar(creneau.idGoogleEvent)
        await this.addActiviteToGCalendar('cancelled')
        // this.dataEvent.creneaux[index].idGoogleEvent = 'delete'
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Mise à jour de la base',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      // let dates = []
      for (let creneau of this.dataEvent.creneaux) {
        if (creneau.idGoogle) {
          dates.push({dateDebut: this.ajusteDate(creneau.date, this.horaire.min), dateFin: this.ajusteDate(creneau.date, this.horaire.max), idGoogle: creneau.idGoogle, sequenceEvent: creneau.sequenceEvent})
          console.log(dates)
        } else {
          dates.push({dateDebut: this.ajusteDate(creneau.date, this.horaire.min), dateFin: this.ajusteDate(creneau.date, this.horaire.max)})
        }
      } */
      if (this.type === 'Ateliers' || this.dupliquer) {
        promises.push(
          this.$apollo.mutate({
            mutation: ADD_ACTIVITE,
            variables: {
              titreActivite: this.dataEvent.titreActivite || 'Grand titre',
              section: this.dataEvent.section,
              checkInscription: this.dataEvent.checkInscription,
              checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
              lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
              description: descriptionDemine || 'Description de l\'atelier ou de l\'évènement',
              illustration: this.dataEvent.illustration || 'logoLBFSeul_a1t4af.png',
              prix: this.dataEvent.prix,
              publie: publie,
              dates: this.lesDates,
              dateDebut: this.lesDates[0].date,
              maxParticipants: this.maxParticipants,
              type: 'Ateliers'
            }
          })
        )
      }
      if (this.type === 'edit') {
        promises.push(
          this.$apollo.mutate({
            mutation: UPDATE_ACTIVITE,
            variables: {
              id: this.idAtelier,
              titreActivite: this.dataEvent.titreActivite || 'Grand titre',
              section: this.dataEvent.section,
              checkInscription: this.dataEvent.checkInscription,
              checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
              lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
              description: descriptionDemine || 'Description de l\'atelier ou de l\'évènement',
              illustration: this.dataEvent.illustration || 'logoLBFSeul_a1t4af.png',
              prix: this.dataEvent.prix,
              publie: publie,
              dates: this.lesDates,
              dateDebut: this.lesDates[0].date,
              maxParticipants: this.maxParticipants,
              type: 'Ateliers'
            }
          })
        )
      }
      /* if (creneau.id && !this.dupliquer) {
        promises.push(
          this.$apollo.mutate({
            mutation: UPDATE_ACTIVITE,
            variables: {
              id: creneau.id,
              titreActivite: this.dataEvent.titreActivite || 'Grand titre',
              section: this.dataEvent.section,
              checkInscription: this.dataEvent.checkInscription,
              checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
              lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
              description: descriptionDemine || 'Description de l\'atelier ou de l\'évènement',
              illustration: this.dataEvent.illustration || 'logoLBFSeul_a1t4af.png',
              prix: this.dataEvent.prix,
              publie: publie,
              idCycle: idCycle,
              dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
              dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
              maxParticipants: creneau.maxParticipants,
              idGoogleEvent: creneau.idGoogleEvent,
              sequenceEvent: creneau.sequenceEvent,
              type: 'Ateliers'
            }
          })
        )
      } else {
        console.log('pas id ou dupliquer', creneau)
        if (creneau.idGoogleEvent) {
          promises.push(
            this.$apollo.mutate({
              mutation: ADD_ACTIVITE,
              variables: {
                titreActivite: this.dataEvent.titreActivite || 'Grand titre',
                section: this.dataEvent.section,
                checkInscription: this.dataEvent.checkInscription,
                checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
                lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
                description: descriptionDemine || 'Description de l\'atelier ou de l\'évènement',
                illustration: this.dataEvent.illustration || 'logoLBFSeul_a1t4af.png',
                prix: this.dataEvent.prix,
                publie: publie,
                idCycle: idCycle,
                dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
                dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
                maxParticipants: creneau.maxParticipants,
                idGoogleEvent: creneau.idGoogleEvent,
                sequenceEvent: creneau.sequenceEvent || 0,
                type: 'Ateliers'
              }
            })
          )
        } else {
          console.log('brouillon !', creneau)
          promises.push(
            this.$apollo.mutate({
              mutation: ADD_ACTIVITE_BROUILLON,
              variables: {
                titreActivite: this.dataEvent.titreActivite || 'Grand titre',
                section: this.dataEvent.section,
                checkInscription: this.dataEvent.checkInscription,
                checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
                lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
                description: descriptionDemine || 'Description de l\'atelier ou de l\'évènement',
                illustration: this.dataEvent.illustration || 'logoLBFSeul_a1t4af.png',
                prix: this.dataEvent.prix,
                publie: publie,
                idCycle: idCycle,
                dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
                dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
                maxParticipants: creneau.maxParticipants,
                type: 'Ateliers'
              }
            })
          )
        }
      } */
      Promise.all(promises).then(async (data) => {
        this.$q.loading.hide()
        await this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Sauvegarde réussie.'
        })
        this.$router.push({name: 'lesateliers'})
      }).catch((error) => console.log(error))
    },
    dialogueOld: function (texte, flagRetour, type) {
      this.$q.loading.hide()
      this.$q.notify({
        timeout: 2500,
        type: 'positive',
        message: 'Compte effacé avec succès.'
      })
      this.$q.dialog({
        title: type,
        message: texte,
        icon: 'fa-check-o',
        color: 'white',
        bgColor: 'teal',
        timeout: 1000,
        position: 'top',
        onDismiss: () => {
          if (flagRetour) {
            this.$q.loading.hide()
            this.$router.push({name: 'lesateliers'})
          }
        }
      })
    },
    addActiviteToGCalendar: function (status) {
      var promises = []
      this.lesDates.forEach((creneau, index) => {
        let newSequence = 1
        if (creneau.sequenceEvent) {
          newSequence = creneau.sequenceEvent + 1
        }
        if (creneau.idGoogleEvent && !this.dupliquer) {
          const eventDataGoogle = {
            summary: this.dataEvent.titreActivite,
            location: this.dataEvent.lieuActivite,
            description: this.dataEvent.description,
            start: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.min)},
            end: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.max)},
            status: status,
            sequence: newSequence
          }
          promises.push(
            this.$apollo.query({
              query: UPDATE_EVENT,
              variables: {
                eventId: creneau.idGoogleEvent,
                dataEvent: eventDataGoogle
              }
            }).then((data) => {
              this.lesDates[index].sequenceEvent = data.data.updateEvent.sequenceEvent
            }).catch((error) => console.log('erreur update', error))
          )
        } else {
          const eventDataGoogle = {
            summary: this.dataEvent.titreActivite,
            location: this.dataEvent.lieuActivite,
            description: this.dataEvent.description,
            start: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.min)},
            end: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.max)},
            status: status
          }
          console.log('ajout google calendar')
          promises.push(
            this.$apollo.query({
              query: ADD_EVENT,
              variables: {
                dataEvent: eventDataGoogle
              }
            }).then((data) => {
              this.lesDates[index].idGoogleEvent = data.data.addEvent.idEvent
              this.lesDates[index].sequenceEvent = data.data.addEvent.sequenceEvent
            }).catch((error) => console.log('erreur ajout google calendar', error))
          )
        }
      })
      return Promise.all(promises)
    },
    effaceEventGoogleCalendar: function (idGoogleEvent) {
      this.$apollo.query({
        query: DELETE_EVENT,
        variables: {
          eventId: idGoogleEvent
        }
      }).then((data) => {
        console.log('success delete from google calendar')
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
    },
    trouverImage: function (image) {
      let imageId = image.split('.')[0]
      var retour = this.listeDesIllu.find(item => item.imageId === imageId)
      if (retour) {
        return retour.image
      } else {
        return 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_auto,h_150,w_150/logoLBFmoyen_p1zcu0.png'
      }
    },
    boutonPoubelleCreneau: function (index) {
      return index > 0
    },
    nomIllustration (nom, format) {
      return nom + '.' + format
    }
    /* addAgenda: function () {
      let ajoutsAgenda = []
      this.lesDates.forEach((uneDate) => {
        ajoutsAgenda.push({
          uid: uneDate.uid,
          titre: this.dataEvent.titreActivite,
          location: this.dataEvent.lieuActivite,
          dateDebut: this.ajusteDate(uneDate.date, uneDate.horaire.min),
          dateFin: this.ajusteDate(uneDate.date, uneDate.horaire.max),
          dateCreatedAt: newDate,
          status: uneDate.status
        })
      })
      this.$apollo.query({
        query: ADD_AGENDA,
        variables: {
          dataEvents: ajoutsAgenda
        }
      }).then((retour) => console.log(retour))
    },
    effaceEventFromAgenda: function (tableUID) {
      this.$apollo.query({
        query: REMOVE_AGENDA,
        variables: {
          uids: tableUID
        }
      }).then((retour) => console.log(retour))
    } */
  }
}
</script>

<style lang="stylus">
@import '~variables'

.formActivite
  width: 100%
  max-width: 800px
  text-align: left

#illuDropzone
  border-radius: 10%;
  border-style: dashed;
  width: 150px !important;
  height: 150px;
  margin-left: 10px;
  margin-top: 5px;

#illuProcessing
  width: 150px
  height: 150px
  margin-left: 10px
  margin-top: 5px

.messageProcess
  font-size: x-small

.liste
  border: 1px solid $blue-grey-3
  margin-left: 20px
  margin-bottom: 20px
  padding: 10px

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.titreActivite
  font-size: x-large
  font-variant: small-caps
  padding: 10px
</style>
