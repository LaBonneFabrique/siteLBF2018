<template>
  <q-page class='formActivite'>
    <q-input
      v-model="newsTitre"
      placeholder='La dernière news croustillante'
      class="titreNews"
      style="margin-bottom: 20px"
      >
  </q-input>
  <div class='row'>
      <div class="col-sm-5">
      <q-select
        v-model="selectedSection"
        stack-label='Espace concerné'
        color='light-green-8'
        inverted
        separator
        :options='listeSection'
        />
          <illustration :section="selectedSection" :currentImage.sync="illustrationChoisie" ></illustration>
    </div>
    <div class="col-sm-6 offset-sm-1">
        <q-editor
    toolbar-flat
    toolbar-bg="white"
    :toolbar="[
      ['bold', 'italic', 'strike', 'underline'],
      ['unordered','ordered','outdent', 'indent'],
      ['link'],
      ['fullscreen']
    ]"
    min-height="200px"
    v-model="texte"/>
    </div>
    </div>
    <div class="row" style="margin-top: 10px">
      <div class="col-sm-4">
      <q-field
        icon='fas fa-tags'
        label='tags'
        :label-width="2"
        >
          <q-input @keydown="keyDownTag($event)" v-model="currentTag.nom" style="margin-left: 5px; margin-top: 2px">
            <q-autocomplete
              :static-data="{field: 'value', list: parseTags}"
              @show="testAutoComplete = true"
              @hide="testAutoComplete = false"
              @selected = "selected"
            />
          </q-input>
        </q-field>
      </div>
      <q-btn
        icon="fas fa-plus"
        class="col-sm-1"
        inverted flat dense
        :disable="currentTag.nom===''"
        @click="addTag()"
      ></q-btn>
      <div class="col-sm-6 offset-1">
        <q-chip v-for="(tag, index) in tags" :key="tag.ip" style="margin-right: 4px"
        tag closable detail
        @hide="removeTag(index)"
        >{{tag.nom}}</q-chip>
      </div>
    </div>
         <div class="row" style="margin-bottom: 20px; margin-top: 20px">
        <q-btn
          icon="fa-times"
          color="warning"
          class="col-sm-3"
          style="margin-top: 0px; padding: 10px"
          @click="$router.push({name: 'listeNews'})"
          label = "Annuler"
          >
        </q-btn>
        <q-btn
          v-if = "!newsId"
          icon = "far fa-save"
          color = "secondary"
          class = "col-sm-3 offset-sm-1"
          style = "margin-top: 0px; padding: 10px"
          label = "Brouillon"
          @click = "sauvegarde(false)"
          ></q-btn>
          <q-btn
          v-else
          icon = "far fa-save"
          color = "secondary"
          class = "col-sm-3 offset-sm-1"
          style = "margin-top: 0px; padding: 10px"
          label = "Mettre à jour"
          @click = "mettreAJour(false)"
          ></q-btn>
          <q-btn
          v-if="!newsId"
          icon="fas fa-pen-square"
          color="primary"
          class="col-sm-3 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegarde(true)"
          label ="Publier"
          >
        </q-btn>
        <q-btn
          v-else
          icon="fas fa-pen-square"
          color="primary"
          class="col-sm-3 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="mettreAJour(true)"
          label ="Modifier et publier"
          >
        </q-btn>
        </div>
  </q-page>
</template>

<script>
import {QSpinnerGears} from 'quasar'
import { LISTE_ESPACEBF } from '../../constants/listeEnums'
import {LES_TAGS, SAVE_TAGS} from '../../graphQL/tags'
import {SAVE_NEWS, READ_NEWS, UPDATE_NEWS} from '../../graphQL/news'
import {DEMINER_HTML} from '../../graphQL/sanitize'
import illustration from '../../components/illustration'

const today = new Date()

