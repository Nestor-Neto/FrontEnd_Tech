import axios from 'axios'
import AuthService from '@/services/auth.service'
import router from '@/router'

// Configuração base do axios
axios.defaults.baseURL = 'http://localhost:3000'

// Interceptor para adicionar o token em todas as requisições
axios.interceptors.request.use(
  config => {
    const token = AuthService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      AuthService.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axios
