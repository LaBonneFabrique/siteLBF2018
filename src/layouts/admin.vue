<template>
  <q-layout
  > <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header
    class="no-shadow"
    >
      <q-toolbar color="white">
        <img
          src="~assets/logoLBFpetit.png"
          style="margin-rigt: 10px;"
        />
        <q-toolbar-title style="color: grey">
          Administration du site
        </q-toolbar-title>
              <q-btn
      icon="fas fa-home"
      color = "grey"
      flat inverted dense
      size = xl
      @click="$router.push({name:'accueil'})"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Retour au site</q-tooltip>
      </q-btn>
      <q-btn
      icon="fas fa-cogs"
      color = "grey"
      flat inverted dense
      size = "xl"
      @click="$router.push({name: 'lesateliers'})"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Les ateliers</q-tooltip>
      </q-btn>
      <q-btn
        icon="far fa-newspaper"
      color = "grey"
        flat inverted dense
        disable
        size="xl"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Les nouvelles</q-tooltip>
      </q-btn>
      <q-btn
        icon="fas fa-bullhorn"
      color = "grey"
        flat inverted dense
        disable
        size="xl"
      >
        <q-chip floating color="dark" small square class="shadow-1">2</q-chip>
        <q-tooltip anchor="bottom middle" self="top middle">Les petites annonces</q-tooltip>
      </q-btn>
      <q-btn
        icon="fas fa-users"
      color = "grey"
        flat inverted dense
        size = "xl"
        @click="$router.push({name: 'listeUsers'})"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Les adhérents</q-tooltip>
      </q-btn>
      <q-btn
        icon="fas fa-at"
      color = "grey"
        flat inverted dense
        disable
        size = "xl"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Envoyer un mail</q-tooltip>
      </q-btn>
      <q-btn
        icon="fas fa-sign-out-alt"
      color = "grey"
        flat inverted dense
        size = "xl"
        @click="deconnexion()"
      >
        <q-tooltip anchor="center right" self="center left">Déconnexion</q-tooltip>
      </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  // name: 'LayoutName',
  data () {
    return {
      leftDrawer: true
    }
  },
  methods: {
    deconnexion: function () {
      this.$q.localStorage.clear()
      this.$router.push({name: 'accueil'})
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