export default {
  // name: 'PageName',
  components: {
    illustration
  },
  props: {
    newsId: String
  },
  data () {
    return {
      texte: '',
      listeSection: [],
      selectedSection: 'LaBonneFabrique',
      newsTitre: '',
      illustrationChoisie: '',
      allTags: [],
      currentTag: {nom: ''},
      tags: [],
      testAutoComplete: false,
      parseTags: []
    }
  },
  apollo: {
    allEnums: {
      query: LISTE_ESPACEBF,
      fetchPolicy: 'network-only',
      update (data) {
        let listeEnum = data.__type.enumValues
        this.listeSection = []
        listeEnum.forEach((valeurEnum) => {
          this.listeSection.push({label: valeurEnum.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(L)(e)/g, '$1\'$2').replace(/(L)(ate)/g, '$1\'$2').replace('Partage', 'partagé'), value: valeurEnum.name})
        })
      }
    },
    allTags: {
      query: LES_TAGS,
      result (result) {
        let parse = []
        parse = result.data.allTags.map((tag) => {
          return {
            label: tag.nom,
            value: tag.nom,
            id: tag.id
          }
        })
        Object.assign(this.parseTags, parse)
      }
    },
    allNews: {
      query: READ_NEWS,
      variables () {
        return {
          id: this.newsId
        }
      },
      skip () {
        return !this.newsId
      },
      async update (result) {
        if (result.allActivites.length === 0) {
          await this.$q.notify({
            timeout: 2500,
            type: 'negative',
            message: 'Les données n\'ont pas été trouvées'
          })
          this.$router.push({name: 'accueilAdmin'})
        }
        let data = result.allActivites[0]
        this.newsTitre = data.titreActivite
        this.texte = data.description
        this.selectedSection = data.section
        this.illustrationChoisie = data.illustration
        Object.assign(this.tags, data.tags)
      }
    }
  },
  methods: {
    addTag () {
      this.tags.push(this.currentTag)
      this.currentTag = {nom: ''}
    },
    keyDownTag (event) {
      if (event.keyCode === 13 && this.currentTag !== '' && !this.testAutoComplete) {
        this.addTag()
      }
    },
    removeTag (index) {
      this.tags.splice(index, 1)
    },
    selected (item) {
      console.log(item)
      this.currentTag.nom = item.value
      this.currentTag.id = item.id
      console.log(this.currentTag)
    },
    async sauvegarde (doitEtrePublie) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Chargement des données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.saveTags()
      let texteSanitized = ''
      if (this.texte === '') this.texte = 'Tu savais que...'
      await this.$apollo.mutate({
        mutation: DEMINER_HTML,
        variables: {
          texte: this.texte
        }
      }).then((result) => {
        texteSanitized = result.data.sanitize.sanitized
      }).catch((error) => {
        console.log(error)
      })
      this.$apollo.mutate({
        mutation: SAVE_NEWS,
        variables: {
          titreActivite: this.newsTitre || 'La dernière news croustillante',
          section: this.selectedSection,
          description: texteSanitized,
          illustration: this.illustrationChoisie,
          publie: doitEtrePublie,
          tags: this.tags,
          type: 'Infos',
          dateDebut: today
        }
      }).then(async (result) => {
        this.$q.loading.hide()
        await this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Info sauvegardée.'
        })
        this.$router.push({name: 'listeNews'})
      }).catch((error) => {
        this.$q.loading.hide()
        console.log(error)
      })
    },
    async mettreAJour (doitEtrePublie) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Chargement des données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.saveTags()
      let texteSanitized = ''
      if (this.texte === '') this.texte = 'Tu savais que...'
      await this.$apollo.mutate({
        mutation: DEMINER_HTML,
        variables: {
          texte: this.texte
        }
      }).then((result) => {
        texteSanitized = result.data.sanitize.sanitized
      }).catch((error) => {
        console.log(error)
      })
      this.$apollo.mutate({
        mutation: UPDATE_NEWS,
        variables: {
          id: this.newsId,
          titreActivite: this.newsTitre || 'La dernière news croustillante',
          section: this.selectedSection,
          description: texteSanitized,
          illustration: this.illustrationChoisie,
          publie: doitEtrePublie,
          tags: this.tags,
          type: 'Infos',
          dateDebut: today
        }
      }).then(async (result) => {
        this.$q.loading.hide()
        await this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Info Modifiée.'
        })
        this.$router.push({name: 'listeNews'})
      }).catch((error) => {
        this.$q.loading.hide()
        console.log(error)
      })
    },
    saveTags () {
      console.log(this.tags)
      this.tags.forEach((tag) => {
        if (!tag.id) {
          this.$apollo.mutate({
            mutation: SAVE_TAGS,
            variables: {
              nom: tag.nom
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables';

  .formActivite {
    width: 100%
    max-width: 800px
    text-align: left
    padding: 20px
  }

  #illuDropzone {
      border-radius: 10%;
      border-style: dashed;
      width: 150px !important;
      height: 150px;
      margin-left: 10px;
      margin-top: 5px;
    }

  #illuProcessing {
      width: 150px;
      height: 150px;
      margin-left: 10px;
      margin-top: 5px;
  }

  .messageProcess {
    font-size: x-small;
  }

  .liste
    border: 1px solid $blue-grey-3;
    margin-left: 20px
    margin-bottom: 20px
    padding: 10px

  .bg-test
    background-color: rgba(75, 188, 196, 0.5)

  .titreNews
    font-size: x-large
    font-variant: small-caps
    padding: 10px
</style>
