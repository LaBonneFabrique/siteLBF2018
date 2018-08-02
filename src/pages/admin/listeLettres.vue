<template>
  <q-page style="width: 960px; shadow-0" class="q-ml-lg">
    <q-table
    title="Liste des lettres de diffusion"
    :data="listeLettres"
    :filter="filter"
    :config="config"
    :columns="columns"
    :visible-columns="visibleColumns"
    :pagination.sync="pagination"
    :separator="separator"
    row-key="id"
    class="no-shadow borderGrise"
  >
          <template slot="top-right" slot-scope="props">
      <q-toggle v-model="estEnvoyeeChecked" label="Non envoyée(s) uniquement" color="tertiary" @input="filtreEnvoyee()"/>
    </template>
      <q-td slot="body-cell-estEnvoyee" slot-scope="props" :props="props">
          <q-icon name="far fa-check-square"
            color="tertiary" size="18px"
            class="q-ml-sm q-mb-xs bouton"
            v-if="props.row.estEnvoyee"
        />
            <q-icon name="far fa-square"
            color="atelier" size="18px"
            class="q-ml-sm q-mb-xs bouton"
            v-else
        />
      </q-td>
          <q-td slot="body-cell-listesDiffusion" slot-scope="props" :props="props" >
      <span v-for="(liste, index) in props.row.listesDiffusion" :key="liste">{{liste}}<span v-if="estDernier(index, props.row.listesDiffusion)">, </span> </span>
    </q-td>
    <q-td slot="body-cell-actions" slot-scope="props" :props="props" >
<q-icon name="far fa-eye"
    color="tertiary" size="18px"
    class="q-ml-sm q-mb-xs bouton"
    @click.native="$router.push({name: 'VisuLettreDiffusion', params: {ldId: props.row.id}})"
></q-icon>
  <q-icon name="far fa-edit"
    color="primary" size="18px"
    class="q-ml-sm q-mb-xs bouton"
    @click.native="$router.push({name: 'mailing', params: {mailId: props.row.id}})"
></q-icon>
  <q-icon name="far fa-trash-alt"
    color="secondary" size="18px"
    @click.native="deleteMailingDialogue(props.row.id)"
    class="q-ml-sm q-mb-xs bouton"
></q-icon>

  </q-td>
    </q-table>
    <q-btn icon="fas fa-plus" label="Créer une nouvelle lettre de diffusion" outline color="primary" class="q-my-sm q-ml-md" @click="$router.push({name: 'newMailing'})"></q-btn>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import {LISTE_LETTRES, DELETE_MAILDIFFUSION} from '../../graphQL/mailingList'
export default {
  // name: 'PageName',
  data () {
    return {
      loadingLettres: false,
      visibleColumns: ['titre', 'estEnvoyee', 'listesDiffusion', 'actions'],
      pagination: {
        sortBy: 'nom', // String, column "name" property value
        descending: true,
        page: 1,
        rowsPerPage: 5 // current rows per page being displayed
      },
      config: {
        title: 'Liste des lettres de diffusion',
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: '40px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        labels: {
          columns: 'Colonnes',
          allCols: 'Toutes les colonnes',
          rows: 'Lignes',
          selected: {
            singular: 'lettre sélectionnée',
            plural: 'lettres sélectionnées'
          },
          clear: 'vider la sélection',
          search: 'Recherche',
          all: 'Tout'
        }
      },
      columns: [{
        label: 'id',
        field: 'id',
        name: 'id'
      },
      {
        label: 'Titre',
        field: 'titre',
        name: 'titre',
        filter: true,
        sort: false,
        required: true
      },
      {
        label: 'Envoyée ?',
        field: 'estEnvoyee',
        name: 'estEnvoyee',
        required: true,
        filter: true,
        sort: false
      },
      {
        label: 'Liste(s) de diffusion concernée(s)',
        field: 'listesDiffusion',
        name: 'listesDiffusion',
        required: true,
        filter: true,
        sort: false
      },
      {
        label: 'Actions',
        field: 'actions',
        name: 'actions',
        required: true
      }
      ],
      selection: 'multiple',
      selected: [],
      separator: 'horizontal',
      filter: '',
      listeLettres: [],
      estEnvoyeeChecked: false,
      listeLettresInitiale: []
    }
  },
  apollo: {
    allDiffusionEmails: {
      query: LISTE_LETTRES,
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
      update (data) {
        let results = data.allDiffusionEmails
        this.listeLettres = results.map((result) => {
          return {
            id: result.id,
            titre: result.titre,
            estEnvoyee: result.estEnvoye,
            listesDiffusion: result.listesDiffusion
          }
        })
        this.listeLettresInitiale = Object.assign([], this.listeLettres)
      }
    }
  },
  methods: {
    estDernier (index, famille) {
      let longueur = index + 1
      return longueur < famille.length
    },
    deleteMailingDialogue (id) {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer Cette lettre de diffusion ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.deleteMailing(id)
      }).catch(() => {
      })
    },
    deleteMailing (id) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Effacement en cours...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: DELETE_MAILDIFFUSION,
        variables: {
          id: id
        }
      }).then((retour) => {
        this.$q.loading.hide()
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'La lettre a été effacée avec succès.'
        })
        this.$apollo.queries.allDiffusionEmails.refetch()
      }).catch((error) => console.log(error))
    },
    filtreEnvoyee () {
      if (this.estEnvoyeeChecked) {
        this.listeLettres = this.listeLettres.filter((lettre) => !lettre.estEnvoyee)
      } else {
        this.listeLettres = this.listeLettresInitiale
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.listeUtilisateurs
  max-width: 500px

.text-atelier
  color: $atelier

.bouton:hover
  cursor: pointer

.borderGrise
  border: 1px solid $blue-grey-2
</style>
