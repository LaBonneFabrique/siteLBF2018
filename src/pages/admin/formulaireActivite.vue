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
            labelWidth="1"
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
                label="horaires"
                style="margin-top: 5px"
                class="col-md-8 offset-1"
                icon-color="primary"
                >
                <q-btn label="ajouter un horaire" dense color="primary" flat @click="ajoutHoraire()"></q-btn>
              </q-field>
              <div class="row" v-for="(unHoraire, index) in horaires" :key="index">
                  <q-range
                    v-model="unHoraire.creneau"
                    :min="9"
                    :max="22"
                    :step="0.5"
                    snap
                    markers
                    label-always
                    :left-label-value="afficheHeure(unHoraire.creneau.min)"
                    :right-label-value="afficheHeure(unHoraire.creneau.max)"
                    class="offset-1 col-6"
                  />
                  <q-btn class="col-1"  v-if="index > 0" icon="far fa-trash-alt" flat color="primary" dense size="18px" @click="removeCreneau(index)"></q-btn>
                </div>
            <q-field
                icon="fa-calendar"
                :label-width="2"
                label="dates"
                class="col-md-10 offset-1"
                style="margin-bottom: 10px; margin-top: 10px"
                icon-color="primary"
                >
                <choix-dates :propDates="lesDates" v-on:remove="(val) => {removeHoraire(val)}" v-if="!existeInscrits || dupliquer"></choix-dates>
            </q-field>
          <q-chip v-for="(laDate, index) in lesDates" :key="toTimeStamp(laDate.date)+'pr'" closable square color="primary" @hide="removeHoraire(index)" class="offset-1" v-if="!existeInscrits || dupliquer">
        {{toDateReadable(laDate.date)}}
      </q-chip>
      <q-chip v-for="(laDate, index) in lesDates" :key="toTimeStamp(laDate.date)+'pr'" square color="primary" @hide="removeHoraire(index)" class="offset-1" v-if="existeInscrits && !dupliquer">
        {{toDateReadable(laDate.date)}}
      </q-chip>
      <div v-if="existeInscrits && !dupliquer" class="offset-1" style="margin-top: 4px">
        <q-icon color="secondary" name="fas fa-exclamation-triangle"></q-icon>
        Cet atelier a déjà des inscrit, les dates ne peuvent être changées.</div>
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
            <q-btn flat color="secondary" icon="far fa-trash-alt" class="col-2 offset-2" @click="removePrix(index)">
                <q-tooltip color="amber-8">
                  Effacer ce prix
              </q-tooltip>
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
import { cloudinaryKeys } from '../../constants/cloudinaryKeys'
import markdownEditor from '../../components/markdownEditor'
import choixDates from '../../components/choixDates'
import {DEMINER_HTML} from '../../graphQL/sanitize'
import {ADD_EVENT, UPDATE_EVENT, DELETE_EVENT} from '../../graphQL/googleAgendaGraphQL'
import { LISTE_ESPACEBF } from '../../constants/listeEnums'
import { GET_LISTE_ILLU_FILTRE_ESPACE, ADD_LISTE_ILLU, DELETE_ILLU_GRAPHQL, DELETE_ILLU } from '../../graphQL/illustrations'
import { QUERY_ACTIVITE_BY_ID, UPDATE_ACTIVITE, ADD_ACTIVITE } from '../../graphQL/activitesAdmin'

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
      lesDates: [],
      horaires: [{creneau: {min: 14, max: 16}}],
      existeInscrits: false
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
          espace: this.dataEvent.section,
          typeIllu: 'Atelier'
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
        this.existeInscrits = this.dataEvent.inscriptions.length > 0
        this.maxParticipants = this.dataEvent.maxParticipants
        this.horaires = []
        this.dataEvent.dates[0].horaires.forEach((horaire) => this.horaires.push(
          {
            creneau: horaire.creneau,
            uid: horaire.uid
          }))
        console.log('horaires', this.horaires)
        this.dataEvent.dates.forEach((laDate) => {
          console.log('chaque date', laDate)
          // this.horaires = laDate.horaires
          this.lesDates.push({
            date: laDate.date,
            horaires: laDate.horaires
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
        console.log('dates', this.lesDates)
        this.dataEvent.prix = []
        data.allActivites[0].prix.forEach((prix) => {
          this.dataEvent.prix.push({id: prix.id, description: prix.description, prix: prix.prix, qf: prix.qf})
        })
        // this.dataEvent = data.allActivites[0]
      }
    }
  },
  methods: {
    ajoutHoraire () {
      this.horaires.push({creneau: {min: 14, max: 16}})
    },
    removeCreneau (index) {
      this.horaires.splice(index, 1)
    },
    resetChoixIllu: function () {
      this.dataEvent.illustration = ''
    },
    removeHoraire: function (index) {
      let dateHorairesAEffacer = []
      if (this.lesDates[index].horaires) {
        this.lesDates[index].horaires.forEach((horaire) => {
          if (horaire.uid) {
            console.log('boum, on efface !')
            dateHorairesAEffacer.push(horaire.uid)
          }
        })
      }
      if (dateHorairesAEffacer.length > 0) this.effaceEventFromAgenda(dateHorairesAEffacer)
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
      formData.append('upload_preset', cloudinaryKeys.preset) // Replace the preset name with your own
      formData.append('api_key', cloudinaryKeys.apiKey) // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0)
    },
    envoieSucces (file, response) {
      this.message = 'Succès !'
      this.$apollo.mutate({
        mutation: ADD_LISTE_ILLU,
        variables: {
          idImage: response.public_id,
          format: response.format,
          espace: this.dataEvent.section,
          typeIllu: 'Atelier'
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
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette image ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.effaceImage(id, imageId)
      }).catch(() => {})
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
      let datesForAgenda = []
      let datesForSave = []
      this.lesDates.forEach((laDate, index) => {
        if (laDate.horaires) {
          laDate.horaires.forEach((horaire) => {
            if (horaire.uid) {
              dateAEffacer.push(horaire.uid)
              console.log('une à effacer')
            }
          })
        }
        let horairesForSave = []
        this.horaires.forEach((horaire) => {
          let uid = this.generateId()
          datesForAgenda.push({
            date: laDate.date,
            horaire: horaire.creneau,
            uid: uid,
            status: publie ? 'CONFIRMED' : 'TENTATIVE'
          })
          horairesForSave.push({creneau: horaire.creneau, uid: uid})
        })
        datesForSave.push({
          date: laDate.date,
          horaires: horairesForSave
        })
      })
      if (dateAEffacer.length > 0) this.effaceEventFromAgenda(dateAEffacer)
      this.addAgenda(this.dataEvent.titreActivite, this.dataEvent.lieuActivite, datesForAgenda)
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
              dates: datesForSave,
              dateDebut: datesForSave[0].date,
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
              dates: datesForSave,
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
  border-radius: 10%
  border-style: dashed
  width: 150px !important
  height: 150px
  margin-left: 10px
  margin-top: 5px

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
