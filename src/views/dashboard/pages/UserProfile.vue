<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-container justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card
          class="v-card-profile"
          :avatar="avatarImage"
        >
          <v-card-text class="text-center">
            <h4 class="text-h3 font-weight-light mb-3 black--text">
              {{ capitalizedName }}
            </h4>

            <p class="font-weight-light grey--text">
              {{ userUpdate.description }}
            </p>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">
              Perfil do Usuário
            </div>

            <div class="text-subtitle-1 font-weight-light">
              Editar Perfil
            </div>
          </template>

          <v-form @submit.prevent="updateProfile">
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="userUpdate.name"
                    class="purple-input"
                    label="Nome"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="userUpdate.email"
                    label="Email"
                    class="purple-input"
                    disabled
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="userUpdate.description"
                    class="purple-input"
                    label="Descrição"
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
                    Salvar Perfil
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
  name: 'UserProfile',
  
  data () {
    return {
      userUpdate: {
        name: '',
        email: '',
        description: '',
        imageUrl: ''
      },
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalColor: ''
    }
  },

  computed: {
    capitalizedName () {
      if (!this.userUpdate.name) return ''
      return this.userUpdate.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    },
    avatarImage () {
      if (!this.userUpdate.imageUrl) {
        return '' // Retorna string vazia se não houver imagem
      }
      
      // Verifica se a string já começa com 'data:image'
      if (this.userUpdate.imageUrl.startsWith('data:image')) {
        return this.userUpdate.imageUrl
      }
      
      // Se for uma string base64 pura, adiciona o prefixo necessário
      return `data:image/jpeg;base64,${this.userUpdate.imageUrl}`
    }
  },

  created () {
    // Carrega os dados do usuário da sessão quando o componente é criado
    this.loadUserData()
  },

  methods: {
    showNotification (type, message) {
      this.$root.$emit('show-notification', {
        type,
        message
      })
    },

    loadUserData () {
      try {
        // Busca os dados do usuário da sessão
        const userSessionStr = localStorage.getItem('user')
        
        if (!userSessionStr) {
          this.showNotification('error', 'Sessão não encontrada. Por favor, faça login novamente.')
          this.$router.push('/login') // Redireciona para a página de login
          return
        }

        const userSessionObj = JSON.parse(userSessionStr)
        const userSession = userSessionObj.user
        console.log('Dados da sessão:', userSession)

        // Verifica se os dados necessários existem na sessão
        if (!userSession || !userSession.name || !userSession.email) {
          this.showNotification('warning', 'Dados do usuário incompletos')
          this.$router.push('/login') // Redireciona para a página de login
          return
        }

        // Atualiza o objeto userUpdate com os dados da sessão
        this.userUpdate = {
          name: userSession.name || '',
          email: userSession.email || '',
          description: userSession.description || '',
          imageUrl: userSession.imageUrl || ''
        }

        console.log('Dados do usuário carregados:', this.userUpdate)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        this.showNotification('error', 'Erro ao carregar dados do usuário')
        this.$router.push('/login') // Redireciona para a página de login
      }
    },

    closeModal () {
      this.showModal = false
      if (this.modalColor === 'success') {
        this.loadUserData() // Recarrega os dados do usuário
      }
    },

    async updateProfile () {
      try {
        // Verifica se ainda existe uma sessão válida antes de atualizar
        const userSession = JSON.parse(localStorage.getItem('user'))
        if (!userSession) {
          this.showModal = true
          this.modalTitle = 'Erro'
          this.modalMessage = 'Sessão expirada. Por favor, faça login novamente.'
          this.modalColor = 'error'
          return
        }

        // Atualiza o perfil usando o UserService
        await UserService.updateProfile(userSession.user.id, this.userUpdate)
        
        // Atualiza a sessão com os novos dados
        const updatedSession = {
          ...userSession,
          user: {
            ...userSession.user,
            name: this.userUpdate.name,
            description: this.userUpdate.description,
            imageBase64: this.userUpdate.imageUrl
          }
        }
        
        // Salva os dados atualizados na sessão
        localStorage.setItem('user', JSON.stringify(updatedSession))

        // Mostra modal de sucesso
        this.showModal = true
        this.modalTitle = 'Sucesso'
        this.modalMessage = 'Perfil atualizado com sucesso!'
        this.modalColor = 'success'
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        this.showModal = true
        this.modalTitle = 'Erro'
        this.modalMessage = 'Erro ao atualizar perfil. Por favor, tente novamente.'
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
