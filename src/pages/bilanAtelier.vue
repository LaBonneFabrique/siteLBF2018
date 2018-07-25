<template>
  <q-page class="pageGlobale">
    <q-window-resize-observable @resize="onResize" />
    <q-fab
      v-if="user.isAdmin"
      class="fixed no-shadow"
      style="right: 18px; bottom: 18px"
      color="primary"
      icon="fas fa-plus"
      direction="up"
    >
      <q-fab-action @click="saveBilan()" color="primary" icon="far fa-save">
        <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Sauver</q-tooltip>
      </q-fab-action>
      <q-fab-action @click="effaceBilanDialogue()" color="secondary" icon="far fa-trash-alt" v-if="idBilan">
        <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Effacer</q-tooltip>
      </q-fab-action>
      <q-fab-action @click="envoiBilan()" color="tertiary" icon="fas fa-at">
        <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Envoyer aux participants</q-tooltip>
      </q-fab-action>
        </q-fab>
        <div class="row max980 no-margin no-padding">
        <img :src="urlImage(illustration,250,250,100,'', 'lfill')" width="250" height="250" class="no-margin no-padding" />
        <div class="minHeight250 cadreTexte" :style="{'background-color': tableCouleurLBF[section]}">
        <div class="q-headline q-mb-none text-center">{{titreAtelier}}</div>
        <div class="text-weight-bolder q-ml-none text-center">{{listeMois(lesDates)}}</div>
        <q-tabs position="bottom" :color="tableCouleurLBF[section]" style="height: 250px" v-if="user.isAdmin">
          <!-- Tabs - notice slot="title" -->
          <q-tab default slot="title" name="Ecrire" color="white" class="titrePane" icon="fas fa-edit"/>
          <q-tab slot="title" name="Rendu" color="white" icon="far fa-eye"/>
          <q-tab slot="title" name="Formatage" color="white" icon="far fa-question-circle" />
          <!-- Targets -->
          <q-tab-pane name="Ecrire" style="height: 198px">
          <q-input
            v-model="bilan"
            type="textarea"
            hide-underline
            rows="7"
            class="no-shadow no-margin no-padding"
            />
          </q-tab-pane>
          <q-tab-pane name="Rendu" style="height: 198px">
            <div v-html="parseMarkdown(bilan)"></div>
          </q-tab-pane>
          <q-tab-pane name="Formatage" style="height: 198px" class="formatage">
                <div class="row" style="margin: 0px; pading: 0px">
                  <div class="col-6">
                    <div class="q-body-2">Bases</div>
                    <em>*italique*</em><br />
                    <strong>**gras**</strong><br />
                  </div>
                  <div class="col-6">
                    <div class="q-body-2">listes</div>
                    * liste non numérotée<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* sous élément<br />
                    1. liste numérotée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">retour à la ligne</div>
                    double espace + entrée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">lien :</div>
                    [texte du lien](url_du_lien)
                  </div>
                </div>
          </q-tab-pane>
        </q-tabs>
        <div v-else v-html="parseMarkdown(bilan)" class="q-ma-sm">
        </div>
      </div>
            <div class="cadreTexte">
        <div class="q-headline q-mb-none text-center">Participants</div>
        <q-list no-border dense class="row">
        <q-item v-for="inscrit in lesInscrits" :key="inscrit.id" class="col-6">
          <q-item-side :avatar="avatar(inscrit.profils[0].id)" />
          <q-item-main :label="inscrit.participant" label-lines="1" />
        </q-item>
        </q-list>
      </div>
        </div>
    <div class="q-mt-md">
      <div class="q-headline q-mb-md text-left max600">Quelques photos</div>
      <div class="row">
    <vue-dropzone
        v-if="user.isAdmin"
        ref='illustrationDropzone'
        id='illuDropzone'
        :options='dropzoneOptions'
        @vdropzone-sending='envoieImage'
        @vdropzone-success='envoieSucces'
        @vdropzone-upload-progress='envoieProgres'
        @vdropzone-processing='processFile'
        class="float-left q-ma-sm thumbsCarousel"
        />
        <div class="divImg q-ma-sm thumbsCarousel" v-for="(illu, index) in listeBilanIllus" :key="illu.id" >
      <lazy-background
        :image-source="urlImage(illu.nom,320,320,100,'', 'fill')"
        :loading-image="urlImage(illu.nom,320,320,1,'blur', 'lfill')"
        error-image="/img/error.png"
        imageClass="bckImg">
      </lazy-background>
      <q-btn-group outline v-if='user.isAdmin' class="btns">
        <q-btn outline color="secondary" icon="far fa-trash-alt" size="14px" @click="effaceImageDialogue(illu.id, index)"></q-btn>
        <q-btn outline color="primary" :icon="illuChoisie(illu.nom)" size="14px" @click="choixIlluMail(illu.nom)">
          <q-tooltip anchor="bottom middle" self="top middle">
            Choix pour illustrer le mail
          </q-tooltip>
        </q-btn>
      </q-btn-group>
      <q-btn
      text-color="tertiary"
      color="white"
      icon="fas fa-expand"
      size="14px"
      @click="noImage = index; modalImage = true"
      class="btn-fullscreen no-shadow"
      ></q-btn>
        </div>
              <div v-if="loadIllu" class="row items-center justify-center" id='illuProcessing'>
        <q-spinner-gears size="46px" color="primary"></q-spinner-gears>
        <div class="justify-center messageProcess">{{message}}</div>
    </div>
            </div>
    </div>
    <q-modal v-model="modalImage" maximized>
      <q-carousel
        color="white"
        ref="leCarousel"
        arrows
        quick-nav
        class="text-white full-height q-pa-none q-ma-none"
        infinite
        v-model="noImage"
        style="background-color: black"
      >
        <q-carousel-slide
          v-for="illu in listeBilanIllus" :key="illu.id+'modal'"
          class="flex flex-center "
        >
          <img :src="urlImageOriginale(illu.nom, widthScreen, heightScreen)">
        </q-carousel-slide>

        <q-carousel-control
          slot="control-full"
          slot-scope="carousel"
          position="bottom-right"
          :offset="[18, 22]"
        >
        </q-carousel-control>
        <q-carousel-control
        position="top-right"
        slot="control-full"
          slot-scope="carousel"
        >
            <q-btn
            color="primary"
            icon="far fa-window-close"
            @click="modalImage = false"
            dense
            size="18px"
            class="no-shadow"
            style="opacity: 0.8"
          />
        </q-carousel-control>
      </q-carousel>
    </q-modal>
    <q-modal
    v-model="modalVerifEmail"
    :content-css="{padding: '20px'}"
    minimized
    no-esc-dismiss
    no-backdrop-dismiss
    >
      <h6 style="margin: 0px; margin-bottom: 5px; max-width: 480px">Vérification de l'email</h6>
      <p>Pour éviter de laisser trainer des photos en libre accès que l'internet, seuls les inscrits peuvent accéder à cette page. Merci de rentrer l'adresse mail ayant servie à l'inscription.</p>
      <q-input class="inputMail" v-model="mailInscription"/>
      <q-btn class="float-right q-mt-md"
        outline
        label="vérifier"
        icon="fas fa-check"
        color="primary"
        @click="rechercheMail()"
      />
    </q-modal>
    <q-modal
    v-model="modalErreurEmail"
    :content-css="{padding: '20px'}"
    minimized
    no-esc-dismiss
    no-backdrop-dismiss>
      <h6 style="margin: 0px; margin-bottom: 5px; max-width: 480px">Il y a une erreur</h6>
      <p>L'adresse entrée n'a pas été trouvée.</p>
      <q-btn class="float-right q-mr-md"
        outline
        label="Essayer à nouveau"
        icon="fas fa-check"
        color="primary"
        @click="modalErreurEmail = false; modalVerifEmail = true"
      />
      <q-btn class="float-right q-mr-md"
        outline
        label="Retour à l'accueil"
        icon="fas fa-home"
        color="tertiary"
        @click="$router.push({name:'accueil'})"
      />
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears,
  dom
} from 'quasar'
import { QUERY_ACTIVITE_BY_ID } from '../graphQL/activitesGraphQL'
import { GET_BILAN, ADD_BILAN, MAJ_BILAN, DELETE_BILAN } from '../graphQL/bilan'
import { DELETE_ILLU } from '../graphQL/illustrations'
import { genURLImageMixins } from '../utils/genURLImage'
import { authMixins } from '../utils/auth'
import { mailMixins } from '../utils/envoiMail'
import { parseMarkdownMixins } from '../utils/parseMarkdown'
import { traitementDateMixins } from '../utils/traitementDate'
import { tableCouleurLBF } from '../constants/constanteLBF'
import { cloudinaryKeys } from '../constants/cloudinaryKeys'

