/**
 * Testes E2E para o serviço de autenticação
 * Este arquivo contém testes para as funcionalidades de login e logout
 * Utiliza interceptação de requisições HTTP para simular respostas da API
 */
describe('Testes de Autenticação', () => {
  beforeEach(() => {
    cy.visit('/')
    // Limpa o localStorage antes de cada teste para garantir um estado limpo
    cy.clearLocalStorage()
  })

  // Teste de login bem-sucedido
  it('Deve fazer login com sucesso', () => {
    const email = 'teste@exemplo.com'
    const password = 'senha123'

    // Simula a resposta da API de autenticação
    cy.intercept('POST', 'http://localhost:3000/users/authenticate', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: email
        }
      }
    }).as('loginRequest')

    // Preenche o formulário de login
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()

    // Aguarda a requisição e verifica o resultado
    cy.wait('@loginRequest')
    cy.get('[data-cy=welcome-message]').should('contain', 'Bem-vindo')
  })

  // Teste de logout
  it('Deve fazer logout com sucesso', () => {
    // Simula um usuário logado no localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({
        token: 'fake-jwt-token',
        user: { id: 1, email: 'teste@exemplo.com' }
      }))
    })

    // Executa o logout e verifica se retorna para a tela de login
    cy.get('[data-cy=logout-button]').click()
    cy.get('[data-cy=login-form]').should('be.visible')
  })
}) 