<template>
  <v-container
    id="user-register"
    fluid
    tag="section"
  >
    <v-container justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">
              Cadastro de Usuário
            </div>

            <div class="text-subtitle-1 font-weight-light">
              Preencha os dados para cadastrar um novo usuário
            </div>
          </template>

          <v-form @submit.prevent="registerUser">
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="userData.name"
                    class="purple-input"
                    label="Nome"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="userData.email"
                    label="Email"
                    class="purple-input"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    required
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="userData.password"
                    label="Senha"
                    class="purple-input"
                    type="password"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="userData.description"
                    class="purple-input"
                    label="Descrição"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    ref="fileInput"
                    label="Imagem de Perfil"
                    accept="image/*"
                    @change="onFileChange"
                    prepend-icon="mdi-camera"
                    :rules="[rules.required]"
                    :error-messages="imageError"
                    required
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    type="submit"
                    color="success"
                    class="mr-0"
                  >
                    Cadastrar Usuário
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-container>

    <!-- Modal de Notificação -->
    <v-dialog
      v-model="showModal"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5" :class="modalColor">
          {{ modalTitle }}
        </v-card-title>

        <v-card-text class="text-body-1">
          {{ modalMessage }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="closeModal"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'UserRegister',
  
  data () {
    return {
      userData: {
        name: '',
        email: '',
        password: '',
        description: '',
        imageBase64: ''
      },
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalColor: '',
      imageFile: null,
      rules: {
        required: v => !!v || 'Esse campo é obrigatório',
        email: v => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(v) || 'Informe um e-mail válido'
        }
      },
      imageError: ''
    }
  },

  methods: {
    closeModal () {
      this.showModal = false
    },

    onFileChange (file) {
      if (!file) {
        this.userData.imageBase64 = ''
        return
      }
      if (!file.type.startsWith('image/')) {
        this.showModal = true
        this.modalTitle = 'Erro'
        this.modalMessage = 'Por favor, selecione um arquivo de imagem válido.'
        this.modalColor = 'error'
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
      // Validação manual para imagem
      if (!this.userData.imageBase64) {
        this.imageError = 'Esse campo é obrigatório'
        return
      } else {
        this.imageError = ''
      }

      // Validação dos campos obrigatórios
      if (!this.userData.name || !this.userData.email || !this.userData.password) {
        this.showModal = true
        this.modalTitle = 'Erro'
        this.modalMessage = 'Por favor, preencha todos os campos obrigatórios.'
        this.modalColor = 'error'
        return
      }
      console.log('Usuario para cadastro', this.userData)
      try {
        await UserService.registerUser(this.userData)
        
        // Limpar o formulário após o cadastro bem-sucedido
        this.userData = {
          name: '',
          email: '',
          password: '',
          description: '',
          imageBase64: ''
        }
        
        // Limpar o campo de imagem
        this.$refs.fileInput.reset()
        
        this.showModal = true
        this.modalTitle = 'Sucesso'
        this.modalMessage = 'Usuário cadastrado com sucesso!'
        this.modalColor = 'success'
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error)
        this.showModal = true
        this.modalTitle = 'Erro'
        this.modalMessage = error.response?.data?.message || 'Erro ao cadastrar usuário. Por favor, tente novamente.'
        this.modalColor = 'error'
      }
    }
  }
}
</script>

<style scoped>
.success {
  color: #4CAF50;
  font-weight: bold;
}

.error {
  color: #F44336;
  font-weight: bold;
}
</style> 