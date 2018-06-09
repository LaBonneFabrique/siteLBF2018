<template>
  <q-page>
    <q-card v-if="affichageActivites.length > 0" v-for="(activite, index) in affichageActivites" class="cadreNew no-shadow" :key="activite.id"  :style="{'display': 'inline-block', 'background-color': tableCouleurLBF[activite.section]}">
      <div class="cadreDates" :style="{'background-color': tableCouleurLBF[activite.section]}"></div>
            <div class="jourNew">
        {{horaireLisible(activite.dateDebut, activite.dateFin).jourNum}} <span>{{horaireLisible(activite.dateDebut, activite.dateFin).mois}}</span>
      </div>
      <div v-if="activite.dates.length > 1" class="separation"></div>
      <div v-if="activite.dates.length > 1" class="moisPlus">{{moisPlus(activite.dates)}}</div>

      <lazy-background
        :image-source="urlImage(activite.image,320,180,100,'', 'crop')"
        :loading-image="urlImage(activite.image,320,180,1,'blur', 'crop')"
        error-image="/img/error.png"
        imageClass="imageEntete">
      </lazy-background>
      <div class="placesRestantes" v-if="activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}">
      {{nbPlacesRestantes(index)}} places restantes
      </div>
      <!--<div class="placesRestantes" v-else-if="activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}">
      Dernière place
      </div>
      <div class="placesRestantes" v-else-if="activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}">
      Complet
      </div>
      :disable="isComplet(activite) || estTropTard(activite.dateDebut)"
      -->
      <div class="inscription" v-if="activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}" @click="creationModalInscription(activite)" >
        <q-icon name="fas fa-edit" size="12px" style="margin-right: 3px"></q-icon>Inscriptions
        <!--<q-tooltip anchor="bottom middle" self="top middle" v-if="estTropTard(activite.dateDebut)">
            La date limite d'inscription est dépassée.
          </q-tooltip>
        <q-tooltip anchor="bottom middle" self="top middle" v-else-if="isComplet(activite)">
            L'atelier est complet
          </q-tooltip> -->
      </div>

      <div class="cadreInfo" >
        <div class="titreNew"><h1>{{activite.titre}}</h1></div>
        <div v-html="parseMarkdown(activite.description)" :class="['text-justify','cadreTexte-'+activite.type]"></div>
      </div>
    <div class="row piedCadre"  v-if="afficheType(activite.type) == 'Atelier'">
      <div class="col-3 lesCategories">
      <q-icon name="fas fa-users" size="18px" style="margin-bottom: 3px"></q-icon>
      <div v-if="afficheType(activite.type) == 'Atelier'">{{activite.maxParticipants}} places</div>
      </div>
      <div class="col-4 lesCategories">
        <q-icon name="far fa-clock" v-if="afficheType(activite.type) == 'Atelier'" size="18px" style="margin-bottom: 3px"></q-icon>
        <p v-for="(horaire,index) in activite.dates[0].horaires" class="no-margin no-padding" :key="'horaire' + index">{{traitementHoraire(horaire.creneau)}}</p>
      </div>
      <div class="col-5 lesCategories">
          <q-icon name="fas fa-euro-sign" v-if="afficheType(activite.type) == 'Atelier'" size="18px" style="margin-bottom: 3px"></q-icon>
        <p v-for="prix in activite.prix" :key="activite.id.concat(prix.description)" class="no-margin no-padding" v-if="afficheType(activite.type) == 'Atelier'">
         <span v-if="prix.qf">{{calculPrix(prix.prix,qf)}} € - {{prix.description}}</span>
         <span v-else>{{prix.prix}} € - {{prix.description}}</span>
        </p>
      </div>
    </div>
      <!-- <q-icon name="far fa-clock" class="horaireIconNew" v-if="afficheType(activite.type) == 'Atelier'" size="25px"></q-icon>
      <div class="horaireNew" v-if="afficheType(activite.type) == 'Atelier'">{{traitementHoraire(activite.dates[0].horaires[0].creneau)}}</div>
      <q-icon name="fas fa-euro-sign" class="prixIconNew" v-if="afficheType(activite.type) == 'Atelier'" size="25px"/>
      <div class="prixNew" v-if="afficheType(activite.type) == 'Atelier'">
        <p v-for="prix in activite.prix" :key="activite.id.concat(prix.description)" class="no-margin no-padding" v-if="afficheType(activite.type) == 'Atelier'">
         <span v-if="prix.qf">{{calculPrix(prix.prix,qf)}} € - {{prix.description}}</span>
         <span v-else>{{prix.prix}} € - {{prix.description}}</span>
        </p>
      </div> -->

      <!-- <div :class="['colonneInfos-'+activite.type]" :style="{'background-color': tableCouleurLBF[activite.section]}">
        <div class="nbPlaces" v-if="activite.checkInscription">{{nbPlacesRestantes(index)}} places restantes</div>
      </div> -->
    </q-card>
    <q-card inline v-if="affichageActivites.length === 0" class="cadre no-shadow">
      <div class="entete" :style="{'background-image': 'url(https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_center,h_220,w_300/v1523014644/logoLBFSeul_a1t4af.png)'}"></div>
      <div class="titre"><span>Il n'y rien par ici...</span></div>
        <div class="description" style="margin-bottom: 10px">Veuillez modifier votre sélection.</div>
    </q-card>
    <q-modal v-model="modalInscription" position="top" :content-css="{padding: '20px'}">
      <h6 style="margin: 0px">Inscription</h6>
      <hr />
      <p>Entrez votre adresse mail pour commencer l'inscription :</p>
      <div class="row no-margin no-padding">
        <div class="col-10 no-margin no-padding">
        <q-icon name="fas fa-at" size="24px" color="primary" class="iconInputMail" ></q-icon>
        <q-input class="inputMail" v-model="mailInscription" @input="rechercheMail2()"/>
        </div>
        <q-icon name="far fa-check-circle" color="primary" size="24px" class="col-1 offset-1 boutonValider" @click.native="ajoutInscrit()" v-if="listeInscriptions.length === 0">
          <q-tooltip anchor="bottom middle" self="top middle">
            Valider
          </q-tooltip>
        </q-icon>
      </div>
      <div :key="'incription'+index" v-for="(inscription, index) in listeInscriptions" v-if="listeInscriptions.length > 0" class="row no-margin no-padding">
        <div class="col-10 no-padding" style="margin-top: 4px">
        <div class="inscriptionNom">
          <q-icon name="fas fa-user" size="24px" style="padding-bottom: 4px"></q-icon>
          {{index+1}}.
        </div>
           <q-input v-model="inscription.participant" class="inputNom"></q-input>
        </div>
        <q-icon name="far fa-trash-alt" color="primary" size="24px" class="col-1 offset-1 boutonValider" @click.native="removeInscrit(index)">
          <q-tooltip anchor="bottom middle" self="top middle">
            Effacer
          </q-tooltip>
        </q-icon>
              <div class="row col-10" v-if="activiteInscription.dates[0].horaires.length > 1" style="margin-left: 30px; margin-top: 5px">
        <q-radio v-for="(horaire,index) in activiteInscription.dates[0].horaires"
        v-model="inscription.dateUID"
        :val="horaire.uid"
        class="no-margin no-padding col-4"
        :key="'horaireinscription' + index"
        :label="traitementHoraire(horaire.creneau)"></q-radio>
        </div>
      </div>
    <div class="piedInscription" v-if="listeInscriptions.length > 0">
      <q-icon name="fas fa-user-plus" color="secondary" size="24px" class="iconPied" @click.native="ajoutInscrit()">
        <q-tooltip anchor="bottom middle" self="top middle">
            Ajouter un participant
          </q-tooltip>
      </q-icon>
      <q-icon name="far fa-save" color="primary" size="36px" class="iconPied" @click.native="saveInscription()">
        <q-tooltip anchor="bottom middle" self="top middle">
            Enregistrer
          </q-tooltip>
      </q-icon>
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
import { RECHERCHE_MAIL, AJOUT_INSCRIPTION, EFFACE_INSCRIPTIONS } from '../graphQL/inscription'
import { tableCouleurLBF, iconeLBF } from '../constants/constanteLBF'
// import { FIND_USER_BY_ID } from '../graphQL/userAuth'
// import { AJOUT_INSCRIPTION, EFFACE_LISTE_INSCRIPTION, CONNECT_ACTIVITE_INSCRIPTION } from '../graphQL/inscriptionGraphQL'
import { EFFACE_LISTE_INSCRIPTION } from '../graphQL/inscriptionGraphQL'
import { authMixins } from '../utils/auth'
import { qfMixins } from '../utils/qf'
import { genURLImageMixins } from '../utils/genURLImage'
import { parseMarkdownMixins } from '../utils/parseMarkdown.js'
import { traitementDateMixins } from '../utils/traitementDate'

