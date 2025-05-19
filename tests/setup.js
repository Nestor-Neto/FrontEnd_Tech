/* global jest */
// Mock do localStorage
const localStorageMock = {
  // Implementação padrão para os métodos
  getItem: jest.fn().mockImplementation((key) => {
    return null
  }),
  setItem: jest.fn().mockImplementation((key, value) => {
    return null
  }),
  clear: jest.fn().mockImplementation(() => {
    return null
  }),
  removeItem: jest.fn().mockImplementation((key) => {
    return null
  })
}

global.localStorage = localStorageMock 