<template>
  <q-page padding>
    Cette page contiendra un résumé des infos et des éventuelles actions à entreprendre (validation d'une petite annonce par exemple).
    <q-btn label="envoyer un mail" @click="envoiMail('luchier@gmail.com', 'pif', 'pouf')"></q-btn><br />
    <markdown-editor v-model="leTexte"></markdown-editor>
    <div>le texte: {{leTexte}}</div>
  </q-page>
</template>

<script>
import { mailMixins } from '../../utils/envoiMail'
import markdownEditor from '../../components/markdownEditor'

export default {
  components: {
    markdownEditor: markdownEditor
  },
  mixins: [mailMixins],
  data () {
    return {
      leTexte: ''
    }
  },
  created () {
    this.$eventBus.$on('sauvegarde', () => console.log('pof'))
  },
  beforeDestroy () {
    this.$eventBus.$off('sauvegarde')
  },
  methods: {
    test: function () {
      console.log('test !')
    }
  }
  // name: 'PageName',
}
</script>

<style>
</style>
