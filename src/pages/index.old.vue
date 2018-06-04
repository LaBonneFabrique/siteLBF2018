<template>
  <q-page>
    <q-card inline v-if="affichageActivites.length > 0" v-for="(activite, index) in affichageActivites" class="cadre no-shadow" :key="activite.id">
      <!-- <div class="entete" :style="{'background-image': 'url('+urlImage(activite.image,300,220,1,'blur')+')'}"></div> -->
      <lazy-background
        :image-source="urlImage(activite.image,300,220,100,'')"
        :loading-image="urlImage(activite.image,300,220,1,'blur')"
        error-image="/img/error.png"
        imageClass="entete">
      </lazy-background>
      <div class="typeCadre"></div>
      <img
        :src="afficheIcon(activite.section)"
        class="typeIcon"
      >
      <div class="type">{{ afficheType(activite.type) }}</div>
          <div class="cadreFond"></div>
          <div class="jour" :style="{'color': tableCouleurLBF[activite.section]}">{{horaireLisible(activite.dateDebut, activite.dateFin).jour}}</div>
          <div class="numJour" :style="{'color': tableCouleurLBF[activite.section]}">{{horaireLisible(activite.dateDebut, activite.dateFin).jourNum}}</div>
          <div class="mois" :style="{'color': tableCouleurLBF[activite.section]}">{{horaireLisible(activite.dateDebut, activite.dateFin).mois}}</div>
        <div class="titre"><span>{{activite.titre}}</span></div>
        <div class="description">
          {{parseMarkdown(activite.description)}}
          </div>
        <div v-if="activite.type === 'Ateliers'" class="cadreActions">
        <q-icon name="far fa-clock" class="horaireIcon"/>
        <div class="horaire">{{horaireLisible(activite.dateDebut, activite.dateFin).horaire}}</div>
        <q-icon name="fas fa-users" class="placesIcon" />
        <div class="places">{{nbPlacesRestantes(index)}}</div>
        <q-icon name="fas fa-euro-sign" class="prixIcon" />
        <div class="prix">
          <p v-for="prix in activite.prix" :key="activite.id.concat(prix.description)" class="no-margin no-padding">
           <span v-if="prix.qf">{{calculPrix(prix.prix,qf)}} € - {{prix.description}}</span>
           <span v-else>{{prix.prix}} € - {{prix.description}}</span>
          </p>
        </div>
          <q-btn class="inscription" label="Inscriptions" icon="fas fa-edit" dense outline no-caps
          v-if="activite.checkInscription"
          :disable="isComplet(activite) || estTropTard(activite.dateDebut)"
          @click="creationModalInscription(activite)"
          :style="{'color': tableCouleurLBF[activite.section]}"
            >
            <q-tooltip anchor="bottom middle" self="top middle" v-if="estIdentifie && estTropTard(activite.dateDebut)">
            La date limite d'inscription est dépassée.
          </q-tooltip>
        <q-tooltip v-if="!estIdentifie" anchor="bottom middle" self="top middle">
          Connectez-vous pour vous inscrire.
        </q-tooltip>
