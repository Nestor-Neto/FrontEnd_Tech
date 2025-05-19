const axios = require('axios').default

const API_URL = 'http://localhost:3000'

class UserServiceError extends Error {
  constructor (message, originalError, context) {
    super(message)
    this.name = 'UserServiceError'
    this.originalError = originalError
    this.context = context
  }
}

class UserService {
  async registerUser (userData) {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        description: userData.description,
        imageBase64: userData.imageBase64
      })

      return response.data
    } catch (error) {
      console.error('Erro ao registrar usuário:', error)
      throw new UserServiceError('Falha ao registrar usuário', error, {
        userData: {
          ...userData,
          password: '[REDACTED]'
        }
      })
    }
  }

  async updateProfile (id, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, {
        id: id,
        name: userData.name,
        description: userData.description,
        imageBase64: userData.imageUrl
      })

      return response.data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw new UserServiceError('Falha ao atualizar perfil', error, {
        id,
        userData
      })
    }
  }
}

module.exports = new UserService() 