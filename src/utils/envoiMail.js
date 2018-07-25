import {ENVOI_MAIL} from '../graphQL/mailGraphQL'

const messageMDP = ['<h3>Bonjour **prenom**</h3>',
  '<p>Quelqu\'un a demandé un lien pour changer votre mot de passe. Le voici.</p>',
  '<p><a href="https://newagenda.labonnefabrique.fr/resetmdp/**uId**/**idToken**">Créer un nouveau mot de passe</a></p>',
  '<p>Si vous n\'êtes pas la personne qui a demandé ce lien, vous pouvez ignorer ce mail.</p>',
  'La Bonne Fabrique'].join('\n')

export var mailMixins = {
  methods: {
    envoiMailMDP (email, prenom, uId, idToken) {
      console.log(idToken)
      let leMessage = messageMDP.replace('**prenom**', prenom)
      leMessage = leMessage.replace('**uId**', uId)
      leMessage = leMessage.replace('**idToken**', idToken)
      console.log(leMessage)
      return this.$apollo.mutate({
        mutation: ENVOI_MAIL,
        variables: {
          tag: 'resetMDP',
          from: 'lasalledesmachines@labonnefabrique.fr',
          to: [email],
          subject: 'Récupération de votre mot de passe',
          html: leMessage
        }
      })
    },
    envoiMail (email, leTitre, leMessage) {
      return this.$apollo.mutate({
        mutation: ENVOI_MAIL,
        variables: {
          tag: 'resetMDP',
          from: 'lasalledesmachines@labonnefabrique.fr',
          to: [email],
          subject: leTitre,
          html: leMessage
        }
      })
    }
  }
}
