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
      <q-btn-dropdown
      icon="fas fa-cogs"
      color = "atelier"
      flat inverted dense
      size = "xl"
      >
      <q-list link class="shadow-1">
    <q-item v-close-overlay :to="{name: 'lesateliers'}">
            <q-item-side>
        <q-icon name="fas fa-th-list" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Tous les ateliers</q-item-tile>
      </q-item-main>
    </q-item>
    <q-item v-close-overlay :to="{name: 'ajoutAtelier'}">
      <q-item-side>
        <q-icon name="fas fa-plus" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Créer un nouvel atelier</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
      </q-btn-dropdown>
            <q-btn-dropdown
        icon="fas fa-at"
      color = "primary"
        flat inverted dense
        size = "xl"
      >
      <q-list link class="shadow-1">
          <q-item v-close-overlay :to="{name: 'listeMailings'}">
              <q-item-side>
          <q-icon name="fas fa-th-list" />
        </q-item-side>
        <q-item-main>
          <q-item-tile label>Toutes les lettres</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-close-overlay :to="{name: 'newMailing'}">
            <q-item-side>
        <q-icon name="fas fa-plus" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Nouvelle lettre</q-item-tile>
      </q-item-main>
    </q-item>
      </q-list>
        <q-tooltip anchor="bottom middle" self="top middle">Lettres d'informations</q-tooltip>
      </q-btn-dropdown>
      <!-- <q-btn-dropdown
        icon="far fa-newspaper"
      color = "grey"
        flat inverted dense
        size="xl"
      >
      <q-list link class="shadow-1">
    <q-item v-close-overlay :to="{name: 'listeNews'}">
            <q-item-side>
        <q-icon name="fas fa-th-list" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Toutes les infos</q-item-tile>
      </q-item-main>
    </q-item>
    <q-item v-close-overlay :to="{name: 'news'}">
      <q-item-side>
        <q-icon name="fas fa-plus" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Une nouvelle infos</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
      </q-btn-dropdown> -->
            <q-btn
        icon="fas fa-users"
        color = "tertiary"
        flat inverted dense
        size = "xl"
        @click="$router.push({name: 'listeUsers'})"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Les adhérents</q-tooltip>
      </q-btn>
     <!-- <q-btn
        icon="fas fa-bullhorn"
        color = "grey"
        flat inverted dense
        disable
        size="xl"
        class="relative-position"
      >
        <q-chip floating color="dark" small square class="shadow-1">2</q-chip>
        <q-tooltip anchor="bottom middle" self="top middle">Les petites annonces</q-tooltip>
      </q-btn>
      <q-btn
        icon="far fa-images"
      color = "grey"
        flat inverted dense
        disable
        size = "xl"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Gérer les images</q-tooltip>
      </q-btn>
      <q-btn
        icon="fas fa-tags"
      color = "grey"
        flat inverted dense
        disable
        size = "xl"
      >
        <q-tooltip anchor="bottom middle" self="top middle">Gérer les tags</q-tooltip>
      </q-btn> -->
      <q-btn
        icon="fas fa-sign-out-alt"
      color = "secondary"
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
      <router-view></router-view>
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
      this.$q.cookies.remove('token')
      this.$router.push({name: 'accueil'})
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.text-atelier
  color: $atelier
</style>
