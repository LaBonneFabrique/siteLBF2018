<template>
  <div>
      <h6 style="margin: 0px; max-width: 480px">Envoi d'un mail</h6>
        <hr />
        {{listeMails}}
        <q-input v-model="sujetMail" placeholder="Sujet du mail" autofocus class="no-shadow q-mb-md" style="max-width: 480px" ></q-input>
       <q-tabs position="bottom" style="height: 250px">
          <!-- Tabs - notice slot="title" -->
          <q-tab default slot="title" name="Ecrire" class="titrePane" icon="fas fa-edit"/>
          <q-tab slot="title" name="Rendu" icon="far fa-eye"/>
          <q-tab slot="title" name="Formatage" icon="far fa-question-circle" />
          <!-- Targets -->
          <q-tab-pane name="Ecrire" style="height: 198px">
          <q-input
            v-model="texteMail"
            type="textarea"
            hide-underline
            rows="7"
            class="no-shadow no-margin no-padding"
            />
          </q-tab-pane>
          <q-tab-pane name="Rendu" style="height: 198px">
            <div v-html="parseMarkdown(texteMail)"></div>
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
        <div class="piedInscription" style="max-width: 480px">
          <q-icon name="fas fa-times" color="secondary" size="36px" class="iconPied" @click.native="fermerRedaction()">
            <q-tooltip anchor="bottom middle" self="top middle">
            Annuler
          </q-tooltip>
          </q-icon>
          <q-icon name="far fa-share-square" color="primary" size="36px" class="iconPied" @click.native="envoiMail()">
            <q-tooltip anchor="bottom middle" self="top middle">
            Envoyer
          </q-tooltip>
          </q-icon>
        </div>
      </div>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import {ENVOI_MAIL} from '../graphQL/mailGraphQL'
import { parseMarkdownMixins } from '../utils/parseMarkdown'

export default {
  name: 'redactionMail',
  mixins: [
    parseMarkdownMixins
  ],
  data () {
    return {
      sujetMail: '',
      texteMail: ''
    }
  },
  props: {
    listeMails: Array
  },
  mounted () {
    console.log(this.listeMails)
  },
  methods: {
    fermerRedaction () {
      this.$eventBus.$emit('finRedaction')
    },
    envoiMail () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Envoyer le mail ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEnvoieMail()
      }).catch(() => {
      })
    },
    processEnvoieMail () {
      this.modalRedaction = false
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Envoie du mail en cours...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: ENVOI_MAIL,
        variables: {
          tag: 'mailUtilisateurs',
          from: 'lasalledesmachines@labonnefabrique.fr',
          to: this.listeMails,
          subject: this.sujetMail,
          html: this.parseMarkdown(this.texteMail)
        }
      }).then((result) => {
        this.sujetMail = ''
        this.texteMail = ''
        this.$eventBus.$emit('finRedaction')
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Mail envoyé avec succès.',
          timeout: 2500,
          type: 'positive'
        })
      }).catch((error) => { console.log(error) })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.titrePane
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px

.piedInscription
  margin-top: 10px
  text-align: right

.iconPied
  margin-left: 10px
  &:hover
    cursor: pointer

.boutonValider:hover
  cursor: pointer
</style>
