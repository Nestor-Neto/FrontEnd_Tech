<template>
  <div id="settings-wrapper">
    <v-card
      id="settings"
      class="py-2 px-4"
      color="rgba(0, 0, 0, .3)"
      dark
      flat
      link
      min-width="100"
      style="position: fixed; top: 115px; right: -35px; border-radius: 8px;"
    >
      <v-icon large>
        mdi-settings
      </v-icon>
    </v-card>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      bottom
      content-class="v-settings"
      left
      nudge-left="8"
      offset-x
      origin="top right"
      transition="scale-transition"
    >
      <v-card
        class="text-center mb-0"
        width="300"
      >
        <v-card-text>
          <strong class="mb-3 d-inline-block">SIDEBAR FILTERS</strong>

          <v-item-group v-model="color">
            <v-item
              v-for="color in colors"
              :key="color"
              :value="color"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-settings__item--active'"
                  :color="color"
                  class="v-settings__item"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              Dark Mode
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="$vuetify.theme.dark"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
// Mixins
import Proxyable from 'vuetify/lib/mixins/proxyable'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DashboardCoreSettings',

  mixins: [Proxyable],

  data: () => ({
    color: '#1976d2',
    colors: [
      '#9C27b0',
      '#00CAE3',
      '#4CAF50',
      '#ff9800',
      '#1976d2',
      '#FF5252'
    ],
    image: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    images: [
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-2.jpg',
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-3.jpg',
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-4.jpg'
    ],
    menu: false,
    saveImage: '',
    showImg: true
  }),

  computed: {
    ...mapState(['barImage'])
  },

  watch: {
    color (val) {
      this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light'].primary = val
    },
    showImg (val) {
      if (!val) {
        this.saveImage = this.barImage
        this.setBarImage('')
      } else if (this.saveImage) {
        this.setBarImage(this.saveImage)
        this.saveImage = ''
      } else {
        this.setBarImage(val)
      }
    },
    image (val) {
      this.setBarImage(val)
    }
  },

  methods: {
    ...mapMutations({
      setBarImage: 'SET_BAR_IMAGE'
    })
  }
}
</script>

<style lang="sass">
  .v-settings
    .v-item-group > *
      cursor: pointer

    &__item
      border-width: 3px
      border-style: solid
      border-color: transparent !important

      &--active
        border-color: #00cae3 !important
</style>
