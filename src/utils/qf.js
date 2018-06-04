export var qfMixins = {
  methods: {
    calculPrix (prix, qf) {
      prix = parseFloat(prix)
      if (!qf) return prix
      if (qf <= 600) return Math.floor(4 * prix) / 10
      if (qf <= 900) return Math.floor(6 * prix) / 10
      if (qf <= 1200) return Math.floor(8 * prix) / 10
      if (qf <= 1500) return Math.floor(9 * prix) / 10
      return prix
    }
  }
}
