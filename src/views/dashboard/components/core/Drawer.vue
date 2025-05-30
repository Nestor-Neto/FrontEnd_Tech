<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          color="white"
          contain
        >
          <v-img
            :src="userImage"
            max-height="30"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="display-1"
          >
            {{ userName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapState
} from 'vuex'

export default {
  name: 'DashboardCoreDrawer',

  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    items: [
      {
        icon: 'mdi-view-dashboard',
        title: 'dashboard',
        to: '/'
      },
      {
        icon: 'mdi-account',
        title: 'Perfil de usuário',
        group: 'user',
        children: [
          {
            title: 'Listar Usuários',
            to: '/pages/users',
            icon: 'mdi-account-multiple'
          },
          {
            title: 'Editar Perfil',
            to: '/pages/user',
            icon: 'mdi-account-edit',
            exact: true
          },
          {
            title: 'Cadastrar',
            to: '/pages/user/register',
            icon: 'mdi-account-plus'
          }
        ]
      }
    ],
    userName: '',
    userImage: ''
  }),

  computed: {
    ...mapState(['barColor', 'barImage']),
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.commit('SET_DRAWER', val)
      }
    },
    computedItems () {
      return this.items.map(this.mapItem)
    },
    profile () {
      return {
        avatar: true,
        title: this.$t('avatar')
      }
    }
  },

  created () {
    this.loadUserData()
  },

  methods: {
    mapItem (item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: item.title
      }
    },
    loadUserData () {
      try {
        const userSessionStr = localStorage.getItem('user')
        if (!userSessionStr) {
          this.userName = 'Usuário'
          this.userImage = ''
          return
        }
        const userSessionObj = JSON.parse(userSessionStr)
        const user = userSessionObj.user
        this.userName = user.name || 'Usuário'
        if (user.imageUrl) {
          if (user.imageUrl.startsWith('data:image')) {
            this.userImage = user.imageUrl
          } else {
            this.userImage = `data:image/jpeg;base64,${user.imageUrl}`
          }
        } else if (user.imageBase64) {
          if (user.imageBase64.startsWith('data:image')) {
            this.userImage = user.imageBase64
          } else {
            this.userImage = `data:image/jpeg;base64,${user.imageBase64}`
          }
        } else {
          this.userImage = ''
        }
      } catch (e) {
        this.userName = 'Usuário'
        this.userImage = ''
      }
    }
  }
}
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
