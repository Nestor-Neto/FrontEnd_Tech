import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const coinmarketcapService = {
  getCryptocurrencies: async () => {
    try {
      const response = await axios.get(`${API_URL}/cryptocurrencies`, {
        headers: {
          accept: 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar criptomoedas:', error)
      throw error
    }
  }
} 