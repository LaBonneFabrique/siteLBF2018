<template>
  <q-page style="width: 960px; shadow-0" class="q-ml-lg">
  <q-table
  :data="listeUsers"
  :filter="filter"
  :config="config"
  :selection="selection"
  :selected.sync="selected"
  :columns="columns"
  :visible-columns="visibleColumns"
  :pagination.sync="pagination"
  :separator="separator"
  title="Liste des utilisateurs"
  row-key="id">
    <template slot="top-right" slot-scope="props">
      <q-search
        hide-underline
        color="primary"
        v-model="filter"
        class="col-7"
        clearable
      />
    </template>
    <template slot="top-selection" slot-scope="props">
        <q-btn color="primary" size="14px" icon="fas fa-at" outline class="q-mr-sm" @click="envoyerMailMasse"/>
      </template>
    <q-td slot="body-cell-famille" slot-scope="props" :props="props" >
      <span v-for="(membre, index) in props.row.famille" :key="membre.id">{{membre.prenom}}<span v-if="estDernier(index, props.row.famille)">, </span> </span>
    </q-td>
<q-td slot="body-cell-actions" slot-scope="props" :props="props" >
  <q-toggle label="Administrateur" :disable="currentUser(props.row.id)" v-if="testDefined(props.row)" v-model="props.row.role" true-value="Admin" false-value="Utilisateur"
  @input="updateUserRole(props.row.id, props.row.role)"></q-toggle>
  <q-icon name="far fa-trash-alt"
    color="atelier" size="18px"
    class="q-ml-sm q-mb-xs bouton"
    @click.native="effacerInscrit(props.row.id, props.row.famille)"
    :disable="!currentUser(props.row.id)"></q-icon>
  <q-icon name="fas fa-at"
    color="primary" size="18px"
    class="q-ml-sm q-mb-xs bouton"
    @click.native="redigerMail(props.row.email)"
    :disable="!currentUser(props.row.id)"></q-icon>
  </q-td>
  </q-table>
      <q-modal v-model="modalRedaction" position="top" :content-css="{padding: '20px', 'max-width': '480px', 'min-width': '320px'}" maximized @hide="listeMails = []">
<redactionMail :listeMails="listeMails"></redactionMail>
    </q-modal>
  </q-page>
</template>

<script>
import {QSpinnerGears} from 'quasar'
import {LISTE_ADHERENTS} from '../../graphQL/users'
import {MAJ_MEMBRE_ROLE, EFFACE_MEMBRE, EFFACER_USER} from '../../graphQL/userAuth'
import redactionMail from '../../components/redactionMail'

export default {
  components: {
    redactionMail
  },
  data () {
    return {
      listeUsers: [],
      loadingUsers: 0,
      visibleColumns: ['nom', 'prenom', 'email', 'famille', 'actions'],
      pagination: {
        sortBy: 'nom', // String, column "name" property value
        descending: true,
        page: 1,
        rowsPerPage: 5 // current rows per page being displayed
      },
      config: {
        title: 'Liste des inscrits',
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
            singular: 'inscrit sélectionné.',
            plural: 'inscrits sélectionnés.'
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
        label: 'Nom',
        field: 'nom',
        name: 'nom',
        filter: true,
        sort: false,
        required: true
      },
      {
        label: 'Prénom',
        field: 'prenom',
        name: 'prenom',
        required: true,
        filter: true,
        sort: false
      },
      {
        label: 'Email',
        field: 'email',
        name: 'email',
        required: true,
        filter: true,
        sort: false
      },
      {
        label: 'Email principal',
        field: 'mainEmail',
        name: 'mainEmail',
        required: false,
        filter: true,
        sort: false
      },
      {
        label: 'Famille',
        field: 'famille',
        name: 'famille',
        require: true,
        filter: false,
        sort: false
      },
      {
        label: 'Actions',
        field: 'actions',
        name: 'actions',
        required: true
      }
      ],
      modalRedaction: false,
      listeMails: [],
      selection: 'multiple',
      selected: [],
      separator: 'horizontal',
      filter: ''
    }
  },
  created () {
    this.$eventBus.$on('finRedaction', () => {
      this.listeMails = []
      this.modalRedaction = false
    })
  },
  beforeDestroy () {
    this.$eventBus.$off('finRedaction')
  },
  apollo: {
    listeUsers: {
      query: LISTE_ADHERENTS,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingUsers',
      update (data) {
        return data.allUsers.map((row) => {
          return {
            id: row.id,
            nom: row.profil[0].nom,
            prenom: row.profil[0].prenom,
            email: row.profil[0].email,
            famille: row.profil.map((profil) => {
              return {
                id: profil.id,
                prenom: profil.prenom
              }
            }),
            role: row.role[0]
          }
        })
      }
    }
  },
  methods: {
    envoyerMailMasse: function () {
      let listeDesMails = this.selected.map((selection) => selection.email)
      this.listeMails = Object.assign([], listeDesMails)
      this.modalRedaction = true
    },
    redigerMail (mail) {
      this.listeMails = Object.assign([], [mail])
      console.log('liste Mails', this.listeMails)
      this.modalRedaction = true
    },
    async updateUserRole (uId, role) {
      console.log(role)
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Chargement des données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.$apollo.mutate({
        mutation: MAJ_MEMBRE_ROLE,
        variables: {
          id: uId,
          role: [role]
        }
      })
      this.$q.loading.hide()
    },
    testDefined (row) {
      if (row.role === undefined) {
        return false
      } else {
        return true
      }
    },
    currentUser (uId) {
      return uId === this.$q.cookies.get('token')
    },
    estDernier (index, famille) {
      let longueur = index + 1
      return longueur < famille.length
    },
    effacerInscrit: function (id, profil) {
      this.$q.dialog({
        title: 'Warning',
        message: 'Vous êtes sur le point d\'effacer un utilisateur. Merci de confirmer.',
        // optional; we want an "OK" button
        ok: 'Confirmer', // takes i18n value, or String for "OK" button label
        // optional; we want a "Cancel" button
        cancel: 'Annuler' // takes i18n value, or String for "Cancel" button label
      }).then(() => {
        this.processEffacerInscrit(id, profil)
      })
    },
    processEffacerInscrit: async function (id, profil) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Mise à jour de la base en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let promises = []
      for (let membre of profil) {
        promises.push(
          this.$apollo.mutate({
            mutation: EFFACE_MEMBRE,
            variables: {
              id: membre.id
            }
          })
        )
      }
      promises.push(
        this.$apollo.mutate({
          mutation: EFFACER_USER,
          variables: {
            id: id
          }
        })
      )
      Promise.all(promises).then((data) => {
        this.$q.loading.hide()
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Compte effacé avec succès.'
        })
        this.$apollo.queries.listeUsers.refetch()
      })
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
</style>
