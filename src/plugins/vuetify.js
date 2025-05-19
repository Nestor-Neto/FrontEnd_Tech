import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import '@/sass/overrides.sass'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#e91e63',
        secondary: '#9c27b0',
        accent: '#00cae3',
        error: '#ff5252',
        info: '#00cae3',
        success: '#4caf50',
        warning: '#fb8c00'
      }
    }
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
