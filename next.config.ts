const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  images: {
    // 90 pour les captures d'écran du carrousel, 75 (le défaut) ailleurs.
    qualities: [75, 90],
  },
}