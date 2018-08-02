<template>
  <q-page style="padding-left: 20px">
    <q-btn
      round
      color="primary"
      @click="saveMailing()"
      class="fixed"
      icon="far fa-save"
      style="right: 18px; bottom: 18px"
      size="16px"
      v-if="!modalPreview"
      >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Sauver</q-tooltip>
    </q-btn>
    <q-btn
      round
      color="atelier"
      @click="modalPreview = true"
      class="fixed"
      icon="far fa-eye"
      style="right: 18px; bottom: 76px"
      size="16px"
      v-if="!modalPreview"
      >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Aperçu</q-tooltip>
    </q-btn>
        <q-btn
      round
      color="atelier"
      @click="modalPreview = true"
      class="fixed"
      icon="fas fa-times"
      style="right: 18px; bottom: 76px"
      size="16px"
      v-else
      >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Fermer l'aperçu</q-tooltip>
    </q-btn>
    <q-btn
      round
      color="tertiary"
      @click="envoyerMailDialogue()"
      class="fixed"
      icon="far fa-paper-plane"
      style="right: 18px; bottom: 134px"
      size="16px"
      v-if="!modalPreview"
      :disable="listeDiffusion.length === 0 || activitesDiffuser.length === 0"
      >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Envoyer aux participants</q-tooltip>
    </q-btn>
    <q-btn
      round
      color="warning"
      @click="deleteMailingDialogue()"
      class="fixed"
      icon="far fa-trash-alt"
      style="right: 18px; bottom: 192px"
      size="16px"
     v-if="mailId && !modalPreview"
      >
      <q-tooltip anchor="center left" self="center right" :offset="[10, 0]">Effacer</q-tooltip>
    </q-btn>
    <div class="row q-mb-md">
          <div class="q-mr-sm">
            <div class="cadreChoix q-mb-sm q-pa-xs" >
          <q-input placeholder="titre de la lettre" v-model="titreMail" hide-underline/>
            </div>
      <div class="cadreChoix q-pa-xs q-mb-sm">
              <q-field
        label="Liste de diffusion"
        icon = "fas fa-th-list"
        icon-color="tertiary"
      >
      </q-field>
            <q-checkbox
        v-model="laListe"
        v-for="liste in lesListes"
        :val="liste.value"
        :label="liste.label"
        :key="liste.label + '-' + liste.value"
        color="tertiary"
        class="q-ml-md q-mt-sm col-5"/>
      <p v-if="listeDiffusion.length > 0" class="q-mt-sm">Il y a {{listeDiffusion.length}} mail(s) sélectionné(s).</p>
      <p v-else-if="laListe.length > 0" class="warning q-mt-sm">La ou les listes de diffusion sélectionnée(s) ne comporte pas d'inscrits.</p>
      <p v-else class="warning q-mt-sm">Veuillez sélectionner une liste.</p>
      </div>
      <div class="cadreChoix q-pa-xs">
    <q-field
      label="Sections"
      icon="far fa-address-book"
      icon-color="tertiary">
    </q-field>
    <div class="row q-mb-sm">
      <q-checkbox
        v-model="lesSections"
        v-for="section in listeSections"
        :val="section.value"
        :label="section.label"
        :key="section.label + '-' + section.value"
        @input = "resetActivites()"
        color="tertiary"
        class="q-ml-md q-mt-sm col-5"/>
    </div>
      </div>
    </div>
    <div class="" >
<div class="cadreChoix">
                           <q-tabs no-pane-border inverted position="bottom" style="min-height: 220px">
          <!-- Tabs - notice slot="title" -->
          <q-tab default slot="title" name="Ecrire" class="titrePane" icon="fas fa-edit"/>
          <q-tab slot="title" name="Rendu" icon="far fa-eye"/>
          <q-tab slot="title" name="Formatage" icon="far fa-question-circle" />
          <!-- Targets -->
          <q-tab-pane name="Ecrire" style="min-height: 220px">
          <q-input
            v-model="texteMail"
            placeholder="Introduction à la lettre d'informations"
            type="textarea"
            hide-underline
            rows="9"
            class="no-shadow no-margin no-padding"
            />
          </q-tab-pane>
          <q-tab-pane name="Rendu" style="min-height: 220px">
            <div v-html="parseMarkdown(texteMail)" v-if="texteMail"></div>
          </q-tab-pane>
          <q-tab-pane name="Formatage" style="min-height: 220px" class="formatage">
                <div class="row" style="margin: 0px; pading: 0px">
                  <div class="col-6">
                    <div class="q-body-2">Bases</div>
                    <em>*italique*</em><br />
                    <strong>**gras**</strong><br />
                  </div>
                  <div class="col-6">
                    <div class="q-body-2">listes</div>
                    * liste non numérotée<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* sous élément<br />
                    1. liste numérotée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">retour à la ligne</div>
                    double espace + entrée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">lien :</div>
                    [texte du lien](url_du_lien)
                  </div>
                </div>
          </q-tab-pane>
        </q-tabs>
            </div>
    </div>
      <div class="q-ml-sm" >
