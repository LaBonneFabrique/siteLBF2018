import {
  date
} from 'quasar'
import { DAYNAMES, MONTHNAMESABRV } from '../constants/date-fr'

export var traitementDateMixins = {
  methods: {
    traitementHoraire (horaire) {
      const heureDebut = Math.floor(horaire.min).toString()
      const minutesDebut = (horaire.min - Math.floor(horaire.min)) > 0 ? '30' : '00'
      const heureFin = Math.floor(horaire.max).toString()
      const minutesFin = (horaire.max - Math.floor(horaire.max)) > 0 ? '30' : '00'
      return heureDebut + 'h' + minutesDebut + ' - ' + heureFin + 'h' + minutesFin
    },
    horaireLisible: function (debut, fin) {
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
    afficheHeure: function (nombre) {
      let heureMinute = this.decimalToHeure(nombre)
      heureMinute.minutes = heureMinute.minutes / 10
      return heureMinute.heures.toString() + 'h' + heureMinute.minutes.toString() + '0'
    },
    decimalToHeure: function (nombre) {
      let minutes = 0
      let heure = Math.floor(nombre)
      if ((nombre - Math.floor(nombre)) > 0) {
        minutes = 30
      } else {
        minutes = 0
      }
      return {heures: heure, minutes: minutes}
    },
    heureToDecimal: function (heures, minutes) {
      return heures + minutes * 0.5 / 30
    },
    ajusteDate: function (dateTemp, ajustement) {
      let heuresMinutes = this.decimalToHeure(ajustement)
      return date.adjustDate(dateTemp, {hours: heuresMinutes.heures, minutes: heuresMinutes.minutes, seconds: 0}, true)
    },
    toTimeStamp: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'X').toString() + Math.random().toString(2)
    },
    toDateReadable: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'dddd DD MMM', {dayNames: DAYNAMES, monthNames: MONTHNAMESABRV})
    }
  }
}
