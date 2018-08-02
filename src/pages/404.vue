<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/404.svg"
        style="width:30vw;max-width:450px;"
      >
    </p>
    <p class="text-faded">Désolé, cette page n'existe pas...<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="$router.push('/')"
    >Retour à l'accueil</q-btn>
  </div>
</template>