import htmlContent from '../assets/bilanAtelier.txt'

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import lazyBackground from '../components/VueLazyBackgroundImage'

const { viewport } = dom

export default {
  // name: 'PageName',
  mixins: [authMixins, genURLImageMixins, parseMarkdownMixins, traitementDateMixins, mailMixins],
  props: {
    idAtelier: String
  },
  components: {
    vueDropzone: vue2Dropzone,
    lazyBackground
  },
  store: {
    user: 'user',
    estIdentifie: 'estIdentifie'
  },
  data () {
    return {
      lesInscrits: [],
      titreAtelier: '',
      description: '',
      lesDates: [],
      illustration: 'logoLBFSeul_a1t4af.png',
      loadingActivites: 0,
      loadingIllusBilan: 0,
      section: '',
      tableCouleurLBF: tableCouleurLBF,
      bilan: '',
      dropzoneOptions: {
        autoProcessQueue: true,
        uploadMultiple: false,
        acceptedFiles: '.jpg,.png,.jpeg,.gif',
        parallelUploads: 10,
        url: 'https://api.cloudinary.com/v1_1/la-bonne-fabrique/image/upload',
        dictDefaultMessage: '<i class=\'fas fa-upload fa-4x\'></i>',
        previewsContainer: false,
        resizeWidth: 1920,
        resizeHeight: 1920,
        resizeMethod: 'contain',
        resizeQuality: 0.9
      },
      message: 'rien',
      listeBilanIllus: [],
      loadIllu: false,
      MAJ: false,
      listeMails: [],
      illuMail: '',
      idBilan: '',
      modalImage: false,
      noImage: 0,
      modalVerifEmail: false,
      mailInscription: '',
      modalErreurEmail: false,
      widthScreen: Math.round(viewport().width * 0.98),
      heightScreen: Math.round(viewport().height * 0.98)
    }
  },
  watch: {
    estIdentifie: function () {
      if (!this.estIdentifie || (this.listeMails.indexOf(this.user.email) >= 0 && !this.user.isAdmin)) this.modalVerifEmail = true
    }
  },
  apollo: {
    getActivite: {
      query: QUERY_ACTIVITE_BY_ID,
      variables () {
        return {
          id: this.idAtelier
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
      update (data) {
        let result = data.allActivites[0]
        this.titreAtelier = result.titreActivite
        this.description = result.description
        this.lesInscrits = result.inscriptions
        this.lesDates = result.dates
        this.illustration = result.illustration
        this.section = result.section
        let listeMailTemp = result.inscriptions.map(inscrit => inscrit.mail)
        this.listeMails = [...new Set(listeMailTemp)]
      }
    },
    getBilan: {
      query: GET_BILAN,
      variables () {
        return {
          idAtelier: this.idAtelier
        }
      },
      fetchPolicy: 'network-only',
      watchLoading (isLoading, countModifier) {
        this.loadingIllusBilan = isLoading
        if (isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Chargement des images',
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
        if (data.allBilanAteliers.length > 0) {
          let result = data.allBilanAteliers[0]
          this.MAJ = true
          this.idBilan = result.id
          this.bilan = result.bilan
          this.illuMail = result.illuMail
          this.listeBilanIllus = Object.assign([], result.listeIllus)
        }
      }
    }
  },
  methods: {
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/50/' + mId + '.png'
    },
    envoieImage: (file, xhr, formData) => {
      formData.append('file', file)
      formData.append('upload_preset', cloudinaryKeys.preset) // Replace the preset name with your own
      formData.append('api_key', cloudinaryKeys.apiKey) // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0)
    },
    envoieSucces (file, response) {
      this.message = 'Succès !'
      let leNom = response.public_id + '.' + response.format
      this.listeBilanIllus.push({'nom': leNom, 'id': response.public_id, 'width': response.width, height: response.height})
      this.loadIllu = false
    },
    envoieProgres (file, progress, bytesSent) {
      this.message = 'Téléversement ' + progress.toFixed(2) + ' %'
    },
    processFile (file) {
      this.loadIllu = true
      this.message = 'Réduction à une taille raisonnable si besoin...'
    },
    saveBilan () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Sauvegarde du bilan',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      if (this.MAJ) {
        this.$apollo.mutate({
          mutation: MAJ_BILAN,
          variables: {
            id: this.idBilan,
            idAtelier: this.idAtelier,
            bilan: this.bilan,
            listeIllus: this.listeBilanIllus,
            illuMail: this.illuMail
          }
        }).then((data) => {
          this.$q.notify({
            timeout: 2500,
            type: 'positive',
            message: 'Le bilan a été mis à jour avec succès.'
          })
          this.$apollo.queries.getBilan.refetch()
          this.$q.loading.hide()
        }).catch((error) => {
          console.log(error)
          this.$q.loading.hide()
        })
      } else {
        this.$apollo.mutate({
          mutation: ADD_BILAN,
          variables: {
            idAtelier: this.idAtelier,
            bilan: this.bilan,
            listeIllus: this.listeBilanIllus,
            illuMail: this.illuMail
          }
        }).then((data) => {
          this.$q.notify({
            timeout: 2500,
            type: 'positive',
            message: 'Le bilan a été sauvegardé avec succès.'
          })
          this.$apollo.queries.getBilan.refetch()
          this.$q.loading.hide()
        }).catch((error) => {
          console.log(error)
          this.$q.loading.hide()
        })
      }
    },
    choixIlluMail (illu) {
      if (this.illuMail === illu) {
        this.illuMail = ''
      } else {
        this.illuMail = illu
      }
    },
    illuChoisie (illu) {
      return this.illuMail === illu ? 'far fa-check-square' : 'far fa-square'
    },
    effaceImageDialogue (imageId, index) {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette image ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.effaceImage(imageId, index)
      }).catch(() => {})
    },
    effaceImage (imageId, index) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'L\'image est en cours d\'effacement',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.query({
        query: DELETE_ILLU,
        variables: {
          imageId
        }
      }).then((data) => {
        this.$q.loading.hide()
        this.listeBilanIllus.splice(index, 1)
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'L\'image a été effacée avec succès.'
        })
      })
    },
    rechercheMail () {
      if (this.listeMails.filter(element => element === this.mailInscription).length > 0) {
        this.modalVerifEmail = false
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Accès à la page validée.'
        })
      } else {
        this.modalVerifEmail = false
        this.modalErreurEmail = true
      }
    },
    envoiBilan () {
      let adresseIllu = this.urlImage(this.illuMail, 264, 264, 100, '', 'fill')
      let URL = 'https://newagenda.labonnefabrique.fr/atelier/' + this.idAtelier
      let titre = 'Retour sur l\'atelier "' + this.titreActivite + '"'
      let htmlTemp = htmlContent
        .replace('*|ILLU|*', adresseIllu)
        .replace('*|le titre|*', this.titreAtelier)
        .replace('*|le sujet|*', this.titreAtelier)
        .replace('*|TEXTE|*', this.parseMarkdown(this.bilan))
        .replace('*|URL PAGE|*', URL)
        .replace('*|MC_PREVIEW_TEXT|*', titre)
      this.listeMails.push('lasalledesmachines@labonnefabrique.fr')
      this.envoiMail(this.listeMails, titre, htmlTemp).then((retour) => console.log(retour)).catch((error) => console.log(error))
    },
    onResize () {
      this.widthScreen = Math.round(viewport().width * 0.98)
      this.heightScreen = Math.round(viewport().height * 0.98)
    },
    effaceBilanDialogue () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer le bilan ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffaceBilan()
      }).catch(() => {})
    },
    processEffaceBilan () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Le bilan va être effacé...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      var promises = []
      this.listeBilanIllus.forEach((uneIllu) => {
        promises.push(
          this.$apollo.query({
            query: DELETE_ILLU,
            variables: {
              imageId: uneIllu.id
            }
          })
        )
      })
      promises.push(
        this.$apollo.mutate({
          mutation: DELETE_BILAN,
          variables: {
            id: this.idBilan
          }
        })
      )
      Promise.all(promises).then((retour) => {
        this.$q.loading.hide()
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Le bilan a été effacé avec succès.'
        })
        this.$router.push({name: 'accueilAdmin'})
      }).catch((error) => console.log(error))
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