</q-btn>
        </div>
    </q-card>
    <q-card inline v-if="affichageActivites.length === 0" class="cadre no-shadow">
      <div class="entete" :style="{'background-image': 'url(https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_center,h_220,w_300/v1523014644/logoLBFSeul_a1t4af.png)'}"></div>
      <div class="titre"><span>Il n'y rien par ici...</span></div>
        <div class="description" style="margin-bottom: 10px">Veuillez modifier votre sélection.</div>
    </q-card>
    <q-modal v-model = "modalInscription" :content-css="{padding: '20px'}">
      <h6 style="margin: 0px">Inscription</h6>
      <hr />
      <div>Sélectionnez le ou les membres de votre famille à inscrire :</div>
      <q-checkbox
        v-model="aInscrire"
        v-for="membre in userData.profil"
        :label="membre.prenom"
        :val="membre.id"
        :key="membre.id"
        :disable="disableCheckbox(membre.id)"
        style="margin-right: 10px"/>
       <div class="row justify-end" style="margin-top: 15px">
       <q-btn :style="{'color': tableCouleurLBF['LaBrasserie']}" @click="modalInscription = false" flat inverted >Annuler</q-btn>
       <q-btn v-if="!inscriptionUpdate" :style="{'color': tableCouleurLBF['jardinPartage']}" flat inverted @click="saveInscription()"
         >
         Enregistrer</q-btn>
       <q-btn v-else :style="{'color': tableCouleurLBF['jardinPartage']}" flat inverted @click="saveInscription()">Modifier</q-btn>
       </div>
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears,
  date
} from 'quasar'
import { QUERY_ALL_ACTIVITES_ASC } from '../graphQL/activitesGraphQL'
import { tableCouleurLBF, iconeLBF } from '../constants/constanteLBF'
// import { GET_ILLU_BY_ID } from '../constants/illustrationsGraphQL'
import { FIND_USER_BY_ID } from '../graphQL/userAuth'
import { AJOUT_INSCRIPTION, LISTE_INSCRIPTION, LES_INSCRIPTIONS, LISTE_INSCRIPTION_BY_ATELIER, EFFACE_LISTE_INSCRIPTION, CONNECT_ACTIVITE_INSCRIPTION } from '../graphQL/inscriptionGraphQL'
import { authMixins } from '../utils/auth'
import { qfMixins } from '../utils/qf'
import { genURLImageMixins } from '../utils/genURLImage'
// import cloudinary from 'cloudinary-core'
// var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})

import marked from 'marked'
import lazyBackground from '../components/VueLazyBackgroundImage'

