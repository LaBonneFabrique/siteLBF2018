<template>
  <q-page class="no-margin no-padding">
    <div class="row">
      <q-card inline flat style="margin-left: 20px; width: 320px; border-style: solid; border-width: 1px; border-color: #E8E8E8;">
        <q-card-title>{{titreAtelier}}
        <span slot="subtitle">Liste des inscrits</span>
        </q-card-title>
        <q-card-media>
          <img :src="urlImage(illustration,320,180,100,'', 'lfill')">
        </q-card-media>
        <q-card-actions class="no-margin no-padding">
          <q-btn flat dense icon="fas fa-at" label="envoyer un mail à tous" color="primary" @click="preparationMail('total')"/>
        </q-card-actions>
      </q-card>
    <q-card inline v-for="(horaire, index) in listeInscritsParHoraire" :key="horaire.uid" flat style="margin-left: 20px; width: 320px; border-style: solid; border-width: 1px; border-color: #E8E8E8;">
      <q-card-title>Créneau {{traitementHoraire(horaire.creneau)}}
      <span slot="subtitle">
                  <q-btn flat dense icon="fas fa-at" color="primary" size="xs" @click="preparationMail('creneau', horaire.inscrits)">
            <q-tooltip anchor="bottom middle" self="top middle">
            Envoyer un mail au créneau entier
          </q-tooltip>
          </q-btn>
          <q-btn flat dense color="tertiary" icon="fas fa-user-plus" size="xs" @click="createModalInscription(horaire.uid, index)">
            <q-tooltip anchor="bottom middle" self="top middle">
            Ajouter une inscription
          </q-tooltip>
          </q-btn>
      </span>
      </q-card-title>

      <q-card-main>
        <q-list no-border separator class="no-margin no-padding">
  <q-item v-for="inscrit in horaire.inscrits" :key="inscrit.participant">
    <q-item-main>
      <q-item-tile label>
      {{inscrit.participant}}
      </q-item-tile>
      <q-item-tile sublabel>
        {{inscrit.mail}}
      </q-item-tile>
    </q-item-main>
              <q-item-side>
      <q-btn icon="far fa-trash-alt" size="12px" dense flat color="secondary" @click="effaceInscription(inscrit.id)"></q-btn>
      <q-btn icon="fas fa-at" size="12px" dense flat color="primary" @click="preparationMail('simple', [inscrit.mail])"></q-btn>
    </q-item-side>
  </q-item>
