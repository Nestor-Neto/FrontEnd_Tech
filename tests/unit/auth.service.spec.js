const AuthService = require('../../src/services/auth.service')
const axios = require('axios')

// Mock do axios
jest.mock('axios', () => ({
  post: jest.fn()
}))

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    // Configuração padrão do mock do localStorage
    localStorage.getItem.mockImplementation((key) => null)
    localStorage.setItem.mockImplementation((key, value) => null)
  })

  describe('login', () => {
    // Testa o fluxo completo de login, verificando se o token é recebido da API, armazenado no localStorage e retornado corretamente
    it('deve fazer login com sucesso e salvar token no localStorage', async () => {
      const mockResponse = {
        data: {
          token: 'fake-token',
          user: { id: 1, email: 'test@example.com' }
        }
      }

      axios.post.mockResolvedValueOnce(mockResponse)

      const result = await AuthService.login('test@example.com', 'password')

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/users/authenticate',
        {
          email: 'test@example.com',
          password: 'password'
        }
      )
      expect(result).toEqual(mockResponse.data)
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data))
    })
  })

  describe('logout', () => {
    // Testa se o método de logout remove corretamente os dados do usuário do localStorage
    it('deve remover usuário do localStorage', () => {
      AuthService.logout()
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('getCurrentUser', () => {
    // Testa se o serviço consegue recuperar corretamente os dados do usuário armazenados no localStorage
    it('deve retornar usuário atual do localStorage', () => {
      const mockUser = { token: 'fake-token', email: 'test@example.com' }
      localStorage.getItem.mockImplementationOnce(() => JSON.stringify(mockUser))

      const result = AuthService.getCurrentUser()

      expect(result).toEqual(mockUser)
    })

    // Testa o comportamento do serviço quando não há usuário logado, garantindo que retorne null
    it('deve retornar null quando não houver usuário', () => {
      const result = AuthService.getCurrentUser()
      expect(result).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    // Testa se o serviço identifica corretamente um usuário autenticado quando existe um token válido
    it('deve retornar true quando houver token', () => {
      const mockUser = { token: 'fake-token' }
      localStorage.getItem.mockImplementationOnce(() => JSON.stringify(mockUser))
      expect(AuthService.isAuthenticated()).toBe(true)
    })

    // Testa se o serviço identifica corretamente um usuário não autenticado quando não há token
    it('deve retornar false quando não houver token', () => {
      expect(AuthService.isAuthenticated()).toBe(false)
    })
  })
}) 