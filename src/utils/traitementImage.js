import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})
import { GET_ILLU_BY_ID } from '../constants/illustrationsGraphQL'

export var imageMixins = {
  methods: {
    async illustrationURL (idIllu, largeur, hauteur) {
      let imageIllu = ''
      await this.$apollo.query({
        query: GET_ILLU_BY_ID,
        variables: {
          id: idIllu
        }
      }).then((data) => {
        const illustration = data.data.allActivitesIllustrations[0]
        if (illustration) {
          imageIllu = cl.url(illustration.idImage + '.' + illustration.format, { width: largeur, height: hauteur, crop: 'lfill', gravity: 'auto' })
        } else {
          imageIllu = cl.url('logoLBFmoyen_p1zcu0.png', { width: largeur, height: hauteur, crop: 'fill', gravity: 'auto' })
        }
      }).catch((error) => {
        console.log(error)
      })
      console.log(imageIllu)
      return {url: imageIllu}
    }
  }
}