export default {
  mixins: [authMixins, qfMixins, genURLImageMixins],
  components: {
    lazyBackground
  },
  data () {
    return {
      affichageActivites: [],
      affichageActivitesReference: [],
      modalInscription: false,
      aInscrire: [],
      checkDisable: false,
      activiteInscription: {},
      checkboxInscription: [],
      inscriptionUpdate: false,
      userData: {},
      listeInscriptions: [],
      complet: false,
      allInscriptions: [],
      listeActivites: [],
      estIdentifie: this.isLoggedIn(),
      tableCouleurLBF: tableCouleurLBF,
      iconeLBF: iconeLBF,
      qf: 0,
      listeFiltres: [],
      listeFiltreTypes: []
    }
  },
  head: {
    title: {
      inner: 'La Bonne Fabrique',
      separator: '-',
      complement: 'Accueil'
    }
  },
  created () {
    this.$eventBus.$on('logginState', this.updateEstIdentifie)
    this.$eventBus.$on('filtreTypes', (filtres) => {
      if (filtres.length === 0) {
        this.listeFiltreTypes = []
      } else {
        Object.assign(this.listeFiltreTypes, filtres)
      }
      this.filtreType()
    })
    this.$eventBus.$on('filtreMenu', (filtres) => {
      if (filtres.length === 0) {
        this.listeFiltres = []
      } else {
        Object.assign(this.listeFiltres, filtres)
      }
      this.filtreSection()
    })
  },
  beforeDestroy () {
    this.$eventBus.$off('logginState', this.updateEstIdentifie)
    this.$eventBus.$off('filtreTypes')
    this.$eventBus.$off('filtreMenu')
  },
  apollo: {
    allActivites: {
      query: QUERY_ALL_ACTIVITES_ASC,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingActivites = isLoading
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
      async result (result) {
        this.affichageActivites = []
        var listeActivites = []
        this.listeActivites = []
        var listeUnique = ''
        for (let activite of result.data.allActivites) {
          switch (activite.type) {
            case 'Ateliers':
              if (listeUnique.indexOf(activite.idCycle) < 0) {
                listeUnique += activite.idCycle
                listeActivites[activite.idCycle] = [{
                  aId: activite.id,
                  gId: activite.idGoogleEvent,
                  sequence: activite.sequenceEvent,
                  summary: activite.titreActivite,
                  location: activite.lieuActivite,
                  description: activite.description,
                  dateDebut: activite.dateDebut,
                  dateFin: activite.dateFin
                }]
                let inscriptions = []
                await this.$apollo.query({
                  query: LISTE_INSCRIPTION_BY_ATELIER,
                  fetchPolicy: 'network-only',
                  variables: {
                    atelierId: activite.id
                  }
                }).then((dataCycle) => {
                  Object.assign(inscriptions, dataCycle.data.allInscriptions)
                }).catch((error) => {
                  console.log(error)
                })
                // let imageIllu = ''
                // imageIllu = cl.url(activite.illustration, { width: 300, height: 220, fetchFormat: 'auto', crop: 'lfill', gravity: 'face' })
                this.affichageActivites.push(
                  {
                    id: activite.id,
                    idCycle: activite.idCycle,
                    checkInscription: activite.checkInscription,
                    publie: activite.publie,
                    section: activite.section,
                    lieu: activite.lieuActivite,
                    prix: activite.prix,
                    titre: activite.titreActivite,
                    description: activite.description,
                    image: activite.illustration,
                    idGoogleEvent: activite.idGoogleEvent,
                    sequenceEvent: activite.sequenceEvent,
                    maxParticipants: activite.maxParticipants,
                    inscriptions: inscriptions,
                    type: activite.type,
                    dateDebut: activite.dateDebut,
                    dateFin: activite.dateFin
                  }
                )
              } else {
                listeActivites[activite.idCycle].push({
                  aId: activite.id,
                  gId: activite.idGoogleEvent,
                  sequence: activite.sequenceEvent,
                  summary: activite.titreActivite,
                  location: activite.lieuActivite,
                  description: activite.description,
                  dateDebut: activite.dateDebut,
                  dateFin: activite.dateFin
                })
              }
              // indice += 1
              break
            case 'Infos':
              // let imageIllu = ''
              // imageIllu = cl.url(activite.illustration, { width: 300, height: 220, fetchFormat: 'auto', crop: 'lfill', gravity: 'face' })
              this.affichageActivites.push({
                id: activite.id,
                publie: activite.publie,
                titre: activite.titreActivite,
                description: activite.description,
                section: activite.section,
                image: activite.illustration,
                type: activite.type,
                dateDebut: activite.dateDebut
              })
              // indice += 1
              break
          }
        }
        Object.assign(this.affichageActivitesReference, this.affichageActivites)
        Object.assign(this.listeActivites, listeActivites)
      }
    },
    userData: {
      query: FIND_USER_BY_ID,
      fetchPolicy: 'network-only',
      variables () {
        return {
          id: this.loggedInUser()
        }
      },
      skip () {
        return !this.isLoggedIn()
      },
      update (data) {
        this.listeInscriptions = []
        this.qf = data.allUsers[0].qf
        data.allUsers[0].profil.forEach((membre) => {
          this.$apollo.query({
            query: LISTE_INSCRIPTION,
            fetchPolicy: 'network-only',
            variables: {
              membreId: membre.id
            }
          }).then((data) => {
            if (data.data.allInscriptions.length > 0) {
              data.data.allInscriptions.forEach((inscription) => {
                this.listeInscriptions.push(inscription)
              })
            }
          })
        })
        return data.allUsers[0]
      }
    },
    allInscriptions: {
      query: LES_INSCRIPTIONS,
      fetchPolicy: 'network-only'
    }
  },
  methods: {
    filtreType () {
      const lesFiltres = this.listeFiltreTypes
      console.log(this.listeFiltreTypes)
      function retourneFiltre (element) {
        let test = false
        lesFiltres.forEach((filtre) => {
          if (element.type === filtre) test = true
        })
        return test
      }
      Object.assign(this.affichageActivites, this.affichageActivitesReference)
      let affichageFiltre = this.affichageActivites.filter(retourneFiltre)
      console.log('liste filtrée', affichageFiltre)
      if (this.listeFiltreTypes.length === 0) {
        this.$set(this, 'affichageActivites', this.affichageActivitesReference)
      } else {
        this.$set(this, 'affichageActivites', affichageFiltre)
      }
    },
    filtreSection () {
      const lesFiltres = this.listeFiltres
      function retourneFiltre (element) {
        let test = false
        lesFiltres.forEach((filtre) => {
          if (element.section === filtre) test = true
        })
        return test
      }
      Object.assign(this.affichageActivites, this.affichageActivitesReference)
      let affichageFiltre = this.affichageActivites.filter(retourneFiltre)
      console.log('liste filtrée', affichageFiltre)
      if (this.listeFiltres.length === 0) {
        this.$set(this, 'affichageActivites', this.affichageActivitesReference)
      } else {
        this.$set(this, 'affichageActivites', affichageFiltre)
      }
    },
    nbPlacesRestantes: function (nActivite) {
      if (this.affichageActivites[nActivite].checkInscription) {
        const nbPlaces = this.affichageActivites[nActivite].maxParticipants - this.affichageActivites[nActivite].inscriptions.length
        if (nbPlaces >= 1) return nbPlaces.toString()
        // if (nbPlaces === 1) return 'Dernière place'
        if (nbPlaces === 0) {
          return 'Séance complète'
        }
      } else {
        return ''
      }
    },
    inscrire: function (mId) {
      if (this.aInscrire.indexOf(mId) > -1) {
        return true
      } else {
        return false
      }
    },
    getValeur: function (mId, cId) {
      return mId + '**-**' + cId
    },
    verifieCheckbox: function (mId, cId) {
      var membreInscritFlag = false // verification si membre inscrit à un creneau
      var membreInscritCreneauFlag = false // verification si membre inscrit à CE creneau cId
      let retour = false
      this.checkboxInscription.forEach((inscription) => {
        if (inscription.indexOf(mId) > -1) membreInscritFlag = true
        if (inscription.indexOf(this.getValeur(mId, cId)) > -1) membreInscritCreneauFlag = true
        if ((membreInscritFlag && membreInscritCreneauFlag) || (!membreInscritFlag && !membreInscritCreneauFlag)) {
          retour = false
        } else {
          retour = true
        }
      })
      return retour
    },
    horaireLisible: function (debut, fin) {
      /* let dateActivite = date.formatDate(debut, 'dddd D MMMM', {
        monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
      }) */
      let jour = date.formatDate(debut, 'dddd')
      let jourNum = date.formatDate(debut, 'D')
      let mois = date.formatDate(debut, 'MMMM')
      switch (mois) {
        case 'Janvier':
          mois = 'Janv'
          break
        case 'Février':
          mois = 'Févr.'
          break
        case 'Juillet':
          mois = 'Juil.'
          break
        case 'Septembre':
          mois = 'Sept.'
          break
        case 'Octobre':
          mois = 'Oct.'
          break
        case 'Novembre':
          mois = 'Nov.'
          break
        case 'Décembre':
          mois = 'Déc.'
          break
      }
      let heureDebut = date.formatDate(debut, 'HH')
      let minDebut = date.formatDate(debut, 'mm')
      let heureFin = date.formatDate(fin, 'HH')
      let minFin = date.formatDate(fin, 'mm')
      let horaire = heureDebut + 'h' + minDebut + '-' + heureFin + 'h' + minFin
      return {horaire: horaire, jour: jour, jourNum: jourNum, mois: mois}
    },
    saveInscription: function () {
      this.modalInscription = false
      if (this.listeInscriptions.length > 0) this.updateInscription()
      if (this.aInscrire.length === 0) {
        this.modalInscription = false
        return
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Enregistrement de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let promises = []
      this.aInscrire.forEach((membre) => {
        promises.push(
          this.$apollo.mutate({
            mutation: AJOUT_INSCRIPTION,
            variables: {
              membreId: membre,
              atelierId: this.activiteInscription.id
            }
          })
        )
      })
      Promise.all(promises).then(async (data) => {
        await this.$apollo.mutate({
          mutation: CONNECT_ACTIVITE_INSCRIPTION,
          variables: {
            aId: this.activiteInscription.id,
            iId: data[0].data.createInscription.id
          }
        }).catch((error) => { console.log(error) })
        this.$apollo.queries.allActivites.refetch()
        this.$apollo.queries.userData.refetch()
        this.$apollo.queries.allInscriptions.refetch()
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Inscription effectuée avec succès.',
          timeout: 2500,
          type: 'positive'
        })
      })
    },
    updateInscription: function () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Préparation de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      var promises = []
      this.listeInscriptions.forEach((inscription) => {
        if (inscription.id) {
          promises.push(
            this.$apollo.mutate({
              mutation: EFFACE_LISTE_INSCRIPTION,
              variables: {
                id: inscription.id
              }
            }).then((data) => {
            })
          )
        }
      })
      Promise.all(promises).then((data) => {
        this.$q.loading.hide()
        this.$apollo.queries.allActivites.refetch()
        this.$apollo.queries.userData.refetch()
      })
    },
    creationModalInscription: async function (activite) {
      this.activiteInscription = activite
      this.aInscrire = []
      this.checkboxInscription = []
      this.listeInscriptions = []
      if (this.userData.profil.length > 0) {
        this.userData.profil.forEach((membre) => {
          let listeAteliers = this.traitementInscription('membre', membre.id)
          if (listeAteliers.length > 0) this.listeInscriptions.push(listeAteliers[0])
          if (listeAteliers.length > 0) {
            this.inscriptionUpdate = true
            this.aInscrire.push(membre.id)
            this.checkboxInscription.push(this.getValeur(membre.id, listeAteliers[0].creneauId))
          }
        })
        this.modalInscription = true
      } else {
        await this.$q.notify({
          message: 'Personne à inscrire dans votre profil. Redirection vers votre tableau de bord.',
          timeout: 2500,
          type: 'warning',
          position: 'bottom-left'
        })
        this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
      }
    },
    traitementInscription: function (leCas, mId, aId) {
      var listeFiltree = []
      switch (leCas) {
        case 'membre':
          listeFiltree = this.activiteInscription.inscriptions.filter((el) => {
            return el.membreId === mId
          })
          break
        case 'creneau':
          listeFiltree = this.activiteInscription.inscriptions.filter((el) => {
            return el.membreId === mId && el.creneauId === aId
          })
          break
      }
      return listeFiltree
    },
    btnDisableStatus: function () {
      if (this.activiteInscription.checkInscriptionCycle) {
        return false
      } else {
        if (this.checkboxInscription.length > 0 || this.listeInscriptions.length > 0) { return false } else { return true }
      }
    },
    isComplet: function (activite) {
      if (!this.estIdentifie) return true
      const complet = (activite.maxParticipants - activite.inscriptions.length) === 0
      var estDejaInscrit = false
      this.userData.profil.forEach((membre) => {
        const filtre = activite.inscriptions.filter((el) => {
          return el.membreId === membre.id
        })
        if (filtre.length > 0) estDejaInscrit = true
      })
      return complet && !estDejaInscrit
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.isLoggedIn())
    },
    disableCheckbox: function (mId) {
      if (!this.modalInscription) return true
      let ajustement = 0
      this.userData.profil.forEach((membre) => {
        if (this.traitementInscription('membre', membre.id).length > 0) ajustement += 1
      })
      if ((this.activiteInscription.maxParticipants - this.activiteInscription.inscriptions.length) > 0) {
        return false
      } else {
        if ((ajustement > 0) && (this.aInscrire.length === 0)) return false
        return (this.aInscrire.indexOf(mId) < 0)
      }
    },
    deconnexion: function () {
      this.logout()
      this.estIdentifie = this.$q.localStorage.has('token')
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      this.$eventBus.$emit('logginState')
      // this.$router.push({name: 'accueil'})
    },
    estTropTard (dateDebutAtelier) {
      let validite = new Date(dateDebutAtelier).getTime()
      let todayTS = Date.now()
      return (validite - todayTS) < 0
    },
    afficheType (typeActivite) {
      switch (typeActivite) {
        case 'Ateliers':
          return 'Atelier'
        case 'Infos':
          return 'Info'
        case 'petitesAnnonces' :
          return 'P.A.'
      }
    },
    afficheIcon (section) {
      return '/statics/' + this.iconeLBF[section] + '.svg'
    },
    parseMarkdown (texte) {
      return marked(texte)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

$fond = #FFFFFF // #F7FAFA

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.cadre
  position: relative
  width: 300px
  background: $fond
  margin-left: 20px
  margin-bottom: 40px
  border: 1px solid $grey-3

.entete
  position: absolute
  width: 298px
  height: 220px
  left: 0px
  top: 0px

.sectionIcon
  position: absolute
  left: 2.33%
  right: 83.33%
  top: 47.59%
  bottom: 44.86%
  font-size: 36px
  color: #C76B00

.barreTitre
  margin-top: 7px
  width: 286px
  margin-left: 7px

.titre
  position: absolute
  width: 221px
  height: 41px
  left: 72px
  top: 220px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 18px
  text-transform: capitalize
  color: #000000
  display: table
.titre span
  display: table-cell
  vertical-align: middle

.cadreFond
  position: absolute
  width: 64px
  height: 86px
  left: 5px
  top: 182px
  background: $fond
  border-radius: 4px

.jour
  position: absolute;
  width: 57px
  height: 17px
  left: 8px
  top: 184px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: center
  text-transform: capitalize

.numJour
  position: absolute
  width: 43px
  height: 38px
  left: 15px
  top: 197px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 36px
  text-transform: capitalize
  text-align: center
  color: #C76B00

.mois
  position: absolute;
  width: 58px
  height: 29px
  left: 7px
  top: 235px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 24px
  text-transform: capitalize
  text-align: center
  color: #C76B00

.description
  position: relative
  width: 286px
  margin-left: 7px
  margin-top: 266px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 16px
  text-align: justify
  color: #000000

.typeCadre
  position: absolute;
  width: 50px
  height: 60px
  left: 243px
  top: 7px
  background: $fond
  border-radius: 4px

.type
  position: absolute;
  width: 46px;
  height: 15px;
  left: 245px;
  top: 51px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  font-size: 14px;
  text-align: center;
  text-transform: capitalize;
  color: $grisLBF;

.typeIcon
  position: absolute;
  width: 40px;
  height: 40px;
  left: 248px;
  top: 8px;

.cadreActions
  position: relative
  width: 286px
  height: 80px
  margin-left: 7px

.horaireIcon
  position: absolute
  width: 17px
  height: 18px
  left: 1px
  top: 1px
  font-size: 18px
  color: $grisBF

.horaire
  position: absolute;
  width: 85px;
  height: 15px;
  left: 27px;
  top: 2px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 14px;
  color: $grisBF;

.placesIcon
  position: absolute;
  width: 19px;
  height: 19px;
  left: 0px;
  top: 23px;
  line-height: normal;
  font-size: 18px;
  color: $grisBF;

.places
  position: absolute;
  width: 82px;
  height: 15px;
  left: 27px;
  top: 26px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 14px;
  color: $grisBF;

.prixIcon
  position: absolute;
  width: 12px;
  height: 17px;
  left: 130px;
  top: 0px;
  font-size: 18px;
  text-transform: capitalize;
  font-variant: small-caps;
  color: $grisBF;

.prix
  position: absolute;
  width: 132px
  height: 63px
  left: 153px
  top: -2px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  font-size: 14px
  line-height: 24px
  color: $grisBF

.inscription
  position: absolute
  width: 115px
  height: 22px
  left: 0px
  top: 46px
  color: #969696

</style>
