import {ENVOI_MAIL} from '../constants/mailGraphQL'

export var mailMixins = {
  methods: {
    envoiMail (email, prenom, leMessage) {
      return this.$apollo.mutate({
        mutation: ENVOI_MAIL,
        variables: {
          tag: 'resetMDP',
          from: 'contact@labonnefabrique.fr',
          to: ['luchier@gmail.com'],
          subject: 'Récupération de votre mot de passe',
          html: leMessage
        }
      })
    }
  }
}
