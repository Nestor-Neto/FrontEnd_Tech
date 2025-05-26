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

  async getAllUsers () {
    try {
      const response = await axios.get(`${API_URL}/users`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw new UserServiceError('Falha ao buscar usuários', error)
    }
  }

  async deleteUser (id) {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw new UserServiceError('Falha ao deletar usuário', error, { id })
    }
  }
}

module.exports = new UserService() 