<div class="cadreChoix">
                           <q-tabs no-pane-border inverted position="bottom" style="min-height: 220px" color="atelier">
          <!-- Tabs - notice slot="title" -->
          <q-tab default slot="title" name="Ecrire" class="titrePane" icon="fas fa-edit"/>
          <q-tab slot="title" name="Rendu" icon="far fa-eye"/>
          <q-tab slot="title" name="Formatage" icon="far fa-question-circle" />
          <!-- Targets -->
          <q-tab-pane name="Ecrire" style="min-height: 220px">
          <q-input
            v-model="conclusionMail"
            placeholder="Conclusion à la lettre d'informations"
            type="textarea"
            hide-underline
            rows="9"
            class="no-shadow no-margin no-padding"
            />
          </q-tab-pane>
          <q-tab-pane name="Rendu" style="min-height: 220px">
            <div v-html="parseMarkdown(conclusionMail)" v-if="conclusionMail"></div>
          </q-tab-pane>
          <q-tab-pane name="Formatage" style="min-height: 220px" class="formatage">
                <div class="row" style="margin: 0px; pading: 0px">
                  <div class="col-6">
                    <div class="q-body-2">Bases</div>
                    <em>*italique*</em><br />
                    <strong>**gras**</strong><br />
                  </div>
                  <div class="col-6">
                    <div class="q-body-2">listes</div>
                    * liste non numérotée<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* sous élément<br />
                    1. liste numérotée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">retour à la ligne</div>
                    double espace + entrée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-body-2">lien :</div>
                    [texte du lien](url_du_lien)
                  </div>
                </div>
          </q-tab-pane>
        </q-tabs>
            </div>
    </div>
    </div>
    <div class="q-mt-md">
          <h5 class="q-ma-none q-mb-sm">Activités inclues dans la lettre de diffusion</h5>
        <q-btn outline icon="fas fa-sync-alt" color="atelier" label="recharger tous les ateliers" @click="resetActivites()" class="q-mb-md"></q-btn>
        <br v-if="activitesDiffuser.length > 0"/>
    <p v-if="lesSections.length === 0">Veuillez sélectionner une section pour afficher les activités à envoyer.</p>
    <p v-else-if="activitesDiffuser.length === 0">Il n'y a pas d'atelier enregistré dans cette ou ces sections.</p>
        <q-card v-for="activite in activitesDiffuser" inline style="position: relative; width: 250px; margin-bottom: 5px;margin-right: 20px" :key="activite.id" class="shadow-1">
          <q-btn dense icon="fas fa-times" size="12px" text-color="secondary" class="btns no-shadow" @click="enleveActivite(activite)"/>
      <q-card-media>
        <img height="150" width="250" :src="urlImage(activite.illustration,250,150,100,'', 'lfill')" />
      </q-card-media>
      <q-card-title style="padding: 0px; margin-top: 0px; margin-right: 10px; margin-left: 10px;">
        <div style="font-size: medium; font-variant: small-caps; padding: 0px; margin: 0px" v-if="activite.titreActivite"><b>{{activite.titreActivite.length > 25 ? activite.titreActivite.substring(0, 22)+'...' : activite.titreActivite}} </b></div>
      </q-card-title>
      <q-card-main>
        <div v-html="parseMarkdown(activite.description)" v-if="activite.description"></div>
      </q-card-main>
    </q-card>
    </div>
    <q-modal v-model="modalPreview" maximized :content-css="{padding: '20px', 'max-width': '700px'}">
      <div v-html="leMailFinal"></div>
    </q-modal>
        <q-modal v-model="modalVerifAvantEnvoi" minimized :content-css="{padding: '20px', 'max-width': '480px'}">
      <h6>Confirmer l'envoi</h6>
      <hr />
      <div class="q-subheading" v-html="messageVerifEnvoie">
      </div>
      <div class="float-right q-mt-md">
        <q-btn
        outline
        color="secondary"
        label="Annuler"
        @click="modalVerifAvantEnvoi = false"
        >
        </q-btn>
        <q-btn
        outline
        color="tertiary"
        :label="labelVerifLettre"
        @click="envoyerMail()"
        >
        </q-btn>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears,
  date
} from 'quasar'
import {abonnements} from '../../constants/listeMailing'
import { parseMarkdownMixins } from '../../utils/parseMarkdown'
import { genURLImageMixins } from '../../utils/genURLImage'
import { mailMixins } from '../../utils/envoiMail'
import { traitementDateMixins } from '../../utils/traitementDate'

