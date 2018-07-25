<template>
  <q-page>
    <q-card v-if="affichageActivites.length > 0" v-for="(activite, index) in affichageActivites" class="cadreNew no-shadow" :key="activite.id"  :style="{'display': 'inline-block', 'background-color': tableCouleurLBF[activite.section]}">
      <div class="iconAdmin" v-if="user.isAdmin">
        <q-btn
          dense
          color="primary"
          icon="fas fa-users"
          size="12px"
          round
          class="no-shadow"
          @click="$router.push({ name: 'listeInscrits', params: { idAtelier: activite.id }})"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            Les inscrits
          </q-tooltip>
        </q-btn>
        <q-btn
          dense
          color="primary"
          icon="far fa-edit"
          size="12px"
          round
          class="no-shadow"
          @click="$router.push({ name: 'modifierAtelier', params: { idAtelier: activite.id }})"
        ><q-tooltip anchor="bottom middle" self="top middle">
            Editer
          </q-tooltip></q-btn>
        <q-btn
          dense
          color="primary"
          icon="far fa-clone"
          size="12px"
          round
          class="no-shadow"
          @click="$router.push({ name: 'dupliquerAtelier', params: { idAtelier: activite.id }})"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            Dupliquer
          </q-tooltip>
        </q-btn>
      </div>
      <div class="cadreDates" :style="{'background-color': tableCouleurLBF[activite.section]}"></div>
            <div class="jourNew">
        {{horaireLisible(activite.dateDebut, activite.dateFin).jourNum}} <span>{{horaireLisible(activite.dateDebut, activite.dateFin).mois}}</span>
      </div>
      <div v-if="activite.dates.length > 1" class="separation"></div>
      <div v-if="activite.dates.length > 1" class="moisPlus">& {{moisPlus(activite.dates)}}</div>

      <lazy-background
        :image-source="urlImage(activite.image,320,180,100,'', 'lfill')"
        :loading-image="urlImage(activite.image,320,180,1,'blur', 'lfill')"
        error-image="/img/error.png"
        imageClass="imageEntete">
      </lazy-background>
      <div class="placesRestantes" v-if="!loadingActivites && activite.checkInscription && nbPlacesRestantes(index, 'total') > 1" :style="{'background-color': tableCouleurLBF[activite.section]}">
      {{nbPlacesRestantes(index, 'total')}} places restantes
      </div>
      <div class="placesRestantes" v-else-if="!loadingActivites && activite.checkInscription && nbPlacesRestantes(index, 'total') > 0" :style="{'background-color': tableCouleurLBF[activite.section]}">
      Dernière place
      </div>
      <div class="placesRestantes" v-else-if="!loadingActivites && activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}">
      Complet
      </div>
      <div class="inscription" v-if="activite.checkInscription" :style="{'background-color': tableCouleurLBF[activite.section]}" @click="creationModalInscription(activite, index)" :disabled="estTropTard(activite.dateDebut)" >
        <q-icon name="fas fa-edit" size="12px" style="margin-right: 3px"></q-icon>Inscriptions
        <q-tooltip anchor="bottom middle" self="top middle" v-if="estTropTard(activite.dateDebut)">
            La date limite d'inscription est dépassée.
          </q-tooltip>
        <q-tooltip anchor="bottom middle" self="top middle" v-else-if="nbPlacesRestantes(index, 'total') === 0">
            L'atelier est complet
          </q-tooltip>
      </div>

      <div class="cadreInfo" >
        <div class="titreNew"><h1>{{activite.titre}}</h1></div>
        <div v-html="parseMarkdown(activite.description)" :class="['text-justify','cadreTexte-'+activite.type]"></div>
      </div>
    <div class="row piedCadre"  v-if="afficheType(activite.type) == 'Atelier'">
      <div class="col-3 lesCategories">
      <q-icon name="fas fa-users" size="18px" style="margin-bottom: 3px"></q-icon>
      <div v-if="afficheType(activite.type) == 'Atelier'">{{affichageActivites[index].maxParticipants * affichageActivites[index].dates[0].horaires.length}} places</div>
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
    </q-card>
    <q-card inline v-if="affichageActivites.length === 0" class="cadre no-shadow">
      <div class="entete" :style="{'background-image': 'url(https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_center,h_220,w_300/v1523014644/logoLBFSeul_a1t4af.png)'}"></div>
      <div class="titre"><span>Il n'y rien par ici...</span></div>
        <div class="description" style="margin-bottom: 10px">Veuillez modifier votre sélection.</div>
    </q-card>
    <q-modal v-model="modalInscription" position="top" :content-css="{padding: '20px', 'max-width': '480px'}">
      <h6 style="margin: 0px">Inscription</h6>
      <hr />
      <p>Merci de renseigner votre adresse mail.</p><p>Si vous vous êtes déjà inscrit à cet atelier, la liste de vos inscriptions s'affichera automatiquement. Vous pouvez à tous moment revenir sur cette page pour modifier vos inscriptions.</p>
      <div class="row no-margin no-padding">
        <div class="col-10 no-margin no-padding">
        <q-icon name="fas fa-at" size="24px" color="primary" class="iconInputMail" ></q-icon>
        <q-input class="inputMail" v-model="mailInscription" @input="rechercheMail2()" :disable="estIdentifie" />
        </div>
        <q-icon name="fas fa-user-plus" color="primary" size="24px" class="col-1 offset-1 boutonValider" @click.native="ajoutInscrit()" v-if="listeInscriptions.length === 0 && nbPlacesRestantes(indexActivite, 'total') > 0" :disabled="!$v.mailInscription.required || !$v.mailInscription.email">
          <q-tooltip v-if="!$v.mailInscription.required" anchor="bottom middle" self="top middle">
            Veuillez entrer une adresse mail.
          </q-tooltip>
          <q-tooltip v-else-if="!$v.mailInscription.email" anchor="bottom middle" self="top middle">
            Votre adresse n'est pas valide.
          </q-tooltip>
          <q-tooltip anchor="bottom middle" self="top middle" v-else>
            Valider
          </q-tooltip>
        </q-icon><br />
      </div>
      <p v-if="personneInscrite" class="q-ma-sm text-justify">Vous n'avez pas encore d'inscription pour cet atelier. Voici la liste des membres que vous avez enregistrés.<br />
      Vous pouvez retirer un participant en cliquant sur le bouton <q-icon name="far fa-minus-square" color="negative" size="16px"></q-icon><br />
      Vous pouvez en ajouter des participants supplémentaires avec le bouton <q-icon name="fas fa-user-plus" color="tertiary" size="16px" class=""></q-icon>
      </p>
      <div :key="'incription'+index" v-for="(inscription, index) in listeInscriptions" v-if="listeInscriptions.length > 0" class="no-margin no-padding" style="margin-bottom: 10px !important">
        <div class="row">
        <q-icon name="far fa-minus-square" color="negative" size="24px" class="col-1 boutonValider" style="margin-right: 10px" @click.native="removeInscrit(index)">
          <q-tooltip anchor="bottom middle" self="top middle">
            Effacer
          </q-tooltip>
        </q-icon>
                  <div class="col-6 no-padding no-margin">
        <div class="inscriptionNom">
          <q-icon name="fas fa-user" size="24px" style="padding-bottom: 4px" ></q-icon>
        </div>
           <q-input v-model="inscription.participant" class="inputNom" :error="validations[index].participant" :float-label="validations[index].participant ? 'Veuillez entrer un prénom':' '"></q-input><br />
        </div>
               <div class="col-4 q-ml-sm" style="margin-top: 4px" v-if="!personneInscrite">
          <q-icon name="fas fa-check" size="24px" style="padding-bottom: 15px; float: left; margin-top: 10px" color="jardin" class="q-mr-sm"></q-icon>
          <p class="q-title inscrit" style="margin-top: 12px">inscrit</p>
        </div>
        </div>
        <div class="row no-margin no-padding" v-if="activiteInscription.dates[0].horaires.length > 1">
          <div class="col-1" style="margin-right: 10px"></div>
          <div class="inscriptionHoraire col-1">
            <q-icon name="far fa-clock" size="24px" style="padding-bottom: 4px"></q-icon>
            </div>
          <q-option-group
          class="col-5"
          type="radio"
          color="tertiary"
          v-model="inscription.dateUID"
          :options="optionQIcon(indexActivite)"
        />
        <div class="col-4" v-if="validations[index].dateUID" style="color: #DB2828">
          Merci de choisir un horaire.
        </div>
        </div>
      </div>
    <div class="piedInscription" v-if="listeInscriptions.length > 0">
      <q-icon name="fas fa-user-plus" color="tertiary" size="24px" class="iconPied" @click.native="ajoutInscrit()" v-if="nbPlacesRestantes(indexActivite, 'total') > 0" >
        <q-tooltip anchor="bottom middle" self="top middle">
            Ajouter un participant
          </q-tooltip>
      </q-icon>
      <q-icon name="far fa-trash-alt" color="secondary" size="36px" class="iconPied" @click.native="removeGlobalInscription()">
        <q-tooltip anchor="bottom middle" self="top middle">
            Supprimer l'inscription
          </q-tooltip>
      </q-icon>
      <q-icon name="far fa-save" color="primary" size="36px" class="iconPied" @click.native="verifSaveInscription()">
        <q-tooltip anchor="bottom middle" self="top middle">
            Enregistrer
          </q-tooltip>
      </q-icon>
    </div>
    </q-modal>
    <q-modal v-model="modalVerifInscriptions" position="top" :content-css="{padding: '20px', 'max-width': '480px'}" @hide="$eventBus.$emit('finVerif')">
      <div v-if="nomsInscrits.length > 0 && !flagProfilNonIdentifie">
      <h6 style="margin: 0px; margin-bottom: 5px">Vos inscriptions en cours...</h6>
      <hr />
      <q-btn color="secondary" label="Tout effacer" icon="far fa-trash-alt" align="center" outline @click="effacerTousInscriptions()"></q-btn>
      <div v-for="inscrit in nomsInscrits" :key="'inscrit-' + inscrit.nom" style="margin-top: 10px">
        <q-field :label="inscrit.nom" icon="far fa-user-circle" icon-color="primary" style="margin-bottom: 4px"></q-field>
        <q-card inline v-for="atelier in inscrit.ateliers" class="cadreInscription no-shadow" :key="inscrit.nom + atelier.titre">
          <div class="dateInscription" :style="{'background-color': tableCouleurLBF[atelier.section]}">
            <div class="jourInscription">
              {{horaireLisible(atelier.dates[0].date, atelier.dateFin).jourNum}} <span>{{horaireLisible(atelier.dates[0].date, atelier.dateFin).mois}}</span>
            </div>
            <div v-if="atelier.dates.length > 1" class="separationDateInscriptions"></div>
            <div v-if="atelier.dates.length > 1" class="moisPlusInscription">& {{moisPlus(atelier.dates)}}</div>
          </div>
          <lazy-background
            :image-source="urlImage(atelier.illustration,160,80,100,'', 'crop')"
            :loading-image="urlImage(atelier.illustration,160,80,1,'', 'crop')"
            error-image="/img/error.png"
            imageClass="imagesInscription">
          </lazy-background>
          <div class="cadreInfosInscriptions">
          <div class="titreInscriptions">
            <h1>{{atelier.titre}}</h1>
          </div>
          <div class="horaireInscriptions">
            <q-icon size="20px" name="far fa-clock"></q-icon>
            {{traitementHoraire(atelier.creneau)}}
          </div>
          <div class="effacerInscriptions">
            <q-btn label="Effacer" icon="far fa-times-circle" flat @click="effaceInscription([atelier.id])"></q-btn>
          </div>
          </div>
        </q-card>
      </div>
      </div>
      <div v-else-if="flagProfilNonIdentifie">
        <h6 style="margin: 0px; margin-bottom: 5px">Des inscriptions existent</h6>
        <hr />
        <p>Des inscriptions existent pour un compte enregistré. Veuillez vous connecter pour accéder à vos inscriptions.</p>
        <q-btn label="Fermer" icon="fas fa-times" outline color="primary" @click="modalVerifInscriptions = false" class="float-right"/>
      </div>
      <div v-else>
        <h6 style="margin: 0px; margin-bottom: 5px">Vous n'avez pas d'inscription en cours.</h6>
        <q-btn label="Fermer" icon="fas fa-times" outline color="primary" @click="modalVerifInscriptions = false" class="float-right"/>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears,
  date
} from 'quasar'
import { QUERY_ACTIVITES_PUBLIEES_ASC } from '../graphQL/ateliers'
import { AJOUT_INSCRIPTION, EFFACE_INSCRIPTIONS } from '../graphQL/inscription'
import { tableCouleurLBF, iconeLBF } from '../constants/constanteLBF'
import { authMixins } from '../utils/auth'
import { qfMixins } from '../utils/qf'
import { genURLImageMixins } from '../utils/genURLImage'
import { parseMarkdownMixins } from '../utils/parseMarkdown'
import { traitementDateMixins } from '../utils/traitementDate'

