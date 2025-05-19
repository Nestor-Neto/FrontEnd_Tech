/**
 * Testes E2E para o serviço de usuário
 * Este arquivo contém testes para registro e atualização de usuários
 * Inclui testes de formulários e interações com a API
 */
describe('Testes de Usuário', () => {
  beforeEach(() => {
    cy.visit('/')
    // Limpa o localStorage para garantir um estado limpo antes de cada teste
    cy.clearLocalStorage()
  })

  // Teste de registro de novo usuário
  it('Deve registrar um novo usuário com sucesso', () => {
    // Dados de teste para o novo usuário
    const userData = {
      name: 'Usuário Teste',
      email: 'novo@exemplo.com',
      password: 'senha123',
      description: 'Descrição de teste'
    }

    // Simula a resposta da API de registro
    cy.intercept('POST', 'http://localhost:3000/users', {
      statusCode: 201,
      body: {
        id: 1,
        ...userData
      }
    }).as('registerRequest')

    // Navega para a página de registro e preenche o formulário
    cy.get('[data-cy=register-link]').click()
    cy.get('[data-cy=name-input]').type(userData.name)
    cy.get('[data-cy=email-input]').type(userData.email)
    cy.get('[data-cy=password-input]').type(userData.password)
    cy.get('[data-cy=description-input]').type(userData.description)
    cy.get('[data-cy=register-button]').click()

    // Verifica se o registro foi bem-sucedido
    cy.wait('@registerRequest')
    cy.get('[data-cy=success-message]').should('contain', 'Usuário registrado com sucesso')
  })

  // Teste de atualização de perfil
  it('Deve atualizar o perfil do usuário', () => {
    // Simula um usuário autenticado no localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({
        token: 'fake-jwt-token',
        user: { id: 1, email: 'teste@exemplo.com' }
      }))
    })

    // Dados para atualização do perfil
    const updatedData = {
      name: 'Nome Atualizado',
      description: 'Nova descrição'
    }

    // Simula a resposta da API de atualização
    cy.intercept('PUT', 'http://localhost:3000/users/1', {
      statusCode: 200,
      body: {
        id: 1,
        ...updatedData
      }
    }).as('updateRequest')

    // Navega para a página de perfil e atualiza os dados
    cy.get('[data-cy=profile-link]').click()
    cy.get('[data-cy=name-input]').clear().type(updatedData.name)
    cy.get('[data-cy=description-input]').clear().type(updatedData.description)
    cy.get('[data-cy=save-profile-button]').click()

    // Verifica se a atualização foi bem-sucedida
    cy.wait('@updateRequest')
    cy.get('[data-cy=success-message]').should('contain', 'Perfil atualizado com sucesso')
  })
}) 