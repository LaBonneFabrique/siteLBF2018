<template>
  <q-page class="max900">
    <div class="row q-mb-md">
          <div class="portrait">
      <img :src="avatar(id)" width="120px" class="no-shadow" />
      <div style="text-align: center">Voici {{prenom}}</div>
    </div>
        <div class="explication no-padding no-margin">
      Vous trouverez dans cet espace différents détails de la participation de <b>{{prenom}}</b> à nos activités, tels que liste des ateliers et badges.<br />
    </div>
    </div>
      <h6 style="margin: 0px; margin-bottom: 5px;">Les prochains ateliers</h6>
      <div class="row">
        <q-card inline v-for="inscrit in inscriptions" class="cadreInscription no-shadow q-ml-sm" :key="inscrit.prenom + inscrit.activite.titreActivite" style="clear: both">
          <div class="dateInscription" :style="{'background-color': tableCouleurLBF[inscrit.activite.section]}">
            <div class="jourInscription">
              {{horaireLisible(inscrit.activite.dates[0].date, inscrit.activite.dates[0].date).jourNum}} <span>{{horaireLisible(inscrit.activite.dates[0].date, inscrit.activite.dates[0].date).mois}}</span>
            </div>
            <div v-if="inscrit.activite.dates.length > 1" class="separationDateInscriptions"></div>
            <div v-if="inscrit.activite.dates.length > 1" class="moisPlusInscription">& {{moisPlus(inscrit.activite.dates)}}</div>
          </div>
          <lazy-background
            :image-source="urlImage(inscrit.activite.illustration,160,80,100,'', 'crop')"
            :loading-image="urlImage(inscrit.activite.illustration,160,80,1,'', 'crop')"
            error-image="/img/error.png"
            imageClass="imagesInscription">
          </lazy-background>
          <div class="cadreInfosInscriptions">
          <div class="titreInscriptions">
            <h1>{{inscrit.activite.titreActivite}}</h1>
          </div>
          <div class="horaireInscriptions">
            <q-icon size="20px" name="far fa-clock"></q-icon>
            {{traitementHoraireAdherent(inscrit.dateUID, inscrit.activite.dates)}}
          </div>
          <div class="effacerInscriptions">
            <q-btn label="Effacer" icon="far fa-times-circle" flat @click="effaceInscription([inscrit.id])"></q-btn>
          </div>
          </div>
        </q-card>
      </div>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import { authMixins } from '../utils/auth.js'
import { imageMixins } from '../utils/traitementImage'
import { traitementDateMixins } from '../utils/traitementDate'
import { tableCouleurLBF } from '../constants/constanteLBF'
import { genURLImageMixins } from '../utils/genURLImage'
import { EFFACE_INSCRIPTIONS } from '../graphQL/inscription'

import lazyBackground from '../components/VueLazyBackgroundImage'

export default {
  // name: 'PageName',
  components: {
    lazyBackground
  },
  props: {
    userId: String,
    membreId: String
  },
  store: {
    user: 'user',
    estIdentifie: 'estIdentifie'
  },
  mixins: [
    imageMixins,
    traitementDateMixins,
    genURLImageMixins,
    authMixins
  ],
  data () {
    return {
      loadingMembre: 0,
      loadingFuturesActivites: 0,
      futursAteliers: [],
      tableCouleurLBF: tableCouleurLBF,
      id: '',
      nom: '',
      prenom: '',
      inscriptions: []
    }
  },
  created () {
    let leProfil = this.user.profil.filter((membre) => membre.id === this.membreId)
    console.log('leProfil created', leProfil)
    if (leProfil.length === 0) this.$router.push({name: 'accueil'})
  },
  mounted () {
    let leProfil = this.user.profil.filter((membre) => membre.id === this.membreId)
    if (leProfil.length === 0) this.$router.push({name: 'accueil'})
    this.id = leProfil[0].id
    this.prenom = leProfil[0].prenom
    this.inscriptions = leProfil[0].inscriptions
  },
  /* watch: {
    userData: function (newUserData) {
      let lesAteliers = newUserData.filter((membre) => membre.id === this.membreId)
      this.id = lesAteliers[0].id
      this.prenom = lesAteliers[0].prenom
      this.inscriptions = lesAteliers[0].inscriptions
    }
  }, */
  head: {
    title: function () {
      return {
        inner: 'La Bonne Fabrique',
        separator: '-',
        complement: 'tableau personnel'
      }
    }
  },
  methods: {
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/150/' + mId + '.png'
    },
    effaceInscription (ids) {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette inscription ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffaceInscription(ids)
      }).catch(() => {
      })
    },
    async processEffaceInscription (ids) {
      let message = ''
      if (ids.length > 1) {
        message = 'Vos inscriptions sont en train d\'être effacées'
      } else {
        message = 'L\'inscription est en train d\'être effacée'
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: message,
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let promises = []
      ids.forEach((id) => {
        promises.push(
          this.$apollo.mutate({
            mutation: EFFACE_INSCRIPTIONS,
            variables: {
              id: id
            }
          })
        )
      })
      Promise.all(promises).then((data) => {
        console.log(data)
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Inscription effacée avec succès.',
          timeout: 2500,
          type: 'positive'
        })
        this.commitUser()
        this.modalVerifInscriptions = false
      }).catch((error) => console.log(error))
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.max900
  max-width: 900px
  padding-left: 5px

