# Frontend Tech

Projeto frontend desenvolvido com Vue.js 3 + TypeScript, seguindo os princípios do Clean Code.

## Requisitos

- Node.js 16.x ou superior
- npm 7.x ou superior

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
VITE_API_URL=http://localhost:3000
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

## Build

Para criar uma build de produção:

```bash
npm run build
```

## Estrutura do Projeto

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── store/
│   ├── plugins/
│   ├── pages/
│   ├── router/
│   ├── views/
│   └── utils/
├── tests/
│   ├── e2e/
│   └── unit/
```

## Funcionalidades

- Sistema de autenticação com JWT
- Persistência de sessão
- Rotas protegidas
- Interface responsiva
- Gerenciamento de estado com Pinia