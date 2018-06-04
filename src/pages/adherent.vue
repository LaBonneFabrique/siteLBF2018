<template>
  <q-page v-if="membreData.id">
    <div class="portrait">
      <img :src="avatar(membreData.id)" width="150px" class="no-shadow" />
      <div style="text-align: center">L'espace de {{membreData.prenom}}</div>
    </div>
    <div class="explication">
      Vous trouverez dans cet espace différents détails de la participation de {{membreData.prenom}} à nos activités, tels que liste des ateliers et badges.<br />
    </div>
    <q-card inline style="width: 400px; margin-left: 20px; background-color: #F9F9F9">
      <q-card-title>
        Les prochains ateliers
      </q-card-title>
      <q-card-main>
        <div v-for="inscrit in futursAteliers" :key="inscrit.id" class="cadreFuturesAteliers">
          <div class="jour" :style="{'color': tableCouleurLBF[inscrit.activite.section]}">{{horaireLisible(inscrit.activite.dateDebut, inscrit.activite.dateFin).jour}}</div>
          <div class="numJour" :style="{'color': tableCouleurLBF[inscrit.activite.section]}">{{horaireLisible(inscrit.activite.dateDebut, inscrit.activite.dateFin).jourNum}}</div>
          <div class="mois" :style="{'color': tableCouleurLBF[inscrit.activite.section]}">{{horaireLisible(inscrit.activite.dateDebut, inscrit.activite.dateFin).mois}}</div>
          <img class="illustration" :src="inscrit.illustrationURL" />
          <div class="titre" ><span>{{inscrit.activite.titreActivite}}</span></div>
          <q-icon name="far fa-clock" class="horaireIcon"/>
          <div class="horaire">{{horaireLisible(inscrit.activite.dateDebut, inscrit.activite.dateFin).horaire}}</div>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import { GET_MEMBRE_BY_ID } from '../graphQL/userAuth'
import { GET_INSCRIPTION_BY_MEMBRE } from '../graphQL/inscriptionGraphQL'
import { imageMixins } from '../utils/traitementImage'
import { traitementDateMixins } from '../utils/traitementDate'
import { tableCouleurLBF } from '../constants/constanteLBF'

export default {
  // name: 'PageName',
  props: {
    userId: String,
    membreId: String
  },
  mixins: [
    imageMixins,
    traitementDateMixins
  ],
  data () {
    return {
      membreData: {},
      loadingMembre: 0,
      loadingFuturesActivites: 0,
      futursAteliers: [],
      tableCouleurLBF: tableCouleurLBF
    }
  },
  head: {
    title: function () {
      return {
        inner: 'La Bonne Fabrique',
        separator: '-',
        complement: 'tableau personnel'
      }
    }
  },
  apollo: {
    membreData: {
      query: GET_MEMBRE_BY_ID,
      variables () {
        return {
          mId: this.membreId
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingMembre',
      watchLoading (isLoading, countModifier) {
        this.loadingUser = isLoading
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
        return data.allProfils[0]
      }
    },
    futursAteliers: {
      query: GET_INSCRIPTION_BY_MEMBRE,
      variables () {
        return {
          mId: this.membreId
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingFuturesActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingUser = isLoading
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
        console.log('membreId', this.membreId)
        console.log(data.allInscriptions)
        let retour = data.allInscriptions.map(async (inscription) => {
          let illuURL = await this.illustrationURL(inscription.activite.illustration, 80, 80)
          return {
            id: inscription.id,
            activite: inscription.activite,
            illustrationURL: illuURL.url
          }
        })
        Promise.all(retour).then((data) => {
          console.log('data', data)
          this.futursAteliers = Object.assign({}, data)
          console.log('futurAtelier', this.futursAteliers)
        })
      }
    }
  },
  methods: {
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/150/' + mId + '.png'
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.portrait
  float: left
  margin-left: 20px

.explication
  float:left
  text-align: justify
  width: 200px
  margin-left: 20px

.cadreFuturesAteliers
  position: relative
  width: 160px
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
  left: 74px
  top: 5px

.cadreFuturesAteliers .titre
  position: absolute
  width: 156px
  height: 43px
  left: 2px
  top: 85px
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
  top: 119px
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
</style>
