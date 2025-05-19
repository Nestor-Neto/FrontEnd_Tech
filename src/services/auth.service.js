const axios = require('axios').default

const API_URL = 'http://localhost:3000'

class AuthService {
  async login (email, password) {
    const response = await axios.post(`${API_URL}/users/authenticate`, {
      email,
      password
    })

    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
  }

  logout () {
    localStorage.removeItem('user')
  }

  getCurrentUser () {
    return JSON.parse(localStorage.getItem('user'))
  }

  getToken () {
    const user = this.getCurrentUser()
    return user ? user.token : null
  }

  isAuthenticated () {
    return !!this.getToken()
  }
}

module.exports = new AuthService()