import lazyBackground from '../components/VueLazyBackgroundImage'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  mixins: [authMixins, qfMixins, genURLImageMixins, parseMarkdownMixins, traitementDateMixins, validationMixin],
  props: {
    userData: Object,
    mailVerifInscription: String
  },
  components: {
    lazyBackground
  },
  store: {
    user: 'user',
    estIdentifie: 'estIdentifie'
  },
  data () {
    return {
      test: '<p>Description de l&#39;atelier ou de l&#39;évènement</p>',
      affichageActivites: [],
      affichageActivitesReference: [],
      modalInscription: false,
      modalVerifInscriptions: false,
      activiteInscription: {},
      listeInscriptions: [],
      complet: false,
      tableCouleurLBF: tableCouleurLBF,
      iconeLBF: iconeLBF,
      qf: 0,
      listeFiltres: [],
      listeFiltreTypes: [],
      mailInscription: '',
      lesInscriptions: [],
      indexActivite: 0,
      validations: [],
      listeVerifInscriptions: [],
      nomsInscrits: [],
      toutesInscriptions: [],
      toutesDatesHoraires: [],
      mailVerifInscrit: '',
      aujourdhui: date.formatDate(date.subtractFromDate(Date.now(), { days: 1 }), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      leProfil: this.estIdentifie ? this.user : [],
      flagProfilNonIdentifie: false,
      personneInscrite: false
    }
  },
  validations: {
    mailInscription: {
      required,
      email
    },
    listeInscriptions: {
      $each: {
        participant: {
          required
        },
        dateUID: {
          required
        }
      }
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
    /* this.$eventBus.$on('filtreTypes', (filtres) => {
      if (filtres.length === 0) {
        this.listeFiltreTypes = []
      } else {
        Object.assign(this.listeFiltreTypes, filtres)
      }
      this.filtreType()
    }) */
    this.$eventBus.$on('filtreMenu', (filtres) => {
      if (filtres.length === 0) {
        this.listeFiltres = []
      } else {
        Object.assign(this.listeFiltres, filtres)
      }
      this.filtreSection()
    })
    this.$eventBus.$on('verifInscription', (email) => {
      this.listeInscriptionEnCours(email)
    })
    this.$eventBus.$on('majMailVerif', (email) => {
      this.listeInscriptionEnCours(email)
    })
  },
  mounted () {
    /* if (this.estIdentifie) {
      this.mailInscription = this.$q.localStorage.get.item('email')
    } else { this.mailInscription = '' } */
  },
  beforeDestroy () {
    // this.$eventBus.$off('logginState')
    this.$eventBus.$off('filtreTypes')
    this.$eventBus.$off('filtreMenu')
    // this.$eventBus.$off('verifInscription')
  },
  apollo: {
    allActivites: {
      query: QUERY_ACTIVITES_PUBLIEES_ASC,
      variables () {
        return {
          aujourdhui: this.aujourdhui
        }
      },
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
        this.toutesDatesHoraires = []
        this.toutesInscriptions = []
        for (let activite of result.data.allActivites) {
          activite.dates[0].horaires.forEach((horaire) => {
            this.toutesDatesHoraires.push({
              date: activite.dates[0].date,
              uid: horaire.uid,
              creneau: horaire.creneau
            })
          })
          let IDs = [] // ids de toutes les inscriptions
          let lesInscriptions = []
          activite.inscriptions.forEach((inscription) => {
            let leProfil = ''
            if (inscription.profils.length > 0) {
              leProfil = inscription.profils[0].id
            }
            IDs.push(inscription.id)
            lesInscriptions.push({
              dateUID: inscription.dateUID,
              mail: inscription.mail,
              participant: inscription.participant,
              profilsIds: [leProfil]
            })
            this.toutesInscriptions.push({
              id: inscription.id,
              titre: activite.titreActivite,
              section: activite.section,
              dateUID: inscription.dateUID,
              dates: activite.dates,
              illustration: activite.illustration,
              mail: inscription.mail,
              participant: inscription.participant,
              profilsIds: [leProfil]
            })
          })
          if (this.mailVerifInscrit !== '' && !this.estIdentifie) this.listeInscriptionEnCours(this.mailVerifInscrit)
          switch (activite.type) {
            case 'Ateliers':
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
              break
          }
        }
        Object.assign(this.affichageActivitesReference, this.affichageActivites)
      }
    }
  },
  methods: {
    optionQIcon (indexActivite) {
      let lesOptions = []
      this.activiteInscription.dates[0].horaires.forEach((horaire, index) => {
        let option = {}
        option.label = this.traitementHoraire(horaire.creneau)
        option.value = horaire.uid
        option.disable = this.nbPlacesRestantes(indexActivite, horaire.uid) === 0
        lesOptions.push(option)
      })
      return lesOptions
    },
    removeInscrit (index) {
      this.listeInscriptions.splice(index, 1)
      this.validations.splice(index, 1)
    },
    ajoutInscrit () {
      if (this.$v.mailInscription.required && this.$v.mailInscription.email) {
        let leParticipant = ''
        if (this.estIdentifie) {
          console.log('leProfil ajoutInscrit', this.leProfil)
          let lesParticipants = this.user.profil.filter((element) => {
            let ilExistepas = true
            this.listeInscriptions.forEach((inscrit) => {
              if (inscrit.participant === element.prenom) {
                ilExistepas = false
              }
            })
            return ilExistepas
          })
          if (lesParticipants.length > 0) {
            this.listeInscriptions.push({
              mail: this.mailInscription,
              participant: lesParticipants[0].prenom,
              profilsIds: lesParticipants[0].id
            })
          } else {
            this.listeInscriptions.push({
              mail: this.mailInscription,
              participant: leParticipant
            })
          }
        } else {
          this.listeInscriptions.push({
            mail: this.mailInscription,
            participant: leParticipant
          })
        }
        this.validations.push({participant: false, dateUID: false})
      }
    },
    removeGlobalInscription () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette inscription ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processRemoveGlobalInscription()
      }).catch(() => {
      })
    },
    processRemoveGlobalInscription () {
      this.listeInscriptions = []
      this.saveInscription()
      this.mailInscription = ''
    },
    rechercheMail2 () {
      this.$v.mailInscription.$touch()
      this.listeInscriptions = this.activiteInscription.inscriptions.filter((element) => {
        if (element.mail === this.mailInscription) this.validations.push({participant: false, dateUID: false})
        return element.mail === this.mailInscription
      })
      if (this.listeInscriptions.length === 0) this.validations = []
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
      function retourneFiltre (element) {
        let test = false
        lesFiltres.forEach((filtre) => {
          if (element.type === filtre) test = true
        })
        return test
      }
      Object.assign(this.affichageActivites, this.affichageActivitesReference)
      let affichageFiltre = this.affichageActivites.filter(retourneFiltre)
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
      if (this.listeFiltres.length === 0) {
        this.$set(this, 'affichageActivites', this.affichageActivitesReference)
      } else {
        this.$set(this, 'affichageActivites', affichageFiltre)
      }
    },
    nbPlacesRestantes: function (nActivite, dateUID) {
      if (this.affichageActivites[nActivite]) {
        if (dateUID === 'total') {
          return this.affichageActivites[nActivite].maxParticipants * this.affichageActivites[nActivite].dates[0].horaires.length - this.affichageActivites[nActivite].inscriptions.length
        } else {
          return this.affichageActivites[nActivite].maxParticipants - this.affichageActivites[nActivite].inscriptions.filter((element) => element.dateUID === dateUID).length
        }
      }
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
    verifSaveInscription () {
      let erreurGlobale = false
      this.validations.forEach((validation, index) => {
        this.validations[index].participant = !this.$v.listeInscriptions.$each[index].participant.required
        erreurGlobale = erreurGlobale || this.validations[index].participant
        if (this.activiteInscription.dates[0].horaires.length > 1) {
          erreurGlobale = erreurGlobale || !this.$v.listeInscriptions.$each[index].dateUID.required
          this.validations[index].dateUID = !this.$v.listeInscriptions.$each[index].dateUID.required
        }
      })
      if (!erreurGlobale) {
        this.saveInscription()
      } else {
        this.$q.notify({
          message: 'Certaines informations sont manquantes. Veuillez vérifier votre inscription.',
          timeout: 2500,
          type: 'warning',
          position: 'bottom-left'
        })
      }
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
        console.log('chaque nouvelle inscription', newInscription)
        lesInscriptions.push(newInscription)
      })
      console.log('les inscriptions', lesInscriptions)
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
      await Promise.all(promises).then().catch((error) => console.log(error))
      await this.$apollo.mutate({
        mutation: AJOUT_INSCRIPTION,
        variables: {
          inscriptions: lesInscriptions,
          id: this.activiteInscription.id
        }
      })
      this.$apollo.queries.allActivites.refetch()
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Inscription effectuée avec succès.',
        timeout: 2500,
        type: 'positive'
      })
    },
    creationModalInscription: function (activite, nActivite) {
      if (!this.estTropTard(activite.dateDebut)) {
        this.mailVerifInscrit = ''
        this.mailInscription = ''
        this.activiteInscription = activite
        this.indexActivite = nActivite
        this.validations = []
        this.listeInscriptions = []
        if (this.estIdentifie) {
          this.mailInscription = this.user.email
          console.log('mail inscription', this.user)
          this.rechercheMail2()
          this.personneInscrite = false
          if (this.listeInscriptions.length === 0) {
            this.personneInscrite = true
            this.user.profil.forEach((membre) => {
              this.listeInscriptions.push({
                mail: this.mailInscription,
                participant: membre.prenom,
                profilsIds: [membre.id]
              })
              this.validations.push({participant: false, dateUID: false})
            })
          }
        }
        this.modalInscription = true
      }
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
    afficheIconOld (section) {
      return '/statics/' + this.iconeLBF[section] + '.svg'
    },
    listeInscriptionEnCours (email) {
      console.log('paf')
      this.mailVerifInscrit = email
      let noms = []
      let lesNoms = []
      this.flagProfilNonIdentifie = false
      this.listeVerifInscriptions = this.toutesInscriptions.filter((element) => {
        console.log(element.mail, email, this.estIdentifie)
        if (element.profil !== '' && !this.estIdentifie && element.mail === email) {
          this.flagProfilNonIdentifie = true
        }
        if (element.mail === email) noms.push(element.participant)
        if (element.dateUID) {
          let lesDatesHoraires = this.toutesDatesHoraires.filter((dateElement) => dateElement.uid === element.dateUID)
          element.creneau = lesDatesHoraires[0].creneau
        } else {
          element.creneau = element.dates[0].horaires[0].creneau
        }
        element.dates = element.dates
        return element.mail === email
      })
      lesNoms = [...new Set(noms)]
      this.nomsInscrits = []
      let nomsInscritsTemp = []
      lesNoms.forEach((nom) => {
        let inscriptionNom = []
        this.listeVerifInscriptions.forEach((inscription) => {
          if (inscription.participant === nom) {
            inscriptionNom.push({
              id: inscription.id,
              creneau: inscription.creneau,
              dates: inscription.dates,
              titre: inscription.titre,
              illustration: inscription.illustration,
              section: inscription.section,
              uid: inscription.dateUID
            })
          }
        })
        nomsInscritsTemp.push({
          nom: nom,
          ateliers: inscriptionNom
        })
      })
      if (!this.flagProfilNonIdentifie) Object.assign(this.nomsInscrits, nomsInscritsTemp)
      this.modalVerifInscriptions = true
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
      await Promise.all(promises).then((data) => console.log(data)).catch((error) => console.log(error))
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Inscription effacée avec succès.',
        timeout: 2500,
        type: 'positive'
      })
      this.$apollo.queries.allActivites.refetch()
      this.modalVerifInscriptions = false
    },
    effacerTousInscriptions () {
      let ids = []
      this.nomsInscrits.forEach((nom) => {
        nom.ateliers.forEach((atelier) => {
          ids.push(atelier.id)
        })
      })
      console.log(ids)
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer toutes vos inscriptions ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffaceInscription(ids)
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.text-jardin
  color: $jardin

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
  margin-top: 10px

.inscriptionHoraire
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 24px
  float: left
  margin-left: 0px
  color: $primary
  margin-bottom: 0px
  margin-right: 4px
  margin-top: 00px
.inscriptionHoraire p
  color: red

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

.iconAdmin
  position: absolute
  left: 5px
  top: 5px
  z-index: 4

.inscrit
  color: $jardin
</style>
