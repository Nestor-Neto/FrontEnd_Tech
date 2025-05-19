<template>
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card>
      <v-card-title class="text-h5">Cadastro de Usuário</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registerUser">
          <v-container class="py-0">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.name" label="Nome" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.email" label="Email" type="email" :rules="[rules.required, rules.email]" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.password" label="Senha" type="password" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="userData.description" label="Descrição" />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input ref="fileInput" label="Imagem de Perfil" accept="image/*" @change="onFileChange" prepend-icon="mdi-camera" :rules="[rules.required]" :error-messages="imageError" required />
              </v-col>
              <v-col cols="12" class="text-right">
                <v-btn type="submit" color="success">Cadastrar Usuário</v-btn>
                <v-btn color="grey" text @click="close">Cancelar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
        <v-alert v-if="successMessage" type="success" class="mt-2">{{ successMessage }}</v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'UserNewRegister',
  props: {
    value: { type: Boolean, default: true }
  },
  data () {
    return {
      dialog: true,
      userData: {
        name: '',
        email: '',
        password: '',
        description: '',
        imageBase64: ''
      },
      rules: {
        required: v => !!v || 'Esse campo é obrigatório',
        email: v => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(v) || 'Informe um e-mail válido'
        }
      },
      imageError: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    close () {
      this.dialog = false
      this.$emit('close')
      this.$router.push('/login')
    },
    onFileChange (file) {
      if (!file) {
        this.userData.imageBase64 = ''
        return
      }
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Por favor, selecione um arquivo de imagem válido.'
        this.userData.imageBase64 = ''
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        this.userData.imageBase64 = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async registerUser () {
      this.errorMessage = ''
      this.successMessage = ''
      if (!this.userData.imageBase64) {
        this.imageError = 'Esse campo é obrigatório'
        return
      } else {
        this.imageError = ''
      }
      if (!this.userData.name || !this.userData.email || !this.userData.password) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.'
        return
      }
      try {
        await UserService.registerUser(this.userData)
        this.successMessage = 'Usuário cadastrado com sucesso!'
        setTimeout(() => {
          this.$router.push('/login')
        }, 1200)
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar usuário. Por favor, tente novamente.'
      }
    }
  }
}
</script>

<style scoped>
.v-card-title {
  justify-content: center;
}
</style> 