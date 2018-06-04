<template>
  <q-page style="width: 800px; shadow-0" >
  <q-table
  :data="listeUsers"
  :config="config"
  :columns="columns"
  :visible-columns="visibleColumns"
  :pagination.sync="pagination"
  row-key="id">
<q-td slot="body-cell-actions" slot-scope="props" :props="props" >
  <q-toggle label="Administrateur" :disable="currentUser(props.row.id)" v-if="testDefined(props.row)" v-model="props.row.role" true-value="Admin" false-value="Utilisateur"
  @input="updateUserRole(props.row.id, props.row.role)"></q-toggle>
  </q-td>
  </q-table>
  </q-page>
</template>

<script>
import {QSpinnerGears} from 'quasar'
import {LISTE_USERS} from '../../constants/usersGraphQL'
import {MAJ_MEMBRE_ROLE} from '../../graphQL/userAuth'

export default {
  components: {
  },
  data () {
    return {
      listeUsers: [],
      loadingUsers: 0,
      visibleColumns: ['nom', 'prenom', 'email', 'actions'],
      pagination: {
        sortBy: 'nom', // String, column "name" property value
        descending: true,
        page: 1,
        rowsPerPage: 5 // current rows per page being displayed
      },
      config: {
        title: 'Liste des adhérents',
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
            singular: 'adhérent sélectionné.',
            plural: 'adhérents sélectionnés.'
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
        label: 'Prénom',
        field: 'prenom',
        name: 'prenom',
        required: true,
        filter: true,
        sort: false
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
        label: 'Actions',
        field: 'actions',
        name: 'actions',
        required: true
      }
      ]
    }
  },
  apollo: {
    listeUsers: {
      query: LISTE_USERS,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingUsers',
      update (data) {
        console.log(data.allProfils)
        let currentId = []
        return data.allProfils.map(row => {
          if (currentId.indexOf(row.user.id) < 0) {
            currentId.push(row.user.id)
            return {
              id: row.user.id,
              nom: row.nom,
              prenom: row.prenom,
              email: row.email,
              mainEmail: row.user.email,
              role: row.user.role[0]
            }
          } else {
            return {
              id: row.id,
              nom: row.nom,
              prenom: row.prenom,
              email: row.email,
              mainEmail: row.user.email
            }
          }
        })
      }
    }
  },
  methods: {
    affiche: function (data) {
      console.log('newVal', data)
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
      console.log(row)
      if (row.role === undefined) {
        console.log('false')
        return false
      } else {
        console.log('true')
        return true
      }
    },
    currentUser (uId) {
      return uId === this.$q.localStorage.get.item('idUser')
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.listeUtilisateurs
  max-width: 500px
</style>
