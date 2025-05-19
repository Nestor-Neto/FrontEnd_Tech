const coinmarketcapService = require('../../src/services/coinmarketcap.service')
const axios = require('axios')

// Mock do axios
jest.mock('axios', () => ({
  get: jest.fn()
}))

describe('CoinmarketcapService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCryptocurrencies', () => {
    // Testa se o serviço consegue buscar e retornar a lista de criptomoedas corretamente, verificando a chamada da API e o formato dos dados retornados
    it('deve retornar dados de criptomoedas com sucesso', async () => {
      const mockData = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC' },
        { id: 2, name: 'Ethereum', symbol: 'ETH' }
      ]

      axios.get.mockResolvedValueOnce({ data: mockData })

      const result = await coinmarketcapService.getCryptocurrencies()

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3000/cryptocurrencies',
        {
          headers: {
            accept: 'application/json'
          }
        }
      )
      expect(result).toEqual(mockData)
    })

    // Testa se o serviço propaga corretamente erros quando a API falha, garantindo que exceções sejam lançadas
    it('deve lançar erro quando a requisição falhar', async () => {
      const error = new Error('Erro na requisição')
      axios.get.mockRejectedValueOnce(error)

      await expect(coinmarketcapService.getCryptocurrencies()).rejects.toThrow(error)
    })
  })
}) 