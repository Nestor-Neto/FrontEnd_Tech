const UserService = require('../../src/services/UserService')
const axios = require('axios')

// Mock do axios
jest.mock('axios', () => ({
  post: jest.fn(),
  put: jest.fn()
}))

describe('UserService', () => {
  // Configuração global para os testes
  jest.setTimeout(30000) // Aumenta o timeout para 30 segundos

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    // Aguarda todas as promessas pendentes
    await new Promise(resolve => setImmediate(resolve))
  })

  afterAll(async () => {
    jest.clearAllMocks()
    // Aguarda todas as promessas pendentes
    await new Promise(resolve => setImmediate(resolve))
  })

  describe('registerUser', () => {
    // Testa o registro completo de um novo usuário, verificando se todos os dados são enviados corretamente para a API e se a resposta é processada adequadamente
    it('deve registrar usuário com sucesso', async () => {
      const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        description: 'Test description',
        imageBase64: 'base64-image-data'
      }

      const mockResponse = {
        data: {
          id: 1,
          ...mockUserData
        }
      }

      axios.post.mockResolvedValueOnce(mockResponse)

      const result = await UserService.registerUser(mockUserData)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/users',
        mockUserData
      )
      expect(result).toEqual(mockResponse.data)
    })

    // Testa o tratamento de erros durante o registro, garantindo que exceções sejam propagadas corretamente
    it('deve lançar erro quando o registro falhar', async () => {
      const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      }

      const errorMessage = 'Erro no registro'
      const mockError = new Error(errorMessage)
      mockError.response = {
        data: { message: errorMessage }
      }

      axios.post.mockRejectedValueOnce(mockError)

      const errorPromise = UserService.registerUser(mockUserData)
      
      await expect(errorPromise).rejects.toThrow('Falha ao registrar usuário')
      await expect(errorPromise).rejects.toMatchObject({
        name: 'UserServiceError',
        originalError: { message: errorMessage },
        context: {
          userData: {
            name: 'Test User',
            email: 'test@example.com',
            password: '[REDACTED]'
          }
        }
      })
    })
  })

  describe('updateProfile', () => {
    // Testa a atualização completa do perfil do usuário, verificando se os dados são enviados corretamente e se a resposta é processada adequadamente
    it('deve atualizar perfil com sucesso', async () => {
      const userId = 1
      const mockUserData = {
        name: 'Updated User',
        description: 'Updated description',
        imageUrl: 'new-image-url'
      }

      const mockResponse = {
        data: {
          id: userId,
          ...mockUserData
        }
      }

      axios.put.mockResolvedValueOnce(mockResponse)

      const result = await UserService.updateProfile(userId, mockUserData)

      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:3000/users/${userId}`,
        {
          id: userId,
          name: mockUserData.name,
          description: mockUserData.description,
          imageBase64: mockUserData.imageUrl
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    // Testa o tratamento de erros durante a atualização do perfil, garantindo que exceções sejam propagadas corretamente
    it('deve lançar erro quando a atualização falhar', async () => {
      const userId = 1
      const mockUserData = {
        name: 'Updated User'
      }

      const errorMessage = 'Erro na atualização'
      const mockError = new Error(errorMessage)
      mockError.response = {
        data: { message: errorMessage }
      }

      axios.put.mockRejectedValueOnce(mockError)

      const errorPromise = UserService.updateProfile(userId, mockUserData)
      
      await expect(errorPromise).rejects.toThrow('Falha ao atualizar perfil')
      await expect(errorPromise).rejects.toMatchObject({
        name: 'UserServiceError',
        originalError: { message: errorMessage },
        context: {
          id: userId,
          userData: mockUserData
        }
      })
    })
  })
}) 