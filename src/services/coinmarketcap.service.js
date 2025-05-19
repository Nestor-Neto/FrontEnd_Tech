const axios = require('axios').default

const API_URL = 'http://localhost:3000'

const coinmarketcapService = {
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

module.exports = coinmarketcapService 