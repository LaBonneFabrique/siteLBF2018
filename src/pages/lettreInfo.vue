<template>
  <q-page padding>
    <!-- content -->
    <div v-html="mailHtml"></div>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import {GET_MAILDIFFUSION_HTML_BY_ID} from '../graphQL/mailingList'
export default {
  // name: 'PageName',
  data () {
    return {
      mailHtml: '',
      loadingLettres: 0
    }
  },
  props: {
    ldId: String
  },
  mounted () {
    console.log(this.ldId)
  },
  apollo: {
    allDiffusionEmails: {
      query: GET_MAILDIFFUSION_HTML_BY_ID,
      variables () {
        return {
          id: this.ldId
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingLettres',
      watchLoading (isLoading, countModifier) {
        this.loadingAbonnes = isLoading
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
        console.log(result.data.allDiffusionEmails)
        this.mailHtml = result.data.allDiffusionEmails[0].mailHtml
      }
    }
  }
}
</script>

<style>
</style>
