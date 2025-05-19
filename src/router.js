import Vue from 'vue'
import Router from 'vue-router'
import AuthService from '@/services/auth.service'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login')
    },
    {
      path: '/registrar',
      name: 'UserNewRegister',
      component: () => import('@/views/dashboard/pages/UserNewRegister.vue')
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      meta: { requiresAuth: true },
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard')
        },
        // Pages
        {
          name: 'Perfil do Usuário',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: { requiresAuth: true }
        },
        {
          name: 'Cadastro de Usuário',
          path: 'pages/user/register',
          component: () => import('@/views/dashboard/pages/UserRegister'),
          meta: { requiresAuth: true }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications')
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons')
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps')
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = AuthService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