taille = 320px

.pageGlobale
  @media screen and (max-width: 480px)
    margin-left: 0px
  @media screen and (min-width: 480px)
    margin-left: 20px

.imageEntete
  position: relative
  float: left
  width: 250px
  @media screen and (max-width: 480px)
    margin-left: calc(50% \- 125px)

.max980
  max-width: 980px

.max640
  max-width: 640px
  @media screen and (max-width: 480px)
    margin-left: 0px
  @media screen and (min-width: 480px)
    margin-left: 250px

.minHeight250
  min-height: 250px
  color: white

.border
  border: 1px solid red

.max920
  max-width: 920px

.max600
  max-width: 600px

#illuDropzone
  border-radius: 2%
  border-style: dashed
  width: taille !important
  height: taille
  margin-left: 10px
  margin-top: 5px
  padding-top: 75px

#illuProcessing
  width: taille
  height: taille
  margin-left: 10px
  margin-top: 5px

.messageProcess
  font-size: large

.bckImg
  width: taille
  height: taille

.divImg
  position: relative
  width: taille
  height: taille

.btns
  position: absolute
  left: 12px
  top: 12px
  background-color: rgba(255, 255, 255, 0.8)

.btn-fullscreen
  position: absolute
  left: 100% - 18px
  top: 100% - 13px
  opacity: 0.8

.btn-close
  position: absolute
  top: 5px
  left: 100% - 5px

.formatage
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 12px

.titrePane
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px

.imageCarousel
  max-height: 100% - 40px
  max-width: 100% - 40px

.thumbsCarousel
  @media screen and (max-width: 480px)
    margin-left: calc(50% \- 160px) !important
  @media screen and (min-width: 480px)
    margin-left: 0px !important

.cadreTexte
  width: 320px
</style>