</q-list>
      </q-card-main>
    </q-card>
    </div>
    <q-modal v-model="modalInscription" position="top" :content-css="{padding: '20px', 'max-width': '480px'}">
      <h6 style="margin: 0px">Inscription</h6>
      <hr />
      <p>Entrer l'adresse de contact.</p>
      <div class="row no-margin no-padding">
        <q-icon name="fas fa-at" size="24px" color="primary" class="col-1"></q-icon>
        <q-input v-model="mailInscription" class="col-8 offset-1"/>
        <q-icon name="fas fa-user-plus" color="primary" size="24px" class="col-1 offset-1 boutonValider" @click.native="ajoutInscrit(true)" :disabled="!$v.mailInscription.required || !$v.mailInscription.email">
          <q-tooltip v-if="!$v.mailInscription.required" anchor="bottom middle" self="top middle">
            Entrer une adresse mail.
          </q-tooltip>
          <q-tooltip v-else-if="!$v.mailInscription.email" anchor="bottom middle" self="top middle">
            L'adresse n'est pas valide.
          </q-tooltip>
          <q-tooltip anchor="bottom middle" self="top middle" v-else>
            Valider
          </q-tooltip>
        </q-icon><br />
      </div>
      <div :key="'incription'+index" v-for="(inscription, index) in listeInscriptions" v-if="listeInscriptions.length > 0" class="no-margin no-padding" style="margin-bottom: 10px !important">
        <div class="row no-margin no-padding">
        <q-icon name="far fa-minus-square" color="secondary" size="24px" class="col-1 boutonValider" style="margin-right: 10px; margin-top: -6px" @click.native="removeInscrit(index)">
          <q-tooltip anchor="bottom middle" self="top middle">
            Effacer
          </q-tooltip>
        </q-icon>
                  <div class="col-10 no-padding no-margin">
        <div class="inscriptionNom">
          <q-icon name="fas fa-user" size="24px" style="padding-bottom: 4px" ></q-icon>
        </div>
           <q-input v-model="inscription.participant" class="inputNom" :error="validations[index].participant" :float-label="validations[index].participant ? 'Veuillez entrer un prénom':''" placeholder="prénom"></q-input><br />
        </div>
        </div>
                <div v-if="!$v.listeInscriptions.$each[index].participant.doublon" class="row">
                  <div class="col-1"></div>
          <q-icon name="fas fa-exclamation-triangle" size="24px" color="red" class="col-1" style="margin: 0px; margin-top: -8px"></q-icon>
          <div class="col-9 offset-1">Cet inscrit existe déjà</div>
          </div>
      </div>
    <div class="piedInscription" v-if="listeInscriptions.length > 0">
      <q-icon name="fas fa-user-plus" color="tertiary" size="24px" class="iconPied" @click.native="ajoutInscrit(false)" >
        <q-tooltip anchor="bottom middle" self="top middle">
            Ajouter un participant
          </q-tooltip>
      </q-icon>
      <q-icon name="far fa-save" color="primary" size="36px" class="iconPied" @click.native="verifSaveInscription()">
        <q-tooltip anchor="bottom middle" self="top middle">
            Enregistrer
          </q-tooltip>
      </q-icon>
    </div>
    </q-modal>
    <q-modal v-model="modalRedaction" position="top" :content-css="{padding: '20px', 'max-width': '480px', 'min-width': '320px'}" maximized @hide="listeMails = []">
      <h6 style="margin: 0px; max-width: 480px">Envoie d'un mail</h6>
        <hr />
        <q-input v-model="sujetMail" placeholder="Sujet du mail" autofocus inverted class="no-shadow" style="max-width: 480px" color="tertiary"></q-input>
        <q-tabs style="margin-top: 15px" inverted>
          <!-- Tabs - notice slot="title" -->
          <q-tab default slot="title" name="Ecrire" label="Ecrire" color="primary"/>
          <q-tab slot="title" name="Rendu" label="Rendu" color="tertiary"/>
          <q-tab slot="title" name="Formatage" label="Formatage" color="secondary"/>
          <!-- Targets -->
          <q-tab-pane name="Ecrire">
          <q-input type="textarea" v-model="texteMail" placeholder="Le texte du mail" style="max-width: 480px" class="no-shadow" color="tertiary" hide-underline rows="5"></q-input>
          </q-tab-pane>
          <q-tab-pane name="Rendu">
            <div v-html="parseMarkdown(texteMail)"></div>
          </q-tab-pane>
          <q-tab-pane name="Formatage">
                <div class="row" style="margin: 0px; pading: 0px">
                  <div class="col-6">
                    <div class="q-title">Bases</div>
                    <em>*italique*</em><br />
                    <strong>**gras**</strong><br />
                  </div>
                  <div class="col-6">
                    <div class="q-title">listes</div>
                    * liste non numérotée<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* sous élément<br />
                    1. liste numérotée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-title">retour à la ligne</div>
                    double espace + entrée
                  </div>
                  <div class="col-6" style="margin-top: 15px">
                    <div class="q-title">lien :</div>
                    [texte du lien](url_du_lien)
                  </div>
                </div>
          </q-tab-pane>
        </q-tabs>
        <div class="piedInscription" style="max-width: 480px">
          <q-icon name="fas fa-times" color="secondary" size="36px" class="iconPied" @click.native="fermerRedaction()">
            <q-tooltip anchor="bottom middle" self="top middle">
            Annuler
          </q-tooltip>
          </q-icon>
          <q-icon name="far fa-share-square" color="primary" size="36px" class="iconPied" @click.native="envoieMail()">
            <q-tooltip anchor="bottom middle" self="top middle">
            Envoyer
          </q-tooltip>
          </q-icon>
        </div>
    </q-modal>
  </q-page>
</template>

<script>
import {
  QSpinnerGears
} from 'quasar'
import { QUERY_ACTIVITE_BY_ID } from '../../graphQL/activitesGraphQL'
import { AJOUT_INSCRIPTION_UID, AJOUT_INSCRIPTION_NO_UID, EFFACE_INSCRIPTIONS, CONNECT_ACTIVITE_INSCRIPTION } from '../../graphQL/inscription'
import {ENVOI_MAIL} from '../../graphQL/mailGraphQL'
import { FIND_USER_BY_EMAIL } from '../../graphQL/userAuth'

import { traitementDateMixins } from '../../utils/traitementDate'
import { genURLImageMixins } from '../../utils/genURLImage'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { parseMarkdownMixins } from '../../utils/parseMarkdown.js'

