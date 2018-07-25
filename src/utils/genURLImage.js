export var genURLImageMixins = {
  methods: {
    urlImage (nom, width, height, qualite, effet, cropType) {
      let adresse = ''
      adresse = 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_' + cropType + ',f_auto,g_face,h_' + height + ',w_' + width + ',q_' + qualite + '/' + nom
      if (effet === 'blur') {
        adresse = 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_' + cropType + ',f_auto,g_face,h_' + height + ',w_' + width + ',q_' + qualite + ',e_blur:300/' + nom
      }
      return adresse
    },
    urlImageOriginale (nom, width, height) {
      let urlImage = 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/f_auto,h_' + height.toString() + ',w_' + width.toString() + ',c_pad,b_black/' + nom
      return urlImage
    }
  }
}
