<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
          />
        </div>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Carregando...' : 'Entrar' }}
        </button>
      </form>
      <div style="text-align:center; margin-top: 16px;">
        <span>Não tem conta? <a href="#" @click.prevent="$router.push('/registrar')">Clique em registrar-se</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      this.error = null
      try {
        console.log('Iniciando tentativa de login...')
        const response = await AuthService.login(this.email, this.password)
        console.log('Login bem sucedido:', response)
        this.$router.push('/')
      } catch (err) {
        console.error('Erro durante o login:', err)
        this.error = err.response?.data?.message || 'Email ou senha inválidos'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.btn-login {
  width: 100%;
  padding: 0.875rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-login:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.9rem;
}
</style>