export default {
  // name: 'PageName',
  mixins: [traitementDateMixins, genURLImageMixins, validationMixin, parseMarkdownMixins],
  props: {
    idAtelier: String
  },
  data () {
    return {
      loadingActivites: 0,
      listeInscrits: [],
      listeInscritsParHoraire: [],
      titreAtelier: '',
      lesDates: [],
      lesHoraires: [],
      illustration: '',
      modalInscription: false,
      mailInscription: '',
      listeInscriptions: [],
      validations: [],
      horaireUID: '',
      sujetMail: '',
      texteMail: '',
      listeMails: [],
      modalRedaction: false,
      formatage: false,
      nHoraire: -1
    }
  },
  created () {
    console.log('bog', this.idAtelier)
  },
  apollo: {
    getActivite: {
      query: QUERY_ACTIVITE_BY_ID,
      variables () {
        return {
          id: this.idAtelier
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
      update (data) {
        let result = data.allActivites[0]
        this.titreAtelier = result.titreActivite
        // this.idAtelier = result.id
        this.listeInscrits = result.inscriptions
        this.lesDates = result.dates
        this.lesHoraires = result.dates[0].horaires
        this.illustration = result.illustration
        this.triParCreneau()
      }
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
          required,
          doublon (value) {
            let verifieDoublon = this.listeInscritsParHoraire[this.nHoraire].inscrits.filter((element) => {
              return element.participant === value && element.mail === this.mailInscription
            })
            return verifieDoublon.length === 0
          }
        },
        dateUID: {
          required
        }
      }
    }
  },
  methods: {
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
      let promises = []
      console.log(this.listeInscriptions)
      this.listeInscriptions.forEach((inscription) => {
        if (inscription.dateUID) {
          promises.push(
            this.$apollo.mutate({
              mutation: AJOUT_INSCRIPTION_UID,
              variables: {
                participant: inscription.participant,
                mail: inscription.mail,
                dateUID: inscription.dateUID
              }
            })
          )
        } else {
          promises.push(
            this.$apollo.mutate({
              mutation: AJOUT_INSCRIPTION_NO_UID,
              variables: {
                participant: inscription.participant,
                mail: inscription.mail
              }
            })
          )
        }
      })
      let inscriptionIDs = []
      await Promise.all(promises).then((results) => {
        results.forEach((result) => {
          inscriptionIDs.push(result.data.createInscription.id)
        })
      }).catch((error) => console.log(error))
      console.log(inscriptionIDs)
      promises = []
      inscriptionIDs.forEach((id) => {
        promises.push(
          this.$apollo.mutate({
            mutation: CONNECT_ACTIVITE_INSCRIPTION,
            variables: {
              iId: id,
              aId: this.idAtelier
            }
          })
        )
      })
      await Promise.all(promises).then().catch((error) => console.log(error))
      this.$apollo.queries.getActivite.refetch()
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Inscription effectuée avec succès.',
        timeout: 2500,
        type: 'positive'
      })
    },
    verifSaveInscription () {
      let erreurGlobale = false
      let doublon = false
      console.log(this.validations)
      this.validations.forEach((validation, index) => {
        this.validations[index].participant = !this.$v.listeInscriptions.$each[index].participant.required
        erreurGlobale = erreurGlobale || this.validations[index].participant
        doublon = doublon || !this.$v.listeInscriptions.$each[index].participant.doublon
      })
      if (!erreurGlobale) {
        if (doublon) {
          this.$q.dialog({
            title: 'Confirmer',
            message: 'Un inscrit a déjà ce nom et ce mail, sauvegarder quand même ?',
            ok: 'Confirmer',
            cancel: 'Annuler'
          }).then(() => {
            this.saveInscription()
          }).catch(() => {
          })
        } else {
          this.saveInscription()
        }
      } else {
        this.$q.notify({
          message: 'Certaines informations sont manquantes. Veuillez vérifier votre inscription.',
          timeout: 2500,
          type: 'warning',
          position: 'bottom-left'
        })
      }
    },
    createModalInscription (uid, index) {
      this.nHoraire = index
      this.horaireUID = uid
      this.mailInscription = ''
      this.listeInscriptions = []
      this.modalInscription = true
    },
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
    triParCreneau () {
      this.listeInscritsParHoraire = []
      // console.log(this.lesHoraires)
      if (this.lesHoraires.length > 1) {
        this.lesHoraires.forEach((horaire) => {
          let inscritsCreneau = {
            creneau: horaire.creneau,
            inscrits: this.listeInscrits.filter((element) => element.dateUID === horaire.uid),
            uid: horaire.uid
          }
          this.listeInscritsParHoraire.push(inscritsCreneau)
        })
      } else {
        this.listeInscritsParHoraire.push({
          creneau: this.lesHoraires[0].creneau,
          inscrits: this.listeInscrits
        })
      }
    },
    effaceInscription (id) {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Effacer cette inscription ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEffaceInscription(id)
      }).catch(() => {
      })
    },
    processEffaceInscription (id) {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Effaçage de l\'inscription en cours...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: EFFACE_INSCRIPTIONS,
        variables: {
          id: id
        }
      }).then((retour) => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Inscription effacée avec succès.',
          timeout: 2500,
          type: 'positive'
        })
        this.$apollo.queries.getActivite.refetch()
      }).catch((error) => {
        console.log(error)
      })
    },
    removeInscrit (index) {
      this.listeInscriptions.splice(index, 1)
      this.validations.splice(index, 1)
    },
    async ajoutInscrit (flagVerif) {
      if (flagVerif) {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: 'Recherche de l\'adresse dans la base',
          messageColor: 'white',
          spinnerSize: 150, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        var profilsNonInscrits = []
        await this.$apollo.query({
          query: FIND_USER_BY_EMAIL,
          variables: {
            email: this.mailInscription
          },
          fetchPolicy: 'network-only'
        }).then((retour) => {
          let lesProfils = retour.data.allUsers[0].profil
          console.log(lesProfils)
          console.log(this.horaireUID)
          this.$q.loading.hide()
          if (this.horaireUID) {
            profilsNonInscrits = lesProfils.filter((membre) => {
              console.log('table', membre.inscriptions.filter((inscription) => inscription.dateUID === this.horaireUID).length)
              return membre.inscriptions.filter((inscription) => {
                console.log('aId', inscription.dateUID === this.horaireUID)
                return inscription.dateUID === this.horaireUID
              }).length === 0
            })
            console.log(profilsNonInscrits)
          } else {
            profilsNonInscrits = lesProfils.filter((membre) => {
              console.log('table 2', membre.inscriptions.filter((inscription) => inscription.activite.id === this.idAtelier).length)
              return membre.inscriptions.filter((inscription) => inscription.activite.id === this.idAtelier).length === 0
            })
            console.log(profilsNonInscrits)
          }
        }).catch((error) => console.log(error))
      }
      if (this.$v.mailInscription.required && this.$v.mailInscription.email) {
        if (profilsNonInscrits.length > 0) {
          console.log('connu !')
          profilsNonInscrits.forEach((profil) => {
            console.log(profil.prenom)
            this.listeInscriptions.push({
              mail: this.mailInscription,
              participant: profil.prenom,
              profilsIds: [profil.id],
              dateUID: this.horaireUID
            })
            this.validations.push({participant: false, dateUID: false})
          })
        } else {
          this.listeInscriptions.push({
            mail: this.mailInscription,
            participant: '',
            dateUID: this.horaireUID
          })
          this.validations.push({participant: false, dateUID: false})
        }
      }
    },
    preparationMail (mode, dataAdresses) {
      switch (mode) {
        case 'simple':
          this.listeMails = dataAdresses
          break
        case 'creneau':
          let listeMailTemp = dataAdresses.map(inscrit => inscrit.mail)
          this.listeMails = [...new Set(listeMailTemp)]
          break
        case 'total':
          let listeMailTempTotal = this.listeInscrits.map(inscrit => inscrit.mail)
          this.listeMails = [...new Set(listeMailTempTotal)]
      }
      this.modalRedaction = true
    },
    fermerRedaction () {
      this.listeMails = []
      this.modalRedaction = false
    },
    envoieMail () {
      this.$q.dialog({
        title: 'Confirmer',
        message: 'Envoyer le mail ?',
        ok: 'Confirmer',
        cancel: 'Annuler'
      }).then(() => {
        this.processEnvoieMail()
      }).catch(() => {
      })
    },
    processEnvoieMail () {
      this.modalRedaction = false
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: 'Envoie du mail en cours...',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.$apollo.mutate({
        mutation: ENVOI_MAIL,
        variables: {
          tag: 'mailInscrits',
          from: 'lasalledesmachines@labonnefabrique.fr',
          to: this.listeMails,
          subject: this.sujetMail,
          html: this.parseMarkdown(this.texteMail)
        }
      }).then((result) => {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Mail envoyé avec succès.',
          timeout: 2500,
          type: 'positive'
        })
      }).catch((error) => { console.log(error) })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.iconHover
  margin-left: 4px
  &:hover
    background: rgba(230,230,230,0.6)
    cursor: pointer

.inputNom
  height: 17px
  margin-left: 30px
  padding: 3px
  paggin-top: 5px

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
  margin-top: 6px

.piedInscription
  margin-top: 10px
  text-align: right

.iconPied
  margin-left: 10px
  &:hover
    cursor: pointer

.boutonValider:hover
  cursor: pointer

.aide
  text-align: right
  font-family: Roboto
  font-style: normal
  font-weight: 400
  line-height: normal
  font-size: 14px
</style>