import marked from 'marked'
import lazyBackground from '../components/VueLazyBackgroundImage'

export default {
  mixins: [authMixins, qfMixins, genURLImageMixins, parseMarkdownMixins, traitementDateMixins],
  components: {
    lazyBackground
  },
  data () {
    return {
      test: '<p>Description de l&#39;atelier ou de l&#39;évènement</p>',
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
      listeFiltreTypes: [],
      mailInscription: '',
      suiteInscription: false,
      lesInscriptions: []
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
        this.listeAteliers = []
        this.affichageActivites = []
        for (let activite of result.data.allActivites) {
          let IDs = []
          let lesInscriptions = []
          activite.inscriptions.forEach((inscription) => {
            IDs.push(inscription.id)
            lesInscriptions.push({
              dateUID: inscription.dateUID,
              mail: inscription.mail,
              participant: inscription.participant,
              profil: inscription.profil
            })
          })
          switch (activite.type) {
            case 'Ateliers':
              /* await this.$apollo.query({
                query: LISTE_INSCRIPTION_BY_ATELIER,
                fetchPolicy: 'network-only',
                variables: {
                  atelierId: activite.id
                }
              }).then((dataCycle) => {
                Object.assign(inscriptions, dataCycle.data.allInscriptions)
              }).catch((error) => {
                console.log(error)
              }) */
              this.affichageActivites.push(
                {
                  id: activite.id,
                  checkInscription: activite.checkInscription,
                  publie: activite.publie,
                  section: activite.section,
                  lieu: activite.lieuActivite,
                  prix: activite.prix,
                  titre: activite.titreActivite,
                  description: activite.description,
                  image: activite.illustration,
                  maxParticipants: activite.maxParticipants,
                  inscriptions: lesInscriptions,
                  type: activite.type,
                  dateDebut: activite.dateDebut,
                  dates: activite.dates,
                  IDs: IDs
                })
              break
            case 'Infos':
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
        console.log('activités', this.affichageActivites)
        // Object.assign(this.listeActivites, listeActivites)
      }
    }
    /* userData: {
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
    } */
  },
  methods: {
    removeInscrit (index) {
      this.listeInscriptions.splice(index, 1)
    },
    ajoutInscrit () {
      this.listeInscriptions.push({
        mail: this.mailInscription,
        participant: ''
      })
    },
    rechercheMail () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Recherche d\'une inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.query({
        query: RECHERCHE_MAIL,
        variables: {
          mail: this.mailInscription
        }
      }).then((result) => {
        console.log(result.data)
        this.$q.loading.hide()
        Object.assign(this.listeInscriptions, result.data.allInscriptions)
        if (this.listeInscriptions.length === 0) {
          this.listeInscriptions.push({
            mail: this.mailInscription,
            participant: ''
          })
        }
        this.suiteInscription = true
      })
    },
    rechercheMail2 () {
      this.listeInscriptions = this.activiteInscription.inscriptions.filter((element) => element.mail === this.mailInscription)
      console.log(this.listeInscriptions)
    },
    moisPlus (lesDates) {
      const n = lesDates.length - 1
      let retour = ''
      lesDates.forEach((laDate, index) => {
        if (index > 0) retour += this.horaireLisible(laDate.date, laDate.date).jourNum + ' ' + this.horaireLisible(laDate.date, laDate.date).mois
        if ((index > 0) && (index < n)) retour += ' - '
      })
      return retour
    },
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
        const nbPlaces = this.affichageActivites[nActivite].maxParticipants * this.affichageActivites[nActivite].dates[0].horaires.length - this.affichageActivites[nActivite].inscriptions.length
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
      let jour = date.formatDate(debut, 'dddd')
      let jourNum = date.formatDate(debut, 'D')
      let mois = date.formatDate(debut, 'MMMM')
      switch (mois) {
        case 'Janvier':
          mois = 'janv'
          break
        case 'Février':
          mois = 'févr.'
          break
        case 'Juillet':
          mois = 'juil.'
          break
        case 'Septembre':
          mois = 'sept.'
          break
        case 'Octobre':
          mois = 'oct.'
          break
        case 'Novembre':
          mois = 'nov.'
          break
        case 'Décembre':
          mois = 'déc.'
          break
      }
      let heureDebut = date.formatDate(debut, 'HH')
      let minDebut = date.formatDate(debut, 'mm')
      let heureFin = date.formatDate(fin, 'HH')
      let minFin = date.formatDate(fin, 'mm')
      let horaire = heureDebut + 'h' + minDebut + '-' + heureFin + 'h' + minFin
      return {horaire: horaire, jour: jour, jourNum: jourNum, mois: mois}
    },
    saveInscription: async function () {
      this.modalInscription = false
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Enregistrement de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let lesInscriptions = this.activiteInscription.inscriptions.filter((element) => element.mail !== this.mailInscription)
      this.listeInscriptions.forEach((newInscription) => {
        lesInscriptions.push(newInscription)
      })
      let promises = []
      this.activiteInscription.IDs.forEach((leID) => {
        promises.push(
          this.$apollo.mutate({
            mutation: EFFACE_INSCRIPTIONS,
            variables: {
              id: leID
            }
          })
        )
      })
      await Promise.all(promises).then((data) => console.log(data)).catch((error) => console.log(error))
      await this.$apollo.mutate({
        mutation: AJOUT_INSCRIPTION,
        variables: {
          inscriptions: lesInscriptions,
          id: this.activiteInscription.id
        }
      })
      this.$apollo.queries.allActivites.refetch()
      /* if (this.listeInscriptions.length > 0) this.updateInscription()
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
      Promise.all(promises).then((data) => {
        console.log(data)
      }).catch((error) => { console.log(error) }) */
      // this.$apollo.queries.allActivites.refetch()
      // this.$apollo.queries.userData.refetch()
      // this.$apollo.queries.allInscriptions.refetch()
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Inscription effectuée avec succès.',
        timeout: 2500,
        type: 'positive'
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
      this.modalInscription = true
      /* if (this.userData.profil.length > 0) {
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
      } */
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

.piedInscription
  margin-top: 10px
  text-align: right

.iconPied
  margin-left: 10px
  &:hover
    cursor: pointer

.boutonValider:hover
  cursor: pointer

.inscriptionNom
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 24px
  float: left
  margin-left: 0px
  color: $primary
  margin-bottom: 4px
  margin-right: 4px

.iconInputMail
  float: left

.inputMail
  height: 17px
  margin-left: 30px
  padding: 5px
  padding-left: 3px

.inputNom
  height: 17px
  margin-left: 30px
  padding: 3px

.cadreNew
  position: relative
  display: block
  width: 320px !important
  margin: 0px
  margin-right: 2px
  margin-bottom: 2px
  @media screen and (max-width: 644px)
    margin-left: calc(50% \- 160px)

.imageEntete
  position: absolute
  width: 320px
  height: 180px
  left: 0px
  top: 0px

.cadreDates
  position: absolute
  width: 135px
  height: 63px
  left: 185px
  top: 0px
  z-index: 3

.jourNew
  position: absolute
  width: 128px
  height: 43px
  left: 208px
  top: 0px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 36px
  color: #FFFFFF
  z-index: 3
.jourNew span
  font-size: 24px

.separation
  position: absolute
  width: 130px
  height: 3px
  left: 190px
  top: 39px
  background: rgba(255, 255, 255, 0.6)
  border-radius: 1px
  z-index: 3

.moisPlus
  position: absolute
  width: 125px
  height: 17px
  left: 190px
  top: 42px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: right
  color: rgba(255, 255, 255, 0.6)
  z-index: 3

.inscription
  position: absolute
  width: 100px
  height: 20px
  left: 220px
  top: 169px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 14px
  text-align: center
  color: #FFFFFF
  z-index: 3
.inscription:hover
  cursor: pointer
.inscription[disabled]
  opacity: 0.8 !important

.placesRestantes
  position: absolute
  width: 128px
  height: 20px
  left: 90px
  top: 169px
  padding-top: 1px
  border-radius: 5px 0px 0px 5px
  color: #FFFFFF
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 14px
  text-align: center
  z-index: 4

.cadreInfo
  position: relative
  width: 320px
  margin: 0px
  margin-top: 180px
  min-height: 210px
  margin-bottom: 0px
  background-color: rgba(251, 251, 251, 1)
  border: 1px solid rgba(251, 251, 251, 1)

.titreNew
  display: table
  position: relative
  width: 310px
  height: 55px
  margin-left: 5px
  margin-top: 13px
.titreNew h1
  display: table-cell
  vertical-align: middle
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 24px
  text-transform: capitalize
  color: #000000

.cadreTexte-Ateliers
  position: relative
  width: 310px
  margin-top: 7px
  margin-bottom: 10px
  margin: 0px
  margin-left: 5px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 14px
  text-align: justify

.piedCadre:
  position: relative
  width: 320px
  min-height: 72px
  margin: 0px
  margin-bottom: 4px
  z-index: 3
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 14px
  text-align: center

.lesCategories
  text-align: center
  color: #FFFFFF
  margin-top: 3px
  margin-bottom: 5px
  font-size: 13px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal

p
  font-size: 14px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal

</style>