.portrait
  float: left
  margin-left: 20px
  margin-right: 20px

.explication
  text-align: justify
  width: 200px
  margin-left: 20px

.cadreFuturesAteliers
  position: relative
  width: 172px
  height: 160px
  background-color: #FFFFFF
  border: 1px solid $grey-4

.cadreFuturesAteliers .jour
  position: absolute
  width: 57px
  height: 17px
  left: 12px
  top: 5px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: center
  text-transform: capitalize
  color: #C76B00

.cadreFuturesAteliers .numJour
  position: absolute
  width: 43px
  height: 38px
  left: 19px
  top: 18px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 36px
  text-transform: capitalize
  color: #C76B00

.cadreFuturesAteliers .mois
  position: absolute
  width: 58px
  height: 29px
  left: 11px
  top: 56px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 24px
  text-align: center
  text-transform: capitalize
  color: #C76B00

.cadreFuturesAteliers .illustration
  position: absolute
  width: 80px
  height: 80px
  left: 5px
  top: 5px

.cadreFuturesAteliers .titre
  position: absolute
  width: 156px
  height: 43px
  left: 2px
  top: 78px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 18px
  text-align: center
  text-transform: capitalize
  color: #000000
  display: table
.cadreFuturesAteliers .titre span
  display: table-cell
  vertical-align: middle

.cadreFuturesAteliers .horaireIcon
  position: absolute
  width: 17px
  height: 18px
  left: 71px
  top: 110px
  font-size: 18px
  color: #5C5C5C

.cadreFuturesAteliers .horaire
  position: absolute
  width: 85px
  height: 15px
  left: 37px
  top: 138px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 14px
  text-align: center
  color: #5C5C5C

.cadreInscription
  display: block
  width: 160px
  margin-right: 3px

.dateInscription
  position: relative
  width: 160px
  height: 63px

.jourInscription
  position: absolute
  width: 122px
  height: 43px
  right: 0px
  top: 0px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 36px
  color: white
.jourInscription span
  font-size: 24px

.separationDateInscriptions
  position: absolute
  width: 138px
  height: 3px
  right: 0px
  top: 39px
  background: rgba(255, 255, 255, 0.6)
  border-radius: 1px

.moisPlusInscription
  position: absolute
  width: 148.15px
  height: 17px
  right: 5.93px
  top: 43px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: right
  color: rgba(255, 255, 255, 0.6)

.imagesInscription
  position: relative
  width: 160px
  height: 80px

.cadreInfosInscriptions
  position: relative
  width: 160px
  min-height: 81px
  background: #FBFBFB

.titreInscriptions
  display:table
  position: relative
  width: 160px
  height: 34px
.titreInscriptions h1
  display: table-cell
  vertical-align: middle
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 18px
  text-align: center
  text-transform: capitalize
  color: #000000

.horaireInscriptions
  padding-left: 4px

.effacerInscriptions
  text-align: center
</style>
