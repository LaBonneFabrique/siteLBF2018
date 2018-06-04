<template>
  <div>
    <div class="q-headline">Formatage</div>
    <div class="row" style="margin: 0px; pading: 0px">
      <div class="col-2">
        <div class="q-title">Bases</div>
        <em>*italique*</em><br />
        <strong>**gras**</strong><br />
      </div>
      <div class="col-2">
        <div class="q-title">listes</div>
        * liste non numérotée<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* sous élément<br />
        1. liste numérotée
      </div>
      <div class="col-2">
        <div class="q-title">retour à la ligne</div>
        double espace + entrée
        <div class="q-title">lien :</div>
        [texte du lien](url_du_lien)
      </div>
    </div>
    <div class="row" style="margin: 0px; pading: 0px; margin-top: 30px">
      <div class="col-5 offset-1" style="margin: 0px; padding: 0px">
        <q-field label="Rédiger" icon="far fa-edit" icon-color="primary">
        </q-field>
        <q-input
          v-model="value"
          ref="input"
          type="textarea"
          rows="7"
          @input="newValue => $emit('input', newValue)"
          style="margin-top: 10px"
        />
      </div>
      <div class="col-1"></div>
      <div class="col-5">
            <q-field label="Aperçu" icon="far fa-edit" icon-color="secondary">
        </q-field>
        <div v-html="parseMarkdown(value)" style="height: 100%; margin-top: 10px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseMarkdownMixins } from '../utils/parseMarkdown.js'

export default {
  // name: 'ComponentName',
  mixins: [parseMarkdownMixins],
  props: ['value'],
  data () {
    return {
    }
  },
  methods: {
    updateValue: function (value) {
      console.log('bob', value)
      this.$eventBus.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
