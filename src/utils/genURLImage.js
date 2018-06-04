export var genURLImageMixins = {
  methods: {
    urlImage (nom, width, height, qualite, effet, cropType) {
      let adresse = ''
      adresse = 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_' + cropType + ',f_auto,g_auto:face,h_' + height + ',w_' + width + ',q_' + qualite + '/' + nom
      if (effet === 'blur') {
        adresse = 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_' + cropType + ',f_auto,g_auto:face,h_' + height + ',w_' + width + ',q_' + qualite + ',e_blur:300/' + nom
      }
      return adresse
    }
  }
}
