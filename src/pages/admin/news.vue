<template>
  <q-page class='formActivite'>
    <q-input
      v-model="newsTitre"
      placeholder='La dernière news croustillante'
      class="titre"
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
          <q-input @keydown="keyDownTag($event)" v-model="currentTag" style="margin-left: 5px; margin-top: 2px"></q-input>
        </q-field>
      </div>
      <q-btn
        icon="fas fa-plus"
        class="col-sm-1"
        inverted flat dense
        :disable="currentTag===''"
        @click="addTag()"
      ></q-btn>
      <div class="col-sm-6 offset-1">
        <q-chip v-for="(tag, index) in tags" :key="tag" style="margin-right: 4px"
        tag closable detail
        @hide="removeTag(index)"
        >{{tag}}</q-chip>
      </div>
    </div>
         <div class="row" style="margin-bottom: 20px; margin-top: 20px">
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
          label = "Brouillon"
          ></q-btn>
        </div>
  </q-page>
</template>

<script>
import { LISTE_ESPACEBF } from '../../constants/listeEnums'
import illustration from '../../components/illustration'

export default {
  // name: 'PageName',
  components: {
    illustration
  },
  data () {
    return {
      texte: '',
      listeSection: [],
      selectedSection: 'LaBonneFabrique',
      newsTitre: '',
      illustrationChoisie: '',
      tags: [],
      currentTag: ''
    }
  },
  apollo: {
    allEnums: {
      query: LISTE_ESPACEBF,
      update (data) {
        let listeEnum = data.__type.enumValues
        this.listeSection = []
        listeEnum.forEach((valeurEnum) => {
          this.listeSection.push({label: valeurEnum.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(L)(e)/g, '$1\'$2'), value: valeurEnum.name})
        })
      }
    }
  },
  methods: {
    test (e) {
      console.log(e)
    },
    addTag () {
      this.tags.push(this.currentTag)
      this.currentTag = ''
    },
    keyDownTag (event) {
      if (event.keyCode === 13 && this.currentTag !== '') {
        this.addTag()
      }
    },
    removeTag (index) {
      this.tags.splice(index, 1)
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

  .titre
    font-size: x-large
    font-variant: small-caps
    padding: 10px
</style>