import {TOUS_ABONNES, SAVE_MAIL_DIFFUSION, CONNECT_ACTIVITE_DIFFUSION, GET_MAILDIFFUSION_BY_ID, DELETE_MAILDIFFUSION} from '../../graphQL/mailingList'
import {ENVOI_MAIL_RV} from '../../graphQL/mailGraphQL'
import { LISTE_ESPACEBF } from '../../constants/listeEnums'
import {QUERY_ACTIVITES_PUBLIEES_ASC} from '../../graphQL/ateliers'

// gabarit de la lettre de diffusion
import laCellule from '../../assets/txt/cellule.txt'
import laLigne from '../../assets/txt/ligne.txt'
import laCelluleVide from '../../assets/txt/celluleVide.txt'
import mailDiffusion from '../../assets/txt/diffusion.txt'

export default {
  // name: 'PageName',
  mixins: [
    parseMarkdownMixins,
    genURLImageMixins,
    mailMixins,
    traitementDateMixins
  ],
  props: {
    mailId: String
  },
  data () {
    return {
      lesListes: [],
      titreMail: '',
      texteMail: '',
      conclusionMail: '',
      estEnvoye: false,
      laListe: [],
      listeSections: [],
      loadingAbonnes: 0,
      lesSections: [],
      aujourdhui: date.formatDate(date.subtractFromDate(Date.now(), { days: 1 }), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      loadingActivites: 0,
      activites: [],
      activitesReference: [],
      activitesId: [],
      modalPreview: false,
      modalVerifAvantEnvoi: false,
      messageVerifEnvoie: '',
      labelVerifLettre: '',
      newMailId: '',
      testEnvoiMail: false
    }
  },
  beforeRouteUpdate (to) {
    this.titreMail = ''
    this.texteMail = ''
    this.conclusionMail = ''
    this.estEnvoye = false
    this.laListe = []
    this.activites = []
    this.lesSections = []
  },
  computed: {
    listeDiffusion: function () {
      let laTable = []
      if (!this.loadingAbonnes) {
        laTable = this.allAbonnes.filter((abonne) => {
          let retour = false
          this.laListe.forEach((abonnement) => {
            if (abonne.abonnement.indexOf(abonnement) >= 0) retour = true
          })
          return retour
        })
      }
      return laTable
    },
    activitesDiffuser: function () {
      let lesActivitesDiffuser = []
      if (!this.loadingActivites) {
        lesActivitesDiffuser = this.activites.filter((activite) => {
          let retour = false
          this.lesSections.forEach((section) => {
            if (activite.section === section) retour = true
          })
          return retour
        })
      }
      return lesActivitesDiffuser
    },
    leMailFinal: function () {
      let mailFinal = ''
      if (!this.loadingAbonnes) {
        mailFinal = mailDiffusion.split('|**TITRE-LETTRE**|').join(this.titreMail)
          .split('|**INTRO-LETTRE**|').join(this.texteMail)
          .split('|**CONCLUSIONS**|').join(this.conclusionMail)
          .split('|**MAJ-ABONNEMENTS**|').join('http://site-lbf-2018-nico-l.c9users.io/')
          .split('|**EFFACER-ABONNEMENTS**|').join('http://site-lbf-2018-nico-l.c9users.io/' + '%recipient.email%')
        let ligne = laLigne
        let ligneTerminee = false
        let lesLignes = []
        this.activitesDiffuser.forEach((activite, index) => {
          let lesDates = activite.dates.map((laDate) => {
            return this.horaireLisible(laDate.date, laDate.date).jourNum + ' ' + this.horaireLisible(laDate.date, laDate.date).mois
          }).join(', ')
          let creneaux = activite.dates[0].horaires.map((horaire) => {
            return this.traitementHoraire(horaire.creneau)
          }).join(' & ')
          let lesPrixTemp = activite.prix.map((prix) => {
            return prix.description + ' : ' + prix.prix
          })
          let lesPrix = lesPrixTemp.join(' € - ') + ' €'
          let cellule = laCellule
            .replace('|**TITRE-ATELIER**|', activite.titreActivite)
            .replace('|**ILLUSTRATION**|', this.urlImage(activite.illustration, 263, 148, 100, '', 'fill'))
            .replace('|**DESCRIPTION**|', this.parseMarkdown(activite.description))
            .replace('|**LES-PRIX**|', lesPrix)
            .replace('|**LES-HORAIRES**|', creneaux)
            .replace('|**LES-DATES**|', lesDates)
          if (index % 2 === 0) {
            ligne = ligne.replace('|**CELLULE1**|', cellule)
            ligneTerminee = false
          } else {
            ligne = ligne.replace('|**CELLULE2**|', cellule)
            lesLignes.push(ligne)
            ligneTerminee = true
            ligne = laLigne
          }
        })
        if (!ligneTerminee) {
          // ajouter une cellule vide dans |**CELLULE2**|
          ligne = ligne.replace('|**CELLULE2**|', laCelluleVide)
          lesLignes.push(ligne)
        }
        mailFinal = mailFinal.replace('|**LIGNE**|', lesLignes.join('\n'))
      }
      return mailFinal
    }
  },
  apollo: {
    allEnums: {
      query: LISTE_ESPACEBF,
      update (data) {
        let listeEnum = data.__type.enumValues
        this.listeSections = []
        listeEnum.forEach((valeurEnum) => {
          this.listeSections.push({label: valeurEnum.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(L)(e)/g, '$1\'$2').replace(/(L)(ate)/g, '$1\'$2').replace('Partage', 'partagé'), value: valeurEnum.name})
        })
      }
    },
    allAbonnes: {
      query: TOUS_ABONNES,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingAbonnes = isLoading
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
      }
    },
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
      result (result) {
        if (result.data.allActivites.length === 0) this.$router.push({name: 'newMailing'})
        let activites = []
        let activitesReference = []
        let activitesId = []
        let imageIllu = ''
        result.data.allActivites.forEach(async (activite, index) => {
          imageIllu = this.urlImage(activite.illustration, 250, 150, 100, '', 'fill')
          let atelier = {
            id: activite.id,
            publie: activite.publie,
            lieu: activite.lieuActivite,
            prix: activite.prix,
            titreActivite: activite.titreActivite,
            description: activite.description,
            illustration: activite.illustration,
            image: imageIllu,
            inscriptions: activite.inscriptions,
            section: activite.section,
            dates: activite.dates
          }
          activites.push(atelier)
          activitesReference.push(atelier)
          activitesId.push(atelier.id)
        })
        if (!this.mailId) this.activites = Object.assign([], activites)
        this.activitesReference = Object.assign([], activitesReference)
        this.activitesId = Object.assign([], activitesId)
      }
    }
  },
  mounted () {
    this.lesListes = abonnements.map((abonnement) => {
      return {
        label: abonnement,
        value: abonnement
      }
    })
    if (this.mailId) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Chargement des données',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.query({
        query: GET_MAILDIFFUSION_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          id: this.mailId
        }
      }).then((retour) => {
        this.$q.loading.hide()
        if (retour.data.allDiffusionEmails.length === 0) this.$router.push({name: 'newMailing'})
        let lesData = retour.data.allDiffusionEmails[0]
        this.titreMail = lesData.titre
        this.texteMail = lesData.texte
        this.conclusionMail = lesData.conclusion
        this.estEnvoye = lesData.estEnvoye
        this.laListe = lesData.listesDiffusion
        this.activites = Object.assign([], lesData.activites)
        let lesSections = lesData.activites.map((activite) => activite.section)
        this.lesSections = [...new Set(lesSections)]
      })
    } else {
      this.titreMail = ''
      this.texteMail = ''
      this.conclusionMail = ''
      this.estEnvoye = false
      this.laListe = []
      this.activites = []
      this.lesSections = []
    }
  },
  methods: {
    enleveActivite (a) {
      let index = this.activites.indexOf(a)
      this.activites.splice(index, 1)
    },
    deleteMailingDialogue () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer ce mail ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.deleteMailing()
      }).catch(() => {
      })
    },
    deleteMailing () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Effacement en cours...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: DELETE_MAILDIFFUSION,
        variables: {
          id: this.mailId
        }
      }).then((retour) => {
        this.$q.loading.hide()
        this.$q.notify({
          timeout: 2500,
          type: 'positive',
          message: 'Le mail a été effacé avec succès.'
        })
        this.$router.push({name: 'accueilAdmin'})
      }).catch((error) => console.log(error))
    },
    saveMailing () {
      this.testEnvoiMail = false
      this.processSaveMailing()
    },
    async processSaveMailing () {
      if (this.mailId) {
        await this.$apollo.mutate({
          mutation: DELETE_MAILDIFFUSION,
          variables: {
            id: this.mailId
          }
        }).catch((error) => console.log(error))
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Enregistrement du mail...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: SAVE_MAIL_DIFFUSION,
        variables: {
          titre: this.titreMail,
          texte: this.texteMail,
          conclusion: this.conclusionMail,
          estEnvoye: this.estEnvoye,
          listesDiffusion: this.laListe,
          mailHtml: this.leMailFinal
        }
      }).then((retour) => {
        this.newMailId = retour.data.createDiffusionEmail.id
        let promises = []
        this.activitesDiffuser.forEach((activite) => {
          promises.push(this.$apollo.mutate({
            mutation: CONNECT_ACTIVITE_DIFFUSION,
            variables: {
              mId: this.newMailId,
              aId: activite.id
            }
          }))
        })
        Promise.all(promises).then((retour) => {
          this.$q.notify({
            timeout: 2500,
            type: 'positive',
            message: 'Le mail a été enregistré avec succès.'
          })
          this.$q.loading.hide()
          if (this.testEnvoiMail) {
            this.processEnvoyerMail()
          } else {
            this.$router.push({name: 'listeMailings'})
          }
        })
      })
    },
    resetActivites () {
      this.activites = Object.assign([], this.activitesReference)
    },
    envoyerMailDialogue () {
      this.messageVerifEnvoie = 'La lettre est prête à partir.'
      this.labelVerifLettre = 'Envoyer'
      let flagPb = this.titreMail === '' || this.texteMail === '' || this.conclusionMail === '' || this.activitesDiffuser.length === 0
      if (flagPb) {
        this.messageVerifEnvoie = '<p class="warning q-mb-sm">Le(s) point(s) suivant(s) ont été détecté(s) :</p>'
        this.labelVerifLettre = 'Envoyer quand même'
      }
      if (this.titreMail === '') this.messageVerifEnvoie = this.messageVerifEnvoie + '<p class="q-ma-none">Le titre est vide.</p>'
      if (this.texteMail === '') this.messageVerifEnvoie = this.messageVerifEnvoie + '<p class="q-ma-none">Le message introductif est vide.</p>'
      if (this.conclusionMail === '') this.messageVerifEnvoie = this.messageVerifEnvoie + '<p class="q-ma-none">Le message de conclusion est vide.</p>'
      if (this.activitesDiffuser.length === 0) this.messageVerifEnvoie = this.messageVerifEnvoie + '<p class="q-ma-none">Aucun atelier est sélectionné.</p>'
      this.modalVerifAvantEnvoi = true
    },
    envoyerMail () {
      this.modalVerifAvantEnvoi = false
      this.testEnvoiMail = true
      this.estEnvoye = true
      this.processSaveMailing()
    },
    processEnvoyerMail () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Envoi de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let titre = this.titreMail
      let recipientVariables = {}
      let listeDiffusionFinale = this.listeDiffusion.map((item) => item.email.toString())
      this.listeDiffusion.forEach((item) => {
        recipientVariables[item.email] = {email: item.email, prenom: item.prenom, id: this.newMailId}
      })
      let aujourdhui = new Date()
      let tag = this.horaireLisible(aujourdhui).mois + ' ' + this.horaireLisible(aujourdhui).annee
      this.$apollo.mutate({
        mutation: ENVOI_MAIL_RV,
        variables: {
          tag: tag,
          from: 'lasalledesmachines@labonnefabrique.fr',
          to: listeDiffusionFinale,
          subject: titre,
          html: this.leMailFinal,
          recipientVariables: recipientVariables
        }
      }).then((retour) => {
        console.log('retour envoi mail', retour)
        this.$router.push({name: 'listeMailings'})
        this.$q.loading.hide()
      }).catch((error) => {
        console.log('erreur envoi mail', error)
        this.$router.push({name: 'listeMailings'})
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

couleurCadre = $blue-grey-3

.bg-atelier
  background: $atelier

.text-atelier
  color: $atelier

.cadreChoix
  width: 400px
  border: 1px solid couleurCadre

.warning
  color: $atelier

.border-2
  border: 1px solid $blue-grey-1

.btns
  position: absolute
  right: 5px
  top: 5px
  background-color: rgba(255, 255, 255, 0.8)
  z-index: 10

.preview
  width: 640px
</style>
