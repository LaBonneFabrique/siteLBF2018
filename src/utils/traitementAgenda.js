import { ADD_AGENDA, REMOVE_AGENDA } from '../graphQL/gestionAgenda'

export var traitementAgendaMixins = {
  methods: {
    addAgenda: function (titre, location, dates) {
      let ajoutsAgenda = []
      dates.forEach((uneDate) => {
        ajoutsAgenda.push({
          uid: uneDate.uid,
          titre: titre,
          location: location,
          dateDebut: this.ajusteDate(uneDate.date, uneDate.horaire.min),
          dateFin: this.ajusteDate(uneDate.date, uneDate.horaire.max),
          status: uneDate.status
        })
      })
      console.log(ajoutsAgenda)
      this.$apollo.query({
        query: ADD_AGENDA,
        variables: {
          dataEvents: ajoutsAgenda
        }
      }).then((retour) => console.log(retour))
    },
    effaceEventFromAgenda: function (tableUID) {
      this.$apollo.query({
        query: REMOVE_AGENDA,
        variables: {
          uids: tableUID
        }
      }).then((retour) => console.log(retour))
    }
  }
}
