/**
 * Testes E2E para o serviço de criptomoedas
 * Este arquivo contém testes para listagem e tratamento de erros
 * na exibição de criptomoedas
 */
describe('Testes de Criptomoedas', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // Teste de carregamento da lista de criptomoedas
  it('Deve carregar a lista de criptomoedas', () => {
    // Dados mockados para simular a resposta da API
    const mockCryptocurrencies = [
      { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 50000 },
      { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000 }
    ]

    // Simula a resposta da API de criptomoedas
    cy.intercept('GET', 'http://localhost:3000/cryptocurrencies', {
      statusCode: 200,
      body: mockCryptocurrencies
    }).as('getCryptocurrencies')

    // Navega para a página de criptomoedas
    cy.get('[data-cy=cryptocurrencies-link]').click()
    cy.wait('@getCryptocurrencies')

    // Verifica se a lista é exibida corretamente
    cy.get('[data-cy=crypto-list]').should('be.visible')
    cy.get('[data-cy=crypto-item]').should('have.length', 2)
    cy.get('[data-cy=crypto-item]').first().should('contain', 'Bitcoin')
    cy.get('[data-cy=crypto-item]').last().should('contain', 'Ethereum')
  })

  // Teste de tratamento de erro na listagem
  it('Deve exibir mensagem de erro quando falhar ao carregar criptomoedas', () => {
    // Simula um erro na API
    cy.intercept('GET', 'http://localhost:3000/cryptocurrencies', {
      statusCode: 500,
      body: { message: 'Erro ao carregar criptomoedas' }
    }).as('getCryptocurrenciesError')

    // Navega para a página e verifica o tratamento do erro
    cy.get('[data-cy=cryptocurrencies-link]').click()
    cy.wait('@getCryptocurrenciesError')

    // Verifica se a mensagem de erro é exibida corretamente
    cy.get('[data-cy=error-message]').should('be.visible')
    cy.get('[data-cy=error-message]').should('contain', 'Erro ao carregar criptomoedas')
  })
}) 