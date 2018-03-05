<template>
  <div>
    <q-btn
      @click="modalIllustration = true"
      class="col-8 offset-2"
      flat
      color="primary"
      >
      choisir une illustration
    </q-btn>
    <img
      height="150"
      width="150"
      :src="trouverImage(currentImage)"
      class="col-6 offset-3"
      style="border: 1px solid grey"
      @click="modalIllustration = true"
      />
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
      <img height="150" width="150" :src="illu.image" @click="choixIllustration = illu.id" />
      <div class="row justify-end">
        <q-radio
          v-model="choixIllustration"
          :val="illu.id"
          unchecked-icon="far fa-square"
          checked-icon="far fa-check-square"
        />
        <q-btn flat color="warning" @click="effaceImageDialogue(illu.id, illu.imageId)" icon="fa-times">

        </q-btn>
      </div>
    </div>
      <!-- <div v-if="loadIllu" class="row items-center justify-center" id='illuProcessing'>
        <q-spinner-gears size="30px" color="primary"></q-spinner-gears>
        <div class="justify-center messageProcess">{{message}}</div>
    </div> -->
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
        @click="valideImage()"
        label="Valider"
      >
      </q-btn>
    </q-modal>
  </div>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import {GET_LISTE_ILLU_FILTRE_ESPACE, ADD_LISTE_ILLU, DELETE_ILLU, DELETE_ILLU_GRAPHQL} from '../constants/illustrationsGraphQL'
import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

export default {
  // name: 'ComponentName',
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
    section: String,
    currentImage: String
  },
  data () {
    return {
      listeDesIllu: [],
      modalIllustration: false,
      choixIllustration: '',
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
      loadIllu: 0
    }
  },
  apollo: {
    allActivitesIllustrations: {
      query: GET_LISTE_ILLU_FILTRE_ESPACE,
      variables () {
        return {
          espace: this.section
        }
      },
      loadingKey: 'loadIllu',
      update (data) {
        this.listeDesIllu = []
        data.allActivitesIllustrations.forEach((image) => {
          this.listeDesIllu.push({id: image.id, imageId: image.idImage, image: cl.url(image.idImage + '.' + image.format, { width: 150, height: 150, crop: 'fill', gravity: 'auto' }), checked: false, efface: false})
        })
      }
    }
  },
  methods: {
    trouverImage: function (idImage) {
      var retour = this.listeDesIllu.find(item => item.id === idImage)
      if (retour) {
        return retour.image
      } else {
        return 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_auto,h_150,w_150/logoLBFmoyen_p1zcu0.png'
      }
    },
    resetChoixIllu: function () {
      this.choixIllustration = ''
    },
    effaceImageDialogue (id, imageId) {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette image ?',
        ok: 'Effacer',
        cancel: 'Annuler'
      }).then(() => {
        this.effaceImage(id, imageId)
      })
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
          espace: this.section
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
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Chargement des données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.choixIllustration = ''
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
          this.$q.loading.hide()
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
    valideImage () {
      this.$emit('update:currentImage', this.choixIllustration)
      this.modalIllustration = false
    }
  }
}
</script>

<style>
</style>
